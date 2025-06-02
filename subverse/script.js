let cart = [];
let products = [];
let isLoggedIn = false;

// Dados de Produtos de Exemplo
const sampleProducts = [
    {
        id: 1,
        name: "Hoodie Urban",
        category: "Hoodies",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
        description: "Hoodie premium com design urbano exclusivo"
    },
    {
        id: 2,
        name: "Camiseta Oversized",
        category: "Camisetas",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        description: "Camiseta oversized com estampa única"
    },
    {
        id: 3,
        name: "Boné Snapback",
        category: "Acessórios",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
        description: "Boné snapback com bordado premium"
    },
    {
        id: 4,
        name: "Jaqueta Bomber",
        category: "Jaquetas",
        price: 299.90,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=400&fit=crop",
        description: "Jaqueta bomber com detalhes únicos"
    },
    {
        id: 5,
        name: "Calça Cargo",
        category: "Calças",
        price: 199.90,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop",
        description: "Calça cargo com múltiplos bolsos"
    },
    {
        id: 6,
        name: "Tênis High Top",
        category: "Calçados",
        price: 349.90,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        description: "Tênis high top estilo streetwear"
    }
];

// DOM carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadProducts();
    updateCartDisplay();
    loadCartFromStorage();
    setupAnimations();
});

// Inicializar App
function initializeApp() {
    products = [...sampleProducts];
    console.log('SUBVERSE App Inicializado');
}

// Configurar Ouvintes de Eventos
function setupEventListeners() {
    // Botões do Header
    const loginBtn = document.getElementById('login-btn');
    const cartBtn = document.getElementById('cart-btn');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
    if (cartBtn) cartBtn.addEventListener('click', openCartModal);
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Controles dos Modais
    const cartClose = document.getElementById('cart-close');
    const loginClose = document.getElementById('login-close');
    const continueShopping = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartClose) cartClose.addEventListener('click', closeCartModal);
    if (loginClose) loginClose.addEventListener('click', closeLoginModal);
    if (continueShopping) continueShopping.addEventListener('click', closeCartModal);
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

    // Formulários
    const loginForm = document.getElementById('login-form');
    const newsletterForm = document.getElementById('newsletter-form');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletter);

    // Navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Cartões de Categoria
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', handleCategoryClick);
    });

    // Fechar modais ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Rolagem suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Carregar Produtos
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}

// Criar Cartão de Produto
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card animate-scale-in';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-actions">
                <button class="btn-icon" onclick="toggleWishlist(${product.id})" title="Adicionar aos favoritos">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
                <button class="btn-icon" onclick="quickView(${product.id})" title="Visualização rápida">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            <div class="product-buttons">
                <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">
                    Adicionar ao Carrinho
                </button>
                <button class="btn btn-outline btn-small" onclick="buyNow(${product.id})">
                    Comprar Agora
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Funções do Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
    
    // Animação no botão do carrinho
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.classList.add('animate-pulse');
        setTimeout(() => cartBtn.classList.remove('animate-pulse'), 600);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    renderCartItems();
    saveCartToStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    updateCartDisplay();
    renderCartItems();
    saveCartToStorage();
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Seu carrinho está vazio</p>
                <button class="btn btn-primary" onclick="closeCartModal()">Continuar Comprando</button>
            </div>
        `;
        cartTotal.textContent = '0,00';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="btn-icon" onclick="removeFromCart(${item.id})" title="Remover item">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = calculateCartTotal();
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
}

// Funções dos Modais
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.add('active');
        renderCartItems();
        document.body.style.overflow = 'hidden';
    }
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Manipuladores de Eventos
function handleSearch() {
    const searchTerm = prompt('Digite o que você está procurando:');
    if (searchTerm) {
        const results = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (results.length > 0) {
            showNotification(`${results.length} produto(s) encontrado(s) para "${searchTerm}"`, 'success');
            // Em um app real, você filtraria a exibição dos produtos
            scrollToSection('produtos');
        } else {
            showNotification(`Nenhum produto encontrado para "${searchTerm}"`, 'error');
        }
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    if (!email || !password) return;
    
    // Simular login
    if (email.value && password.value) {
        isLoggedIn = true;
        showNotification('Login realizado com sucesso!', 'success');
        closeLoginModal();
        
        // Atualizar botão de login
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = `
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 2L9 7V9H3V22H7V16H9V22H11V16H13V22H15V16H17V22H21V9H21Z"/>
                </svg>
            `;
            loginBtn.title = 'Perfil do usuário';
        }
    }
}

function handleNewsletter(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    
    if (emailInput && emailInput.value) {
        showNotification('Inscrição realizada com sucesso!', 'success');
        e.target.reset();
    }
}

function handleNavigation(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
        scrollToSection(href.substring(1));
    }
}

function handleCategoryClick(e) {
    const category = e.currentTarget.dataset.category;
    if (category) {
        showNotification(`Explorando categoria: ${category}`, 'success');
        scrollToSection('produtos');
    }
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'error');
        return;
    }
    
    if (!isLoggedIn) {
        closeCartModal();
        openLoginModal();
        showNotification('Faça login para finalizar a compra', 'error');
        return;
    }
    
    // Simular checkout
    const total = calculateCartTotal();
    showNotification(`Compra finalizada! Total: R$ ${total.toFixed(2).replace('.', ',')}`, 'success');
    cart = [];
    updateCartDisplay();
    closeCartModal();
    saveCartToStorage();
}

// Funções Utilitárias
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const sectionTop = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

function loadMoreProducts() {
    // Simular carregamento de mais produtos
    const newProducts = [
        {
            id: products.length + 1,
            name: "Moletom Tech",
            category: "Hoodies",
            price: 199.90,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
            description: "Moletom com tecnologia thermoregulation"
        },
        {
            id: products.length + 2,
            name: "Camiseta Longline",
            category: "Camisetas",
            price: 99.90,
            image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop",
            description: "Camiseta longline com corte moderno"
        }
    ];
    
    products.push(...newProducts);
    
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        newProducts.forEach((product, index) => {
            const productCard = createProductCard(product, products.length - newProducts.length + index);
            productsGrid.appendChild(productCard);
        });
    }
    
    showNotification('Mais produtos carregados!', 'success');
}

function toggleWishlist(productId) {
    showNotification('Produto adicionado aos favoritos!', 'success');
}

function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Visualização rápida:\n\n${product.name}\n${product.description}\nR$ ${product.price.toFixed(2).replace('.', ',')}`);
    }
}

function buyNow(productId) {
    addToCart(productId);
    openCartModal();
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    }
}

function showNotification(message, type = 'success') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Funções de Local Storage
function saveCartToStorage() {
    localStorage.setItem('subverse_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('subverse_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Configuração de Animações
function setupAnimations() {
    // Intersection Observer para animações de rolagem
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animações de rolagem
    document.querySelectorAll('.section-header, .product-card, .category-card').forEach(el => {
        observer.observe(el);
    });
    
    // Efeito de rolagem no header
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (!header) return;
        
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Adicionar animações CSS para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar app quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
