/**
 * TruckingPulse Website JavaScript
 * Enhanced version with improved performance and functionality
 */

(function () {
  "use strict";

  // Wait for document ready
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousels
    initCarousels();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize form validation and submission
    initForms();
    
    // Initialize parallax effect
    initParallax();
    
    // Initialize header navigation enhancements
    initHeaderNavigation();
  });

  /**
   * Initialize all carousel sliders with jQuery Owl Carousel
   */
  function initCarousels() {
    if (typeof jQuery !== 'undefined' && jQuery.fn.owlCarousel) {
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
  }

  /**
   * Set up all event listeners
   */
  function setupEventListeners() {
    // Header mobile menu toggle
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

    // FAQ accordion
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const arrow = this.querySelector('.faq-arrow');
        
        // Close other open FAQs for accordion behavior
        const allContents = document.querySelectorAll('.faq-content');
        const allArrows = document.querySelectorAll('.faq-arrow');
        
        allContents.forEach(item => {
          if (item.id !== targetId && item.classList.contains('active')) {
            item.classList.remove('active');
          }
        });
        
        allArrows.forEach(item => {
          if (item !== arrow && item.classList.contains('rotate')) {
            item.classList.remove('rotate');
          }
        });
        
        // Toggle aria attributes for accessibility
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        
        // Toggle content visibility
        content.classList.toggle('active');
        arrow.classList.toggle('rotate');
      });
    });
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Lazy load images as they come into view
    lazyLoadImages();
    
    // Add scroll to top button
    addScrollToTopButton();
  }

  /**
   * Initialize form validation and submission
   */
  function initForms() {
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
          // Show loading state
          const submitBtn = this.querySelector('button[type="submit"]');
          const originalBtnText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="animate-pulse">Processing...</span>';
          
          // Submit the form using fetch API
          fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
              'Accept': 'application/json'
            }
          }).then(response => {
            if (response.ok) {
              // Show success message
              const successMsg = document.getElementById('contact-success');
              if (successMsg) successMsg.classList.remove('hidden');
              
              // Reset form
              this.reset();
              
              // Reset button
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
              
              // Hide success message after 5 seconds
              setTimeout(() => {
                if (successMsg) successMsg.classList.add('hidden');
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
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
              });
            }
          }).catch(error => {
            console.error('Error:', error);
            alert('There was a problem sending your message. Please try again later.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          });
        }
      });
    }
    
    // Fuel card form submission (if present)
    const fuelCardForm = document.getElementById('fuel-card-form');
    if (fuelCardForm) {
      fuelCardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
          // Show loading state
          const submitBtn = this.querySelector('button[type="submit"]');
          const originalBtnText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="animate-pulse">Processing...</span>';
          
          // For demo purposes, we'll simulate a successful submission after a delay
          setTimeout(function() {
            // Show success message
            const successMsg = document.getElementById('form-success');
            if (successMsg) successMsg.classList.remove('hidden');
            
            // Reset form
            fuelCardForm.reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Hide success message after 5 seconds
            setTimeout(function() {
              if (successMsg) successMsg.classList.add('hidden');
            }, 5000);
          }, 1500);
        }
      });
    }
  }

  /**
   * Initialize parallax scrolling effect
   */
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length) {
      window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
          const speed = element.getAttribute('data-parallax-speed') || 0.3;
          const offset = scrollTop * speed * -1;
          
          element.style.backgroundPositionY = offset + 'px';
        });
      });
    }
  }

  /**
   * Validate form inputs
   */
  function validateForm(form) {
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
   * Lazy load images as they come into view
   */
  function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    if (lazyImages.length) {
      const lazyLoad = () => {
        lazyImages.forEach(img => {
          const rect = img.getBoundingClientRect();
          if (rect.top <= window.innerHeight && rect.bottom >= 0 && !img.classList.contains('loaded')) {
            img.classList.add('loaded');
          }
        });
      };
      
      // Initial check
      lazyLoad();
      
      // Add scroll event listener with debounce
      let debounceTimer;
      window.addEventListener('scroll', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(lazyLoad, 100);
      });
      
      window.addEventListener('resize', lazyLoad);
    }
  }

  /**
   * Add scroll to top button
   */
  function addScrollToTopButton() {
    // Check if button already exists
    if (!document.getElementById('scroll-top-btn')) {
      const scrollTopButton = document.createElement('button');
      scrollTopButton.id = 'scroll-top-btn';
      scrollTopButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      `;
      scrollTopButton.classList.add('scroll-top-button');
      scrollTopButton.setAttribute('aria-label', 'Scroll to top');
      document.body.appendChild(scrollTopButton);
      
      // Show/hide button based on scroll position
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
          scrollTopButton.classList.add('visible');
        } else {
          scrollTopButton.classList.remove('visible');
        }
      });
      
      // Scroll to top when button is clicked
      scrollTopButton.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
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
          const headerHeight = document.querySelector('header').offsetHeight || 80;
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
  
  /**
   * Initialize enhanced header navigation
   */
  function initHeaderNavigation() {
    const header = document.querySelector('header');
    
    if (header) {
      // Add active state for current section
      const navLinks = header.querySelectorAll('nav a');
      const sections = document.querySelectorAll('section[id]');
      
      // Function to determine which section is currently in view
      function setActiveNavLink() {
        let currentSection = '';
        
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 100; // Adjust for header height
          const sectionHeight = section.offsetHeight;
          const scrollPosition = window.pageYOffset;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
          }
        });
        
        navLinks.forEach(link => {
          link.classList.remove('text-blue-700', 'border-b-2', 'border-blue-700');
          if (link.getAttribute('href') === currentSection) {
            link.classList.add('text-blue-700', 'border-b-2', 'border-blue-700');
          }
        });
      }
      
      // Call on scroll
      window.addEventListener('scroll', setActiveNavLink);
      
      // Call on load
      setActiveNavLink();
      
      // Make header sticky with transition
      let lastScrollTop = 0;
      
      window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
          // Scrolling down
          header.style.transform = `translateY(-${header.offsetHeight}px)`;
        } else {
          // Scrolling up
          header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
      });
      
      // Add transition to header
      header.style.transition = 'transform 0.3s ease';
    }
    
    // Ensure mobile menu and desktop menu links match
    const syncNavLinks = () => {
      const desktopNav = document.querySelector('header nav');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (desktopNav && mobileMenu) {
        const desktopLinks = Array.from(desktopNav.querySelectorAll('a')).map(link => ({
          href: link.getAttribute('href'),
          text: link.textContent.trim()
        }));
        
        const mobileLinks = mobileMenu.querySelectorAll('a');
        
        // Update mobile links to match desktop
        mobileLinks.forEach((link, index) => {
          if (desktopLinks[index]) {
            link.setAttribute('href', desktopLinks[index].href);
            link.textContent = desktopLinks[index].text;
          }
        });
      }
    };
    
    // Call once on load
    syncNavLinks();
  }
})();