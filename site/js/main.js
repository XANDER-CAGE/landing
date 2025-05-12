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
    
    // Check for saved language preference
    initLanguage();
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

    // Language dropdown functionality
    $("#language-dropdown-button").on("click", function() {
      $("#language-dropdown-menu").toggleClass("hidden");
    });

    // Close language dropdown when clicking outside
    $(document).on("click", function(e) {
      if (!$(e.target).closest(".language-dropdown").length) {
        $("#language-dropdown-menu").addClass("hidden");
      }
    });

    // Handle language change
    $(".language-option").on("click", function() {
      const lang = $(this).attr("onclick").replace("changeLanguage('", "").replace("')", "");
      changeLanguage(lang);
    });
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
   * Multilingual support
   */
  
  // Language translations
  const translations = {
    en: {
      // Navigation
      nav: {
        about: "About",
        services: "Services",
        savings: "Savings",
        partners: "Partners",
        testimonials: "Testimonials",
        contactUs: "Contact Us",
        login: "Login",
        getFuelCard: "Get Fuel Card"
      },
      // Hero section
      hero: {
        title: "Fuel Your Fleet and Maximize Savings!",
        subtitle: "Save up to $0.70 per gallon with TruckingPulse fuel cards, accepted at major truck stops nationwide. Maximize savings and fuel efficiency today.",
        applyNow: "Apply Now",
        learnMore: "Learn More"
      },
      // Partners section
      partners: {
        title: "Accepted at Major Truck Stops"
      },
      // About section
      about: {
        title: "Our Story Begins With Integrity",
        p1: "At TruckingPulse, we uphold the principles of integrity in serving our esteemed clients. Our commitment to transparent and open communication is paramount, and we are dedicated to acting in accordance with industry best practices.",
        p2: "In order to achieve success, we firmly believe in our relentless pursuit of improvement across all facets of our operations.",
        p3: "Our mission is straightforward: to foster equitable opportunities for small and medium-sized trucking companies in comparison to larger fleets. Our objective is to provide exceptional customer service and deliver optimal cost savings to every client, regardless of fleet size, through the utilization of the TruckingPulse Fuel Card.",
        p4: "We are resolute in our commitment to deliver responsive and personalized service that creates a tangible impact. We hold deep regard for our clients, business partners, and colleagues alike."
      },
      // Benefits section
      benefits: {
        title: "Benefits",
        mainTitle: "Everything you need to manage your fleet",
        subtitle: "TruckingPulse fuel cards offer exceptional value and convenient management tools for your business.",
        benefit1: {
          title: "Significant Savings",
          p1: "Save up to $0.70 per gallon at major truck stops across the nation with zero transaction fees.",
          p2: "Optimize your fuel spend and improve your bottom line with our exclusive nationwide discounts."
        },
        benefit2: {
          title: "No Hidden Fees",
          p1: "$0 transaction, swipe, deposit, monthly, or annual fees for using our fuel cards.",
          p2: "Transparent pricing with no surprises, so you can focus on running your business."
        },
        benefit3: {
          title: "Interactive Fuel Finder",
          p1: "Use our interactive map to find the best fuel prices around you or along your routes.",
          p2: "Plan your trips efficiently and maximize savings by finding the lowest prices."
        },
        benefit4: {
          title: "Mobile App Control",
          p1: "Manage your fuel cards, track expenses, and view reports from anywhere with our mobile app.",
          p2: "Both drivers and account administrators can access the tools they need on the go."
        },
        benefit5: {
          title: "Detailed Reporting",
          p1: "Get itemized fuel consumption statements focused on IFTA reporting and expense tracking.",
          p2: "Simplify your tax reporting and gain insights into your fleet's fuel efficiency."
        },
        benefit6: {
          title: "Credit Access",
          p1: "Access credit lines and cash-secured account options to manage your cash flow effectively.",
          p2: "Flexible payment options to help your business thrive during peak seasons and slower periods."
        }
      },
      // Testimonials section
      testimonials: {
        title: "Testimonials",
        mainTitle: "What Our Clients Say",
        subtitle: "Don't take our word for it - hear from the fleet managers and drivers who use our fuel cards every day.",
        testimonial1: {
          name: "Steven Wilkinson",
          position: "Manager at Double Tap Transportation LLC",
          text: "\"Pretty good fleet cards with reasonable savings and 24/7 multilingual customer service. I would highly recommend to get these cards to minimize the fuel costs and to maximize the fleet convenience.\""
        },
        testimonial2: {
          name: "Adi Pavlowsky",
          position: "Fleet Manager at Energy Trucking LLC",
          text: "\"Everyone I spoke with at TruckingPulse provides excellent customer service, and took the time to answer all of our questions. The fuel savings have made a significant impact on our bottom line.\""
        },
        testimonial3: {
          name: "Emily Walker",
          position: "Fleet Specialist at GT Transportation LLC",
          text: "\"Found out about TruckingPulse about 5 months ago and have been working with them ever since. Their cards have made my fuel management way easier - convenient to use, stable discounts, and one of the most professional services I have ever faced!\""
        },
        testimonial4: {
          name: "Michael Roberts",
          position: "Owner at Roberts Logistics",
          text: "\"As a small fleet owner, I was looking for ways to compete with larger companies. TruckingPulse fuel cards have given us that edge with substantial savings and excellent reporting tools that help us track every penny.\""
        }
      },
      // Location section
      location: {
        title: "Visit Us At Our Location",
        subtitle: "Our headquarters are located at 1309 Coffeen Avenue STE 1200, Sheridan, Wyoming. Find us easily using the map below."
      },
      // Coverage section
      coverage: {
        title: "Nationwide Coverage",
        subtitle: "TruckingPulse provides comprehensive coverage across the United States with 24/7 support for your fleet.",
        states: "States Covered",
        support: "Customer Support"
      },
      // FAQ section
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Get answers to the most common questions about TruckingPulse fuel cards.",
        question1: {
          q: "What is the main advantage of your fuel cards?",
          a: "The main advantage of our fuel cards is a weekly credit line of $5,000 that we provide to our cardholders. In addition, we work with the largest stations in America: Love's, TA & PETRO, which together have a network of more than 1,000 gas stations and truck stops throughout the country."
        },
        question2: {
          q: "Does your card cover only fuel costs?",
          a: "No. You can also pay for scaling, reefing and DEF with our card."
        },
        question3: {
          q: "How much does your fuel card cost?",
          a: "We provide fuel cards for free, which allows small companies and owner-operators to use our services without any upfront cost or annual fees."
        },
        question4: {
          q: "Does your card allow me to track fuel consumption?",
          a: "Yes. On our website, each client has their own personal account, where they fully manage the cards (make activations, set limits, receive EFS codes), and can also track fuel prices and expenses, which allows them to effectively plan their budget."
        },
        question5: {
          q: "When can I contact your support?",
          a: "Our support is available 24/7. So you can contact us at any time convenient for you."
        }
      },
      // Contact form
      contactForm: {
        title: "Contact Us",
        subtitle: "We'd love to hear from you! Drop us a message and we'll get back to you as soon as possible.",
        fullName: "Full Name*",
        email: "Email Address*",
        phone: "Phone Number",
        subject: "Subject*",
        message: "Message*",
        subscribe: "Subscribe to our newsletter for fuel saving tips and industry news",
        send: "Send Message",
        success: "Message Sent Successfully!",
        successMessage: "Thank you for reaching out to TruckingPulse. We'll get back to you as soon as possible.",
        nameError: "Please enter your full name",
        emailError: "Please enter a valid email address",
        subjectError: "Please enter a subject",
        messageError: "Please enter your message"
      },
      // Footer
      footer: {
        info: "Smart fuel solutions for trucking companies of all sizes.",
        company: "Company",
        contact: "Contact",
        downloadApp: "Download Our App",
        billing: "Billing:",
        support: "Support:",
        phone: "Phone:",
        copyright: "© 2025 TruckingPulse. All rights reserved.",
        terms: "Terms",
        privacy: "Privacy",
        cookies: "Cookies"
      }
    },
    ru: {
      // Navigation
      nav: {
        about: "О нас",
        services: "Услуги",
        savings: "Экономия",
        partners: "Партнеры",
        testimonials: "Отзывы",
        contactUs: "Связаться",
        login: "Вход",
        getFuelCard: "Получить карту"
      },
      // Hero section
      hero: {
        title: "Заправляйте свой автопарк и максимизируйте экономию!",
        subtitle: "Экономьте до $0.70 за галлон с топливными картами TruckingPulse, принимаемыми на крупнейших автозаправках по всей стране. Максимальная экономия и эффективность уже сегодня.",
        applyNow: "Подать заявку",
        learnMore: "Узнать больше"
      },
      // Partners section
      partners: {
        title: "Принимается на основных автозаправках"
      },
      // About section
      about: {
        title: "Наша история начинается с честности",
        p1: "В TruckingPulse мы поддерживаем принципы честности при обслуживании наших уважаемых клиентов. Наше стремление к прозрачному и открытому общению является первостепенным, и мы стремимся действовать в соответствии с лучшими отраслевыми практиками.",
        p2: "Для достижения успеха мы твердо верим в наше неустанное стремление к совершенствованию во всех аспектах нашей деятельности.",
        p3: "Наша миссия проста: создать равные возможности для малых и средних транспортных компаний по сравнению с более крупными автопарками. Наша цель - обеспечить исключительное обслуживание клиентов и оптимальную экономию средств для каждого клиента, независимо от размера парка, с помощью топливной карты TruckingPulse.",
        p4: "Мы твердо намерены обеспечить оперативное и персонализированное обслуживание, которое оказывает ощутимое влияние. Мы глубоко уважаем наших клиентов, деловых партнеров и коллег."
      },
      // Benefits section
      benefits: {
        title: "Преимущества",
        mainTitle: "Всё, что нужно для управления вашим автопарком",
        subtitle: "Топливные карты TruckingPulse предлагают исключительную ценность и удобные инструменты управления для вашего бизнеса.",
        benefit1: {
          title: "Значительная экономия",
          p1: "Экономьте до $0.70 за галлон на крупных автозаправках по всей стране без комиссий за транзакции.",
          p2: "Оптимизируйте расходы на топливо и улучшите свой финансовый результат с нашими эксклюзивными скидками по всей стране."
        },
        benefit2: {
          title: "Без скрытых комиссий",
          p1: "$0 за транзакции, за проведение карты, за депозит, за ежемесячное или годовое обслуживание наших топливных карт.",
          p2: "Прозрачные цены без сюрпризов, чтобы вы могли сосредоточиться на ведении бизнеса."
        },
        benefit3: {
          title: "Интерактивный поиск топлива",
          p1: "Используйте нашу интерактивную карту, чтобы найти лучшие цены на топливо вокруг вас или по вашим маршрутам.",
          p2: "Планируйте поездки эффективно и максимизируйте экономию, находя самые низкие цены."
        },
        benefit4: {
          title: "Управление через мобильное приложение",
          p1: "Управляйте топливными картами, отслеживайте расходы и просматривайте отчеты отовсюду с помощью нашего мобильного приложения.",
          p2: "Как водители, так и администраторы счетов могут получить доступ к необходимым инструментам в пути."
        },
        benefit5: {
          title: "Детальная отчетность",
          p1: "Получайте детализированные отчеты о расходе топлива с ориентацией на отчетность IFTA и отслеживание расходов.",
          p2: "Упростите налоговую отчетность и получите представление об эффективности использования топлива вашим автопарком."
        },
        benefit6: {
          title: "Доступ к кредиту",
          p1: "Доступ к кредитным линиям и опциям обеспеченных счетов для эффективного управления денежными потоками.",
          p2: "Гибкие варианты оплаты, чтобы помочь вашему бизнесу процветать в пиковые сезоны и более медленные периоды."
        }
      },
      // Testimonials section
      testimonials: {
        title: "Отзывы",
        mainTitle: "Что говорят наши клиенты",
        subtitle: "Не верьте нам на слово - услышите от менеджеров автопарков и водителей, которые используют наши топливные карты каждый день.",
        testimonial1: {
          name: "Стивен Уилкинсон",
          position: "Менеджер Double Tap Transportation LLC",
          text: "\"Очень хорошие карты для автопарка с разумной экономией и круглосуточной многоязычной службой поддержки. Я настоятельно рекомендую приобрести эти карты, чтобы минимизировать расходы на топливо и максимизировать удобство автопарка.\""
        },
        testimonial2: {
          name: "Ади Павловский",
          position: "Менеджер автопарка Energy Trucking LLC",
          text: "\"Все, с кем я общался в TruckingPulse, обеспечивают отличное обслуживание клиентов и нашли время, чтобы ответить на все наши вопросы. Экономия топлива оказала значительное влияние на наши финансовые показатели.\""
        },
        testimonial3: {
          name: "Эмили Уокер",
          position: "Специалист по автопарку GT Transportation LLC",
          text: "\"Узнала о TruckingPulse около 5 месяцев назад и с тех пор работаю с ними. Их карты значительно упростили управление моим топливом - удобны в использовании, стабильные скидки и один из самых профессиональных сервисов, с которыми я когда-либо сталкивалась!\""
        },
        testimonial4: {
          name: "Майкл Робертс",
          position: "Владелец Roberts Logistics",
          text: "\"Как владелец небольшого автопарка, я искал способы конкурировать с более крупными компаниями. Топливные карты TruckingPulse дали нам это преимущество со значительной экономией и отличными инструментами отчетности, которые помогают нам отслеживать каждый цент.\""
        }
      },
      // Location section
      location: {
        title: "Посетите нас по адресу",
        subtitle: "Наша штаб-квартира находится по адресу: 1309 Coffeen Avenue STE 1200, Шеридан, Вайоминг. Легко найдите нас, используя карту ниже."
      },
      // Coverage section
      coverage: {
        title: "Общенациональное покрытие",
        subtitle: "TruckingPulse обеспечивает комплексное покрытие по всей территории США с круглосуточной поддержкой вашего автопарка.",
        states: "Штатов покрыто",
        support: "Поддержка клиентов"
      },
      // FAQ section
      faq: {
        title: "Часто задаваемые вопросы",
        subtitle: "Получите ответы на наиболее распространенные вопросы о топливных картах TruckingPulse.",
        question1: {
          q: "В чем основное преимущество ваших топливных карт?",
          a: "Основное преимущество наших топливных карт - это еженедельная кредитная линия в размере $5,000, которую мы предоставляем нашим держателям карт. Кроме того, мы работаем с крупнейшими станциями в Америке: Love's, TA и PETRO, которые вместе имеют сеть из более чем 1,000 заправочных станций и грузовых остановок по всей стране."
        },
        question2: {
          q: "Ваша карта покрывает только расходы на топливо?",
          a: "Нет. Вы также можете оплачивать взвешивание, рифование и DEF с помощью нашей карты."
        },
        question3: {
          q: "Сколько стоит ваша топливная карта?",
          a: "Мы предоставляем топливные карты бесплатно, что позволяет малым компаниям и владельцам-операторам пользоваться нашими услугами без предварительных затрат или годовых комиссий."
        },
        question4: {
          q: "Позволяет ли ваша карта отслеживать расход топлива?",
          a: "Да. На нашем веб-сайте у каждого клиента есть собственный личный кабинет, где он полностью управляет картами (производит активацию, устанавливает лимиты, получает коды EFS), а также может отслеживать цены на топливо и расходы, что позволяет эффективно планировать бюджет."
        },
        question5: {
          q: "Когда я могу связаться с вашей службой поддержки?",
          a: "Наша поддержка доступна 24/7. Так что вы можете связаться с нами в любое удобное для вас время."
        }
      },
      // Contact form
      contactForm: {
        title: "Свяжитесь с нами",
        subtitle: "Мы будем рады услышать от вас! Отправьте нам сообщение, и мы свяжемся с вами как можно скорее.",
        fullName: "Полное имя*",
        email: "Адрес электронной почты*",
        phone: "Номер телефона",
        subject: "Тема*",
        message: "Сообщение*",
        subscribe: "Подпишитесь на нашу рассылку с советами по экономии топлива и новостями отрасли",
        send: "Отправить сообщение",
        success: "Сообщение успешно отправлено!",
        successMessage: "Спасибо, что обратились в TruckingPulse. Мы свяжемся с вами как можно скорее.",
        nameError: "Пожалуйста, введите ваше полное имя",
        emailError: "Пожалуйста, введите действительный адрес электронной почты",
        subjectError: "Пожалуйста, введите тему",
        messageError: "Пожалуйста, введите ваше сообщение"
      },
      // Footer
      footer: {
        info: "Умные решения для топлива для транспортных компаний любого размера.",
        company: "Компания",
        contact: "Контакты",
        downloadApp: "Скачать наше приложение",
        billing: "Биллинг:",
        support: "Поддержка:",
        phone: "Телефон:",
        copyright: "© 2025 TruckingPulse. Все права защищены.",
        terms: "Условия",
        privacy: "Конфиденциальность",
        cookies: "Куки"
      }
    },
    es: {
      // Español (Spanish) translations
      nav: {
        about: "Acerca de",
        services: "Servicios",
        savings: "Ahorros",
        partners: "Socios",
        testimonials: "Testimonios",
        contactUs: "Contáctenos",
        login: "Iniciar sesión",
        getFuelCard: "Obtener tarjeta de combustible"
      },
      hero: {
        title: "¡Suministra tu flota y maximiza el ahorro!",
        subtitle: "Ahorra hasta $0.70 por galón con las tarjetas de combustible TruckingPulse, aceptadas en las principales estaciones de camiones a nivel nacional. Maximiza el ahorro y la eficiencia del combustible hoy mismo.",
        applyNow: "Solicitar ahora",
        learnMore: "Saber más"
      },
      partners: {
        title: "Aceptado en principales estaciones de camiones"
      },
      about: {
        title: "Nuestra historia comienza con integridad",
        p1: "En TruckingPulse, mantenemos los principios de integridad al servir a nuestros estimados clientes. Nuestro compromiso con la comunicación transparente y abierta es fundamental, y nos dedicamos a actuar de acuerdo con las mejores prácticas de la industria.",
        p2: "Para lograr el éxito, creemos firmemente en nuestra búsqueda incansable de mejorar en todos los aspectos de nuestras operaciones.",
        p3: "Nuestra misión es simple: crear oportunidades equitativas para las pequeñas y medianas empresas de transporte en comparación con las flotas más grandes. Nuestro objetivo es proporcionar un servicio excepcional al cliente y entregar ahorros óptimos a cada cliente, sin importar el tamaño de la flota, a través de la tarjeta de combustible TruckingPulse.",
        p4: "Estamos comprometidos a proporcionar un servicio personalizado y receptivo que tenga un impacto tangible. Respetamos profundamente a nuestros clientes, socios comerciales y colegas."
      },
      benefits: {
        title: "Beneficios",
        mainTitle: "Todo lo que necesitas para administrar tu flota",
        subtitle: "Las tarjetas de combustible TruckingPulse ofrecen un valor excepcional y herramientas convenientes de gestión para tu negocio.",
        benefit1: {
          title: "Ahorro significativo",
          p1: "Ahorra hasta $0.70 por galón en las principales estaciones de camiones a nivel nacional sin comisiones por transacción.",
          p2: "Optimiza tus gastos en combustible y mejora tu rentabilidad con nuestros descuentos exclusivos a nivel nacional."
        },
        benefit2: {
          title: "Sin tarifas ocultas",
          p1: "$0 en tarifas de transacción, tarifas por uso, depósitos, tarifas mensuales o anuales para usar nuestras tarjetas de combustible.",
          p2: "Precios transparentes sin sorpresas, para que puedas concentrarte en hacer crecer tu negocio."
        },
        benefit3: {
          title: "Buscador interactivo de combustible",
          p1: "Usa nuestro mapa interactivo para encontrar los mejores precios de combustible cerca de ti o en tus rutas.",
          p2: "Planifica tus viajes de manera eficiente y maximiza tus ahorros encontrando los precios más bajos."
        },
        benefit4: {
          title: "Control a través de la aplicación móvil",
          p1: "Administra tus tarjetas de combustible, haz un seguimiento de los gastos y consulta los informes desde cualquier lugar con nuestra aplicación móvil.",
          p2: "Tanto los conductores como los administradores de cuentas pueden acceder a las herramientas que necesitan mientras están en movimiento."
        },
        benefit5: {
          title: "Informes detallados",
          p1: "Obtén declaraciones detalladas del consumo de combustible centradas en el reporte IFTA y el seguimiento de gastos.",
          p2: "Simplifica tu reporte fiscal y obtiene información sobre la eficiencia del combustible de tu flota."
        },
        benefit6: {
          title: "Acceso a crédito",
          p1: "Accede a líneas de crédito y opciones de cuentas aseguradas para gestionar tu flujo de efectivo de manera efectiva.",
          p2: "Opciones de pago flexibles para ayudar a tu negocio a prosperar durante las temporadas altas y bajas."
        }
      },
      testimonials: {
        title: "Testimonios",
        mainTitle: "Lo que dicen nuestros clientes",
        subtitle: "No nos creas solo a nosotros, escucha lo que los gerentes de flotas y conductores tienen que decir sobre nuestras tarjetas de combustible.",
        testimonial1: {
          name: "Steven Wilkinson",
          position: "Gerente en Double Tap Transportation LLC",
          text: "\"Tarjetas para flotas bastante buenas con ahorros razonables y servicio al cliente multilingüe 24/7. Las recomendaría ampliamente para minimizar los costos de combustible y maximizar la conveniencia de la flota.\""
        },
        testimonial2: {
          name: "Adi Pavlowsky",
          position: "Gerente de flota en Energy Trucking LLC",
          text: "\"Todos con los que hablé en TruckingPulse brindan un excelente servicio al cliente y se tomaron el tiempo para responder todas nuestras preguntas. Los ahorros en combustible han tenido un impacto significativo en nuestra rentabilidad.\""
        },
        testimonial3: {
          name: "Emily Walker",
          position: "Especialista en flotas en GT Transportation LLC",
          text: "\"Me enteré de TruckingPulse hace unos 5 meses y he estado trabajando con ellos desde entonces. Sus tarjetas han hecho que mi gestión de combustible sea mucho más fácil, son convenientes de usar, con descuentos estables y uno de los servicios más profesionales que he experimentado.\""
        },
        testimonial4: {
          name: "Michael Roberts",
          position: "Propietario en Roberts Logistics",
          text: "\"Como propietario de una flota pequeña, estaba buscando formas de competir con las empresas más grandes. Las tarjetas de combustible de TruckingPulse nos dieron esa ventaja con ahorros significativos y herramientas de informes excelentes que nos ayudan a rastrear cada centavo.\""
        }
      },
      location: {
        title: "Visítanos en nuestra ubicación",
        subtitle: "Nuestra sede está ubicada en 1309 Coffeen Avenue STE 1200, Sheridan, Wyoming. Encuéntranos fácilmente usando el mapa a continuación."
      },
      coverage: {
        title: "Cobertura a nivel nacional",
        subtitle: "TruckingPulse ofrece una cobertura completa en todo Estados Unidos con soporte 24/7 para tu flota.",
        states: "Estados cubiertos",
        support: "Soporte al cliente"
      },
      faq: {
        title: "Preguntas frecuentes",
        subtitle: "Obtén respuestas a las preguntas más comunes sobre las tarjetas de combustible TruckingPulse.",
        question1: {
          q: "¿Cuál es la principal ventaja de sus tarjetas de combustible?",
          a: "La principal ventaja de nuestras tarjetas de combustible es una línea de crédito semanal de $5,000 que proporcionamos a nuestros titulares de tarjetas. Además, trabajamos con las estaciones más grandes de América: Love's, TA y PETRO, que en conjunto tienen una red de más de 1,000 estaciones de servicio y paradas de camiones en todo el país."
        },
        question2: {
          q: "¿La tarjeta solo cubre los costos de combustible?",
          a: "No. También puedes pagar el pesaje, el enfriamiento y DEF con nuestra tarjeta."
        },
        question3: {
          q: "¿Cuánto cuesta su tarjeta de combustible?",
          a: "Ofrecemos las tarjetas de combustible de forma gratuita, lo que permite a las pequeñas empresas y operadores independientes utilizar nuestros servicios sin costos iniciales ni tarifas anuales."
        },
        question4: {
          q: "¿Mi tarjeta me permite rastrear el consumo de combustible?",
          a: "Sí. En nuestro sitio web, cada cliente tiene su propia cuenta personal, donde gestiona completamente las tarjetas (realiza activaciones, establece límites, recibe códigos EFS), y también puede rastrear los precios del combustible y los gastos, lo que le permite planificar su presupuesto de manera efectiva."
        },
        question5: {
          q: "¿Cuándo puedo contactar con su soporte?",
          a: "Nuestro soporte está disponible 24/7. Por lo tanto, puedes contactarnos en cualquier momento conveniente para ti."
        }
      },
      contactForm: {
        title: "Contáctanos",
        subtitle: "¡Nos encantaría saber de ti! Envíanos un mensaje y nos pondremos en contacto contigo lo antes posible.",
        fullName: "Nombre completo*",
        email: "Dirección de correo electrónico*",
        phone: "Número de teléfono",
        subject: "Asunto*",
        message: "Mensaje*",
        subscribe: "Suscríbete a nuestro boletín para obtener consejos sobre ahorro de combustible y noticias de la industria",
        send: "Enviar mensaje",
        success: "¡Mensaje enviado exitosamente!",
        successMessage: "Gracias por contactarnos en TruckingPulse. Nos pondremos en contacto contigo lo antes posible.",
        nameError: "Por favor, ingresa tu nombre completo",
        emailError: "Por favor, ingresa una dirección de correo electrónico válida",
        subjectError: "Por favor, ingresa un asunto",
        messageError: "Por favor, ingresa tu mensaje"
      },
      footer: {
        info: "Soluciones inteligentes de combustible para empresas de transporte de todos los tamaños.",
        company: "Empresa",
        contact: "Contacto",
        downloadApp: "Descargar nuestra aplicación",
        billing: "Facturación:",
        support: "Soporte:",
        phone: "Teléfono:",
        copyright: "© 2025 TruckingPulse. Todos los derechos reservados.",
        terms: "Términos",
        privacy: "Privacidad",
        cookies: "Cookies"
      }
    }
  };

  // Current language storage
  let currentLanguage = 'en';

  /**
   * Initialize language settings
   */
  function initLanguage() {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    if (savedLanguage && translations[savedLanguage]) {
      changeLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0];
      
      if (translations[browserLanguage]) {
        changeLanguage(browserLanguage);
      } else {
        // Set default language
        changeLanguage('en');
      }
    }

    // Style language switcher
    styleLanguageSwitcher();
  }

  /**
   * Style language switcher buttons
   */
  function styleLanguageSwitcher() {
    const $languageButtons = $(".language-option");
    
    if ($languageButtons.length) {
      $languageButtons.each(function() {
        const lang = $(this).attr("onclick").replace("changeLanguage('", "").replace("')", "");
        
        $(this).addClass("px-2 py-1 text-sm font-medium rounded-md mx-1 transition-colors");
        
        if (lang === currentLanguage) {
          $(this).addClass("bg-blue-100 text-blue-700 active-lang");
        } else {
          $(this).addClass("bg-gray-200 text-gray-700 hover:bg-gray-300");
        }
      });
    }
  }

  /**
   * Change website language
   */
  function changeLanguage(lang) {
    if (translations[lang]) {
      currentLanguage = lang;
      updateContent();
      
      // Save selected language in localStorage
      localStorage.setItem('preferredLanguage', lang);
      
      // Update active classes for language switcher buttons
      $(".language-option").each(function() {
        const buttonLang = $(this).attr("onclick").replace("changeLanguage('", "").replace("')", "");
        
        if (buttonLang === lang) {
          $(this).addClass("active-lang bg-blue-100 text-blue-700").removeClass("bg-gray-200 text-gray-700");
        } else {
          $(this).removeClass("active-lang bg-blue-100 text-blue-700").addClass("bg-gray-200 text-gray-700");
        }
      });

      // Update dropdown button text
      $("#current-language-text").text(
        lang === "en" ? "English" : (lang === "ru" ? "Русский" : "Español")
      );
    }
  }

  /**
   * Update all page content with translations
   */
  function updateContent() {
    const t = translations[currentLanguage];
    
    // Update navigation
    updateNavigation(t.nav);
    
    // Update hero section
    updateHero(t.hero);
    
    // Update partners section
    updatePartners(t.partners);
    
    // Update about section
    updateAbout(t.about);
    
    // Update benefits section
    updateBenefits(t.benefits);
    
    // Update testimonials section
    updateTestimonials(t.testimonials);
    
    // Update location section
    updateLocation(t.location);
    
    // Update coverage section
    updateCoverage(t.coverage);
    
    // Update FAQ section
    updateFAQ(t.faq);
    
    // Update contact form
    updateContactForm(t.contactForm);
    
    // Update footer
    updateFooter(t.footer);
  }

  /**
   * Update navigation section
   */
  function updateNavigation(navTranslations) {
    const $navLinks = $("header nav a");
    $navLinks.each(function() {
      const href = $(this).attr("href");
      
      if (href === "#about") {
        $(this).text(navTranslations.about);
      } else if (href === "#services") {
        $(this).text(navTranslations.services);
      } else if (href === "#savings") {
        $(this).text(navTranslations.savings);
      } else if (href === "#partners") {
        $(this).text(navTranslations.partners);
      } else if (href === "#testimonials") {
        $(this).text(navTranslations.testimonials);
      } else if (href === "#contact-us") {
        $(this).text(navTranslations.contactUs);
      }
    });

    // Update mobile menu links as well
    const $mobileLinks = $("#mobile-menu a");
    $mobileLinks.each(function() {
      const href = $(this).attr("href");
      
      if (href === "#about") {
        $(this).text(navTranslations.about);
      } else if (href === "#services") {
        $(this).text(navTranslations.services);
      } else if (href === "#savings") {
        $(this).text(navTranslations.savings);
      } else if (href === "#partners") {
        $(this).text(navTranslations.partners);
      } else if (href === "#testimonials") {
        $(this).text(navTranslations.testimonials);
      } else if (href === "#contact") {
        $(this).text(navTranslations.contactUs);
      }
    });

    // Update buttons
    $("a.inline-flex.items-center.px-4.py-2.border.border-transparent.text-sm.font-medium.rounded-full").each(function() {
      if ($(this).text().trim() === "Login") {
        $(this).text(navTranslations.login);
      } else if ($(this).text().trim() === "Get Fuel Card") {
        $(this).text(navTranslations.getFuelCard);
      }
    });
  }

  /**
   * Update hero section
   */
  function updateHero(heroTranslations) {
    const $heroSection = $(".hero-gradient");
    if ($heroSection.length) {
      const $title = $heroSection.find("h1");
      const $subtitle = $heroSection.find("p");
      const $buttons = $heroSection.find("a");
      
      if ($title.length) $title.text(heroTranslations.title);
      if ($subtitle.length) $subtitle.text(heroTranslations.subtitle);
      
      $buttons.each(function() {
        if ($(this).attr("href") === "#fuel-card") {
          $(this).text(heroTranslations.applyNow);
        } else if ($(this).attr("href") === "#learn-more") {
          $(this).text(heroTranslations.learnMore);
        }
      });
    }
  }

  /**
   * Update partners section
   */
  function updatePartners(partnersTranslations) {
    const $partnersSection = $("#partners");
    if ($partnersSection.length) {
      const $title = $partnersSection.find("h2");
      if ($title.length) $title.text(partnersTranslations.title);
    }
  }

  /**
   * Update about section
   */
  function updateAbout(aboutTranslations) {
    const $aboutSection = $("#about");
    if ($aboutSection.length) {
      const $title = $aboutSection.find("h2");
      const $paragraphs = $aboutSection.find(".text-lg.text-gray-600 p");
      
      if ($title.length) $title.text(aboutTranslations.title);
      
      if ($paragraphs.length >= 4) {
        $paragraphs.eq(0).text(aboutTranslations.p1);
        $paragraphs.eq(1).text(aboutTranslations.p2);
        $paragraphs.eq(2).text(aboutTranslations.p3);
        $paragraphs.eq(3).text(aboutTranslations.p4);
      }
    }
  }

  /**
   * Update benefits section
   */
  function updateBenefits(benefitsTranslations) {
    const $benefitsSection = $("#services");
    if ($benefitsSection.length) {
      const $titleSmall = $benefitsSection.find(".text-base.font-semibold");
      const $titleMain = $benefitsSection.find(".text-4xl.font-extrabold");
      const $subtitle = $benefitsSection.find(".max-w-xl.mt-5.mx-auto.text-xl");
      
      if ($titleSmall.length) $titleSmall.text(benefitsTranslations.title);
      if ($titleMain.length) $titleMain.text(benefitsTranslations.mainTitle);
      if ($subtitle.length) $subtitle.text(benefitsTranslations.subtitle);
      
      // Update benefit cards
      const $benefitCards = $benefitsSection.find(".benefits-card");
      
      if ($benefitCards.length >= 6) {
        // Benefit 1
        updateBenefitCard($benefitCards.eq(0), benefitsTranslations.benefit1);
        
        // Benefit 2
        updateBenefitCard($benefitCards.eq(1), benefitsTranslations.benefit2);
        
        // Benefit 3
        updateBenefitCard($benefitCards.eq(2), benefitsTranslations.benefit3);
        
        // Benefit 4
        updateBenefitCard($benefitCards.eq(3), benefitsTranslations.benefit4);
        
        // Benefit 5
        updateBenefitCard($benefitCards.eq(4), benefitsTranslations.benefit5);
        
        // Benefit 6
        updateBenefitCard($benefitCards.eq(5), benefitsTranslations.benefit6);
      }
    }
  }

  /**
   * Update a single benefit card
   */
  function updateBenefitCard($card, benefitTranslation) {
    const $title = $card.find("h3");
    const $paragraphs = $card.find("p");
    
    if ($title.length) $title.text(benefitTranslation.title);
    
    if ($paragraphs.length >= 2) {
      $paragraphs.eq(0).text(benefitTranslation.p1);
      $paragraphs.eq(1).text(benefitTranslation.p2);
    }
  }

  /**
   * Update testimonials section
   */
  function updateTestimonials(testimonialsTranslations) {
    const $testimonialsSection = $("#testimonials");
    if ($testimonialsSection.length) {
      const $titleSmall = $testimonialsSection.find(".text-base.font-semibold");
      const $titleMain = $testimonialsSection.find(".mt-1.text-4xl.font-extrabold");
      const $subtitle = $testimonialsSection.find(".max-w-xl.mt-5.mx-auto.text-xl");
      
      if ($titleSmall.length) $titleSmall.text(testimonialsTranslations.title);
      if ($titleMain.length) $titleMain.text(testimonialsTranslations.mainTitle);
      if ($subtitle.length) $subtitle.text(testimonialsTranslations.subtitle);
      
      // Update testimonial cards
      const $testimonialCards = $testimonialsSection.find(".testimonial-card");
      
      if ($testimonialCards.length >= 4) {
        // Testimonial 1
        updateTestimonialCard($testimonialCards.eq(0), testimonialsTranslations.testimonial1);
        
        // Testimonial 2
        updateTestimonialCard($testimonialCards.eq(1), testimonialsTranslations.testimonial2);
        
        // Testimonial 3
        updateTestimonialCard($testimonialCards.eq(2), testimonialsTranslations.testimonial3);
        
        // Testimonial 4
        updateTestimonialCard($testimonialCards.eq(3), testimonialsTranslations.testimonial4);
      }
    }
  }

  /**
   * Update a single testimonial card
   */
  function updateTestimonialCard($card, testimonialTranslation) {
    const $name = $card.find("h3");
    const $position = $card.find("p.text-indigo-200");
    const $text = $card.find("p.text-indigo-100");
    
    if ($name.length) $name.text(testimonialTranslation.name);
    if ($position.length) $position.text(testimonialTranslation.position);
    if ($text.length) $text.text(testimonialTranslation.text);
  }

  /**
   * Update location section
   */
  function updateLocation(locationTranslations) {
    const $locationSection = $("#learn-more");
    if ($locationSection.length) {
      const $title = $locationSection.find("h2");
      const $subtitle = $locationSection.find("p.text-lg");
      
      if ($title.length) $title.text(locationTranslations.title);
      if ($subtitle.length) $subtitle.text(locationTranslations.subtitle);
    }
  }

  /**
   * Update coverage section
   */
  function updateCoverage(coverageTranslations) {
    const $coverageSection = $(".py-16.bg-gray-900.text-white");
    if ($coverageSection.length) {
      const $title = $coverageSection.find("h2");
      const $subtitle = $coverageSection.find("p.text-lg");
      const $statesLabel = $coverageSection.find("p.text-xl.text-gray-300").eq(0);
      const $supportLabel = $coverageSection.find("p.text-xl.text-gray-300").eq(1);
      
      if ($title.length) $title.text(coverageTranslations.title);
      if ($subtitle.length) $subtitle.text(coverageTranslations.subtitle);
      if ($statesLabel.length) $statesLabel.text(coverageTranslations.states);
      if ($supportLabel.length) $supportLabel.text(coverageTranslations.support);
    }
  }

  /**
   * Update FAQ section
   */
  function updateFAQ(faqTranslations) {
    const $faqSection = $("#faq");
    if ($faqSection.length) {
      const $title = $faqSection.find("h2");
      const $subtitle = $faqSection.find("p.text-lg");
      
      if ($title.length) $title.text(faqTranslations.title);
      if ($subtitle.length) $subtitle.text(faqTranslations.subtitle);
      
      // Update FAQ items
      const $faqItems = $faqSection.find(".bg-white.shadow.overflow-hidden.rounded-lg");
      
      if ($faqItems.length >= 5) {
        // FAQ 1
        updateFAQItem($faqItems.eq(0), faqTranslations.question1);
        
        // FAQ 2
        updateFAQItem($faqItems.eq(1), faqTranslations.question2);
        
        // FAQ 3
        updateFAQItem($faqItems.eq(2), faqTranslations.question3);
        
        // FAQ 4
        updateFAQItem($faqItems.eq(3), faqTranslations.question4);
        
        // FAQ 5
        updateFAQItem($faqItems.eq(4), faqTranslations.question5);
      }
    }
  }

  /**
   * Update a single FAQ item
   */
  function updateFAQItem($item, questionTranslation) {
    const $question = $item.find("h3");
    const $answer = $item.find(".faq-content p");
    
    if ($question.length) $question.text(questionTranslation.q);
    if ($answer.length) $answer.text(questionTranslation.a);
  }

  /**
   * Update contact form section
   */
   function updateContactForm(contactFormTranslations) {
  const contactFormSection = document.getElementById('contact-us');
  if (contactFormSection) {
    const title = contactFormSection.querySelector('h2');
    const subtitle = contactFormSection.querySelector('p.text-lg');
    
    if (title) title.textContent = contactFormTranslations.title;
    if (subtitle) subtitle.textContent = contactFormTranslations.subtitle;
    
    // Обновляем поля формы
    const labels = contactFormSection.querySelectorAll('label');
    labels.forEach(label => {
      const for_attr = label.getAttribute('for');
      
      if (for_attr === 'contact-name') {
        label.textContent = contactFormTranslations.fullName;
      } else if (for_attr === 'contact-email') {
        label.textContent = contactFormTranslations.email;
      } else if (for_attr === 'contact-phone') {
        label.textContent = contactFormTranslations.phone;
      } else if (for_attr === 'contact-subject') {
        label.textContent = contactFormTranslations.subject;
      } else if (for_attr === 'contact-message') {
        label.textContent = contactFormTranslations.message;
      } else if (for_attr === 'contact-newsletter') {
        label.textContent = contactFormTranslations.subscribe;
      }
    });
    
    // Обновляем сообщения об ошибках
    const errorMessages = contactFormSection.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
      const id = message.getAttribute('id');
      
      if (id === 'contact-name-error') {
        message.textContent = contactFormTranslations.nameError;
      } else if (id === 'contact-email-error') {
        message.textContent = contactFormTranslations.emailError;
      } else if (id === 'contact-subject-error') {
        message.textContent = contactFormTranslations.subjectError;
      } else if (id === 'contact-message-error') {
        message.textContent = contactFormTranslations.messageError;
      }
    });
    
    // Обновляем кнопку отправки
    const submitButton = contactFormSection.querySelector('button[type="submit"]');
    if (submitButton) {
      // Обновляем текст кнопки, сохраняя SVG внутри
      const svg = submitButton.querySelector('svg');
      submitButton.innerHTML = '';
      if (svg) submitButton.appendChild(svg);
      submitButton.appendChild(document.createTextNode(contactFormTranslations.send));
    }
    
    // Обновляем сообщение об успешной отправке
    const successTitle = contactFormSection.querySelector('#contact-success h3');
    const successMessage = contactFormSection.querySelector('#contact-success p');
    
    if (successTitle) successTitle.textContent = contactFormTranslations.success;
    if (successMessage) successMessage.textContent = contactFormTranslations.successMessage;
  }
}

// Функция для обновления футера
function updateFooter(footerTranslations) {
  const footer = document.querySelector('footer');
  if (footer) {
    const infoText = footer.querySelector('p.mt-4.text-gray-400');
    if (infoText) infoText.textContent = footerTranslations.info;
    
    // Обновляем заголовки разделов
    const sectionTitles = footer.querySelectorAll('h3.text-sm.font-bold');
    if (sectionTitles.length >= 3) {
      sectionTitles[0].textContent = footerTranslations.company;
      sectionTitles[1].textContent = footerTranslations.contact;
      sectionTitles[2].textContent = footerTranslations.downloadApp;
    }
    
    // Обновляем ссылки компании
    const companyLinks = footer.querySelectorAll('ul')[0].querySelectorAll('a');
    if (companyLinks.length >= 4) {
      companyLinks[0].textContent = footerTranslations.nav.about;
      companyLinks[1].textContent = footerTranslations.nav.services;
      companyLinks[2].textContent = footerTranslations.nav.partners;
      companyLinks[3].textContent = footerTranslations.nav.testimonials;
    }
    
    // Обновляем контактную информацию
    const contactLabels = footer.querySelectorAll('ul')[1].querySelectorAll('p.text-gray-400');
    if (contactLabels.length >= 3) {
      contactLabels[0].textContent = footerTranslations.billing;
      contactLabels[1].textContent = footerTranslations.support;
      contactLabels[2].textContent = footerTranslations.phone;
    }
    
    // Обновляем копирайт и ссылки
    const copyright = footer.querySelector('p.text-base.text-gray-400');
    const footerLinks = footer.querySelectorAll('.mt-4.md\\:mt-0.flex.space-x-6 a');
    
    if (copyright) copyright.textContent = footerTranslations.copyright;
    
    if (footerLinks.length >= 3) {
      footerLinks[0].textContent = footerTranslations.terms;
      footerLinks[1].textContent = footerTranslations.privacy;
      footerLinks[2].textContent = footerTranslations.cookies;
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
    // Проверяем наличие сохраненного языка в localStorage
    let savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        changeLanguage(savedLanguage);
    } else {
        // Определяем язык браузера
        const browserLanguage = navigator.language.split('-')[0];
        if (translations[browserLanguage]) {
            changeLanguage(browserLanguage);
        } else {
            // Устанавливаем язык по умолчанию
            changeLanguage('en');
        }
    }

    // Стилизуем переключатель языков
    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
        languageSwitcher.classList.add('flex', 'items-center', 'ml-4');
        
        const buttons = languageSwitcher.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.add('px-2', 'py-1', 'text-sm', 'font-medium', 'rounded-md', 'mx-1', 'transition-colors');
            
            const lang = button.getAttribute('onclick').replace('changeLanguage(\'', '').replace('\')', '');
            if (lang === currentLanguage) {
                button.classList.add('bg-blue-100', 'text-blue-700', 'active-lang');
            } else {
                button.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            }
        });
    }

    // Обработчик для кнопок переключения языка
    function handleLanguageSwitch() {
        const lang = this.getAttribute('onclick').replace('changeLanguage(\'', '').replace('\')', '');
        if (currentLanguage !== lang) {
            changeLanguage(lang);
        }
    }

    // Добавляем обработчики событий для кнопок переключения языка
    const languageButtons = document.querySelectorAll('.language-switcher button');
    languageButtons.forEach(button => {
        button.addEventListener('click', handleLanguageSwitch);
    });
});


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
                    field.closest('.form-field').classList.remove('error');
                });
                
                [nameError, phoneError, emailError, privacyError].forEach(error => {
                    error.classList.add('hidden');
                });
                
                // Validate name
                if (!nameInput.value.trim()) {
                    nameInput.closest('.form-field').classList.add('error');
                    nameError.classList.remove('hidden');
                    isValid = false;
                }
                
                // Validate phone
                if (!phoneInput.value.trim() || !/^[0-9]{10,}$/.test(phoneInput.value.replace(/[^0-9]/g, ''))) {
                    phoneInput.closest('.form-field').classList.add('error');
                    phoneError.classList.remove('hidden');
                    isValid = false;
                }
                
                // Validate email
                if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                    emailInput.closest('.form-field').classList.add('error');
                    emailError.classList.remove('hidden');
                    isValid = false;
                }
                
                // Validate privacy policy
                if (!privacyCheckbox.checked) {
                    privacyCheckbox.closest('.form-field').classList.add('error');
                    privacyError.classList.remove('hidden');
                    isValid = false;
                }
                
                if (isValid) {
                    // If using AJAX submission, you'd call that here
                    // For demo purposes, we'll just show success message
                    formSuccess.classList.remove('hidden');
                    form.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formSuccess.classList.add('hidden');
                    }, 5000);
                }
            });
            
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Close mobile menu if open
                        if (mobileMenu.classList.contains('active')) {
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