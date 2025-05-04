// Animation.js - Custom animations for Elecwire website

document.addEventListener('DOMContentLoaded', function() {
    // Fade-in animations using Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // About section animation trigger
    const aboutSection = document.getElementById('about');
    
    if (aboutSection) {
        console.log("About section found, setting up observer");
        
        // Safety timeout - if section hasn't become visible after scrolling
        setTimeout(() => {
            if (!aboutSection.classList.contains('in-view')) {
                console.log("Safety timeout triggered, forcing about section animation");
                aboutSection.classList.add('in-view');
            }
        }, 4000); // 4 second safety timeout
        
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                console.log("About section intersection status:", entry.isIntersecting);
                
                if (entry.isIntersecting) {
                    aboutSection.classList.add('in-view');
                    console.log("Added in-view class to about section");
                    aboutObserver.unobserve(aboutSection);
                }
            });
        }, {
            threshold: 0.1, // Trigger when just 10% of the section is visible
            rootMargin: '-100px 0px' // Adjust if needed based on navbar height
        });
        
        aboutObserver.observe(aboutSection);
        
        // Also trigger the animation when the user scrolls past a certain point
        window.addEventListener('scroll', function() {
            const aboutSectionTop = aboutSection.getBoundingClientRect().top;
            
            if (aboutSectionTop < window.innerHeight * 0.8 && !aboutSection.classList.contains('in-view')) {
                console.log("Scroll-based trigger for about section");
                aboutSection.classList.add('in-view');
            }
        });
    } else {
        console.log("About section not found");
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Gallery carousel functionality
    const gallerySlides = document.querySelectorAll('.gallery-flex-container');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const nextButtons = document.querySelectorAll('.next-btn');
    let currentSlide = 0;
    const totalSlides = gallerySlides.length;
    
    // Initialize all next buttons
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            gallerySlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            gallerySlides[currentSlide].classList.add('active');
        });
    });
    
    // Initialize all prev buttons
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            gallerySlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            gallerySlides[currentSlide].classList.add('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate stats when in viewport
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.textContent);
        let count = 0;
        const duration = 2000; // 2 seconds
        const increment = Math.ceil(target / (duration / 20)); // Update every 20ms
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = count;
            }
        }, 20);
    }
});
