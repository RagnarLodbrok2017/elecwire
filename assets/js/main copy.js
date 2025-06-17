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
                const navbarHeight = 9; // Navbar height in pixels
                const sectionTop = servicesSection.offset().top;
                
                const servicesContainer = servicesSection.find('.container');
                let desiredRightOffset = '6%'; // Default to CSS value if container not found

                if (servicesContainer.length) {
                    const containerOffset = servicesContainer.offset();
                    const containerWidth = servicesContainer.outerWidth();
                    const viewportWidth = $(window).width();

                    // Calculate the position of the container's right edge relative to the viewport left edge
                    const containerRightEdgeFromViewportLeft = containerOffset.left + containerWidth;

                    // The desired position for the column's right edge is 40px to the left of the container's right edge
                    const desiredColumnRightEdgeFromViewportLeft = containerRightEdgeFromViewportLeft - 10;

                    // The 'right' CSS property is the distance from the viewport's right edge.
                    // So, calculate the distance from the viewport's right edge to the desired column's right edge.
                    desiredRightOffset = viewportWidth - desiredColumnRightEdgeFromViewportLeft;
                }

                // Check if we're in the services section
                const windowHeight = $(window).height();
                const servicesSectionBottom = sectionTop + servicesSection.outerHeight();
                
                if (scrollTop + windowHeight > sectionTop && scrollTop < servicesSectionBottom) {
                    // We're in the services section
                    servicesSection.addClass('in-view');
                    
                    // Before reaching the first service item
                    if (scrollTop < firstItemTop - 60) {
                        // Keep it aligned with first service item
                        rightColumn.css({
                            'position': 'absolute',
                            'top': (firstItemTop - sectionTop) + 'px',
                            'right': desiredRightOffset + 'px', // Use calculated pixel value
                            'transform': 'translateY(0)'
                        });
                    }
                    // When we reach the last service item
                    else if (scrollTop >= lastItemTop - 60) {
                        // Switch to absolute positioning to stay with last item
                        rightColumn.css({
                            'position': 'absolute',
                            'top': (lastItemTop - sectionTop) + 'px',
                            'right': desiredRightOffset + 'px', // Use calculated pixel value
                            'transform': 'translateY(0)'
                        });
                    } 
                    // For scrolling between first and last items, stay fixed at navbar height
                    else {
                        rightColumn.css({
                            'position': 'fixed',
                            'top': navbarHeight + 'vh',
                            'right': desiredRightOffset + 'px', // Use calculated pixel value
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
    const progressBar = document.querySelector('.loader-progress-bar');
    
    // If there's no page loader, exit early
    if (!pageLoader) {
        return;
    }
    
    // Track loading resources
    let totalResources = 0;
    let loadedResources = 0;
    let videoLoaded = false;
    let pageLoaded = false;
    let loaderHidden = false;
    let videoStarted = false;
    
    // Original page title to restore later
    const originalTitle = document.title;
    
    // Function to update progress bar
    function updateProgress() {
        // Don't update if loader is already hidden
        if (loaderHidden) return;
        
        // Calculate percentage loaded (minimum 5% to show something is happening)
        let percentage = 5;
        
        if (totalResources > 0) {
            // Base percentage on loaded resources (max 90% until video is ready)
            const resourcePercentage = Math.floor((loadedResources / totalResources) * 90);
            percentage = Math.max(5, Math.min(90, resourcePercentage));
        }
        
        // Final 10% reserved for video loading
        if (videoLoaded) {
            percentage = Math.min(100, percentage + 10);
        }
        
        // If everything is loaded, set to 100%
        if (videoLoaded && pageLoaded && loadedResources >= totalResources) {
            percentage = 100;
        }
        
        // Update progress bar width with smooth animation
        progressBar.style.width = percentage + '%';
        
        // Update browser tab title with loading percentage
        document.title = `${percentage}% | ${originalTitle}`;
        
        // Update favicon to show loading progress (creates a dynamic loading indicator)
        updateFavicon(percentage);
        
        console.log(`Loading progress: ${percentage}% (${loadedResources}/${totalResources} resources, video: ${videoLoaded ? 'ready' : 'loading'})`);
        
        // Hide loader when fully loaded
        if (percentage === 100) {
            // Make sure video has started playing before hiding loader
            if (video && !videoStarted) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            videoStarted = true;
                            setTimeout(() => hideLoader(), 300);
                        })
                        .catch(error => {
                            console.error("Video play error:", error);
                            // Still hide loader even if video fails
                            videoStarted = true;
                            setTimeout(() => hideLoader(), 300);
                        });
                } else {
                    videoStarted = true;
                    setTimeout(() => hideLoader(), 300);
                }
            } else {
                setTimeout(() => hideLoader(), 300);
            }
        }
    }
    
    // Function to create a dynamic favicon showing loading progress
    function updateFavicon(percentage) {
        // Skip if browser doesn't support canvas
        if (!document.createElement('canvas').getContext) {
            return;
        }
        
        try {
            // Create canvas for the favicon
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            
            // Draw background
            ctx.fillStyle = '#050F19';
            ctx.fillRect(0, 0, 32, 32);
            
            // Draw progress circle
            ctx.beginPath();
            ctx.moveTo(16, 16);
            ctx.arc(16, 16, 14, -Math.PI/2, (-Math.PI/2) + (Math.PI*2*percentage/100), false);
            ctx.lineTo(16, 16);
            ctx.fillStyle = '#FF4D00';
            ctx.fill();
            
            // Draw inner circle
            ctx.beginPath();
            ctx.arc(16, 16, 8, 0, Math.PI*2, false);
            ctx.fillStyle = '#050F19';
            ctx.fill();
            
            // Create the favicon link element
            const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'icon';
            link.href = canvas.toDataURL('image/png');
            
            // Add to document if it doesn't exist
            if (!document.querySelector('link[rel="icon"]')) {
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        } catch (e) {
            console.error("Error updating favicon:", e);
        }
    }
    
    // Function to hide the loader
    function hideLoader() {
        // Prevent multiple calls to hideLoader
        if (loaderHidden) return;
        
        loaderHidden = true;
        console.log("All resources loaded, hiding loader");
        
        // Restore original page title
        document.title = originalTitle;
        
        // Force opacity to 0 first to ensure transition works
        pageLoader.style.opacity = '0';
        
        setTimeout(function() {
            // Then add the hidden class and remove from DOM flow
            pageLoader.classList.add('hidden');
            pageLoader.style.visibility = 'hidden';
            
            // Force a scroll event to properly position elements after loader is hidden
                window.dispatchEvent(new Event('scroll'));
        }, 500);
    }
    
    // Count and track all page resources
    function trackPageResources() {
        // Get all resources that need to be loaded
        const images = Array.from(document.images);
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        const videos = Array.from(document.querySelectorAll('video'));
        
        // Calculate total resources to track
        totalResources = images.length + scripts.length + stylesheets.length + videos.length;
        console.log(`Tracking ${totalResources} resources: ${images.length} images, ${scripts.length} scripts, ${stylesheets.length} stylesheets, ${videos.length} videos`);
        
        // Track image loading
        images.forEach(img => {
            // If image is already loaded
            if (img.complete) {
                loadedResources++;
                updateProgress();
            } else {
                // Add load and error event listeners
                img.addEventListener('load', () => {
                    loadedResources++;
                    updateProgress();
                });
                img.addEventListener('error', () => {
                    loadedResources++;
                    updateProgress();
                });
            }
        });
        
        // Track video loading
        videos.forEach(vid => {
            if (vid.readyState >= 3) {
                loadedResources++;
                updateProgress();
        } else {
                vid.addEventListener('canplaythrough', () => {
                    loadedResources++;
                    updateProgress();
                }, { once: true });
                vid.addEventListener('error', () => {
                    loadedResources++;
                    updateProgress();
                }, { once: true });
            }
        });
        
        // For scripts and stylesheets, we'll assume they're loaded
        // since they're usually blocking resources
        loadedResources += scripts.length + stylesheets.length;
        updateProgress();
    }
    
    // Handle main background video loading separately
    if (video) {
        // Check for cached video
        if (video.readyState >= 3) {
            console.log("Background video already loaded from cache");
            videoLoaded = true;
            updateProgress();
        }
        
        // Video can play through (fully loaded)
        video.addEventListener('canplaythrough', function() {
            console.log("Background video can play through");
            if (!videoLoaded) {
                videoLoaded = true;
                updateProgress();
            }
        });
        
        // Also handle video loading error
        video.addEventListener('error', function(e) {
            console.error("Background video loading error:", e);
            videoLoaded = true;
            updateProgress();
        });
        
        // Preload video to ensure faster playback
        video.preload = "auto";
        
        // Add timeout for video loading as fallback (longer timeout)
        setTimeout(function() {
            if (!videoLoaded) {
                console.log("Video load timeout - forcing video loaded state");
                videoLoaded = true;
                updateProgress();
            }
        }, 5000); // Increased to 5 seconds for video loading
    } else {
        // No video element, mark video as loaded
        videoLoaded = true;
        updateProgress();
    }
    
    // Start tracking resources once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackPageResources);
    } else {
        trackPageResources();
    }
    
    // Wait for the entire page to load
    window.addEventListener('load', function() {
        console.log("Window load event fired");
        pageLoaded = true;
        updateProgress();
    });
    
    // Final fallback - hide loader after maximum wait time (10 seconds)
    setTimeout(function() {
        if (!loaderHidden) {
            console.log("Force loading complete after maximum timeout");
            videoLoaded = true;
            pageLoaded = true;
            // Force all resources to be considered loaded
            loadedResources = totalResources;
            updateProgress();
        }
    }, 10000); // Increased to 10 seconds as final safety
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
    handleProgressMedia();
    initServicesSection();
    
    // Trigger scroll event to position elements correctly
    setTimeout(function() {
        window.dispatchEvent(new Event('scroll'));
    }, 200);
}); 