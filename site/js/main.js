/**
 * TruckingPulse Website JavaScript
 * Enhanced version with improved performance and functionality
 */

(function ($) {
  "use strict";

  // Wait for document ready
  $(document).ready(function() {
    // Initialize owl carousels with better performance options
    initCarousels();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize form validation and submission
    initForms();
    
    // Initialize parallax effect
    initParallax();
  });

  /**
   * Initialize all carousel sliders
   */
  function initCarousels() {
    // Testimonials slider
    $("#sliderTestimonialsFirst").owlCarousel({
      margin: 20,
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      smartSpeed: 500,
      dots: false,
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        1200: {
          items: 3,
        },
      },
      // Enable lazy loading for images inside carousel
      lazyLoad: true,
    });

    // Setup slider navigation
    $(".sliderTestimonialsNavNext").click(function () {
      $("#sliderTestimonialsFirst").trigger("next.owl.carousel");
    });
    
    $(".sliderTestimonialsNavPrev").click(function () {
      $("#sliderTestimonialsFirst").trigger("prev.owl.carousel");
    });
  }

  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Header mobile menu toggle
    $("#mobile-menu-button").on("click", function () {
      const $mobileMenu = $("#mobile-menu");
      const $body = $("body");
      
      $(this).find("svg").toggleClass("rotate-90");
      
      if ($mobileMenu.hasClass("active")) {
        $mobileMenu.removeClass("active");
        $body.removeClass("overflow-hidden");
        
        // Wait for transition to complete
        setTimeout(function() {
          $mobileMenu.hide();
        }, 300);
      } else {
        $mobileMenu.show();
        
        // Force browser reflow to make transition work
        $mobileMenu[0].offsetHeight;
        
        $mobileMenu.addClass("active");
        $body.addClass("overflow-hidden");
      }
    });

    // FAQ accordion
    $(".faq-toggle").on("click", function () {
      const targetId = $(this).attr("data-target");
      const $content = $("#" + targetId);
      const $arrow = $(this).find(".faq-arrow");
      const $allContents = $(".faq-content");
      const $allArrows = $(".faq-arrow");
      
      // Set ARIA attributes for accessibility
      const expanded = $(this).attr("aria-expanded") === "true";
      $(this).attr("aria-expanded", !expanded);
      
      // Close other open FAQs for accordion behavior
      $allContents.not($content).removeClass("active");
      $allArrows.not($arrow).removeClass("rotate");
      
      // Toggle current FAQ
      $content.toggleClass("active");
      $arrow.toggleClass("rotate");
    });

    // Close modals on escape key
    $(document).on("keyup", function (event) {
      if (event.key === "Escape") {
        $(".modal").addClass("hidden");
        $("body").removeClass("overflow-hidden");
      }
    });

    // Close modals when clicking outside
    $(".modal").on("click", function (e) {
      if (!$(e.target).closest(".modal-content").length) {
        $(this).addClass("hidden");
        $("body").removeClass("overflow-hidden");
      }
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on("click", function (e) {
      if ($(this).attr("href") !== "#") {
        e.preventDefault();
        
        // Close mobile menu if open
        if ($("#mobile-menu").hasClass("active")) {
          $("#mobile-menu-button").trigger("click");
        }
        
        const targetId = $(this).attr("href");
        const $target = $(targetId);
        
        if ($target.length) {
          $("html, body").animate({
            scrollTop: $target.offset().top - 80 // Account for fixed header
          }, 800);
        }
      }
    });
    
    // Lazy load images as they come into view
    lazyLoadImages();
    
    // Add scroll to top button
    addScrollToTopButton();
  }

  /**
   * Initialize form validation and submission
   */
  function initForms() {
    // Form validation
    function validateForm($form) {
      let isValid = true;
      
      // Reset previous error states
      $form.find(".form-field").removeClass("error");
      $form.find(".error-message").addClass("hidden");
      
      // Validate required fields
      $form.find("[required]").each(function() {
        const $field = $(this);
        const $formField = $field.closest(".form-field");
        const fieldId = $field.attr("id");
        const $errorMsg = $("#" + fieldId + "-error");
        
        if ($field.is(":checkbox") && !$field.is(":checked")) {
          $formField.addClass("error");
          $errorMsg.removeClass("hidden");
          isValid = false;
        } else if (!$field.val().trim()) {
          $formField.addClass("error");
          $errorMsg.removeClass("hidden");
          isValid = false;
        }
      });
      
      // Validate email format
      const $emailField = $form.find('input[type="email"]');
      if ($emailField.length && $emailField.val()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($emailField.val())) {
          $emailField.closest(".form-field").addClass("error");
          $("#" + $emailField.attr("id") + "-error").removeClass("hidden");
          isValid = false;
        }
      }
      
      // Validate phone format
      const $phoneField = $form.find('input[type="tel"]');
      if ($phoneField.length && $phoneField.val()) {
        const phoneNumber = $phoneField.val().replace(/[^0-9]/g, '');
        if (phoneNumber.length < 10) {
          $phoneField.closest(".form-field").addClass("error");
          $("#" + $phoneField.attr("id") + "-error").removeClass("hidden");
          isValid = false;
        }
      }
      
      return isValid;
    }
    
    // Fuel card form submission
    $("#fuel-card-form").on("submit", function(e) {
      e.preventDefault();
      
      const $form = $(this);
      
      if (validateForm($form)) {
        // Show loading state
        const $submitBtn = $form.find('button[type="submit"]');
        const originalBtnText = $submitBtn.text();
        $submitBtn.prop("disabled", true).html('<span class="animate-pulse">Processing...</span>');
        
        // Gather form data
        const formData = {
          name: $("#email-name").val(),
          email: $("#email-address").val(),
          phone: $("#email-phone").val(),
          company: $("#email-company").val() || "Not specified",
          mcDot: $("#email-id").val() || "Not specified",
          trucks: $("#email-trucks").val() || "Not specified"
        };
        
        // For demo purposes, we'll simulate a successful submission after a delay
        // In a real implementation, this would be an AJAX call to your server
        setTimeout(function() {
          // Show success message
          $("#form-success").removeClass("hidden");
          
          // Reset form
          $form[0].reset();
          
          // Reset button
          $submitBtn.prop("disabled", false).text(originalBtnText);
          
          // Hide success message after 5 seconds
          setTimeout(function() {
            $("#form-success").addClass("hidden");
          }, 5000);
        }, 1500);
        
        // Uncomment for actual AJAX submission
        /*
        $.ajax({
          url: "your-api-endpoint",
          type: "POST",
          data: JSON.stringify(formData),
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: function(response) {
            // Show success message
            $("#form-success").removeClass("hidden");
            
            // Reset form
            $form[0].reset();
            
            // Reset button
            $submitBtn.prop("disabled", false).text(originalBtnText);
            
            // Hide success message after 5 seconds
            setTimeout(function() {
              $("#form-success").addClass("hidden");
            }, 5000);
          },
          error: function(error) {
            console.error("Form submission error:", error);
            alert("There was an error submitting your application. Please try again or contact us directly.");
            $submitBtn.prop("disabled", false).text(originalBtnText);
          }
        });
        */
      }
    });

    // Contact form submission
    $("#contact-form").on("submit", function(e) {
      e.preventDefault();
      
      const $form = $(this);
      
      if (validateForm($form)) {
        // Show loading state
        const $submitBtn = $form.find('button[type="submit"]');
        const originalBtnText = $submitBtn.text();
        $submitBtn.prop("disabled", true).html('<span class="animate-pulse">Processing...</span>');
        
        // Submit the form using fetch API as specified in the HTML
        fetch($form.attr('action'), {
          method: 'POST',
          body: new FormData($form[0]),
          headers: {
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.ok) {
            // Show success message
            $("#contact-success").removeClass("hidden");
            
            // Reset form
            $form[0].reset();
            
            // Reset button
            $submitBtn.prop("disabled", false).html(originalBtnText);
            
            // Hide success message after 5 seconds
            setTimeout(() => {
              $("#contact-success").addClass("hidden");
            }, 5000);
          } else {
            response.json().then(data => {
              if (Object.hasOwn(data, 'errors')) {
                console.error(data["errors"].map(error => error["message"]).join(", "));
                alert(data["errors"].map(error => error["message"]).join(", "));
              } else {
                console.error("Oops! There was a problem submitting your form");
                alert("Oops! There was a problem submitting your form");
              }
              $submitBtn.prop("disabled", false).html(originalBtnText);
            });
          }
        }).catch(error => {
          console.error('Error:', error);
          alert('There was a problem sending your message. Please try again later.');
          $submitBtn.prop("disabled", false).html(originalBtnText);
        });
      }
    });
  }

  /**
   * Initialize parallax scrolling effect
   */
  function initParallax() {
    const $parallaxElements = $(".parallax");
    
    if ($parallaxElements.length) {
      $(window).on("scroll", function() {
        const scrollTop = $(window).scrollTop();
        
        $parallaxElements.each(function() {
          const $element = $(this);
          const speed = $element.data("parallax-speed") || 0.3;
          const offset = scrollTop * speed * -1;
          
          $element.css("background-position-y", offset + "px");
        });
      });
    }
  }

  /**
   * Lazy load images as they come into view
   */
  function lazyLoadImages() {
    const $lazyImages = $(".lazy-load");
    
    if ($lazyImages.length) {
      // Initial check
      checkLazyImages();
      
      // Check on scroll and resize
      $(window).on("scroll resize", checkLazyImages);
      
      function checkLazyImages() {
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();
        
        $lazyImages.each(function() {
          const $image = $(this);
          
          if (!$image.hasClass("loaded")) {
            const imageTop = $image.offset().top;
            
            if (imageTop < windowHeight + scrollTop + 100) { // 100px buffer
              $image.addClass("loaded");
            }
          }
        });
      }
    }
  }

  /**
   * Add scroll to top button
   */
  function addScrollToTopButton() {
    // Create button element if it doesn't exist
    if ($("#scroll-top-btn").length === 0) {
      const $scrollTopBtn = $('<button id="scroll-top-btn" aria-label="Scroll to top" class="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transform transition-transform hover:scale-110 z-30 opacity-0 invisible"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg></button>');
      
      $("body").append($scrollTopBtn);
      
      // Show/hide button based on scroll position
      $(window).on("scroll", function() {
        if ($(window).scrollTop() > 500) {
          $scrollTopBtn.css({
            opacity: 1,
            visibility: "visible"
          });
        } else {
          $scrollTopBtn.css({
            opacity: 0,
            visibility: "hidden"
          });
        }
      });
      
      // Scroll to top when button is clicked
      $scrollTopBtn.on("click", function() {
        $("html, body").animate({ scrollTop: 0 }, 800);
        return false;
      });
    }
  }

  /**
   * Enhanced form validation function
   */
  function validateFormEnhanced(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    // Clear previous error states
    form.querySelectorAll('.form-field').forEach(field => {
      field.classList.remove('error');
    });
    
    form.querySelectorAll('.error-message').forEach(msg => {
      msg.classList.add('hidden');
    });
    
    // Validate each field
    fields.forEach(field => {
      const fieldType = field.type;
      const fieldId = field.id;
      const fieldContainer = field.closest('.form-field');
      const errorElement = document.getElementById(`${fieldId}-error`);
      
      if (!errorElement) return;
      
      let fieldValid = true;
      
      // Required field validation
      if (field.hasAttribute('required')) {
        if (fieldType === 'checkbox' && !field.checked) {
          fieldValid = false;
        } else if (fieldType !== 'checkbox' && !field.value.trim()) {
          fieldValid = false;
        }
      }
      
      // Email validation
      if (fieldType === 'email' && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value)) {
          fieldValid = false;
        }
      }
      
      // Phone validation
      if (fieldType === 'tel' && field.value.trim()) {
        const phoneDigits = field.value.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          fieldValid = false;
        }
      }
      
      // Apply error state if validation failed
      if (!fieldValid) {
        if (fieldContainer) fieldContainer.classList.add('error');
        if (errorElement) errorElement.classList.remove('hidden');
        isValid = false;
      }
    });
    
    return isValid;
  }

  /**
   * Improved smooth scrolling to anchors
   */
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            document.getElementById('mobile-menu-button').click();
          }
          
          // Get header height for offset
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          
          // Calculate appropriate offset with some additional padding
          const offset = headerHeight + 20;
          
          window.scrollTo({
            top: targetPosition - offset,
            behavior: 'smooth'
          });
        }
      });
    });
  }
})(jQuery);

document.addEventListener('DOMContentLoaded', function() {
  // Lazy loading for images
  const lazyImages = document.querySelectorAll('.lazy-load');
  
  function lazyLoad() {
    lazyImages.forEach(img => {
      if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
        img.classList.add('loaded');
      }
    });
  }
  
  // Initial check
  lazyLoad();
  
  // Add scroll event listener
  window.addEventListener('scroll', lazyLoad);
  window.addEventListener('resize', lazyLoad);
  
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      const menuIcon = this.querySelector('svg');
      menuIcon.classList.toggle('rotate-90');
      
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
        
        // Wait for transition to complete before hiding
        setTimeout(() => {
          mobileMenu.style.display = 'none';
        }, 300);
      } else {
        mobileMenu.style.display = 'block';
        
        // Force reflow to make the transition work
        window.getComputedStyle(mobileMenu).opacity;
        
        mobileMenu.classList.add('active');
        document.body.classList.add('overflow-hidden');
      }
    });
  }
  
  // FAQ accordions
  const faqToggles = document.querySelectorAll('.faq-toggle');
  
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const arrow = this.querySelector('.faq-arrow');
      
      // Toggle aria attributes for accessibility
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      
      // Toggle content visibility
      if (content.classList.contains('active')) {
        content.classList.remove('active');
        arrow.classList.remove('rotate');
      } else {
        content.classList.add('active');
        arrow.classList.add('rotate');
      }
    });
  });
  
  // Form validation
  const form = document.getElementById('fuel-card-form');
  if (form) {
    const nameInput = document.getElementById('email-name');
    const phoneInput = document.getElementById('email-phone');
    const emailInput = document.getElementById('email-address');
    const privacyCheckbox = document.getElementById('privacy-policy');
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');
    const privacyError = document.getElementById('privacy-error');
    const formSuccess = document.getElementById('form-success');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      
      // Reset previous errors
      [nameInput, phoneInput, emailInput, privacyCheckbox].forEach(field => {
        if (field && field.closest) {
          const fieldContainer = field.closest('.form-field');
          if (fieldContainer) fieldContainer.classList.remove('error');
        }
      });
      
      [nameError, phoneError, emailError, privacyError].forEach(error => {
        if (error) error.classList.add('hidden');
      });
      
      // Validate name
      if (nameInput && !nameInput.value.trim()) {
        if (nameInput.closest) {
          const nameContainer = nameInput.closest('.form-field');
          if (nameContainer) nameContainer.classList.add('error');
        }
        if (nameError) nameError.classList.remove('hidden');
        isValid = false;
      }
      
      // Validate phone
      if (phoneInput && phoneInput.value.trim()) {
        const phoneNumber = phoneInput.value.replace(/[^0-9]/g, '');
        if (phoneNumber.length < 10) {
          if (phoneInput.closest) {
            const phoneContainer = phoneInput.closest('.form-field');
            if (phoneContainer) phoneContainer.classList.add('error');
          }
          if (phoneError) phoneError.classList.remove('hidden');
          isValid = false;
        }
      }
      
      // Validate email
      if (emailInput && (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value))) {
        if (emailInput.closest) {
          const emailContainer = emailInput.closest('.form-field');
          if (emailContainer) emailContainer.classList.add('error');
        }
        if (emailError) emailError.classList.remove('hidden');
        isValid = false;
      }
      
      // Validate privacy policy
      if (privacyCheckbox && !privacyCheckbox.checked) {
        if (privacyCheckbox.closest) {
          const privacyContainer = privacyCheckbox.closest('.form-field');
          if (privacyContainer) privacyContainer.classList.add('error');
        }
        if (privacyError) privacyError.classList.remove('hidden');
        isValid = false;
      }
      
      if (isValid) {
        // If using AJAX submission, you'd call that here
        // For demo purposes, we'll just show success message
        if (formSuccess) formSuccess.classList.remove('hidden');
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          if (formSuccess) formSuccess.classList.add('hidden');
        }, 5000);
      }
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenuButton.click();
        }
        
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add scroll to top button
  const scrollTopButton = document.createElement('button');
  scrollTopButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  `;
  scrollTopButton.classList.add('fixed', 'bottom-8', 'right-8', 'bg-blue-600', 'text-white', 'p-3', 'rounded-full', 'shadow-lg', 'hover:bg-blue-700', 'focus:outline-none', 'transform', 'transition-transform', 'hover:scale-110', 'z-30', 'hidden');
  scrollTopButton.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollTopButton);
  
  // Show/hide scroll to top button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 500) {
      scrollTopButton.classList.remove('hidden');
    } else {
      scrollTopButton.classList.add('hidden');
    }
  });
  
  // Scroll to top when button is clicked
  scrollTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});