// Animation.js - Custom animations for Elecwire website

document.addEventListener('DOMContentLoaded', function() {
    // First, only animate the hero/header section immediately
    initializeHeroAnimations();
    
    // Then set up all section animations
    setupSectionAnimations();
    
    // Set up other UI behaviors
    setupFadeInAnimations();
    setupNavbarScroll();
    setupGalleryCarousel();
    setupSmoothScrolling();
    setupStatCounters();
    setupScrollDependentAnimations();
    
    // Function to initialize only the hero/header animations immediately
    function initializeHeroAnimations() {
        // For navbar, hero and about section animations, these should run immediately
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.classList.add('in-view');
        }
        
        // About section should only auto-animate if it's actually visible on initial load
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const rect = aboutSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                aboutSection.classList.add('in-view');
                triggerSectionAnimations('about');
            }
        }
    }
    
    // Function to set up all section animations with Intersection Observer
    function setupSectionAnimations() {
        // We'll skip the hero section since it's handled separately
        const animatedSections = [
            { id: 'about', threshold: 0.1, rootMargin: '-100px 0px' },
            { id: 'services', threshold: 0.1, rootMargin: '-100px 0px' },
            { id: 'whyus', threshold: 0.1, rootMargin: '-100px 0px' },
            { id: 'progress', threshold: 0.1, rootMargin: '-100px 0px' },
            { id: 'gallery', threshold: 0.1, rootMargin: '-100px 0px' },
            { id: 'contact', threshold: 0.1, rootMargin: '-100px 0px' }
        ];
        
        // Create separate observers for each section to apply different rootMargins
        animatedSections.forEach(sectionInfo => {
            const section = document.getElementById(sectionInfo.id);
            if (section) {
                // Skip if this section already has animations running
                if (section.classList.contains('in-view')) {
                    return;
                }
                
                // For whyus section, handle differently to ensure animations don't start too early
                if (sectionInfo.id === 'whyus') {
                    setupWhyUsAnimations(section, sectionInfo.rootMargin);
                } else {
                    const sectionObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                section.classList.add('in-view');
                                sectionObserver.unobserve(section);
                                
                                // Manually trigger animations in case CSS animations don't start
                                triggerSectionAnimations(section.id);
                            }
                        });
                    }, {
                        threshold: sectionInfo.threshold,
                        rootMargin: sectionInfo.rootMargin
                    });
                    
                    sectionObserver.observe(section);
                }
            }
        });
        
        // Initial check on page load for sections that might already be visible
        checkCurrentlyVisibleSections();
    }
    
    // Function to check which sections are currently visible
    function checkCurrentlyVisibleSections() {
        const animatedSections = [
            'about', 'services', 'whyus', 'progress', 'gallery', 'contact'
        ];
        
        animatedSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section && !section.classList.contains('in-view')) {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    section.classList.add('in-view');
                    triggerSectionAnimations(sectionId);
                }
            }
        });
    }
    
    // Special function to handle Why Us section animations
    function setupWhyUsAnimations(whyusSection, rootMargin) {
        if (!whyusSection) return;
        
        // Remove any existing animation classes to prevent premature animation
        whyusSection.classList.remove('in-view');
        
        // Simple observer that matches other sections' behavior
        const whyusObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    whyusSection.classList.add('in-view');
                    whyusObserver.unobserve(whyusSection);
                    
                    // Manually trigger animations
                    triggerSectionAnimations('whyus');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: rootMargin
        });
        
        whyusObserver.observe(whyusSection);
    }
    
    // Function to check which sections are in view during scrolling
    function checkSectionsInView() {
        const animatedSections = [
            'about', 'services', 'whyus', 'progress', 'gallery', 'contact'
        ];
        
        animatedSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section && !section.classList.contains('in-view')) {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                
                // Consider the section in view if it's visible in the viewport
                if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
                    section.classList.add('in-view');
                    triggerSectionAnimations(sectionId);
                }
            }
        });
    }
    
    // Add scroll event listener to check sections during scrolling
    window.addEventListener('scroll', checkSectionsInView);
    
    // Function to manually trigger animations for a section
    function triggerSectionAnimations(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Force a reflow to ensure animations restart properly
        section.style.animation = 'none';
        section.offsetHeight; // Trigger reflow
        section.style.animation = '';
        
        // Find all animatable elements within the section and ensure they have running animations
        const animatableElements = section.querySelectorAll('[class*="animation"], [style*="animation"]');
        animatableElements.forEach(el => {
            // Reset animation and trigger reflow for each element
            el.style.animationPlayState = 'paused';
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = '';
            el.style.animationPlayState = 'running';
        });
    }
    
    // Function to set up fade-in animations
    function setupFadeInAnimations() {
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
    }
    
    // Function to set up navbar scroll effect
    function setupNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Function to set up gallery carousel
    function setupGalleryCarousel() {
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
    }
    
    // Function to set up smooth scrolling
    function setupSmoothScrolling() {
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
                    
                    // Also trigger animations when scrolling to a section via clicking
                    setTimeout(() => {
                        if (targetElement && !targetElement.classList.contains('in-view')) {
                            targetElement.classList.add('in-view');
                            triggerSectionAnimations(targetId.substring(1));
                        }
                    }, 1000); // After scroll animation completes
                }
            });
        });
    }
    
    // Function to set up stat counters
    function setupStatCounters() {
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
    }
    
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
    
    // Function to handle scroll-dependent animations for display-1 elements
    function setupScrollDependentAnimations() {
        // Target sections with display-1 headings we want to animate on scroll
        const targetSections = ['about', 'whyus', 'gallery', 'services'];
        const displayElements = {};
        
        // First, ensure we cancel any existing animations on these elements
        targetSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                // Target the h2.display-1 elements specifically
                const displayElement = section.querySelector('.outline-heading h2.display-1');
                if (displayElement) {
                    // Cancel any existing animations from the animations.css
                    displayElement.style.animation = 'none';
                    displayElement.style.opacity = '1';
                    displayElement.style.transform = 'translateX(0)';
                    
                    // Force a reflow
                    displayElement.offsetHeight;
                    
                    // Add a data attribute to mark this element for our scroll animation
                    displayElement.setAttribute('data-scroll-animate', 'true');
                }
            }
        });
        
        // Function to update section positions (for initial setup and on resize)
        function updateSectionPositions() {
            targetSections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    // Use a more specific selector to target the display-1 elements
                    // directly inside outline-heading
                    const displayElement = section.querySelector('.outline-heading h2.display-1');
                    
                    if (displayElement) {
                        displayElements[sectionId] = {
                            element: displayElement,
                            sectionTop: section.offsetTop,
                            sectionBottom: section.offsetTop + section.offsetHeight
                        };
                        
                        // Add a class to identify these elements for styling
                        displayElement.classList.add('scroll-animate-display');
                        
                        // Force an initial position to ensure they're visible
                        displayElement.style.transform = 'translateX(0)';
                    }
                }
            });
            
            // Initial update of positions
            window.dispatchEvent(new Event('scroll'));
        }
        
        // Add scroll listener to handle the animation
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Get the computed styles for the display-1 elements to check if they have existing animations
            // that might be interfering with our scroll-based animations
            Object.keys(displayElements).forEach(sectionId => {
                const data = displayElements[sectionId];
                if (!data || !data.element) return;
                
                const element = data.element;
                const computedStyle = window.getComputedStyle(element);
                
                // Check if the element has any animations running
                const hasAnimation = computedStyle.animationName !== 'none';
                
                // If the element has animations, we'll override them with our transform
                if (hasAnimation) {
                    // Cancel any running animations
                    element.style.animation = 'none';
                    element.style.animationName = 'none';
                }
                
                // Calculate whether the section is in view
                const sectionStart = data.sectionTop - windowHeight;
                const sectionEnd = data.sectionBottom;
                
                // If the section is visible, calculate the transform
                if (scrollPosition > sectionStart && scrollPosition < sectionEnd) {
                    // Calculate animation progress within the section
                    // 0 = just entered, 1 = about to leave
                    const progress = (scrollPosition - sectionStart) / (sectionEnd - sectionStart);
                    
                    // Calculate the transform - we want it to move from -100px to 0 as user scrolls down,
                    // and from 0 to 100px as user continues scrolling down out of view
                    let translateX = 0;
                    
                    if (progress < 0.5) {
                        // Coming into view (map 0->0.5 to -100->0)
                        translateX = -100 + (progress * 200);
                    } else {
                        // Going out of view (map 0.5->1 to 0->100)
                        translateX = (progress - 0.5) * 200;
                    }
                    
                    // Apply only the translateX transform directly, bypassing any existing styles
                    element.style.transform = `translateX(${translateX}px)`;
                } else if (scrollPosition <= sectionStart) {
                    // Before section is in view
                    element.style.transform = 'translateX(-100px)';
                } else {
                    // After section is out of view
                    element.style.transform = 'translateX(100px)';
                }
            });
        });
        
        // Listen for window resize events to update section positions
        window.addEventListener('resize', function() {
            // Debounce resize events
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(function() {
                updateSectionPositions();
            }, 200);
        });
        
        // Initial setup
        updateSectionPositions();
    }
});
