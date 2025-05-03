$(document).ready(function() {
    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 70
        }, 500, 'linear');
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

document.addEventListener('DOMContentLoaded', function() {
    // Gallery Carousel functionality
    function initGalleryCarousel() {
        // Get all gallery slides
        const gallerySlides = document.querySelectorAll('.gallery-flex-container');
        const totalSlides = gallerySlides.length;
        let currentSlideIndex = 0; // First slide is active by default
        
        // Get all navigation buttons
        const prevButtons = document.querySelectorAll('.prev-btn');
        const nextButtons = document.querySelectorAll('.next-btn');
        
        // Add click event to all previous buttons
        prevButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Calculate the previous slide index (with loop back to last slide)
                currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
                updateActiveSlide();
            });
        });
        
        // Add click event to all next buttons
        nextButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Calculate the next slide index (with loop back to first slide)
                currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
                updateActiveSlide();
            });
        });
        
        // Function to update which slide is active
        function updateActiveSlide() {
            // Remove 'active' class from all slides
            gallerySlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Add 'active' class to current slide
            gallerySlides[currentSlideIndex].classList.add('active');
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
    
    // Initialize all functionality
    initGalleryCarousel();
    handleVideoEnd();
}); 