(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
      }
    });
  }

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  var bars = document.querySelectorAll(".bar-fill");
  var barObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fill = entry.target;
          fill.style.width = fill.getAttribute("data-width") || "0%";
          barObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.4 }
  );
  bars.forEach(function (bar) { barObserver.observe(bar); });

  var links = document.querySelectorAll(".nav-links a[href^='#']");
  var sections = [];
  links.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) sections.push({ link: link, sec: sec });
  });

  function highlightNav() {
    var pos = window.scrollY + 120;
    var current = null;
    sections.forEach(function (item) {
      if (item.sec.offsetTop <= pos) current = item;
    });
    sections.forEach(function (item) {
      item.link.classList.toggle("active", item === current);
    });
  }
  if (sections.length) {
    window.addEventListener("scroll", highlightNav, { passive: true });
    highlightNav();
  }

  var counterHosts = document.querySelectorAll(".hero-meta");
  if (counterHosts.length && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll(".count").forEach(function (el) {
            var target = parseInt(el.getAttribute("data-target"), 10) || 0;
            var duration = 1200;
            var start = null;
            function step(ts) {
              if (!start) start = ts;
              var p = Math.min((ts - start) / duration, 1);
              var eased = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(eased * target);
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          });
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );
    counterHosts.forEach(function (el) { counterObserver.observe(el); });
  } else {
    document.querySelectorAll(".count").forEach(function (el) {
      el.textContent = el.getAttribute("data-target") || "0";
    });
  }

  if (window.location.hash) {
    setTimeout(function () {
      var target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
})();
