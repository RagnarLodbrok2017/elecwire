$(document).ready(function() {
    // Handle page loading when video is ready
    handlePageLoading();
    
    // Previous position to detect jumps
    let previousPosition = 0;
    
    // Keep track of the last active section
    let lastActiveSection = '';
    
    // Scroll indicator functionality
    function updateScrollIndicator() {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height();
        const winHeight = $(window).height();
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
        
        // Update the scroll bar fill height (not width)
        $('.scroll-bar-fill').css('height', scrollPercent + '%');
        
        // Show the scroll indicator when past the hero section, hide it otherwise
        const heroSectionHeight = $('.hero-section').outerHeight();
        
        if (scrollTop > heroSectionHeight / 2) {
            $('.scroll-indicator-container').addClass('visible');
        } else {
            $('.scroll-indicator-container').removeClass('visible');
        }
    }
    
    // Function to update active nav link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = $(window).scrollTop() + 100; // Reduced offset for better precision
        let currentActiveSection = null;
        
        // Get the hero section first
        const heroSection = $('.hero-section');
        let heroTop = 0;
        let heroBottom = 0;
        
        if (heroSection.length) {
            heroTop = heroSection.offset().top;
            heroBottom = heroTop + heroSection.outerHeight();
            
            // If we're in the hero section
            if (scrollPosition >= heroTop && scrollPosition <= heroBottom) {
                currentActiveSection = '';  // Home link has empty section ID
            }
        }
        
        // Special handling for about section - activate when within 150px of top
        const aboutSection = $('#about');
        if (aboutSection.length) {
            const aboutTop = aboutSection.offset().top - 150; // Activate 150px before reaching the section
            const aboutBottom = aboutTop + aboutSection.outerHeight();
            
            if (scrollPosition >= aboutTop && scrollPosition <= aboutBottom) {
                currentActiveSection = 'about';
            }
        }
        
        // Check all other sections with IDs (except about which we handled specially)
        $('section[id]').each(function() {
            if ($(this).attr('id') === 'about') {
                return; // Skip about section as we handled it specially
            }
            
            const sectionTop = $(this).offset().top;
            const sectionBottom = sectionTop + $(this).outerHeight();
            const sectionId = $(this).attr('id');
            
            // If we're in this section
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                currentActiveSection = sectionId;
                return false; // Break the loop
            }
        });
        
        // If we're at the very bottom of the page, activate contact
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 0) {
            currentActiveSection = 'contact';
        }
        
        // If we're at the very top, it's home
        if ($(window).scrollTop() < 50) {
            currentActiveSection = '';
        }
        
        // If we found an active section, update it
        if (currentActiveSection !== null) {
            // First reset all navlinks
            $('.nav-link').removeClass('active').css('color', '#ffffff');
            
            if (currentActiveSection === '') {
                // Home link
                $('.nav-link[href="#"]').addClass('active').css('color', 'var(--primary-color)');
            } else {
                // Section link
                $('.nav-link[href="#' + currentActiveSection + '"]').addClass('active').css('color', 'var(--primary-color)');
            }
            
            // Update the last active section
            lastActiveSection = currentActiveSection;
        } else if (lastActiveSection !== null) {
            // No active section found, but we have a last active section
            // Keep the last active section's link highlighted
            $('.nav-link').removeClass('active').css('color', '#ffffff');
            
            if (lastActiveSection === '') {
                $('.nav-link[href="#"]').addClass('active').css('color', 'var(--primary-color)');
            } else {
                $('.nav-link[href="#' + lastActiveSection + '"]').addClass('active').css('color', 'var(--primary-color)');
            }
        } else {
            // No active section and no last active section, default to home
            $('.nav-link').removeClass('active').css('color', '#ffffff');
            $('.nav-link[href="#"]').addClass('active').css('color', 'var(--primary-color)');
        }
    }
    
    // Add active class styling
    $('<style>.nav-link.active { color: var(--primary-color) !important; }</style>').appendTo('head');
    
    // Initialize scroll indicator on page load
    updateScrollIndicator();
    updateActiveNavLink();
    
    // Update on scroll
    $(window).scroll(function() {
        updateScrollIndicator();
        updateActiveNavLink();
    });
    
    // Add cursor pointer to scroll indicator on hover
    $('.scroll-indicator-container').css('cursor', 'pointer');
    
    // Scroll to top when clicking the scroll indicator
    $('.scroll-indicator-container').on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800, 'linear');
    });
    
    // Make clicked nav links active immediately
    $('.nav-link').on('click', function(e) {
        // Ensure we only handle clicks directly on the nav-link element, not its padding
        if (e.target !== this) return;
        
        // Remove active class from all links
        $('.nav-link').removeClass('active').css('color', '#ffffff');
        
        // Add active class to clicked link
        $(this).addClass('active').css('color', 'var(--primary-color)');
        
        // Get the href attribute
        const href = $(this).attr('href');
        
        // Special handling for contact link
        if (href === '#contact') {
            e.preventDefault();
            
            // Find the contact section or footer
            const contactSection = $('.contact-section');
            
            if (contactSection.length) {
                // Scroll to the contact section
                $('html, body').animate({
                    scrollTop: contactSection.offset().top
                }, 800, 'linear');
            } else {
                // If no contact section, scroll to the very bottom
                $('html, body').animate({
                    scrollTop: 999999 // A very large number to ensure scrolling to bottom
                }, 800, 'linear');
            }
            
            // Update lastActiveSection
            lastActiveSection = 'contact';
            return;
        }
        
        // Special handling for about link with -120px offset
        if (href === '#about') {
            e.preventDefault();
            
            const aboutSection = $('#about');
            if (aboutSection.length) {
                $('html, body').animate({
                    scrollTop: aboutSection.offset().top - 120
                }, 800, 'linear');
                
                // Update lastActiveSection
                lastActiveSection = 'about';
                return;
            }
        }
        
        // Special handling for gallery link with -80px offset
        if (href === '#gallery') {
            e.preventDefault();
            
            const gallerySection = $('#gallery');
            if (gallerySection.length) {
                $('html, body').animate({
                    scrollTop: gallerySection.offset().top + 50
                }, 800, 'linear');
                
                // Update lastActiveSection
                lastActiveSection = 'gallery';
                return;
            }
        }
        
        // If it's a section link, update the lastActiveSection
        if (href === '#') {
            lastActiveSection = '';
        } else if (href.startsWith('#')) {
            lastActiveSection = href.substring(1); // Remove the # character
        }
        
        // The smooth scrolling is already handled in the existing code
    });
    
    // Override the default smooth scrolling for all links
    $('a[href*="#"]').on('click', function(e) {
        const href = $(this).attr('href');
        
        // Don't override for links with special handling
        if (href === '#contact' || href === '#about' || href === '#gallery') {
            return;
        }
        
        // If it's the home link (href="#"), scroll to top
        if (href === '#') {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 500, 'linear');
        }
        // For all other links, use the standard behavior with a 70px offset
        else if (href.startsWith('#')) {
            e.preventDefault();
            const targetSection = $(href);
            if (targetSection.length) {
                $('html, body').animate({
                    scrollTop: targetSection.offset().top - 70
                }, 500, 'linear');
            }
        }
    });
    
    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
        
        // Make the services fixed column behave correctly with first and last service items
        const servicesSection = $('#services');
        if (servicesSection.length) {
            const rightColumn = $('.services-fixed-column');
            const serviceItems = $('.services-item');
            const firstItem = serviceItems.first();
            const lastItem = serviceItems.last();
            
            if (firstItem.length && lastItem.length) {
                const firstItemTop = firstItem.offset().top;
                const lastItemTop = lastItem.offset().top;
                const scrollTop = $(window).scrollTop();
                const navbarHeight = 90; // Navbar height in pixels
                const sectionTop = servicesSection.offset().top;
                
                // Check if we're in the services section
                const windowHeight = $(window).height();
                const servicesSectionBottom = sectionTop + servicesSection.outerHeight();
                
                if (scrollTop + windowHeight > sectionTop && scrollTop < servicesSectionBottom) {
                    // We're in the services section
                    servicesSection.addClass('in-view');
                    
                    // Before reaching the first service item
                    if (scrollTop < firstItemTop - 90) {
                        // Keep it aligned with first service item
                        rightColumn.css({
                            'position': 'absolute',
                            'top': (firstItemTop - sectionTop) + 'px',
                            'right': '6%',
                            'transform': 'translateY(0)'
                        });
                    }
                    // When we reach the last service item
                    else if (scrollTop >= lastItemTop - 90) {
                        // Switch to absolute positioning to stay with last item
                        rightColumn.css({
                            'position': 'absolute',
                            'top': (lastItemTop - sectionTop) + 'px',
                            'right': '6%',
                            'transform': 'translateY(0)'
                        });
                    } 
                    // For scrolling between first and last items, stay fixed at navbar height
                    else {
                        rightColumn.css({
                            'position': 'fixed',
                            'top': navbarHeight + 'px',
                            'right': '6%',
                            'transform': 'translateY(0)'
                        });
                    }
                } else {
                    // We're not in the services section
                    servicesSection.removeClass('in-view');
                    
                    // Hide the fixed column with transform
                    rightColumn.css({
                        'transform': 'translateY(20px)'
                    });
                }
            }
        }
    });

    // Initialize column position on load
    $(window).on('load', function() {
        $(window).trigger('scroll');
    });

    // Also trigger on resize
    $(window).on('resize', function() {
        $(window).trigger('scroll');
    });

    // Fade in animation on scroll
    function fadeInOnScroll() {
        $('.fade-in').each(function() {
            if ($(window).scrollTop() + $(window).height() > $(this).offset().top + 100) {
                $(this).addClass('visible');
            }
        });
    }

    $(window).on('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Initial check on page load

    // Mobile menu toggle
    $('.navbar-toggler').on('click', function() {
        $('.navbar-collapse').toggleClass('show');
    });

    // Close mobile menu on link click
    $('.nav-link').on('click', function() {
        $('.navbar-collapse').removeClass('show');
    });

    // Gallery image modal
    $('.gallery-item').on('click', function() {
        const imgSrc = $(this).find('img').attr('src');
        const modal = `
            <div class="modal fade" id="galleryModal">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content bg-dark">
                        <div class="modal-body p-0">
                            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal"></button>
                            <img src="${imgSrc}" class="img-fluid" alt="Gallery Image">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modal);
        $('#galleryModal').modal('show');
        
        $('#galleryModal').on('hidden.bs.modal', function() {
            $(this).remove();
        });
    });
});

// Function to handle page loading when video is ready
function handlePageLoading() {
    const video = document.getElementById('background-video');
    const pageLoader = document.getElementById('page-loader');
    const afterVideoImg = document.getElementById('after-video-img');
    
    // If there's no page loader, exit early
    if (!pageLoader) {
        return;
    }
    
    // Track if video and page are loaded
    let videoLoaded = false;
    let pageLoaded = false;
    
    // Function to hide the loader only when both video and page are loaded
    function hideLoader() {
        if (videoLoaded && pageLoaded) {
            console.log("Both video and page fully loaded, hiding loader");
            pageLoader.classList.add('hidden');
            
            // Force a scroll event to properly position elements after loader is hidden
            setTimeout(function() {
                window.dispatchEvent(new Event('scroll'));
            }, 100);
        } else {
            console.log("Still waiting for full page load. Video loaded: " + videoLoaded + ", Page loaded: " + pageLoaded);
        }
    }
    
    // Handle video loading
    if (video) {
        // Check for cached video
        if (video.readyState >= 3) {
            console.log("Video already loaded from cache");
            videoLoaded = true;
            hideLoader();
        }
        
        // Video can play through (fully loaded)
        video.addEventListener('canplaythrough', function() {
            console.log("Video can play through");
            // Only respond if we haven't already loaded
            if (!videoLoaded) {
                videoLoaded = true;
                hideLoader();
            }
        });
        
        // Also handle video loading error
        video.addEventListener('error', function(e) {
            console.error("Video loading error:", e);
            videoLoaded = true;
            hideLoader();
        });
        
        // Handle video ended event
        video.addEventListener('ended', function() {
            console.log("Video ended");
            video.style.display = 'none';
            afterVideoImg.style.display = 'block';
        });
        
        // Add timeout for video loading as fallback
        setTimeout(function() {
            if (!videoLoaded) {
                console.log("Video load timeout - forcing video loaded state");
                videoLoaded = true;
                hideLoader();
            }
        }, 5000);
    } else {
        // No video element, mark video as loaded
        videoLoaded = true;
        hideLoader();
    }
    
    // Wait for the entire page to load
    window.addEventListener('load', function() {
        console.log("Window load event fired");
        pageLoaded = true;
        hideLoader();
    });
    
    // Mark page as loaded if DOMContentLoaded already fired
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log("Document already interactive/complete");
        pageLoaded = true;
        hideLoader();
    }
            
    // Fallback - hide loader after maximum wait time (8 seconds)
    setTimeout(function() {
        console.log("Force loading complete after timeout");
        if (!videoLoaded || !pageLoaded) {
            console.log("Forcing loader to hide after timeout");
            // Force both video and page to be considered loaded after timeout
            videoLoaded = true;
            pageLoaded = true;
            hideLoader();
            
            // Directly hide the loader in case the hideLoader function has issues
            pageLoader.classList.add('hidden');
            
            // Force a scroll event to properly position elements
            setTimeout(function() {
                window.dispatchEvent(new Event('scroll'));
            }, 100);
        }
    }, 8000);
}

document.addEventListener('DOMContentLoaded', function() {
    // Gallery Carousel functionality
    function initGalleryCarousel() {
        // Get all gallery slides
        const gallerySlides = document.querySelectorAll('.gallery-flex-container');
        const totalSlides = gallerySlides.length;
        let currentSlideIndex = 0; // First slide is active by default
        let previousSlideIndex = null;
        let isAnimating = false; // Add this to prevent rapid clicks
        
        // Get all navigation buttons
        const prevButtons = document.querySelectorAll('.prev-btn');
        const nextButtons = document.querySelectorAll('.next-btn');
        
        // Add click event to all previous buttons
        prevButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Prevent rapid clicks during animation
                if (isAnimating) return;
                isAnimating = true;
                
                // Store previous slide index
                previousSlideIndex = currentSlideIndex;
                
                // Calculate the previous slide index (with loop back to last slide)
                currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
                updateActiveSlide();
            });
        });
        
        // Add click event to all next buttons
        nextButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Prevent rapid clicks during animation
                if (isAnimating) return;
                isAnimating = true;
                
                // Store previous slide index
                previousSlideIndex = currentSlideIndex;
                
                // Calculate the next slide index (with loop back to first slide)
                currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
                updateActiveSlide();
            });
        });
        
        // Function to update which slide is active
        function updateActiveSlide() {
            // Remove transition classes from all slides
            gallerySlides.forEach(slide => {
                slide.classList.remove('active', 'previous', 'next-in');
                slide.style.display = 'none';
            });
            
            // Set up the exiting slide (previous)
            if (previousSlideIndex !== null) {
                gallerySlides[previousSlideIndex].classList.add('previous');
                gallerySlides[previousSlideIndex].style.display = 'flex';
                
                // Add the next slide with entering transition
                gallerySlides[currentSlideIndex].classList.add('next-in');
                gallerySlides[currentSlideIndex].style.display = 'flex';
                
                // After transition completes, clean up the previous slide
                setTimeout(() => {
                    if (gallerySlides[previousSlideIndex]) {
                        gallerySlides[previousSlideIndex].classList.remove('previous');
                        gallerySlides[previousSlideIndex].style.display = 'none';
                    }
                    gallerySlides[currentSlideIndex].classList.remove('next-in');
                    gallerySlides[currentSlideIndex].classList.add('active');
                    
                    // Reset animation flag
                    isAnimating = false;
                }, 1500); // Match this to the CSS transition duration
            } else {
                // Initial load, just show the active slide
                gallerySlides[currentSlideIndex].classList.add('active');
                gallerySlides[currentSlideIndex].style.display = 'flex';
                isAnimating = false;
            }
        }
    }
    
    // Handle video end
    function handleVideoEnd() {
        const video = document.getElementById('background-video');
        const afterImage = document.getElementById('after-video-img');
        
        if (video && afterImage) {
            video.addEventListener('ended', function() {
                // Hide video and show image when video ends
                video.style.display = 'none';
                afterImage.style.display = 'block';
            });
        }
    }
    
    // Handle progress section media
    function handleProgressMedia() {
        // Check if the browser supports video
        const progressVideo = document.querySelector('.progress-circle-video');
        
        if (progressVideo) {
            // Try to play the video
            const playPromise = progressVideo.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Video playback failed:", error);
                    // Try to play again after a short delay
                    setTimeout(() => {
                        progressVideo.play().catch(e => console.log("Retry failed:", e));
                    }, 1000);
                });
            }
            
            // Make sure video keeps playing
            progressVideo.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play().catch(e => console.log("Loop play failed:", e));
            });
        }
    }
    
    // Initialize services section
    function initServicesSection() {
        // Hide services fixed column initially
        const servicesSection = $('#services');
        const rightColumn = $('.services-fixed-column');
        
        // Set initial state
        if (servicesSection.length && rightColumn.length) {
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            const sectionTop = servicesSection.offset().top;
            const servicesSectionBottom = sectionTop + servicesSection.outerHeight();
            
            // Check if services section is in view
            if (scrollTop + windowHeight > sectionTop && scrollTop < servicesSectionBottom) {
                servicesSection.addClass('in-view');
            } else {
                servicesSection.removeClass('in-view');
            }
        }
    }
    
    // Initialize all functionality
    initGalleryCarousel();
    handleVideoEnd();
    handleProgressMedia();
    initServicesSection();
    
    // Trigger scroll event to position elements correctly
    setTimeout(function() {
        window.dispatchEvent(new Event('scroll'));
    }, 200);
}); 