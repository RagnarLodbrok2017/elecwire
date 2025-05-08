$(document).ready(function() {
    // Handle page loading when video is ready
    handlePageLoading();
    
    // Previous position to detect jumps
    let previousPosition = 0;
    
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
                
                // Always show the fixed column
                rightColumn.css('opacity', '1');
                
                // Before reaching the first service item
                if (scrollTop < firstItemTop - 90) {
                    // Keep it aligned with first service item
                    rightColumn.css({
                        'position': 'absolute',
                        'top': (firstItemTop - sectionTop) + 'px',
                        'right': '6%'
                    });
                }
                // When we reach the last service item
                else if (scrollTop >= lastItemTop - 90) {
                    // Switch to absolute positioning to stay with last item
                    rightColumn.css({
                        'position': 'absolute',
                        'top': (lastItemTop - sectionTop) + 'px',
                        'right': '6%'
                    });
                } 
                // For scrolling between first and last items, stay fixed at navbar height
                else {
                    rightColumn.css({
                        'position': 'fixed',
                        'top': navbarHeight + 'px',
                        'right': '6%'
                    });
                }
            }
        }
    });

    // Smooth scrolling for navigation links
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 70
        }, 500, 'linear');
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
    
    // If there's no video, hide loader immediately
    if (!video || !pageLoader) {
        if (pageLoader) {
            hideLoader();
        }
        return;
    }
    
    // Track if video is loaded from cache
    let videoLoaded = false;
    
    // Function to hide the loader
    function hideLoader() {
        pageLoader.style.opacity = '0';
        setTimeout(() => {
            pageLoader.style.visibility = 'hidden';
        }, 500);
    }
    
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
    
    // Fallback - hide loader after maximum wait time (10 seconds)
    setTimeout(function() {
        if (!videoLoaded) {
            console.log("Force loading complete after timeout");
            videoLoaded = true;
            hideLoader();
        }
    }, 10000);
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
    
    // Initialize all functionality
    initGalleryCarousel();
    handleVideoEnd();
    handleProgressMedia();
}); 