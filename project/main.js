// Import styles
import './style.css';

// Import component modules
import { setupProducts } from './components/products.js';
import { setupCart } from './components/cart.js';
import { setupAuth } from './components/auth.js';
import { setupUI } from './components/ui.js';

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Setup UI components and animations
  setupUI();
  
  // Setup product display and filtering
  setupProducts();
  
  // Setup cart functionality
  setupCart();
  
  // Setup authentication
  setupAuth();
  
  console.log('SUBVERSE website initialized');
});