(function ($) {
  // Accordion
  $(".themeAccordionBtn").click(function () {
    let accordionBody = $(this)
      .parents(".themeAccordion")
      .find(".themeAccordionBody");
    let accordionContainer = $(this).parents(".themeAccordionContainer");

    if (accordionBody.is(":visible")) {
      accordionBody.slideUp("fast");
      $(this).parents(".themeAccordion").removeClass("themeAccordionActive");
    } else {
      accordionContainer.find(".themeAccordionBody").slideUp("fast");
      accordionBody.slideDown("fast");
      accordionContainer
        .find(".themeAccordion")
        .removeClass("themeAccordionActive");
      $(this).parents(".themeAccordion").addClass("themeAccordionActive");
    }
  });

  // Header mobile menu
  $(".ToggleMobileMenu").on("click", function () {
    $(".MobileMenu").toggleClass("hidden");
    $("body").toggleClass("overflow-hidden");
  });

  // Slider - Testimonials
  let sliderTestimonials = $("#sliderTestimonials");
  sliderTestimonials.owlCarousel({
    loop: true,
    margin: 30,
    items: 1,
    dots: false,
  });
  $(".sliderTestimonialsNavNext").click(function () {
    sliderTestimonials.trigger("next.owl.carousel");
  });
  $(".sliderTestimonialsNavPrev").click(function () {
    sliderTestimonials.trigger("prev.owl.carousel");
  });
  sliderTestimonials.trigger("play.owl.carousel", false);

  // FAQs
  $(".ToggleFaq").on("click", function () {
    const faq = $("#faq-" + $(this).attr("data-toggle-faq"));
    faq.toggleClass("hidden");
    faq.parent().find(".FaqIcon").toggleClass("rotate-90");
  });

  // Modals
  $(".ToggleModal").on("click", function () {
    const modal = $(this).attr("data-toggle-modal");
    $("#modal-" + modal).toggleClass("hidden");
    $("body").toggleClass("overflow-hidden");
  });

  // Close modals on "esc"
  $(document).on("keyup", function (event) {
    if ((event.name = "Escape")) {
      $(".modal").addClass("hidden");
      $("body").removeClass("overflow-hidden");
    }
  });

  // Close modals when clicked outside
  $(document).on("click", function () {
    $(".modal").on("click", function (e) {
      if (!$(this).find(".modal-content").has(e.target).length) {
        $(this).addClass("hidden");
        $("body").removeClass("overflow-hidden");
      }
    });
  });

  // Owl Carousel
  $("#sliderTestimonialsFirst").owlCarousel({
    margin: 20,
    loop: true,
    responsive: {
      1200: {
        items: 3,
      },
      768: {
        items: 2,
      },
      0: {
        items: 1,
      },
    },
  });

  $("#email-submit1").on("click", function () {
    var name = $("#email-name").val();
    var email = $("#email-address").val();
    var message = $("#email-message").val();
    if (name == "" || email == "" || message == "") {
      alert("Please fill * required fields!");
    } else {
      $.ajax({
        url: "http://15.235.212.129:5000/api/Common/SendEmail",
        type: "POST",
        data: JSON.stringify({
          email: email,
          subject: "Anonym email - Hi , " + name + " ...",
          body: message,
        }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function () {
          alert(
            `Thank you, your message has been successfully sent. We will contact you very soon!`
          );

          setTimeout(function () {
            location.reload();
          }, 2000);

        },
      });
    }
  });

  $("#email-submit2").on("click", function () {
    var name = $("#email-name").val();
    var email = $("#email-address").val();
    var message = `
    Phone number: ${$('#email-phone').val()} 
    <br>
    Company name: ${$('#email-company').val()} 
    <br>
    MC/DOT Number: ${$('#email-id').val()} 
    <br>
    How many trucks do you have? -  ${$('#email-trucks').val()} 
    `;
    if (name == "" || email == "") {
      alert("Please fill * required fields!");
    } else {
      $.ajax({
        url: "http://15.235.212.129:5000/api/Common/SendEmail",
        type: "POST",
        data: JSON.stringify({
          email: email,
          subject: "Anonym email - Hi , " + name + " ...",
          body: message,
        }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function () {
          alert(
            `Thank you, your message has been successfully sent. We will contact you very soon!`
          );

          setTimeout(function () {
            location.reload();
          }, 2000);
        },
      });
    }
  });
})(jQuery);

// Parallax
const parallaxElements = document.querySelectorAll(".parallax");
window.addEventListener("scroll", function () {
  let offset = window.pageYOffset;
  parallaxElements.forEach((element) => {
    element.style.backgroundPositionY = offset * -0.36 + "px";
  });
});
