export function setupCart() {
  const cartBtn = document.getElementById('cart-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');
  const overlay = document.getElementById('overlay');
  
  // Initialize cart from localStorage or create empty cart
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Update cart count badge
  updateCartCount();
  
  // Render cart items
  renderCartItems();
  
  // Add event listener to cart button to open cart sidebar
  cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Add event listener to close cart button
  closeCartBtn.addEventListener('click', closeCart);
  
  // Add event listener to overlay for closing cart
  overlay.addEventListener('click', () => {
    if (cartSidebar.classList.contains('active')) {
      closeCart();
    }
  });
  
  // Add event listener to checkout button
  checkoutBtn.addEventListener('click', () => {
    // Close cart
    closeCart();
    
    // If cart is empty, don't proceed
    if (cart.length === 0) return;
    
    // Show login modal
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.add('active');
    overlay.classList.add('active');
  });
  
  // Listen for add-to-cart events
  document.addEventListener('add-to-cart', (e) => {
    const { product, quantity, size } = e.detail;
    addToCart(product, quantity, size);
  });
  
  // Function to add product to cart
  function addToCart(product, quantity = 1, size = product.sizes[0]) {
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(
      item => item.id === product.id && item.size === size
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: size
      });
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart UI
    updateCartCount();
    renderCartItems();
    
    // Show animation on cart icon
    cartBtn.classList.add('pulse');
    setTimeout(() => {
      cartBtn.classList.remove('pulse');
    }, 500);
    
    // Show notification
    showNotification(`Added to cart: ${product.name}`);
  }
  
  // Function to remove item from cart
  function removeFromCart(index) {
    // Remove item from cart array
    cart.splice(index, 1);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart UI
    updateCartCount();
    renderCartItems();
  }
  
  // Function to update cart item quantity
  function updateCartItemQuantity(index, newQuantity) {
    // Ensure quantity is valid
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;
    
    // Update quantity
    cart[index].quantity = newQuantity;
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart UI
    renderCartItems();
  }
  
  // Function to render cart items
  function renderCartItems() {
    // Clear cart items container
    cartItems.innerHTML = '';
    
    // If cart is empty, show message
    if (cart.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="#products" class="btn outline-btn" onclick="closeCart()">Start Shopping</a></div>';
      cartTotal.textContent = '$0.00';
      return;
    }
    
    // Calculate total
    let total = 0;
    
    // Render each cart item
    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-size">Size: ${item.size}</p>
          <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus" data-index="${index}">+</button>
          </div>
        </div>
        <button class="remove-item-btn" data-index="${index}">&times;</button>
      `;
      
      cartItems.appendChild(cartItem);
      
      // Add to total
      total += item.price * item.quantity;
    });
    
    // Update total
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.cart-item .quantity-btn.minus').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        updateCartItemQuantity(index, cart[index].quantity - 1);
      });
    });
    
    document.querySelectorAll('.cart-item .quantity-btn.plus').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        updateCartItemQuantity(index, cart[index].quantity + 1);
      });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        removeFromCart(index);
      });
    });
  }
  
  // Function to update cart count badge
  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
    
    if (count === 0) {
      cartCount.style.display = 'none';
    } else {
      cartCount.style.display = 'flex';
    }
  }
  
  // Function to close cart
  function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Function to show notification
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('active');
    }, 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}