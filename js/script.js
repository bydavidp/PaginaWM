/* ═══════════════════════════════════════
   CONTROL DE PLAGAS — SCRIPT.JS
   Navegación, testimonios, formularios, init
   ═══════════════════════════════════════ */

/* ══ HAMBURGER MENU ══ */

/**
 * @description Inicializa el menú hamburguesa para móvil
 */
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__links');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('nav__links--open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  document.addEventListener('click', (e) => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (!isOpen) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('nav__links--open');
      document.body.style.overflow = '';
    }
  });

  const links = menu.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('nav__links--open');
      document.body.style.overflow = '';
    });
  });
}

/* ══ TESTIMONIALS CAROUSEL ══ */

/**
 * @description Inicializa el carrusel de testimonios con auto-rotación
 */
function initTestimonials() {
  const track = document.querySelector('.testimonials__track');
  const prevBtn = document.querySelector('.testimonials__btn--prev');
  const nextBtn = document.querySelector('.testimonials__btn--next');
  const dotsContainer = document.querySelector('.testimonials__dots');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial');
  const total = slides.length;
  let currentIndex = 0;
  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 5000;

  if (!total) return;

  function goTo(index) {
    currentIndex = ((index % total) + total) % total;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.testimonials__dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('testimonials__dot--active', i === currentIndex);
      });
    }
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials__dot';
      dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
      if (i === 0) dot.classList.add('testimonials__dot--active');
      dot.addEventListener('click', () => {
        goTo(i);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      startAutoplay();
    });
  }

  track.addEventListener('mouseenter', stopAutoplay, { passive: true });
  track.addEventListener('mouseleave', startAutoplay, { passive: true });

  startAutoplay();
}

/* ══ FORM VALIDATION ══ */

/**
 * @description Valida un campo individual y muestra/oculta error
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field
 * @returns {boolean}
 */
function validateField(field) {
  const errorEl = field.parentElement.querySelector('.form__error');
  const value = field.value.trim();
  let isValid = true;
  let message = '';

  field.classList.remove('form__input--error', 'form__select--error', 'form__textarea--error');

  if (field.hasAttribute('required') && !value) {
    isValid = false;
    message = 'Este campo es obligatorio';
  } else if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      message = 'Ingresa un correo electrónico válido';
    }
  } else if (field.id === 'phone' && value) {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      message = 'Ingresa un teléfono válido (7-15 dígitos)';
    }
  }

  if (!isValid) {
    const errorClass =
      field.tagName === 'SELECT' ? 'form__select--error'
      : field.tagName === 'TEXTAREA' ? 'form__textarea--error'
      : 'form__input--error';
    field.classList.add(errorClass);
  }

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.toggle('form__error--visible', !isValid);
  }

  return isValid;
}

/**
 * @description Inicializa validación en tiempo real del formulario
 */
function initFormValidation() {
  const form = document.querySelector('.form');
  if (!form) return;

  const fields = form.querySelectorAll('input, textarea, select');

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('form__input--error') ||
          field.classList.contains('form__textarea--error') ||
          field.classList.contains('form__select--error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let allValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        allValid = false;
      }
    });

    const statusEl = form.querySelector('.form__status');
    const submitBtn = form.querySelector('.form__submit');

    if (!allValid) {
      const firstError = form.querySelector('.form__input--error, .form__textarea--error, .form__select--error');
      if (firstError) firstError.focus();
      return;
    }

    if (statusEl) {
      statusEl.className = 'form__status form__status--visible form__status--loading';
      statusEl.textContent = 'Enviando solicitud...';
    }

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    /* Enviar a Formspree */
    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        if (statusEl) {
          statusEl.className = 'form__status form__status--visible form__status--success';
          statusEl.textContent = '¡Solicitud enviada con éxito! Te contactaremos pronto.';
        }
        form.reset();
        fields.forEach((f) => {
          f.classList.remove('form__input--error', 'form__textarea--error', 'form__select--error');
          const err = f.parentElement.querySelector('.form__error');
          if (err) err.classList.remove('form__error--visible');
        });
      } else {
        throw new Error('Error en el servidor');
      }
    } catch {
      if (statusEl) {
        statusEl.className = 'form__status form__status--visible form__status--error';
        statusEl.textContent = 'Ocurrió un error al enviar. Intenta de nuevo.';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
}

/* ══ ACTIVE NAV LINK ══ */

/**
 * @description Marca el link de navegación activo según la página actual
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop();
  const normalizedPath = (!currentPath || currentPath === '' || currentPath === 'index.html') ? 'index.html' : currentPath;
  const links = document.querySelectorAll('.nav__link');

  links.forEach((link) => {
    link.classList.remove('nav__link--active');
    const href = link.getAttribute('href');
    if (href === normalizedPath) {
      link.classList.add('nav__link--active');
    }
  });
}

/* ══ SMOOTH SCROLL ANCHOR ══ */

/**
 * @description Smooth scroll para anclas internas (#)
 */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ══ COTIZADOR AUTOMÁTICO ══ */

const PRECIOS_BASE = {
  residencial: 80000,
  comercial: 150000,
  roedores: 120000,
  insectos: 90000,
  preventivo: 60000,
  certificado: 100000
};

function initCotizador() {
  const tipo = document.getElementById('cot-tipo');
  const metros = document.getElementById('cot-metros');
  const metrosRange = document.getElementById('cot-metros-range');
  const urgente = document.getElementById('cot-urgente');
  const garantia = document.getElementById('cot-garantia');
  const calcular = document.getElementById('cot-calcular');
  const resultado = document.getElementById('cot-resultado');
  const precioEl = document.getElementById('cot-precio');
  const detalle = document.getElementById('cot-detalle');
  const waBtn = document.getElementById('cot-wa-btn');

  if (!tipo || !metros || !calcular) return;

  function calcPrecio() {
    const selec = tipo.options[tipo.selectedIndex];
    const base = selec ? parseInt(selec.dataset.precio) || 0 : 0;
    const m = parseInt(metros.value) || 100;
    const factorMetros = Math.max(1, m / 100);
    const extraUrgente = urgente?.checked ? 30000 : 0;
    const extraGarantia = garantia?.checked ? 25000 : 0;
    const total = Math.round((base * factorMetros) + extraUrgente + extraGarantia);
    return { total, base, factorMetros, m, extraUrgente, extraGarantia, nombre: selec?.text || 'Sin seleccionar' };
  }

  function actualizar() {
    const data = calcPrecio();
    if (data.base === 0 || !data.base) {
      resultado.style.display = 'none';
      return;
    }
    resultado.style.display = 'flex';
    precioEl.textContent = '$' + data.total.toLocaleString('es-CO');
    detalle.innerHTML = `
      <div>${data.nombre}</div>
      <div>${data.m} m² x $${data.base.toLocaleString('es-CO')}/100m²</div>
      ${data.extraUrgente ? '<div>+ Servicio urgente: $30,000</div>' : ''}
      ${data.extraGarantia ? '<div>+ Garantía extendida: $25,000</div>' : ''}
    `;
    const msg = encodeURIComponent(
      `Hola! Quiero una cotización:%0A` +
      `Servicio: ${data.nombre}%0A` +
      `Metros: ${data.m} m²%0A` +
      `Precio estimado: $${data.total.toLocaleString('es-CO')}%0A` +
      `${data.extraUrgente ? 'Urgente: Sí%0A' : ''}` +
      `${data.extraGarantia ? 'Garantía extendida: Sí%0A' : ''}` +
      `¿Podemos agendar una visita?`
    );
    waBtn.href = `https://w.app/fumigacionesmagistral?text=${msg}`;
  }

  tipo.addEventListener('change', actualizar);
  metros.addEventListener('input', () => { metrosRange.value = metros.value; actualizar(); });
  metrosRange.addEventListener('input', () => { metros.value = metrosRange.value; actualizar(); });
  urgente?.addEventListener('change', actualizar);
  garantia?.addEventListener('change', actualizar);
  calcular.addEventListener('click', actualizar);
}

/* ══ GALERÍA Y LIGHTBOX ══ */

function initGaleria() {
  const filtros = document.querySelectorAll('.galeria__filter-btn');
  const items = Array.from(document.querySelectorAll('.galeria__item'));
  const fotos = items.filter(it => !it.classList.contains('galeria__item--video'));
  const videos = items.filter(it => it.classList.contains('galeria__item--video'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let currentIndex = 0;

  if (!items.length) return;

  /**
   * @description Desvanece un elemento usando anime.js si está disponible
   */
  function fade(el, from, to, done) {
    if (typeof anime === 'function') {
      anime({
        targets: el,
        opacity: [from, to],
        duration: to ? 380 : 220,
        easing: 'easeOutQuad',
        complete: done
      });
    } else {
      el.style.opacity = to;
      if (done) done();
    }
  }

  function pausarVideo(item) {
    const v = item.querySelector('.galeria__video');
    if (v && !v.paused) v.pause();
    item.classList.remove('is-playing');
  }

  /* ── Filtros por categoría ── */
  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filtros.forEach(b => {
        const activo = b === btn;
        b.classList.toggle('galeria__filter-btn--active', activo);
        b.setAttribute('aria-pressed', activo ? 'true' : 'false');
      });
      items.forEach(item => {
        const visible = filter === 'all' || item.dataset.categoria === filter;
        if (visible) {
          item.style.display = '';
          fade(item, 0, 1);
        } else {
          pausarVideo(item);
          fade(item, 1, 0, () => { item.style.display = 'none'; });
        }
      });
    });
  });

  /* ── Videos: reproducir / pausar al hacer clic ── */
  videos.forEach(item => {
    const video = item.querySelector('.galeria__video');
    if (!video) return;
    item.addEventListener('click', () => {
      if (video.paused) {
        videos.forEach(pausarVideo);
        item.classList.add('is-playing');
        const p = video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => item.classList.remove('is-playing'));
        }
      } else {
        pausarVideo(item);
      }
    });
    video.addEventListener('ended', () => item.classList.remove('is-playing'));
  });

  /* ── Lightbox ── */
  if (!lightbox || !lightboxImg) return;

  function fotosVisibles() {
    return fotos.filter(it => it.style.display !== 'none');
  }

  function pintar(item) {
    const img = item.querySelector('.galeria__img');
    if (!img) return;
    lightboxImg.src = img.dataset.full || img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) lightboxCaption.textContent = img.alt;
  }

  function openLightbox(item) {
    const visibles = fotosVisibles();
    const i = visibles.indexOf(item);
    currentIndex = i < 0 ? 0 : i;
    pintar(item);
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }

  function navigate(dir) {
    const visibles = fotosVisibles();
    if (!visibles.length) return;
    currentIndex = (currentIndex + dir + visibles.length) % visibles.length;
    pintar(visibles[currentIndex]);
  }

  fotos.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  document.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
  document.querySelector('.lightbox__nav--prev')?.addEventListener('click', () => navigate(-1));
  document.querySelector('.lightbox__nav--next')?.addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
}

/* ══ INIT ══ */

/**
 * @description Inicializa todas las funcionalidades del sitio
 */
function init() {
  initMobileMenu();
  initTestimonials();
  initFormValidation();
  setActiveNavLink();
  initSmoothScroll();
  initCotizador();
  initGaleria();

  if (typeof initAnimations === 'function') {
    initAnimations();
  }

  /* ocultar loader después de inicializar todo */
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }
  }, 1200);
}

document.addEventListener('DOMContentLoaded', init);
