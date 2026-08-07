(function () {

  /* ═══════════════════════════════════════
     FUMIGACIONES MAGISTRAL — ANIMATIONS.JS
     Animaciones temáticas con Anime.js + Intersection Observer
     ═══════════════════════════════════════ */

  /* ───────── helpers ───────── */
  function el(sel) { return document.querySelector(sel); }
  function els(sel) { return document.querySelectorAll(sel); }

  function onVisibleEach(selector, cb, threshold = 0.15) {
    const nodes = els(selector);
    if (!nodes.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cb(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold });
    nodes.forEach((n) => obs.observe(n));
  }

  /* ───────── Observe for CSS .animate elements ───────── */
  function observeElements(selector, animationClass = 'visible', threshold = 0.15) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );
    elements.forEach((el) => observer.observe(el));
  }

  /* ───────── Animate entrance genérica (reemplaza duplicados) ───────── */
  function staggerReveal(containerSelector, childSelector, { delay = 120, y = 40, removeAnime = true } = {}) {
    onVisibleEach(containerSelector, (container) => {
      const items = container.querySelectorAll(childSelector);
      if (removeAnime) items.forEach(i => i.classList.remove('animate'));
      anime({
        targets: items,
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 600,
        delay: anime.stagger(delay),
        easing: 'easeOutQuad',
      });
    });
  }

  /* ───────── 1. LOGO PULSE ───────── */
  function logoPulse() {
    const logoSvg = el('.nav__logo svg circle:first-child');
    if (!logoSvg) return;
    anime({
      targets: logoSvg,
      r: [18, 16, 18],
      strokeOpacity: [1, 0.4, 1],
      duration: 2500,
      loop: true,
      easing: 'easeInOutSine',
    });
  }

  /* ───────── 2. HERO — NIEBLA DE FUMIGACIÓN DRAMÁTICA ───────── */
  function heroFumigationFog() {
    const hero = el('#hero');
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero__particles';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.zIndex = '10';
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let w, h;
    function resize() {
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* Nube densa en el centro. La densidad baja en pantallas pequeñas:
       este efecto corre justo cuando el móvil está pintando el hero. */
    const count = window.innerWidth < 640 ? 110 : window.innerWidth < 1024 ? 220 : 380;
    const particles = [];
    const cx = w / 2, cy = h / 2;
    const maxDist = Math.max(w, h) * 0.6;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * maxDist;
      const outward = maxDist * 0.8 + Math.random() * maxDist * 0.5;
      particles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        targetX: cx + Math.cos(angle) * outward,
        targetY: cy + Math.sin(angle) * outward,
        r: Math.random() * 7 + 3,
        alpha: Math.random() * 0.5 + 0.4,
        delay: Math.random() * 200,
      });
    }

    let startTime = null;
    const duration = 3500;

    function draw(time) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        if (elapsed < p.delay) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(225, 29, 46, ${p.alpha * 0.6})`;
          ctx.fill();
          return;
        }

        const t = Math.min((elapsed - p.delay) / duration, 1);
        const e = 1 - Math.pow(1 - t, 2.5);
        const px = p.x + (p.targetX - p.x) * e;
        const py = p.y + (p.targetY - p.y) * e;
        const a = p.alpha * (1 - e);
        const radius = p.r * (1 - e * 0.4);

        if (a > 0.01) {
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(225, 29, 46, ${a})`;
          ctx.fill();
        }
      });

      if (progress >= 1) {
        canvas.style.zIndex = '1';
        anime({
          targets: canvas,
          opacity: [1, 0],
          duration: 800,
          easing: 'easeOutQuad',
          complete: () => canvas.remove(),
        });
      } else {
        requestAnimationFrame(draw);
      }
    }

    requestAnimationFrame(draw);
  }

  /* ───────── 3. HERO TITLE — FADE-IN ESCALONADO (preserva HTML) ───────── */
  function heroTextStagger() {
    const title = el('.hero__title');
    const badge = el('.hero__badge');
    const actions = el('.hero__actions');

    if (badge) badge.classList.remove('animate');
    if (title) { title.classList.remove('animate'); title.classList.add('hero__title--animating'); }
    if (actions) actions.classList.remove('animate');

    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      complete: function() {
        if (title) title.classList.remove('hero__title--animating');
      }
    });

    if (badge) {
      timeline.add({
        targets: badge,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
      }, 0);
    }

    if (title) {
      const words = [];
      title.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
          node.textContent.split(/\s+/).forEach(w => {
            if (w) words.push({ text: w, tag: null });
          });
        } else if (node.nodeType === 1) {
          const tag = node.tagName.toLowerCase();
          node.textContent.split(/\s+/).forEach(w => {
            if (w) words.push({ text: w, tag });
          });
        }
      });
      title.innerHTML = words.map(w => {
        if (w.tag) return `<${w.tag} class="hero__word">${w.text}</${w.tag}>`;
        return `<span class="hero__word">${w.text}</span>`;
      }).join(' ');
      timeline.add({
        targets: '.hero__word',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 500,
        delay: anime.stagger(60),
      }, 400);
    }

    if (actions) {
      timeline.add({
        targets: actions.children,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 500,
        delay: anime.stagger(150),
      }, 1800);
    }
  }

  /* ───────── 4. HERO VISUAL — APARICIÓN CON EFECTO ESCUDO ───────── */
  function heroVisualReveal() {
    const visual = el('.hero__visual');
    if (!visual) return;
    visual.classList.remove('animate--right');
    anime({
      targets: visual,
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 1200,
      delay: 600,
      easing: 'easeOutElastic(1, .5)',
    });
  }

  /* ───────── 4b. HERO IMAGE — FLOTACIÓN SUTIL + EFECTO LUPA ───────── */
  function heroImageFloat() {
    const img = el('.hero__image');
    if (!img) return;
    anime({
      targets: img,
      translateY: [0, -8, 0],
      duration: 4000,
      loop: true,
      easing: 'easeInOutSine',
    });
  }

  /* ───────── 4c. HOVER ZOOM EN HERO IMAGE ───────── */
  function heroImageHover() {
    const img = el('.hero__image');
    if (!img) return;
    img.addEventListener('mouseenter', () => {
      anime({
        targets: img,
        scale: [1, 1.04],
        filter: ['brightness(1)', 'brightness(1.08)'],
        duration: 400,
        easing: 'easeOutQuad',
      });
    });
    img.addEventListener('mouseleave', () => {
      anime({
        targets: img,
        scale: [1.04, 1],
        filter: ['brightness(1.08)', 'brightness(1)'],
        duration: 400,
        easing: 'easeOutQuad',
      });
    });
  }

  /* ───────── 4c2. HERO TYPING — EFECTO TYPEWRITER ───────── */
  function heroTyping() {
    const el = document.getElementById('hero-typing');
    if (!el) return;
    const text = el.getAttribute('data-text') || '';
    if (!text) return;
    let index = 0;
    el.textContent = '';
    el.style.opacity = '1';
    el.style.visibility = 'visible';
    function type() {
      if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
        const delay = text.charAt(index - 1) === '.' || text.charAt(index - 1) === ',' ? 80 : 30 + Math.random() * 20;
        setTimeout(type, delay);
      }
    }
    setTimeout(type, 1500);
  }

  /* ───────── 4d. BENEFITS IMAGE — REVELACIÓN CON ZOOM + FLOTACIÓN ───────── */
  function benefitsImageReveal() {
    const img = el('.benefits__image');
    if (!img) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.classList.remove('animate--right');
          anime({
            targets: img,
            opacity: [0, 1],
            scale: [0.9, 1],
            translateX: [40, 0],
            duration: 800,
            easing: 'easeOutExpo',
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(img);
  }

  /* ───────── 4e. BENEFITS IMAGE — HOVER ZOOM SUTIL ───────── */
  function benefitsImageHover() {
    const img = el('.benefits__image');
    if (!img) return;
    img.addEventListener('mouseenter', () => {
      anime({
        targets: img,
        scale: [1, 1.03],
        duration: 400,
        easing: 'easeOutQuad',
      });
    });
    img.addEventListener('mouseleave', () => {
      anime({
        targets: img,
        scale: [1.03, 1],
        duration: 400,
        easing: 'easeOutQuad',
      });
    });
  }

  /* ───────── 4f. TEAM IMAGE — REVELACIÓN CON EFECTO DE APERTURA ───────── */
  function teamImageReveal() {
    const img = el('.team__image');
    if (!img) return;
    const container = img.closest('.team__photo');
    if (!container) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: container,
            opacity: [0, 1],
            scale: [0.95, 1],
            duration: 700,
            easing: 'easeOutExpo',
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    container.style.opacity = '0';
    obs.observe(container);
  }

  /* ───────── 4g. TEAM IMAGE — HOVER CON BRILLO ───────── */
  function teamImageHover() {
    const img = el('.team__image');
    if (!img) return;
    img.addEventListener('mouseenter', () => {
      anime({
        targets: img,
        filter: ['brightness(1)', 'brightness(1.06) contrast(1.04)'],
        duration: 400,
        easing: 'easeOutQuad',
      });
    });
    img.addEventListener('mouseleave', () => {
      anime({
        targets: img,
        filter: ['brightness(1.06) contrast(1.04)', 'brightness(1) contrast(1)'],
        duration: 400,
        easing: 'easeOutQuad',
      });
    });
  }

  /* ───────── 5. CONTADORES CON REBOTE ELÁSTICO ───────── */
  function counterElastic() {
    onVisibleEach('[data-counter]', (el) => {
      const target = parseFloat(el.dataset.target) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const hasDecimal = target % 1 !== 0;
      anime({
        targets: el,
        innerHTML: [0, target],
        round: hasDecimal ? 1 : 0,
        duration: 2500,
        delay: 200,
        easing: 'easeOutElastic(1, .6)',
        update: (anim) => {
          const val = anim.animations[0].currentValue;
          el.textContent = (hasDecimal ? parseFloat(val).toFixed(1) : Math.floor(val).toString()) + suffix;
        },
        complete: () => {
          el.textContent = target.toString() + suffix;
          anime({
            targets: el,
            filter: ['brightness(2)', 'brightness(1)'],
            duration: 600,
            easing: 'easeOutQuad',
          });
          const rect = el.getBoundingClientRect();
          burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        },
      });
    }, 0.4);
  }

  /* ───────── 5b. COUNTER — VANILLA JS FALLBACK (si anime.js no carga) ───────── */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target') || el.innerText);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  function vanillaCounterFallback() {
    if (typeof anime !== 'undefined') return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
  }

  /* ───────── 6. SERVICE CARDS — STAGGER + HOVER WAVE ───────── */
  function serviceCardsAnime() {
    onVisibleEach('.services-grid', (container) => {
      const cards = container.querySelectorAll('.service-card');
      cards.forEach(c => c.classList.remove('animate'));
      anime({
        targets: cards,
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 600,
        delay: anime.stagger(120),
        easing: 'easeOutQuad',
      });
    });

    els('.service-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.service-card__icon');
        if (icon) {
          anime({
            targets: icon,
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
            duration: 600,
            easing: 'easeOutQuad',
          });
        }
        anime({
          targets: card,
          boxShadow: [
            '0 4px 12px rgba(0,0,0,0.1)',
            '0 8px 40px rgba(225,29,46,0.3)',
          ],
          duration: 400,
          easing: 'easeOutQuad',
        });
      });
    });
  }

  /* ───────── 7. BENEFIT ITEMS — ICONOS CON ROTACIÓN 3D ───────── */
  function benefitIcons3d() {
    els('.benefit-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('.benefit-item__icon');
        if (!icon) return;
        anime({
          targets: icon,
          rotateY: [0, 360],
          scale: [1, 1.15, 1],
          duration: 700,
          easing: 'easeOutQuad',
        });
      });
    });
  }

  /* ───────── 8. TESTIMONIALS — ESTRELLAS BRILLAN ───────── */
  function testimonialStarsGlow() {
    onVisibleEach('.testimonial__stars', (container) => {
      const stars = container.querySelectorAll('.testimonial__star--filled');
      anime({
        targets: stars,
        opacity: [0, 1],
        scale: [0, 1],
        duration: 400,
        delay: anime.stagger(100),
        easing: 'easeOutBack',
      });
    }, 0.3);
  }

  /* ───────── 9. CTA BANNER — LÍNEAS DE ESCANEO ───────── */
  function ctaScanEffect() {
    const banner = el('.cta-banner');
    if (!banner) return;
    const scanLine = document.createElement('div');
    scanLine.className = 'cta-scanline';
    banner.appendChild(scanLine);
    anime({
      targets: scanLine,
      top: ['0%', '100%'],
      duration: 3000,
      loop: true,
      easing: 'linear',
    });
  }

  /* ───────── 10. TIMELINE — DOTS PULSANTES ───────── */
  function timelinePulse() {
    onVisibleEach('.timeline__dot', (dot) => {
      anime({
        targets: dot,
        scale: [1, 1.3, 1],
        boxShadow: [
          '0 2px 12px rgba(225,29,46,0.3)',
          '0 4px 24px rgba(225,29,46,0.6)',
          '0 2px 12px rgba(225,29,46,0.3)',
        ],
        duration: 1200,
        loop: true,
        easing: 'easeInOutSine',
      });
    }, 0.3);
  }

  /* ───────── 11. PROCESS STEPS ───────── */
  function processReveal() {
    staggerReveal('.process', '.process__step', { delay: 150, y: 40 });
  }

  /* ───────── 12. GUARANTEE CARDS ───────── */
  function guaranteeEntrance() {
    staggerReveal('.guarantee', '.guarantee__item', { delay: 100, y: 30 });
  }

  /* ───────── 13. VALUE CARDS ───────── */
  function valuesEntrance() {
    staggerReveal('.values', '.value-card', { delay: 120, y: 30 });
  }

  /* ───────── 14. TEAM MEMBERS ───────── */
  function teamEntrance() {
    staggerReveal('.team', '.team__member', { delay: 100, y: 30 });
  }

  /* ───────── 15. CERTIFICATIONS ───────── */
  function certsEntrance() {
    staggerReveal('.certifications', '.certifications__item', { delay: 100, y: 30 });
  }

  /* ───────── 16. FORM BOTÓN CON PARTÍCULAS ───────── */
  function formButtonEffect() {
    const btn = el('.form__submit');
    if (!btn) return;
    btn.addEventListener('mouseenter', () => {
      anime({
        targets: btn,
        scale: [1, 1.03],
        boxShadow: ['0 4px 15px rgba(225,29,46,0.3)', '0 8px 30px rgba(225,29,46,0.5)'],
        duration: 300,
        easing: 'easeOutQuad',
      });
    });
    btn.addEventListener('mouseleave', () => {
      anime({
        targets: btn,
        scale: [1.03, 1],
        boxShadow: ['0 8px 30px rgba(225,29,46,0.5)', '0 4px 15px rgba(225,29,46,0.3)'],
        duration: 300,
        easing: 'easeOutQuad',
      });
    });
    btn.addEventListener('click', function onClick(e) {
      if (btn.disabled) return;
      const rect = btn.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 8; i++) {
        const dot = document.createElement('span');
        dot.className = 'form-particle';
        dot.style.left = cx + 'px';
        dot.style.top = cy + 'px';
        btn.appendChild(dot);
        const angle = (i / 8) * Math.PI * 2;
        const dist = anime.random(40, 80);
        anime({
          targets: dot,
          translateX: Math.cos(angle) * dist,
          translateY: Math.sin(angle) * dist,
          opacity: [1, 0],
          scale: [1, 0],
          duration: 600,
          easing: 'easeOutQuad',
          complete: () => dot.remove(),
        });
      }
    });
  }

  /* ───────── 17. CONTACT CARDS HOVER ───────── */
  function contactCardHover() {
    els('.contact__card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.contact__card-icon');
        if (icon) {
          anime({
            targets: icon,
            scale: [1, 1.15],
            rotate: [0, -5, 5, 0],
            duration: 500,
            easing: 'easeOutQuad',
          });
        }
      });
    });
  }

  /* ───────── 18. SERVICIO DETALLE ───────── */
  function serviceDetailReveal() {
    onVisibleEach('.service-detail', (el) => {
      el.classList.remove('animate');
      anime({
        targets: el,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 700,
        easing: 'easeOutQuad',
      });
    });
  }

  /* ───────── 19. TABLAS CON STAGGER ───────── */
  function tableStagger() {
    onVisibleEach('.table-wrap', (wrap) => {
      wrap.classList.remove('animate');
      const rows = wrap.querySelectorAll('tbody tr');
      anime({
        targets: rows,
        opacity: [0, 1],
        translateX: [20, 0],
        duration: 400,
        delay: anime.stagger(80),
        easing: 'easeOutQuad',
      });
    });
  }

  /* ───────── 20. FOOTER SOCIAL LINKS ───────── */
  function footerSocialEntrance() {
    staggerReveal('.footer__social', '.footer__social-link', { delay: 100, y: 15 });
  }

  /* ───────── 20b. SCROLL PARALLAX — secciones dark ───────── */
  function scrollParallax() {
    const sections = document.querySelectorAll('.section--dark');
    if (!sections.length) return;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + window.innerHeight * 0.3;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY > top && scrollY < top + height) {
          const progress = (scrollY - top) / height;
          section.style.backgroundPositionY = `${progress * 30}px`;
        }
      });
    }, { passive: true });
  }

  /* ───────── 20c. TABLA ROW HOVER GLOW ───────── */
  function tableRowGlow() {
    document.querySelectorAll('.feature-table tbody tr').forEach(row => {
      row.addEventListener('mouseenter', () => {
        anime({
          targets: row,
          backgroundColor: ['rgba(225,29,46,0)', 'rgba(225,29,46,0.03)'],
          duration: 300,
          easing: 'easeOutQuad',
        });
      });
    });
  }

  /* ═══════════════════════════════════════
     ANIMACIONES 3D INTERACTIVAS
     ═══════════════════════════════════════ */

  /* ───────── 21. 3D TILT EN TARJETAS (service, value, guarantee, team) ───────── */
  function cardTilt3D() {
    const selectors = '.service-card, .value-card, .guarantee__item, .team__member, .certifications__item, .benefit-item';
    els(selectors).forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * -12;
        const tiltY = (x - 0.5) * 12;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease-out';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.4s ease-out';
      });
    });
  }

  /* ───────── 22. PARALLAX 3D EN HERO VISUAL ───────── */
  function parallax3D() {
    const visual = el('.hero__visual');
    if (!visual) return;
    visual.addEventListener('mousemove', (e) => {
      const rect = visual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      visual.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${y * -6}deg)`;
      visual.style.transition = 'transform 0.15s ease-out';
    });
    visual.addEventListener('mouseleave', () => {
      visual.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
      visual.style.transition = 'transform 0.5s ease-out';
    });
  }

  /* ───────── 23. 3D FLOATING ORB EN SECCIÓN DARK ───────── */
  function floatingOrbs3D() {
    const darkSections = els('.section--dark, .cta-banner');
    darkSections.forEach((section) => {
      const orbs = section.querySelectorAll('.hero__orb');
      if (!orbs.length) return;
      section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        orbs.forEach((orb, i) => {
          const factor = (i + 1) * 10;
          orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
          orb.style.transition = 'transform 0.3s ease-out';
        });
      });
      section.addEventListener('mouseleave', () => {
        orbs.forEach((orb) => {
          orb.style.transform = 'translate(0, 0)';
          orb.style.transition = 'transform 0.8s ease-out';
        });
      });
    });
  }

  /* ───────── 24. NAVBAR 3D — SOMBRA DINÁMICA ───────── */
  function navTilt3D() {
    const nav = el('.nav');
    if (!nav) return;
    nav.addEventListener('mousemove', (e) => {
      const rect = nav.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      nav.style.boxShadow = `0 2px 30px rgba(0,0,0,${0.2 + Math.abs(x) * 0.3})`;
      nav.style.transition = 'box-shadow 0.1s ease-out';
    });
    nav.addEventListener('mouseleave', () => {
      nav.style.boxShadow = '';
      nav.style.transition = 'box-shadow 0.4s ease-out';
    });
  }

  /* ═══════════════════════════════════════
     ANIMACIONES GRANDES / DRAMÁTICAS
     ═══════════════════════════════════════ */

  /* ───────── 26. ONDAS DE PULSO EXPANSIVAS ───────── */
  function pulseWaveEffect() {
    const hero = el('#hero');
    if (!hero) return;

    const colors = [
      'rgba(225, 29, 46, 0.12)',
      'rgba(0, 184, 132, 0.10)',
      'rgba(225, 29, 46, 0.06)',
    ];

    colors.forEach((color, i) => {
      const ring = document.createElement('div');
      ring.className = 'pulse-ring';
      ring.style.borderColor = color;
      hero.appendChild(ring);

      const maxSize = Math.max(hero.offsetWidth, hero.offsetHeight) * 1.8;
      anime({
        targets: ring,
        width: [0, maxSize],
        height: [0, maxSize],
        opacity: [0.8, 0],
        duration: 5000,
        delay: i * 1600,
        loop: true,
        easing: 'easeOutCubic',
        update: (anim) => {
          const s = anim.animations[0].currentValue;
          ring.style.left = `calc(50% - ${s / 2}px)`;
          ring.style.top = `calc(50% - ${s / 2}px)`;
        },
      });
    });
  }

  /* ═══════════════════════════════════════
     NUEVOS COMPONENTES — GRANDES IDEAS
     ═══════════════════════════════════════ */

  /* ───────── B. BARRA DE PROGRESO ───────── */
  function scrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    document.body.appendChild(bar);
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ───────── C. VOLVER ARRIBA ───────── */
  function backToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="4 13 10 7 16 13"/></svg>';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    let ticking = false;
    function check() {
      if (!ticking) {
        requestAnimationFrame(() => {
          btn.classList.toggle('visible', window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ───────── D. SVGs QUE SE DIBUJAN SOLOS ───────── */
  function svgDraw() {
    document.querySelectorAll('.service-detail__visual svg').forEach(svg => {
      const paths = svg.querySelectorAll('[stroke]:not([stroke="none"])');
      const valid = Array.from(paths).filter(p => p.getTotalLength && p.getTotalLength() > 0);
      if (!valid.length) return;

      valid.forEach(p => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.dataset.len = len;
      });

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const targets = entry.target.querySelectorAll('[stroke]:not([stroke="none"])');
            const validTargets = Array.from(targets).filter(t => parseFloat(t.dataset.len) > 0);
            if (validTargets.length) {
              anime({
                targets: validTargets,
                strokeDashoffset: [el => el.dataset.len, 0],
                duration: 2500,
                delay: anime.stagger(30),
                easing: 'easeOutQuad',
              });
            }
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      obs.observe(svg);
    });
  }

  /* ───────── E. EFECTO SPRAY AL MOUSE ───────── */
  function mouseSpray() {
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
      if (!ticking) {
    requestAnimationFrame(() => {
      const p = document.createElement('div');
      p.className = 'mouse-particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX + (Math.random() - 0.5) * 20}px;top:${e.clientY + (Math.random() - 0.5) * 20}px;background:rgba(225,29,46,${Math.random() * 0.4 + 0.2})`;
      document.body.appendChild(p);
      anime({
        targets: p,
        translateX: (Math.random() - 0.5) * 30,
        translateY: (Math.random() - 0.5) * 30 - 10,
        opacity: [0.5, 0],
        scale: [1, 0],
        duration: 400 + Math.random() * 200,
        easing: 'easeOutQuad',
        complete: () => p.remove(),
      });
      ticking = false;
    });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ───────── F. CONFETI EN CONTADORES ───────── */
  function burstConfetti(x, y) {
    const colors = ['#E11D2E', '#00B884', '#FF5566', '#FFB020', '#FFFFFF'];
    for (let i = 0; i < 24; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const w = Math.random() * 6 + 4;
      const h = Math.random() * 6 + 4;
      piece.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${colors[Math.floor(Math.random() * colors.length)]}`;
      document.body.appendChild(piece);
      const angle = Math.random() * Math.PI * 2;
      const dist = anime.random(60, 200);
      anime({
        targets: piece,
        translateX: Math.cos(angle) * dist,
        translateY: Math.sin(angle) * dist + 150,
        rotate: anime.random(-360, 360),
        opacity: [1, 0],
        duration: anime.random(1000, 2000),
        easing: 'easeOutQuad',
        complete: () => piece.remove(),
      });
    }
  }

  /* ───────── G. LOADER DE ENTRADA ───────── */
  function pageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    const logo = loader.querySelector('.page-loader__logo');
    if (!logo) return;
    const anim = anime({
      targets: logo,
      scale: [1, 1.15, 1],
      rotate: [0, 5, -5, 0],
      duration: 1400,
      loop: true,
      easing: 'easeInOutSine',
    });
    const obs = new MutationObserver(() => {
      if (!document.body.contains(logo)) {
        anim.pause();
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════
     NAVBAR — CAMBIO DE COLOR POR SCROLL
     ═══════════════════════════════════════ */

  /* ───────── 27. COLOR DINÁMICO DEL NAVBAR ───────── */
  function navColorOnScroll() {
    const nav = el('.nav');
    if (!nav) return;

    const navLinks = nav.querySelectorAll('.nav__link');
    const logoText = nav.querySelector('.nav__logo-text');
    const goldSpan = nav.querySelector('.nav__logo-text span');
    const navCta = nav.querySelector('.nav__cta');
    let currentIsDark = true;

    function applyTheme(isDark) {
      if (isDark === currentIsDark) return;
      currentIsDark = isDark;

      const color = isDark ? '#FFFFFF' : '#0A0A0A';
      navLinks.forEach(l => l.style.color = color);
      if (logoText) logoText.style.color = color;
      if (goldSpan) goldSpan.style.color = 'var(--color-gold)';
      if (navCta) {
        navCta.style.color = '#FFFFFF';
        navCta.style.background = 'var(--gradient-red)';
      }

      if (nav.classList.contains('nav--scrolled')) {
        nav.style.backgroundColor = isDark ? 'rgba(10, 10, 10, 0.92)' : 'rgba(255, 255, 255, 0.95)';
        nav.style.borderBottom = isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.06)';
      }
    }

    function getSections() {
      const list = [];
      document.querySelectorAll('#hero, .hero-secondary, .section--dark, .cta-banner, .footer')
        .forEach(el => list.push({ el, d: true }));
      document.querySelectorAll('.section--light')
        .forEach(el => list.push({ el, d: false }));
      document.querySelectorAll('.section:not(#hero):not(.hero-secondary):not(.section--dark):not(.section--light):not(.cta-banner):not(.footer)')
        .forEach(el => list.push({ el, d: false }));
      return list;
    }

    function update() {
      const sections = getSections();
      sections.sort((a, b) => a.el.offsetTop - b.el.offsetTop);
      const scrollY = window.scrollY + 100;
      let isDark = true;
      for (const s of sections) {
        if (scrollY >= s.el.offsetTop) isDark = s.d;
        else break;
      }
      applyTheme(isDark);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ═══════════════════════════════════════
     FEATURES PREMIUM — MODAL, FAQ, COOKIE, ETC
     ═══════════════════════════════════════ */

  /* ───────── H. SERVICE MODAL ───────── */
  function serviceModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal"><button class="modal__close" aria-label="Cerrar"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 5 L15 15 M15 5 L5 15"/></svg></button><div class="modal__body"></div></div>';
    document.body.appendChild(overlay);
    const body = overlay.querySelector('.modal__body');
    const close = overlay.querySelector('.modal__close');

    close.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.classList.remove('active'); });

    /* El modal es un extra: se abre al tocar la tarjeta, pero el enlace
       "Ver más →" navega de verdad a services.html#ancla. Interceptarlo
       rompía la navegación interna y el enlazado interno para SEO. */
    els('.service-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;

        const title = card.querySelector('.service-card__title')?.textContent || 'Servicio';
        const desc = card.querySelector('.service-card__desc')?.textContent || '';
        const iconHTML = card.querySelector('.service-card__icon')?.innerHTML || '';
        const features = card.querySelectorAll('.service-detail__feature') || [];
        let featuresHTML = '';
        if (features.length) {
          featuresHTML = '<div class="modal__features">';
          features.forEach(f => featuresHTML += `<div class="modal__feature">${f.innerHTML}</div>`);
          featuresHTML += '</div>';
        } else {
          featuresHTML = `
            <div class="modal__features">
              <div class="modal__feature"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 9 7 13 15 5"/></svg><span>Profesionales certificados</span></div>
              <div class="modal__feature"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 9 7 13 15 5"/></svg><span>Productos eco-amigables</span></div>
              <div class="modal__feature"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 9 7 13 15 5"/></svg><span>Garantía de resultados</span></div>
            </div>`;
        }
        const detalleHref = card.querySelector('.service-card__link')?.getAttribute('href') || 'services.html';
        const waMsg = encodeURIComponent(`Hola, quiero una cotización de ${title} en Cali.`);

        body.innerHTML = `
          <div class="modal__icon">${iconHTML}</div>
          <h3 class="modal__title">${title}</h3>
          <p class="modal__desc">${desc}</p>
          ${featuresHTML}
          <a href="https://wa.me/573147781700?text=${waMsg}" target="_blank" rel="noopener" class="btn btn--whatsapp modal__cta">Cotizar por WhatsApp</a>
          <a href="${detalleHref}" class="btn btn--secondary-dark modal__cta" style="margin-top:.625rem;">Ver detalles del servicio</a>
        `;
        overlay.classList.add('active');
        anime({
          targets: '.modal__icon',
          scale: [0, 1],
          rotate: [180, 0],
          duration: 500,
          easing: 'easeOutBack',
        });
      });
    });
  }

  /* ───────── I. FAQ ACCORDION ───────── */
  function faqAccordion() {
    els('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isActive = item.classList.contains('active');
        els('.faq-item.active').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          item.classList.add('active');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ───────── J. COOKIE CONSENT ───────── */
  function cookieConsent() {
    if (localStorage.getItem('cookiesAccepted')) return;
    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.innerHTML = `
      <p>Usamos cookies para mejorar tu experiencia. Al continuar navegando aceptas nuestra <a href="#">política de privacidad</a>.</p>
      <button class="cookie-consent__btn">Aceptar</button>
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('show'), 500);
    banner.querySelector('.cookie-consent__btn').addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      banner.style.transform = 'translateY(100%)';
      setTimeout(() => banner.remove(), 500);
    });
  }

  /* ───────── K. PAGE TRANSITIONS ───────── */
  function pageTransition() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.innerHTML = '<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="#E11D2E" stroke-width="2.5" fill="none"/><path d="M20 8 L20 14 M20 26 L20 32 M8 20 L14 20 M26 20 L32 20" stroke="#E11D2E" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="20" r="4" fill="#E11D2E"/></svg>';
    document.body.appendChild(overlay);

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.startsWith('javascript:')) return;
      if (a.hasAttribute('target')) return;
      if (href.startsWith('#') || href.startsWith('http') || href.startsWith('https://wa.me')) return;
      if (!href.endsWith('.html') && !href.endsWith('/')) return;
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 500);
    });
  }

  /* ───────── L. MAGNETIC BUTTONS ───────── */
  function magneticButtons() {
    els('.btn, .nav__cta, .whatsapp-float, .back-to-top').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.3s ease-out';
        setTimeout(() => { btn.style.transition = ''; }, 300);
      });
    });
  }

  /* ───────── INIT ───────── */

  function initAnimations() {
    /* específicas */
    logoPulse();
    heroFumigationFog();
    pulseWaveEffect();
    heroTextStagger();
    heroVisualReveal();
    heroImageFloat();
    heroImageHover();
    heroTyping();
    benefitsImageReveal();
    benefitsImageHover();
    teamImageReveal();
    teamImageHover();
    counterElastic();
    vanillaCounterFallback();
    serviceCardsAnime();
    benefitIcons3d();
    testimonialStarsGlow();
    ctaScanEffect();
    timelinePulse();
    processReveal();
    guaranteeEntrance();
    valuesEntrance();
    teamEntrance();
    certsEntrance();
    formButtonEffect();
    contactCardHover();
    serviceDetailReveal();
    tableStagger();
    footerSocialEntrance();

    /* 3D interactivas */
    cardTilt3D();
    parallax3D();
    floatingOrbs3D();
    navTilt3D();

    /* nuevos componentes grandes */
  scrollProgress();
  backToTop();
  svgDraw();
  mouseSpray();
  pageLoader();
  scrollParallax();
  tableRowGlow();

    /* general: elementos .animate que no tienen handler específico */
    observeElements('.animate');
    observeElements('.animate--left', 'visible');
    observeElements('.animate--right', 'visible');
    observeElements('.animate--scale', 'visible');
    observeElements('.animate--up', 'visible');

    /* color dinámico del navbar */
    navColorOnScroll();

    /* features premium: modales, FAQ, cookie, transiciones, imán */
    serviceModal();
    faqAccordion();
    cookieConsent();
    pageTransition();
    magneticButtons();

    /* Red de seguridad: si las animaciones no terminan en 2.6s,
       forzar visibilidad de contenido crítico */
    safetyNetTimeout();
  }

  /* ───────── SAFETY NET ───────── */
  function safetyNetTimeout() {
    const CRITICAL_SELECTORS = [
      '.hero__title',
      '.hero__badge',
      '.hero__actions',
      '.hero__proof',
      '.hero__visual',
      '.hero__subtitle',
      '.counter__number'
    ];
    setTimeout(function() {
      CRITICAL_SELECTORS.forEach(function(sel) {
        var els = document.querySelectorAll(sel);
        els.forEach(function(el) { el.classList.add('force-visible'); });
      });
      var title = document.querySelector('.hero__title');
      if (title) title.classList.remove('hero__title--animating');
    }, 2600);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initAnimations };
  } else {
    window.initAnimations = initAnimations;
  }

})();
