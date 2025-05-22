export function setupUI() {
  // Header scroll effect
  const header = document.getElementById('main-header');
  
  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'mobile-menu';
  document.body.appendChild(mobileMenu);
  
  // Clone navigation links for mobile menu
  const navLinks = document.querySelector('.nav-links').cloneNode(true);
  mobileMenu.appendChild(navLinks);
  
  // Add close button to mobile menu
  const closeMenuBtn = document.createElement('button');
  closeMenuBtn.classList.add('close-btn');
  closeMenuBtn.innerHTML = '&times;';
  closeMenuBtn.style.position = 'absolute';
  closeMenuBtn.style.top = '20px';
  closeMenuBtn.style.right = '20px';
  mobileMenu.prepend(closeMenuBtn);
  
  // Search functionality
  const searchBtn = document.getElementById('search-btn');
  const searchBar = document.createElement('div');
  searchBar.classList.add('search-bar');
  searchBar.innerHTML = `
    <form class="search-form">
      <input type="text" placeholder="Search products..." class="search-input">
      <button type="submit" class="search-submit"><i class="fas fa-search"></i></button>
      <button type="button" class="search-close">&times;</button>
    </form>
  `;
  document.body.appendChild(searchBar);
  
  // Newsletter form
  const newsletterForm = document.getElementById('newsletter-form');
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: targetPosition - headerHeight,
          behavior: 'smooth'
        });
        
        // If mobile menu is open, close it
        if (mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          document.getElementById('overlay').classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Active navigation link based on scroll position
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const headerHeight = header.offsetHeight;
      
      if (window.scrollY >= sectionTop - headerHeight - 100 && 
          window.scrollY < sectionTop + sectionHeight - headerHeight - 100) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Close mobile menu
  closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Close mobile menu when overlay is clicked
  document.getElementById('overlay').addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      document.getElementById('overlay').classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Search bar toggle
  searchBtn.addEventListener('click', () => {
    searchBar.classList.add('active');
  });
  
  // Close search bar
  document.querySelector('.search-close').addEventListener('click', () => {
    searchBar.classList.remove('active');
  });
  
  // Newsletter form submission
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (email) {
      // Store email (would normally send to a server)
      const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
      subscribers.push(email);
      localStorage.setItem('subscribers', JSON.stringify(subscribers));
      
      // Clear input
      emailInput.value = '';
      
      // Show success notification
      showNotification('Thanks for subscribing!');
    }
  });
  
  // Add animation classes to elements when they enter viewport
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.value-item, .featured-item, .section-title, .hero-content');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight;
      
      if (elementPosition < screenPosition - 100) {
        element.classList.add('fade-in');
      }
    });
  };
  
  // Run animation check on load and scroll
  window.addEventListener('load', animateOnScroll);
  window.addEventListener('scroll', animateOnScroll);
  
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