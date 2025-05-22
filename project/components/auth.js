export function setupAuth() {
  // Get modal elements
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  const overlay = document.getElementById('overlay');
  
  // Get buttons and links
  const accountBtn = document.getElementById('account-btn');
  const closeLoginBtn = document.getElementById('close-login');
  const closeRegisterBtn = document.getElementById('close-register');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');
  
  // Get forms
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  // Stored users (normally would be in a database)
  let users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Current user
  let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  
  // Update UI based on authentication status
  updateAuthUI();
  
  // Add event listener to account button
  accountBtn.addEventListener('click', () => {
    if (currentUser) {
      // If user is logged in, show account menu (not implemented in this basic version)
      showAccountMenu();
    } else {
      // If user is not logged in, show login modal
      loginModal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
  
  // Add event listeners to close buttons
  closeLoginBtn.addEventListener('click', closeModals);
  closeRegisterBtn.addEventListener('click', closeModals);
  
  // Add event listener to overlay for closing modals
  overlay.addEventListener('click', () => {
    if (loginModal.classList.contains('active') || registerModal.classList.contains('active')) {
      closeModals();
    }
  });
  
  // Add event listeners to show login/register links
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    registerModal.classList.add('active');
  });
  
  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.classList.remove('active');
    loginModal.classList.add('active');
  });
  
  // Add event listener to login form
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Login successful
      currentUser = {
        name: user.name,
        email: user.email
      };
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Update UI
      updateAuthUI();
      
      // Close modal
      closeModals();
      
      // Show success message
      showNotification(`Welcome back, ${user.name}!`);
    } else {
      // Login failed
      showFormError(loginForm, 'Invalid email or password');
    }
  });
  
  // Add event listener to register form
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      showFormError(registerForm, 'Email already exists');
      return;
    }
    
    // Create new user
    const newUser = {
      name,
      email,
      password
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log in new user
    currentUser = {
      name: newUser.name,
      email: newUser.email
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    updateAuthUI();
    
    // Close modal
    closeModals();
    
    // Show success message
    showNotification(`Welcome to SUBVERSE, ${name}!`);
  });
  
  // Function to close all modals
  function closeModals() {
    loginModal.classList.remove('active');
    registerModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear form errors
    clearFormErrors();
  }
  
  // Function to update UI based on authentication status
  function updateAuthUI() {
    const accountBtn = document.getElementById('account-btn');
    
    if (currentUser) {
      // Update account button icon
      accountBtn.innerHTML = `<i class="fas fa-user-check"></i>`;
    } else {
      // Reset account button icon
      accountBtn.innerHTML = `<i class="fas fa-user"></i>`;
    }
  }
  
  // Function to show account menu (basic implementation)
  function showAccountMenu() {
    // For a basic implementation, just show a logout option
    if (confirm(`Logged in as ${currentUser.name}. Do you want to log out?`)) {
      // Log out
      currentUser = null;
      localStorage.removeItem('currentUser');
      updateAuthUI();
      showNotification('You have been logged out');
    }
  }
  
  // Function to show form error
  function showFormError(form, message) {
    // Clear any existing errors
    clearFormErrors();
    
    // Create error element
    const errorElement = document.createElement('div');
    errorElement.classList.add('form-error');
    errorElement.textContent = message;
    
    // Add to form
    form.appendChild(errorElement);
  }
  
  // Function to clear form errors
  function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(error => {
      error.parentNode.removeChild(error);
    });
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