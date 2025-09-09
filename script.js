// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or respect OS preference
if (localStorage.getItem('theme') === 'dark' ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animate Elements on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate, .project-card, .timeline-item, .skill-progress');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);

        if (isVisible) {
            if (element.classList.contains('skill-progress')) {
                const width = element.getAttribute('data-width');
                element.style.width = width;
            } else {
                element.classList.add('visible');
            }
        }
    });
};

// Counter Animation for Stats
const counters = document.querySelectorAll('.stat-number');
const speed = 200;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace('+', '');
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment) + '+';
            setTimeout(() => animateCounters(), 1);
        } else {
            counter.innerText = target + '+';
        }
    });
};

// Initialize animations and counters
window.addEventListener('load', () => {
    // Add animate class to elements
    document.querySelectorAll('.project-card, .timeline-item').forEach(el => {
        el.classList.add('animate');
    });

    // Set data targets for counters
    document.getElementById('projectCount').setAttribute('data-target', '12');
    document.getElementById('clientCount').setAttribute('data-target', '5');
    document.getElementById('experienceCount').setAttribute('data-target', '15');
    document.getElementById('coffeeCount').setAttribute('data-target', '500');

    // Initial check for elements in viewport
    animateOnScroll();

    // Initialize counters when stats section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.about-stats'));
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Form Submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const form = this;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    const formMessage = document.getElementById('formMessage');
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    formMessage.className = 'form-message';
    
    // Submit form data to Google Apps Script
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        mode: 'no-cors'
    })
    .then(() => {
        // Since we're using no-cors, we can't read the response
        // But we assume it was successful
        btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
        formMessage.textContent = 'Thank you! Your message has been sent.';
        formMessage.className = 'form-message success';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            form.reset();
            formMessage.className = 'form-message';
        }, 3000);
    })
    .catch(error => {
        btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Try Again';
        formMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
        formMessage.className = 'form-message error';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            formMessage.className = 'form-message';
        }, 3000);
        console.error('Error:', error);
    });
});