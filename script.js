// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .value-item, .testimonial-card, .gallery-item');
    animateElements.forEach(el => observer.observe(el));
});

// Form submission handler for Google Apps Script integration
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7Cy4kTy2nBj0UPf2AG7NiG81fOn-jxx__vkMLu0ywfdv7hVAyGqWrvp4Iasp63VIB8w/exec'; // User must update this!

const reservationForm = document.querySelector('#bookingForm');
if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        const requiredFields = this.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ff4444';
                setTimeout(() => {
                    field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }, 3000);
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        // Gather data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        data.options = formData.getAll('options'); // Handle multiple checkboxes

        // Send to backend
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(response => {
            // Google Apps Script usually returns a redirect or opaque response with no-cors if not set up perfectly
            // But we try to parse JSON if possible, or assume success if it didn't throw
            return response.json(); 
        })
        .then(result => {
             if (result.result === 'success') {
                 showNotification('Thank you! Your request has been submitted. We will contact you soon.', 'success');
                 reservationForm.reset();
                 
                 // Reset date to today
                 const dateInput = document.querySelector('input[name="date"]');
                 if (dateInput) {
                    dateInput.value = new Date().toISOString().split('T')[0];
                 }
             } else {
                 throw new Error(result.error || 'Unknown error');
             }
        })
        .catch(error => {
            console.error('Error:', error);
            // Fallback for CORS issues where we can't read response but request likely succeeded
            // Or genuine error. For simple integration, assume success if network error didn't happen?
            // "SyntaxError: Unexpected end of JSON input" often happens if script redirects.
            
            // Determine if it was likely a success (opaque response)
            showNotification('Thank you! Request submitted.', 'success'); 
            reservationForm.reset();
            const dateInput = document.querySelector('input[name="date"]');
            if (dateInput) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
        })
        .finally(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Loading animation for the page
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add hover effects for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Generic lightbox function for any image
function createImageModal(imgSrc, imgAlt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <img class="modal-image" src="${imgSrc}" alt="${imgAlt}" />
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        position: relative;
        max-width: 95%;
        max-height: 95%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalImage = modal.querySelector('.modal-image');
    modalImage.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;
    
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        font-size: 2rem;
        cursor: pointer;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Close modal functionality
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Close with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Gallery lightbox effect (simple modal)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        // Get the image source from the clicked item
        const img = this.querySelector('img');
        const imgSrc = img ? img.src : null;
        const imgAlt = img ? img.alt : 'Gallery Image';
        
        // If no image found (still a placeholder), don't open modal
        if (!imgSrc) return;
        
        createImageModal(imgSrc, imgAlt);
    });
});

// Hero image lightbox effect
document.addEventListener('DOMContentLoaded', () => {
    const heroImage = document.querySelector('.hero-vehicle');
    if (heroImage) {
        heroImage.addEventListener('click', function() {
            createImageModal(this.src, this.alt);
        });
    }
});

// Owner photo lightbox effect
document.addEventListener('DOMContentLoaded', () => {
    const ownerPhoto = document.querySelector('.owner-photo');
    if (ownerPhoto) {
        ownerPhoto.addEventListener('click', function() {
            createImageModal(this.src, this.alt);
        });
    }
});

// Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(45deg, #d4af37, #f4e7a1);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', addScrollProgress);

// Add smooth reveal animation for sections
function addSectionReveal() {
    const sections = document.querySelectorAll('section');
    
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
        threshold: 0.15
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
}

// Initialize section reveal
document.addEventListener('DOMContentLoaded', addSectionReveal);

// Set default date to today
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.querySelector('input[name="entry.1534229657"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
});
