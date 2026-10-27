(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var header = document.getElementById("siteHeader");
  var progressBar = document.getElementById("scroll-progress");
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  var navItems = document.querySelectorAll(".nav-link");
  var heroRole = document.getElementById("heroRole");

  if (progressBar) {
    window.addEventListener("scroll", function () {
      var doc = document.documentElement;
      var scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
      progressBar.style.width = scrolled + "%";
    }, { passive: true });
  }

  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }, { passive: true });
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var sections = document.querySelectorAll("section[id]");
  if (sections.length && navItems.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navItems.forEach(function (link) {
            link.classList.toggle("is-active", link.dataset.section === entry.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  document.querySelectorAll(".reveal").forEach(function (el) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealObserver.observe(el);
  });

  if (heroRole && !reduceMotion) {
    var roles = [
      "I build websites that grow your business.",
      "Full-Stack Web Developer · 3+ years",
      "Founder — K Tech Solutions",
      "React, WordPress & SEO specialist"
    ];
    var roleIndex = 0;
    setInterval(function () {
      roleIndex = (roleIndex + 1) % roles.length;
      heroRole.style.opacity = "0";
      setTimeout(function () {
        heroRole.textContent = roles[roleIndex];
        heroRole.style.opacity = "1";
      }, 280);
    }, 4000);
    heroRole.style.transition = "opacity 0.28s ease";
  }

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

  if (sendAnother) {
    sendAnother.addEventListener("click", function () {
      form.reset();
      formMsg.textContent = "";
      formMsg.className = "form-msg";
      formSent.hidden = true;
      form.hidden = false;
    });
  }

  ["name", "contact", "need", "details"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    var clear = function () { el.style.borderColor = ""; };
    el.addEventListener("input", clear);
    el.addEventListener("change", clear);
  });

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value.trim();
    var contact = document.getElementById("contact").value.trim();
    var need = document.getElementById("need").value;
    var budget = document.getElementById("budget").value;
    var details = document.getElementById("details").value.trim();

    var firstMissing = null;
    [["name", name], ["contact", contact], ["need", need], ["details", details]].forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      var empty = !pair[1];
      el.style.borderColor = empty ? "#ff6b6b" : "";
      if (empty && !firstMissing) firstMissing = el;
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
    formMsg.textContent = "";
    formMsg.className = "form-msg";

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
      var msg =
        "*New Project Enquiry — K Tech Solutions*\n\n" +
        "*Name:* " + name + "\n" +
        "*Contact:* " + contact + "\n" +
        "*Needs:* " + need + "\n" +
        "*Budget:* " + (budget || "Not specified") + "\n" +
        "*Details:* " + details;
      formMsg.textContent = leadText + " ";
      var a = document.createElement("a");
      a.href = "https://wa.me/" + WHATSAPP_NO + "?text=" + encodeURIComponent(msg);
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Send on WhatsApp instead →";
      formMsg.appendChild(a);
      formMsg.className = "form-msg error";
    }

    fetch("https://formsubmit.co/ajax/" + encodeURIComponent(ENQUIRY_EMAIL), {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload
    })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
        if (j && (j.success === true || j.success === "true")) {
          showSent(name);
        } else if (j && /activation/i.test(j.message || "")) {
          offerWhatsApp("Email delivery is still being set up.");
        } else {
          offerWhatsApp("Could not send by email.");
        }
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
        offerWhatsApp("Could not send by email.");
      });
  });
})();
