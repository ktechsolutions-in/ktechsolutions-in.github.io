(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var isMobile = window.innerWidth < 768;

  /* Preloader — the 2s splash is deliberate, but it used to start counting
     from window.load, which does not fire until every image and CDN library
     has finished downloading. On a slow connection that held the page behind
     the splash for many seconds. This file is deferred, so it already runs
     after the HTML is parsed; start the timer here instead. */
  setTimeout(function(){
    var pl = document.getElementById('preloader');
    if (pl) pl.classList.add('hidden');
  }, reduceMotion ? 300 : 2000);

  /* Custom cursor */
  var cursor = document.getElementById('cursor-dot');
  if(isTouch || reduceMotion){
    cursor.style.display = 'none';
  } else {
    window.addEventListener('mousemove', function(e){
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a,button,.chip,.skill-card,input,select,textarea').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursor.style.transform = 'translate(-50%,-50%) scale(2)'; });
      el.addEventListener('mouseleave', function(){ cursor.style.transform = 'translate(-50%,-50%) scale(1)'; });
    });
  }

  /* Scroll progress bar */
  var progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });

  /* Navbar scroll state */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function(){
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* Mobile hamburger */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', function(){
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });

  /* Active nav link on scroll */
  var sections = document.querySelectorAll('section[id]');
  var navItems = document.querySelectorAll('.nav-link');
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        navItems.forEach(function(link){
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(function(s){ observer.observe(s); });

  /* Typed.js */
  if(window.Typed){
    new Typed('#typed-text', {
      strings: [
        'Full-Stack Web Developer',
        'React &amp; WordPress Expert',
        'I Build Websites That Grow Your Business',
        'Founder — K Tech Solutions'
      ],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 1500,
      loop: true,
      smartBackspace: true
    });
  }

  /* AOS */
  if(window.AOS){
    AOS.init({ duration: 800, once: true, disable: reduceMotion });
  }

  /* VANTA.NET hero background */
  if(window.VANTA && !reduceMotion){
    VANTA.NET({
      el: '#vanta-bg',
      mouseControls: true,
      touchControls: !isMobile,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xe11d48,
      backgroundColor: 0x0a0a0f,
      points: isMobile ? 6.00 : 12.00,
      maxDistance: isMobile ? 16.00 : 22.00,
      spacing: isMobile ? 20.00 : 16.00,
      showDots: true
    });
  }

  /* vanilla-tilt */
  if(window.VanillaTilt && !isTouch){
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.2,
      scale: 1.02
    });
  }

  /* Skills data + render + animate on scroll */
  var skills = [
    { name:'HTML / CSS', level:95 },
    { name:'JavaScript', level:90 },
    { name:'React', level:85 },
    { name:'WordPress', level:90 },
    { name:'Node.js', level:80 },
    { name:'PHP', level:80 },
    { name:'MySQL', level:75 },
    { name:'SEO / Performance', level:85 },
    { name:'Responsive Design', level:95 },
    { name:'Git & GitHub', level:80 }
  ];
  var skillsGrid = document.getElementById('skillsGrid');
  skills.forEach(function(skill, i){
    var card = document.createElement('div');
    card.className = 'glass skill-card';
    card.setAttribute('data-aos','fade-up');
    card.setAttribute('data-aos-delay', (i % 3) * 100);
    card.setAttribute('data-tilt','');
    card.setAttribute('data-tilt-max','8');
    card.innerHTML =
      '<div class="skill-top"><span>'+skill.name+'</span><span>'+skill.level+'%</span></div>'+
      '<div class="bar-track"><div class="bar-fill" data-level="'+skill.level+'"></div></div>';
    skillsGrid.appendChild(card);
  });
  if(window.VanillaTilt && !isTouch){
    VanillaTilt.init(skillsGrid.querySelectorAll('[data-tilt]'), { max:8, speed:400, glare:true, 'max-glare':0.2, scale:1.02 });
  }
  var barObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var fill = entry.target.querySelector('.bar-fill');
        fill.style.width = fill.dataset.level + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillsGrid.querySelectorAll('.skill-card').forEach(function(c){ barObserver.observe(c); });

  /* Contact form -> email inbox, via FormSubmit.
     The first submission to a new address triggers a one-time activation
     mail from FormSubmit; until that link is clicked nothing is delivered. */
  var ENQUIRY_EMAIL = 'karandesai8044@gmail.com';
  var WHATSAPP_NO   = '919825794375';

  var form = document.getElementById('contactForm');
  var formMsg = document.getElementById('formMsg');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('name').value.trim();
    var contact = document.getElementById('contact').value.trim();
    var need = document.getElementById('need').value;
    var budget = document.getElementById('budget').value;
    var details = document.getElementById('details').value.trim();

    if(!name || !contact || !need || !details){
      formMsg.textContent = 'Please fill in all required fields.';
      formMsg.className = 'form-msg error';
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var btnLabel = btn ? btn.textContent : '';
    if(btn){ btn.disabled = true; btn.textContent = 'Sending…'; }
    formMsg.textContent = '';
    formMsg.className = 'form-msg';

    var payload = new FormData();
    payload.append('_subject', 'New project enquiry — ' + name);
    payload.append('_template', 'table');
    payload.append('_captcha', 'false');
    payload.append('Name', name);
    payload.append('Phone or Email', contact);
    payload.append('Needs', need);
    payload.append('Budget', budget || 'Not specified');
    payload.append('Project details', details);

    /* Offer WhatsApp as a link rather than calling window.open here: this runs
       inside a fetch callback, which is no longer a user gesture, so browsers
       block the popup silently and the visitor sees nothing happen at all. */
    function offerWhatsApp(leadText){
      var msg =
        '*New Project Enquiry — K Tech Solutions*\n\n' +
        '*Name:* ' + name + '\n' +
        '*Contact:* ' + contact + '\n' +
        '*Needs:* ' + need + '\n' +
        '*Budget:* ' + (budget || 'Not specified') + '\n' +
        '*Details:* ' + details;

      formMsg.textContent = leadText + ' ';
      var a = document.createElement('a');
      a.href = 'https://wa.me/' + WHATSAPP_NO + '?text=' + encodeURIComponent(msg);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Send it on WhatsApp instead →';
      a.style.textDecoration = 'underline';
      formMsg.appendChild(a);
      formMsg.className = 'form-msg error';
    }

    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(ENQUIRY_EMAIL), {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: payload
    })
      .then(function(r){ return r.json(); })
      .then(function(j){
        if(btn){ btn.disabled = false; btn.textContent = btnLabel; }
        if(j && (j.success === true || j.success === 'true')){
          form.reset();
          formMsg.textContent = 'Thanks! Your enquiry is in — I\'ll reply shortly.';
          formMsg.className = 'form-msg success';
        } else if(j && /activation/i.test(j.message || '')){
          /* FormSubmit holds the very first message to a new address until the
             activation link in its email is clicked. Worth naming plainly so
             it does not look like the form is simply broken. */
          offerWhatsApp('Email delivery is still being set up.');
        } else {
          offerWhatsApp('Could not send by email.');
        }
      })
      .catch(function(){
        if(btn){ btn.disabled = false; btn.textContent = btnLabel; }
        offerWhatsApp('Could not send by email.');   // offline or blocked
      });
  });
})();
