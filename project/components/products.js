import { products } from '../data/products.js';

export function setupProducts() {
  const productsContainer = document.getElementById('products-container');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productModal = document.getElementById('product-modal');
  const productDetails = document.getElementById('product-details');
  const closeProductBtn = document.getElementById('close-product');
  const overlay = document.getElementById('overlay');

  // Display all products initially
  displayProducts('all');

  // Add event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get category from data attribute
      const category = button.getAttribute('data-category');
      
      // Display products of selected category
      displayProducts(category);
    });
  });

  // Function to display products based on category
  function displayProducts(category) {
    // Clear products container
    productsContainer.innerHTML = '';
    
    // Filter products by category
    const filteredProducts = category === 'all' 
      ? products 
      : products.filter(product => product.category === category);
    
    // Create product cards
    filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      
      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-quick-actions">
            <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
      `;
      
      productsContainer.appendChild(productCard);
      
      // Add animation class after small delay for staggered effect
      setTimeout(() => {
        productCard.classList.add('fade-in');
      }, 100 * (filteredProducts.indexOf(product) + 1));
    });
    
    // Add event listeners to quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = parseInt(button.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
          showProductDetails(product);
        }
      });
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const productId = parseInt(button.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
          // Dispatch custom event to add product to cart
          const event = new CustomEvent('add-to-cart', { 
            detail: { product, quantity: 1 } 
          });
          document.dispatchEvent(event);
        }
      });
    });
  }

  // Function to show product details
  function showProductDetails(product) {
    productDetails.innerHTML = `
      <div class="product-modal-content">
        <div class="product-modal-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-modal-info">
          <h2>${product.name}</h2>
          <p class="product-modal-price">$${product.price.toFixed(2)}</p>
          <p class="product-modal-description">${product.description}</p>
          
          <div class="product-modal-sizes">
            <h3>Size</h3>
            <div class="size-options">
              ${product.sizes.map(size => 
                `<button class="size-option" data-size="${size}">${size}</button>`
              ).join('')}
            </div>
          </div>
          
          <div class="product-modal-quantity">
            <h3>Quantity</h3>
            <div class="quantity-selector">
              <button class="quantity-btn minus">-</button>
              <input type="number" value="1" min="1" max="10" class="quantity-input">
              <button class="quantity-btn plus">+</button>
            </div>
          </div>
          
          <button class="btn primary-btn buy-now-btn" data-id="${product.id}">BUY NOW</button>
          <button class="btn outline-btn add-to-cart-modal-btn" data-id="${product.id}">ADD TO CART</button>
        </div>
      </div>
    `;
    
    // Show modal and overlay
    productModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listeners for size options
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
      option.addEventListener('click', () => {
        sizeOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });
    
    // Add event listeners for quantity buttons
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.querySelector('.quantity-input');
    
    minusBtn.addEventListener('click', () => {
      if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    });
    
    plusBtn.addEventListener('click', () => {
      if (parseInt(quantityInput.value) < 10) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
      }
    });
    
    // Add event listener for buy now button
    const buyNowBtn = document.querySelector('.buy-now-btn');
    buyNowBtn.addEventListener('click', () => {
      // Close the modal
      closeProductModal();
      
      // Show login modal
      const loginModal = document.getElementById('login-modal');
      loginModal.classList.add('active');
      overlay.classList.add('active');
    });
    
    // Add event listener for add to cart button
    const addToCartModalBtn = document.querySelector('.add-to-cart-modal-btn');
    addToCartModalBtn.addEventListener('click', () => {
      const productId = parseInt(addToCartModalBtn.getAttribute('data-id'));
      const selectedSize = document.querySelector('.size-option.selected')?.getAttribute('data-size') || product.sizes[0];
      const quantity = parseInt(quantityInput.value);
      
      // Dispatch custom event to add product to cart
      const event = new CustomEvent('add-to-cart', { 
        detail: { 
          product, 
          quantity, 
          size: selectedSize 
        } 
      });
      
      document.dispatchEvent(event);
      
      // Close the modal
      closeProductModal();
    });
  }
  
  // Function to close product modal
  function closeProductModal() {
    productModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Close product modal when close button is clicked
  closeProductBtn.addEventListener('click', closeProductModal);
  
  // Close product modal when overlay is clicked
  overlay.addEventListener('click', () => {
    if (productModal.classList.contains('active')) {
      closeProductModal();
    }
  });
}