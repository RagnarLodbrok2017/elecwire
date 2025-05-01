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