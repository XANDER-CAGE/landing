/**
 * TruckingPulse Website JavaScript
 * Enhanced version with improved performance and functionality
 */

(function () {
  "use strict";

  // Немедленное скрытие мобильного меню при загрузке скрипта
  const mobileMenuEarly = document.getElementById('mobile-menu');
  if (mobileMenuEarly) {
    mobileMenuEarly.classList.remove('active');
    mobileMenuEarly.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCarousels();
    initMobileMenu();
    initForms();
    initParallax();
    initHeaderNavigation();
    lazyLoadImages();
    addScrollToTopButton();
    enhancedSmoothScroll();
    initFloatingCirclesAnimation();
    init3DCardEffect();
    calculateSavingsByGas();
  });

  // New: 3D card effect with mouse tracking
  function init3DCardEffect() {
    const card = document.querySelector('.card-3d');
    const cardContent = document.querySelector('.card-content');
    
    if (!card || !cardContent) return;
    
    // Add tilt effect on mouse move
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // X position within the element
      const y = e.clientY - rect.top;  // Y position within the element
      
      // Calculate tilt values (positive and negative)
      const tiltX = (y / rect.height - 0.5) * 10; // 10 is the max tilt
      const tiltY = -((x / rect.width - 0.5) * 10);
      
      // Apply the transform with smooth transition
      cardContent.style.transition = 'transform 0.1s ease-out';
      cardContent.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      cardContent.style.transition = 'transform 0.5s ease-out';
      cardContent.style.transform = 'rotateX(5deg) rotateY(-5deg)';
    });
    
    // Initial tilt
    setTimeout(() => {
      cardContent.style.transform = 'rotateX(5deg) rotateY(-5deg)';
    }, 1200);
  }
  
  // New: Gas price savings calculator
  function calculateSavingsByGas() {
    const calcLink = document.querySelector('a[href="#calculator"]');
    if (!calcLink) return;
    
    calcLink.addEventListener('click', e => {
      e.preventDefault();
      
      // Get current location - calculate section or create modal
      const calcSection = document.getElementById('calculator');
      
      if (calcSection) {
        // Scroll to existing calculator section
        window.scrollTo({
          top: calcSection.offsetTop - 80,
          behavior: 'smooth'
        });
      } else {
        // Create a modal calculator
        showSavingsCalculator();
      }
    });
  }
  
  function showSavingsCalculator() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-75', 'z-50', 'flex', 'items-center', 'justify-center', 'p-4');
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease-out';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.classList.add('bg-white', 'rounded-xl', 'p-6', 'max-w-lg', 'w-full', 'max-h-90vh', 'overflow-y-auto', 'transform', 'scale-95');
    modalContent.style.transition = 'transform 0.3s ease-out';
    
    // Add calculator HTML
    modalContent.innerHTML = `
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-slate-900">Fuel Savings Calculator</h2>
        <button class="text-slate-500 hover:text-slate-700 focus:outline-none" id="close-calculator">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="mb-6">
        <p class="text-slate-600 mb-4">Estimate your potential savings with TruckingPulse fuel cards.</p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Number of Trucks</label>
            <input type="number" id="num-trucks" min="1" value="4" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Average Monthly Gallons per Truck</label>
            <input type="number" id="gallons-per-truck" min="100" value="1000" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Average Savings per Gallon</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">$</span>
              <input type="number" id="savings-per-gallon" min="0.01" step="0.01" value="0.70" class="w-full pl-8 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-amber-50 rounded-lg p-4 mb-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-slate-700 mb-1">Your Estimated Monthly Savings</h3>
          <div class="text-4xl font-bold text-amber-600" id="monthly-savings">$2,800</div>
          <p class="text-sm text-slate-600 mt-1">That's <span id="yearly-savings">$33,600</span> per year!</p>
        </div>
      </div>
      
      <div class="flex justify-end">
        <a href="#fuel-card" class="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg transition hover:shadow-lg">
          Apply Now
        </a>
      </div>
    `;
    
    // Append modal to body
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
      modal.style.opacity = '1';
      modalContent.style.transform = 'scale(100%)';
    }, 10);
    
    // Add event listeners
    const closeButton = modalContent.querySelector('#close-calculator');
    closeButton.addEventListener('click', () => {
      modal.style.opacity = '0';
      modalContent.style.transform = 'scale(95%)';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    });
    
    // Calculate savings on input change
    const numTrucksInput = modalContent.querySelector('#num-trucks');
    const gallonsPerTruckInput = modalContent.querySelector('#gallons-per-truck');
    const savingsPerGallonInput = modalContent.querySelector('#savings-per-gallon');
    const monthlySavingsOutput = modalContent.querySelector('#monthly-savings');
    const yearlySavingsOutput = modalContent.querySelector('#yearly-savings');
    
    const calculateSavings = () => {
      const numTrucks = parseFloat(numTrucksInput.value) || 1;
      const gallonsPerTruck = parseFloat(gallonsPerTruckInput.value) || 0;
      const savingsPerGallon = parseFloat(savingsPerGallonInput.value) || 0;
      
      const monthlySavings = numTrucks * gallonsPerTruck * savingsPerGallon;
      const yearlySavings = monthlySavings * 12;
      
      monthlySavingsOutput.textContent = '$' + monthlySavings.toLocaleString(undefined, {maximumFractionDigits: 0});
      yearlySavingsOutput.textContent = '$' + yearlySavings.toLocaleString(undefined, {maximumFractionDigits: 0});
    };
    
    // Initial calculation
    calculateSavings();
    
    // Add event listeners for recalculation
    numTrucksInput.addEventListener('input', calculateSavings);
    gallonsPerTruckInput.addEventListener('input', calculateSavings);
    savingsPerGallonInput.addEventListener('input', calculateSavings);
    
    // Close on background click
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeButton.click();
      }
    });
  }

  function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    // Ensure correct initial state based on CSS (hidden by default)
    mobileMenu.classList.add('hidden'); // Should be controlled by CSS initially
    mobileMenu.classList.remove('active');
    
    mobileMenuButton.addEventListener('click', function() {
      const isMenuOpen = mobileMenu.classList.toggle('active');
      mobileMenu.classList.toggle('hidden', !isMenuOpen);
      document.body.classList.toggle('overflow-hidden', isMenuOpen);
      // SVG icon state can also be managed here if needed, e.g., rotating the hamburger
      mobileMenuButton.querySelector('svg')?.classList.toggle('rotate-90', isMenuOpen); // Example if you have a rotate class
    });
    
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (mobileMenu.classList.contains('active')) {
          mobileMenuButton.click(); 
        }
      });
    });
  }

  function enhancedSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('header')?.offsetHeight || 80;
          const offset = headerHeight + 16; // Additional padding
          
          window.scrollTo({
            top: target.offsetTop - offset,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  function initCarousels() {
    if (typeof jQuery !== 'undefined' && jQuery.fn.owlCarousel) {
      $("#sliderTestimonialsFirst").owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        smartSpeed: 500,
        dots: false,
        responsive: {
          0: { items: 1 },
          768: { items: 2 },
          1200: { items: 3 }
        },
        lazyLoad: true
      });

      $(".sliderTestimonialsNavNext").click(() => {
        $("#sliderTestimonialsFirst").trigger("next.owl.carousel");
      });
      $(".sliderTestimonialsNavPrev").click(() => {
        $("#sliderTestimonialsFirst").trigger("prev.owl.carousel");
      });
    }
  }

  function initForms() {
    const form = document.getElementById("my-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const status = document.getElementById("my-form-status");
      const data = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          status.innerHTML = "Thanks for your submission!";
          form.reset();
        } else {
          response.json().then(data => {
            status.innerHTML = data.errors
              ? data.errors.map(error => error.message).join(", ")
              : "Oops! There was a problem submitting your form.";
          });
        }
      }).catch(() => {
        status.innerHTML = "Oops! There was a problem submitting your form.";
      });
    });
  }

  function lazyLoadImages() {
    const images = document.querySelectorAll('.lazy-load');

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded'); // This will trigger the opacity transition in CSS
          observer.unobserve(img);
        }
      });
    }, { rootMargin: "0px 0px 50px 0px" }); // Start loading when image is 50px from viewport

    images.forEach(img => {
      observer.observe(img);
    });
  }

  function addScrollToTopButton() {
    if (document.getElementById('scroll-top-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    `;
    btn.className = 'fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition hidden z-30';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      btn.classList.toggle('hidden', window.pageYOffset < 500);
    });
  }

  function initParallax() {
    const elements = document.querySelectorAll('.parallax');
    if (!elements.length) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      elements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.3;
        el.style.backgroundPositionY = `${-scrollTop * speed}px`;
      });
    });
  }

  function initHeaderNavigation() {
    const header = document.querySelector('header');
    const navLinks = header?.querySelectorAll('nav a') || [];
    const sections = document.querySelectorAll('section[id]');

    const setActive = () => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 100;
        const height = section.offsetHeight;
        if (window.pageYOffset >= top && window.pageYOffset < top + height) {
          current = `#${section.id}`;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('text-blue-700', 'border-b-2', 'border-blue-700');
        if (link.getAttribute('href') === current) {
          link.classList.add('text-blue-700', 'border-b-2', 'border-blue-700');
        }
      });
    };

    setActive();
    window.addEventListener('scroll', setActive);

    // Улучшенная работа со sticky header
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Прячем header только когда скролл вниз и мы уже прокрутили больше высоты header
      if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
        header.style.transform = `translateY(-${header.offsetHeight}px)`;
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop;
    });
    header.style.transition = 'transform 0.3s ease';
  }

  function initFloatingCirclesAnimation() {
    const circles = document.querySelectorAll('.floating-circles .circle');
    if (!circles.length) return;
    
    // Simplified scroll effect for floating circles, less performance intensive
    let ticking = false;
    document.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          circles.forEach((el, i) => {
            // Apply a subtle parallax effect, adjust multiplier as needed
            el.style.transform = `translateY(${scrollY * 0.01 * (i % 3 + 1)}px)`; 
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();