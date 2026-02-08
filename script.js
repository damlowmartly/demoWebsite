/**
 * FOLLICLES SALON DE ROYALE - JAVASCRIPT
 * Modern, minimal interactions for premium salon website
 */

// ================================================================
// MOBILE NAVIGATION TOGGLE
// ================================================================

const initMobileNav = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu) return;
    
    // Toggle menu on button click
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
};

// ================================================================
// OPENING HOURS STATUS CHECKER
// ================================================================

const checkOpeningStatus = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Opening hours: 9:00 AM to 9:00 PM (540 minutes to 1260 minutes)
    const openingTime = 9 * 60; // 9:00 AM
    const closingTime = 21 * 60; // 9:00 PM
    
    // Highlight today's row
    const hoursItems = document.querySelectorAll('.hours-item');
    hoursItems.forEach(item => {
        const dayData = parseInt(item.getAttribute('data-day'));
        if (dayData === currentDay) {
            item.classList.add('today');
        }
    });
    
    // Check if currently open
    const statusBadge = document.getElementById('status-badge');
    if (!statusBadge) return;
    
    const isOpen = currentTimeInMinutes >= openingTime && currentTimeInMinutes < closingTime;
    
    if (isOpen) {
        // Calculate minutes until closing
        const minutesUntilClose = closingTime - currentTimeInMinutes;
        const hoursUntilClose = Math.floor(minutesUntilClose / 60);
        const minsUntilClose = minutesUntilClose % 60;
        
        statusBadge.textContent = `Open Now`;
        statusBadge.classList.add('open');
        statusBadge.classList.remove('closed');
    } else {
        // Calculate when opens next
        let nextOpenDay = currentDay;
        let nextOpenMessage = '';
        
        if (currentTimeInMinutes >= closingTime) {
            // After closing today, opens tomorrow
            nextOpenDay = (currentDay + 1) % 7;
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const nextDayName = nextOpenDay === currentDay ? 'Today' : 'Tomorrow';
            nextOpenMessage = ` • Opens ${nextDayName} at 9:00 AM`;
        } else {
            // Before opening today
            nextOpenMessage = ' • Opens Today at 9:00 AM';
        }
        
        statusBadge.textContent = `Closed${nextOpenMessage}`;
        statusBadge.classList.add('closed');
        statusBadge.classList.remove('open');
    }
};

// ================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================================================

const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed nav
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ================================================================
// NAV BACKGROUND ON SCROLL
// ================================================================

const initScrollEffects = () => {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 50) {
            nav.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        } else {
            nav.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
};

// ================================================================
// LAZY LOADING IMAGES
// ================================================================

const initLazyLoading = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// ================================================================
// INITIALIZE ALL FUNCTIONS
// ================================================================

const init = () => {
    // Core functionality
    initMobileNav();
    checkOpeningStatus();
    initSmoothScroll();
    initScrollEffects();
    initLazyLoading();
    
    // Update opening status every minute
    setInterval(checkOpeningStatus, 60000);
};

// Run when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ================================================================
// PERFORMANCE OPTIMIZATION
// ================================================================

// Prevent layout shift from images
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
