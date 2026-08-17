(function () {
  "use strict";

  /* ---------- Quantity ---------- */
  var quantityInput = document.getElementById("quantity");
  var orderFeedback = document.getElementById("orderFeedback");
  var feedbackTimer = null;

  function getQuantity() {
    var qty = parseInt(quantityInput.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 99) qty = 99;
    quantityInput.value = qty;
    return qty;
  }

  function showFeedback(message) {
    if (!orderFeedback) return;
    orderFeedback.textContent = message;
    orderFeedback.hidden = false;
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(function () {
      orderFeedback.hidden = true;
    }, 2800);
  }

  var qtyMinus = document.getElementById("qtyMinus");
  var qtyPlus = document.getElementById("qtyPlus");

  if (qtyMinus) {
    qtyMinus.addEventListener("click", function () {
      var qty = getQuantity();
      if (qty > 1) quantityInput.value = qty - 1;
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener("click", function () {
      var qty = getQuantity();
      if (qty < 99) quantityInput.value = qty + 1;
    });
  }

  if (quantityInput) {
    quantityInput.addEventListener("change", getQuantity);
    quantityInput.addEventListener("blur", getQuantity);
  }

  /* ---------- Buy Now ---------- */
  function handleBuyNow() {
    var qty = getQuantity();
    showFeedback("تم تجهيز طلبك بكمية " + qty + " — سنتواصل معك قريبًا");
  }

  var buyNow = document.getElementById("buyNow");
  var buyNowBottom = document.getElementById("buyNowBottom");
  if (buyNow) buyNow.addEventListener("click", handleBuyNow);
  if (buyNowBottom) buyNowBottom.addEventListener("click", handleBuyNow);

  /* ---------- Reusable Carousel ---------- */
  function initCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-carousel-dots] .carousel__dot"));
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var current = 0;
    var autoplayTimer = null;
    var touchStartX = 0;

    function goTo(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        var active = i === current;
        slide.classList.toggle("is-active", active);
        if (active) slide.removeAttribute("hidden");
        else slide.setAttribute("hidden", "");
      });

      dots.forEach(function (dot, i) {
        var active = i === current;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, 5000);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        next();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prev();
        startAutoplay();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        goTo(parseInt(dot.getAttribute("data-index"), 10));
        startAutoplay();
      });
    });

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);

    root.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    root.addEventListener("touchend", function (e) {
      var delta = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(delta) > 40) {
        if (delta > 0) prev();
        else next();
      }
      startAutoplay();
    }, { passive: true });

    goTo(0);
    startAutoplay();
  }

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
})();
