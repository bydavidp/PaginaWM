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
