// ===================================
// Mobile Navigation Toggle
// ===================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===================================
// Smooth Scrolling for Navigation Links
// ===================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Check if it's an internal link
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Active Navigation Link on Scroll
// ===================================
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// ===================================
// Navbar Background on Scroll
// ===================================
const navbar = document.getElementById('navbar');

function updateNavbarBackground() {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(248, 250, 252, 0.98)';
        navbar.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.08)';
    } else {
        navbar.style.background = 'rgba(248, 250, 252, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

window.addEventListener('scroll', updateNavbarBackground);

// ===================================
// Intersection Observer for Fade-In Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .about-card');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered animation delay
            setTimeout(() => {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
            }, index * 100);
            
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeInElements.forEach(element => {
    fadeInObserver.observe(element);
});

// ===================================
// Contact Form Validation and Submission
// ===================================
const contactForm = document.getElementById('contactForm');
const formInputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message')
};

const formErrors = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    subject: document.getElementById('subjectError'),
    message: document.getElementById('messageError')
};

const formSuccess = document.getElementById('formSuccess');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate individual field
function validateField(fieldName, value) {
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldName) {
        case 'name':
            if (value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
            
        case 'email':
            if (!emailRegex.test(value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'subject':
            if (value.trim().length < 3) {
                isValid = false;
                errorMessage = 'Subject must be at least 3 characters long';
            }
            break;
            
        case 'message':
            if (value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    return { isValid, errorMessage };
}

// Show error message
function showError(fieldName, message) {
    const formGroup = formInputs[fieldName].parentElement;
    formGroup.classList.add('error');
    formErrors[fieldName].textContent = message;
}

// Clear error message
function clearError(fieldName) {
    const formGroup = formInputs[fieldName].parentElement;
    formGroup.classList.remove('error');
    formErrors[fieldName].textContent = '';
}

// Real-time validation on input
Object.keys(formInputs).forEach(fieldName => {
    formInputs[fieldName].addEventListener('blur', (e) => {
        const { isValid, errorMessage } = validateField(fieldName, e.target.value);
        
        if (!isValid) {
            showError(fieldName, errorMessage);
        } else {
            clearError(fieldName);
        }
    });
    
    // Clear error on input
    formInputs[fieldName].addEventListener('input', () => {
        clearError(fieldName);
    });
});

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide previous success message
        formSuccess.classList.remove('show');
        
        // Validate all fields
        let isFormValid = true;
        
        Object.keys(formInputs).forEach(fieldName => {
            const { isValid, errorMessage } = validateField(fieldName, formInputs[fieldName].value);
            
            if (!isValid) {
                showError(fieldName, errorMessage);
                isFormValid = false;
            } else {
                clearError(fieldName);
            }
        });
        
        // If form is valid, simulate submission
        if (isFormValid) {
            // In a real application, you would send the form data to a server here
            // For this demo, we'll just show a success message
            
            // Simulate network delay
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Sending...</span>';
            submitButton.disabled = true;
            
            setTimeout(() => {
                // Show success message
                formSuccess.classList.add('show');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
            }, 1500);
        }
    });
}

// ===================================
// Scroll Progress Indicator (Optional Enhancement)
// ===================================
function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    // You can create a progress bar element and update it here
    // For now, this is just tracking the scroll progress
}

window.addEventListener('scroll', updateScrollProgress);

// ===================================
// Smooth Scroll to Top (if needed)
// ===================================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===================================
// Project Card Hover Effects Enhancement
// ===================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
});

// ===================================
// Lazy Loading for Project Images (if using real images)
// ===================================
// This would be used if you replace placeholders with actual images
/*
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}
*/

// ===================================
// Typing Effect for Hero Subtitle (Optional Enhancement)
// ===================================
/*
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect after page load
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 1000);
    });
}
*/

// ===================================
// Initialize on Page Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    setActiveNavLink();
    
    // Update navbar background
    updateNavbarBackground();
    
    // Add loaded class to body for any CSS animations
    document.body.classList.add('loaded');
});

// ===================================
// Console Message (Easter Egg)
// ===================================
console.log('%c👋 Hello, fellow developer!', 'font-size: 20px; font-weight: bold; color: #06b6d4;');
console.log('%cThanks for checking out my portfolio. Feel free to explore the code!', 'font-size: 14px; color: #64748b;');
console.log('%cInterested in working together? Reach out via the contact form!', 'font-size: 14px; color: #64748b;');
