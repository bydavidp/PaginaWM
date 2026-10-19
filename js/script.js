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

    /* La tarjeta activa se enfoca; las demás pierden opacidad y blur
       para dar sensación de profundidad al cambiar. */
    slides.forEach((slide, i) => {
      const activo = i === currentIndex;
      slide.classList.toggle('testimonial--active', activo);
      slide.setAttribute('aria-hidden', activo ? 'false' : 'true');
    });

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
  track.addEventListener('focusin', stopAutoplay, { passive: true });
  track.addEventListener('focusout', startAutoplay, { passive: true });

  goTo(0);
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
          statusEl.innerHTML = '¡Solicitud enviada con éxito! Te contactaremos pronto. ' +
            '<a href="https://wa.me/573147781700?text=Hola%2C%20acabo%20de%20enviar%20el%20formulario%20y%20quiero%20respuesta%20inmediata" ' +
            'target="_blank" rel="noopener">¿Quieres respuesta inmediata? Escríbenos por WhatsApp</a>';
        }
        document.dispatchEvent(new CustomEvent('formulario:enviado'));
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
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });
    }
  });
}

/* ══ COTIZADOR AUTOMÁTICO ══ */

const COTIZADOR_WHATSAPP = 'https://wa.me/573147781700?text=';

function initCotizador() {
  const tipos = Array.from(document.querySelectorAll('input[name="cot-tipo"]'));
  const metros = document.getElementById('cot-metros');
  const metrosRange = document.getElementById('cot-metros-range');
  const urgente = document.getElementById('cot-urgente');
  const garantia = document.getElementById('cot-garantia');
  const calcular = document.getElementById('cot-calcular');
  const resultado = document.getElementById('cot-resultado');
  const precioEl = document.getElementById('cot-precio');
  const detalle = document.getElementById('cot-detalle');
  const waBtn = document.getElementById('cot-wa-btn');
  const estado = document.getElementById('cot-estado');

  if (!tipos.length || !metros || !calcular || !precioEl || !resultado) return;

  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let precioMostrado = 0;
  let animacionPrecio = null;

  function formatear(valor) {
    return '$' + Math.round(valor).toLocaleString('es-CO');
  }

  function calcPrecio() {
    const selec = tipos.find((tipo) => tipo.checked);
    const base = selec ? parseInt(selec.dataset.precio, 10) || 0 : 0;
    const nombre = selec ? (selec.dataset.nombre || selec.value) : 'Sin seleccionar';
    const m = Math.max(20, Math.min(2000, parseInt(metros.value, 10) || 100));
    const factorMetros = Math.max(1, m / 100);
    const extraUrgente = urgente?.checked ? 30000 : 0;
    const extraGarantia = garantia?.checked ? 25000 : 0;
    const total = Math.round((base * factorMetros) + extraUrgente + extraGarantia);
    return { total, base, factorMetros, m, extraUrgente, extraGarantia, nombre };
  }

  /* Anima el número del precio para que el cambio se sienta vivo.
     Cancela la animación anterior para que un cambio rápido de servicio
     no deje un precio viejo escrito en pantalla. */
  function pintarPrecio(total, animar) {
    if (animacionPrecio) {
      animacionPrecio.pause();
      animacionPrecio = null;
    }

    if (!animar || movimientoReducido || typeof anime !== 'function' || !precioMostrado) {
      precioMostrado = total;
      precioEl.textContent = formatear(total);
      return;
    }

    const desde = precioMostrado;
    animacionPrecio = anime({
      targets: { valor: desde },
      valor: total,
      duration: 550,
      easing: 'easeOutCubic',
      update: (anim) => {
        precioEl.textContent = formatear(anim.animations[0].currentValue);
      },
      complete: () => {
        precioMostrado = total;
        precioEl.textContent = formatear(total);
        animacionPrecio = null;
      }
    });
  }

  function actualizar({ animar = false } = {}) {
    const data = calcPrecio();

    if (!data.base) {
      resultado.style.display = 'none';
      waBtn.href = '#';
      return;
    }

    resultado.style.display = 'flex';
    pintarPrecio(data.total, animar);

    detalle.innerHTML = `
      <div><strong>${data.nombre}</strong></div>
      <div>${data.m} m² · base ${formatear(data.base)} por cada 100 m²</div>
      ${data.extraUrgente ? '<div>+ Urgente hoy: $30.000</div>' : ''}
      ${data.extraGarantia ? '<div>+ Garantía extendida: $25.000</div>' : ''}
      <div class="cotizador__nota">Precio estimado. El valor final se confirma con una inspección gratuita.</div>
    `;

    const lineas = [
      'Hola, quiero una cotización de fumigación en Cali.',
      `Servicio: ${data.nombre}`,
      `Área aproximada: ${data.m} m²`,
      `Precio estimado: ${formatear(data.total)}`,
      data.extraUrgente ? 'Atención: urgente para hoy' : '',
      data.extraGarantia ? 'Incluir garantía extendida' : '',
      '¿Podemos agendar una visita?'
    ].filter(Boolean);

    waBtn.href = COTIZADOR_WHATSAPP + encodeURIComponent(lineas.join('\n'));
  }

  tipos.forEach((tipo) => {
    tipo.addEventListener('change', () => actualizar({ animar: true }));
  });

  metros.addEventListener('input', () => {
    metrosRange.value = metros.value;
    actualizar();
  });

  metrosRange.addEventListener('input', () => {
    metros.value = metrosRange.value;
    actualizar();
  });

  urgente?.addEventListener('change', () => actualizar({ animar: true }));
  garantia?.addEventListener('change', () => actualizar({ animar: true }));

  calcular.addEventListener('click', () => {
    const data = calcPrecio();

    if (!data.base) {
      if (estado) estado.textContent = 'Selecciona un servicio para calcular tu cotización.';
      return;
    }

    actualizar({ animar: true });
    resultado.classList.add('cotizador__resultado--ready');

    if (estado) {
      estado.textContent = '¡Listo! Abrimos WhatsApp con tu cotización en un clic.';
    }

    document.dispatchEvent(new CustomEvent('cotizador:calcular', { detail: data }));

    /* Abre WhatsApp desde el gesto del usuario. Si el navegador lo bloquea,
       el botón verde de abajo sigue funcionando como respaldo. */
    window.setTimeout(() => {
      window.open(waBtn.href, '_blank', 'noopener');
    }, movimientoReducido ? 80 : 450);
  });

  actualizar();
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

  function pausarVideo(item) {
    const v = item.querySelector('.galeria__video');
    if (v && !v.paused) v.pause();
    item.classList.remove('is-playing');
  }

  /* Los posters de los videos pesan ~120 KB y están bajo el pliegue:
     se asignan solo cuando el usuario se acerca a la galería. */
  const videosConPoster = Array.from(document.querySelectorAll('video[data-poster]'));
  if (videosConPoster.length) {
    const cargarPoster = (video) => {
      if (!video.dataset.poster) return;
      video.poster = video.dataset.poster;
      video.removeAttribute('data-poster');
    };

    if ('IntersectionObserver' in window) {
      const obsPoster = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          cargarPoster(entry.target);
          obsPoster.unobserve(entry.target);
        });
      }, { rootMargin: '400px 0px' });
      videosConPoster.forEach((video) => obsPoster.observe(video));
    } else {
      videosConPoster.forEach(cargarPoster);
    }
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
      const visibles = [];

      items.forEach(item => {
        const visible = filter === 'all' || item.dataset.categoria === filter;
        if (visible) {
          item.style.display = '';
          visibles.push(item);
        } else {
          pausarVideo(item);
          item.style.display = 'none';
        }
      });

      const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (typeof anime === 'function' && !movimientoReducido) {
        anime.remove(visibles);
        visibles.forEach(item => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(14px) scale(0.94)';
        });
        anime({
          targets: visibles,
          opacity: [0, 1],
          translateY: [14, 0],
          scale: [0.94, 1],
          duration: 520,
          delay: anime.stagger(50),
          easing: 'easeOutCubic',
          complete: () => {
            visibles.forEach(item => {
              item.style.opacity = '';
              item.style.transform = '';
            });
          }
        });
      } else {
        visibles.forEach(item => {
          item.style.opacity = '';
          item.style.transform = '';
        });
      }
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
    const fullImage = img.dataset.full || img.src;
    const selectedFormat = (img.currentSrc || img.src).match(/\.(avif|webp)(?:$|\?)/i);
    lightboxImg.src = selectedFormat
      ? fullImage.replace(/\.(?:jpe?g|png)(?=$|\?)/i, `.${selectedFormat[1]}`)
      : fullImage;
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

/* ══ WHATSAPP CONTEXTUAL ══ */

/**
 * @description Cambia el mensaje pre-armado del botón flotante según la
 * sección que el usuario está viendo. Cada sección declara su mensaje en
 * el atributo data-wa-msg.
 */
function initContextualWhatsApp() {
  const flotante = document.querySelector('.whatsapp-float');
  const movil = document.querySelector('.mobile-cta__btn--wa');
  const secciones = document.querySelectorAll('[data-wa-msg]');

  if ((!flotante && !movil) || !secciones.length) return;

  const base = 'https://wa.me/573147781700?text=';
  let mensajeActual = '';

  function aplicar(mensaje) {
    if (!mensaje || mensaje === mensajeActual) return;
    mensajeActual = mensaje;
    const url = base + encodeURIComponent(mensaje);
    if (flotante) flotante.href = url;
    if (movil) movil.href = url;
  }

  if (!('IntersectionObserver' in window)) {
    aplicar(secciones[0].dataset.waMsg);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) aplicar(entry.target.dataset.waMsg);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  secciones.forEach((seccion) => observer.observe(seccion));
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
  initContextualWhatsApp();

  if (typeof initAnimations === 'function') {
    const revealContent = () => {
      document.querySelectorAll('.animate, .animate--left, .animate--right, .animate--scale, .animate--up')
        .forEach((el) => el.classList.add('visible'));
    };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || typeof anime === 'function' || window.animeLoadState === 'failed') {
      initAnimations();
    } else {
      let initialized = false;
      const initialize = () => {
        if (initialized) return;
        initialized = true;
        window.removeEventListener('animejsready', initialize);
        window.removeEventListener('animejsfailed', initialize);
        initAnimations();
      };
      revealContent();
      window.addEventListener('animejsready', initialize, { once: true });
      window.addEventListener('animejsfailed', initialize, { once: true });
      window.setTimeout(initialize, 4000);
    }
  }

  /* ocultar loader después de inicializar todo */
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 520);
    }
  }, 300);
}

document.addEventListener('DOMContentLoaded', init);
