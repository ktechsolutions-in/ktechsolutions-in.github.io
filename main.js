/* K Tech Solutions — main.js (plain JavaScript, no libraries) */
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Loader: remove as soon as the page is ready (CSS also hides it after ~0.8s) ---- */
  var loader = document.getElementById("loader");
  function hideLoader() { if (loader) loader.classList.add("done"); }
  window.addEventListener("load", function () { setTimeout(hideLoader, 250); });
  setTimeout(hideLoader, 900);

  /* ---- Navbar: glass on scroll, mobile menu, active link ---- */
  var header = document.getElementById("siteHeader");
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  var navItems = document.querySelectorAll(".nav-link");

  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 24); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  function closeMenu() {
    navLinks.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navLinks.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }
  var sections = document.querySelectorAll("section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) navItems.forEach(function (l) { l.classList.toggle("is-active", l.dataset.section === en.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ---- Scroll reveal (fade + slight move up) ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Animated stat counters (values come from data-count / data-suffix in index.html) ---- */
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cObs.observe(c); });
  }

  /* ==========================================================
     CONTACT FORM — sending logic is unchanged from the old site
     (FormSubmit email + WhatsApp fallback). Only validation messages are new.
     ========================================================== */
  var ENQUIRY_EMAIL = "karandesai8044@gmail.com";
  var ENQUIRY_CC = "ktechsolutions.in@gmail.com";
  var WHATSAPP_NO = "919825794375";

  var form = document.getElementById("contactForm");
  var formMsg = document.getElementById("formMsg");
  var formSent = document.getElementById("formSent");
  var sentLine = document.getElementById("sentLine");
  var sendAnother = document.getElementById("sendAnother");

  function showSent(personName) {
    var first = (personName || "").trim().split(/\s+/)[0];
    sentLine.textContent = (first ? "Thanks " + first + " — " : "Thanks — ") +
      "I've got your details and I'll get back to you personally, usually the same day.";
    form.hidden = true;
    formSent.hidden = false;
    formSent.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }
  function setError(id, text) {
    var el = document.getElementById(id), field = el.closest(".field"), err = field.querySelector(".err");
    field.classList.toggle("has-error", !!text);
    el.setAttribute("aria-invalid", text ? "true" : "false");
    if (err) err.textContent = text || "";
  }
  if (sendAnother) {
    sendAnother.addEventListener("click", function () {
      form.reset();
      ["name", "contactInfo", "need", "details"].forEach(function (id) { setError(id, ""); });
      formMsg.textContent = ""; formMsg.className = "form-msg";
      formSent.hidden = true; form.hidden = false;
    });
  }
  var messages = {
    name: "Please enter your name.",
    contactInfo: "Please add a phone number or email so I can reply.",
    need: "Please choose what you need.",
    details: "Please tell me a little about your project."
  };
  ["name", "contactInfo", "need", "details"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    var clear = function () { setError(id, ""); };
    el.addEventListener("input", clear);
    el.addEventListener("change", clear);
  });

  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value.trim();
    var contact = document.getElementById("contactInfo").value.trim();
    var need = document.getElementById("need").value;
    var budget = document.getElementById("budget").value;
    var details = document.getElementById("details").value.trim();

    var firstMissing = null;
    [["name", name], ["contactInfo", contact], ["need", need], ["details", details]].forEach(function (pair) {
      var empty = !pair[1];
      setError(pair[0], empty ? messages[pair[0]] : "");
      if (empty && !firstMissing) firstMissing = document.getElementById(pair[0]);
    });
    if (firstMissing) {
      formMsg.textContent = "Please fill in the highlighted fields.";
      formMsg.className = "form-msg error";
      firstMissing.focus();
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var btnLabel = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    formMsg.textContent = ""; formMsg.className = "form-msg";

    var payload = new FormData();
    payload.append("_subject", "New project enquiry — " + name);
    payload.append("_template", "table");
    payload.append("_captcha", "false");
    payload.append("_cc", ENQUIRY_CC);
    payload.append("Name", name);
    payload.append("Phone or Email", contact);
    payload.append("Needs", need);
    payload.append("Budget", budget || "Not specified");
    payload.append("Project details", details);

    function offerWhatsApp(leadText) {
      var msg = "*New Project Enquiry — K Tech Solutions*\n\n" +
        "*Name:* " + name + "\n*Contact:* " + contact + "\n*Needs:* " + need + "\n" +
        "*Budget:* " + (budget || "Not specified") + "\n*Details:* " + details;
      formMsg.textContent = leadText + " ";
      var a = document.createElement("a");
      a.href = "https://wa.me/" + WHATSAPP_NO + "?text=" + encodeURIComponent(msg);
      a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Send on WhatsApp instead →";
      formMsg.appendChild(a);
      formMsg.className = "form-msg error";
    }

    fetch("https://formsubmit.co/ajax/" + encodeURIComponent(ENQUIRY_EMAIL), {
      method: "POST", headers: { Accept: "application/json" }, body: payload
    })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
        if (j && (j.success === true || j.success === "true")) showSent(name);
        else if (j && /activation/i.test(j.message || "")) offerWhatsApp("Email delivery is still being set up.");
        else offerWhatsApp("Could not send by email.");
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
        offerWhatsApp("Could not send by email.");
      });
  });
})();
