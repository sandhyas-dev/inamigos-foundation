// ===================== 1. DOM ELEMENT SELECTION =====================
// Select elements from HTML that we'll manipulate

const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');
const backToTopBtn = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.navbar__link');
const statNumbers = document.querySelectorAll('[data-count]');

// ===================== 2. MOBILE MENU TOGGLE =====================
// Show/hide navigation menu on mobile devices

// Toggle menu when hamburger button is clicked
menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ===================== 3. BACK TO TOP BUTTON =====================
// Show/hide and handle back to top button

// Show button when user scrolls down 300px
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Scroll to top when button is clicked
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================== 4. HEADER SCROLL EFFECT =====================
// Add shadow to header when user scrolls

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});

// ===================== 5. SMOOTH ANCHOR SCROLLING =====================
// Smooth scroll to sections when clicking navigation links

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Get header height to account for sticky header
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================== 6. NUMBER COUNTER ANIMATION =====================
// Animate counting from 0 to target number when section comes into view

// Create intersection observer to detect when element enters viewport
const observerOptions = {
    threshold: 0.5,  // Trigger when 50% of element is visible
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // If element is visible and hasn't been animated yet
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            // Mark as animated to prevent running multiple times
            entry.target.classList.add('animated');
            
            // Animate all numbers in this section
            const numbers = entry.target.querySelectorAll('[data-count]');
            numbers.forEach(number => {
                animateCounter(number);
            });
        }
    });
}, observerOptions);

// Observe the impact section
const impactSection = document.querySelector('.impact__stats');
if (impactSection) {
    observer.observe(impactSection);
}

/**
 * Animate counter from 0 to target number
 * @param {HTMLElement} element - The element containing data-count attribute
 */
function animateCounter(element) {
    const targetNumber = parseInt(element.getAttribute('data-count'));
    const duration = 2000;  // 2 seconds
    const increment = targetNumber / (duration / 16);  // Calculate increment per frame
    let currentNumber = 0;
    
    // Animate until we reach target
    const interval = setInterval(() => {
        currentNumber += increment;
        
        if (currentNumber >= targetNumber) {
            // Reached target, display exactly
            element.textContent = targetNumber.toLocaleString();
            clearInterval(interval);
        } else {
            // Display current number
            element.textContent = Math.floor(currentNumber).toLocaleString();
        }
    }, 16);  // Update every ~16ms (60fps)
}

// ===================== 7. INTERSECTION OBSERVER FOR ANIMATIONS =====================
// Fade in elements as they come into view (optional)

const elementObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, elementObserverOptions);

// Apply to all project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    elementObserver.observe(card);
});

// ===================== 8. ACTIVE NAVIGATION LINK =====================
// Highlight the current section's navigation link

window.addEventListener('scroll', () => {
    let current = '';
    
    // Get all sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Check if section is currently in viewport
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active link in navigation
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===================== 9. FORM SUBMISSION (Optional) =====================
// Handle form submission if you add a contact form later

/**
 * Handle form submission
 * @param {Event} e - Form submission event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Log form data (replace with actual API call)
    console.log('Form submitted:', Object.fromEntries(formData));
    
    // Show success message (optional)
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    form.reset();
}

// Add event listener to forms (if they exist)
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
});

// ===================== 10. LAZY LOADING IMAGES (Optional) =====================
// Load images only when they're about to enter viewport (improves performance)

/**
 * Implement lazy loading for images
 * Add data-src attribute to images instead of src
 * Example: <img data-src="image.jpg" alt="Description">
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================== 11. HANDLE KEYBOARD NAVIGATION =====================
// Improve keyboard accessibility

document.addEventListener('keydown', (e) => {
    // Close menu on Escape key
    if (e.key === 'Escape') {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// ===================== 12. PAGE LOAD OPTIMIZATION =====================
// Initialize everything when DOM is ready

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded - InAmigos Foundation');
    
    // You can add initialization code here
    initializePage();
});

/**
 * Initialize page elements
 */
function initializePage() {
    // Add any initialization code here
    // Example: Load external data, set up third-party libraries, etc.
    
    // Check if images are loaded
    checkImageLoad();
}

/**
 * Check if images are properly loaded
 */
function checkImageLoad() {
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    
    images.forEach(img => {
        if (img.complete) {
            loadedCount++;
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
            });
            img.addEventListener('error', () => {
                console.error('Image failed to load:', img.src);
                // Optionally add fallback image
                img.src = 'assets/images/placeholder.jpg';
            });
        }
    });
}

// ===================== 13. PERFORMANCE OPTIMIZATION =====================
// Debounce function to optimize scroll/resize events

/**
 * Debounce function to prevent excessive function calls
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Example: Debounced resize handler
const debouncedResize = debounce(() => {
    // Handle resize events
    console.log('Window resized');
}, 250);

window.addEventListener('resize', debouncedResize);

// ===================== 14. UTILITY FUNCTIONS =====================
// Reusable utility functions

/**
 * Add class to element
 * @param {HTMLElement} element - Target element
 * @param {String} className - Class name to add
 */
function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Remove class from element
 * @param {HTMLElement} element - Target element
 * @param {String} className - Class name to remove
 */
function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Toggle class on element
 * @param {HTMLElement} element - Target element
 * @param {String} className - Class name to toggle
 */
function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

// ===================== 15. EVENT DELEGATION =====================
// Handle events on dynamically created elements

document.addEventListener('click', (e) => {
    // Example: Handle clicks on elements with specific class
    if (e.target.closest('.project-card')) {
        console.log('Project card clicked');
    }
});

// ===================== 16. CONSOLE MESSAGES =====================
// Helpful console messages (remove in production)

console.log('%c InAmigos Foundation Website', 'color: #0066cc; font-size: 16px; font-weight: bold;');
console.log('%c Modern, Responsive, Accessible NGO Landing Page', 'color: #00b386; font-size: 12px;');
console.log('%c Built with HTML5, CSS3, and Vanilla JavaScript', 'color: #666;');

// ===================== 17. ANALYTICS (Optional) =====================
// Track user interactions (uncomment to use)

/*
function trackEvent(category, action, label) {
    // Example for Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Example usage:
// trackEvent('engagement', 'button_click', 'volunteer_cta');
*/

// ===================== 18. ERROR HANDLING =====================
// Handle errors gracefully

window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
    // Report to error tracking service (e.g., Sentry, Rollbar)
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ===================== 19. SERVICE WORKER (Optional) =====================
// Progressive Web App capabilities (optional)

/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered:', registration);
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}
*/

// ===================== 20. EXPORT FUNCTIONS FOR REUSABILITY =====================
// Export functions for use in other scripts (if using modules)

// Note: To use ES6 modules, add type="module" to <script> tag
// export { animateCounter, debounce, addClass, removeClass, toggleClass };
