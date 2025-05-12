/**
 * TruckingPulse Website JavaScript
 * Enhanced version with improved performance and functionality
 */

(function () {
  "use strict";

  document.addEventListener('DOMContentLoaded', function () {
    initCarousels();
    setupEventListeners();
    initForms();
    initParallax();
    initHeaderNavigation();

    // Ensure mobile menu is hidden on load
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
      mobileMenu.style.display = 'none';
    }
  });

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

  function setupEventListeners() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', function () {
        const menuIcon = this.querySelector('svg');
        menuIcon.classList.toggle('rotate-90');

        if (mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('overflow-hidden');
          setTimeout(() => {
            mobileMenu.style.display = 'none';
          }, 300);
        } else {
          mobileMenu.style.display = 'block';
          window.getComputedStyle(mobileMenu).opacity;
          mobileMenu.classList.add('active');
          document.body.classList.add('overflow-hidden');
        }
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = (document.querySelector('header')?.offsetHeight || 80) + 20;
          window.scrollTo({
            top: target.offsetTop - offset,
            behavior: 'smooth'
          });

          if (mobileMenu?.classList.contains('active')) {
            mobileMenuButton.click();
          }
        }
      });
    });

    addScrollToTopButton();
    lazyLoadImages();
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

    const load = () => {
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0 && !img.classList.contains('loaded')) {
          img.classList.add('loaded');
        }
      });
    };

    load();
    let debounce;
    window.addEventListener('scroll', () => {
      clearTimeout(debounce);
      debounce = setTimeout(load, 100);
    });
    window.addEventListener('resize', load);
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

    // Sticky header
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
        header.style.transform = `translateY(-${header.offsetHeight}px)`;
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop;
    });
    header.style.transition = 'transform 0.3s ease';
  }
})();
