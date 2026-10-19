/* ═══════════════════════════════════════
   ANALÍTICA DE CONVERSIÓN
   - Carga GA4 solo si config.js tiene un ID.
   - Mide clics de WhatsApp, llamadas, email, cotizador,
     formulario y profundidad de scroll.
   - No bloquea la carga: es un script defer y no usa cookies
     propias.
   ═══════════════════════════════════════ */
(function () {
  'use strict';

  const config = window.SITE_CONFIG || {};
  const gaId = (config.gaId || '').trim();

  function track(evento, parametros) {
    const datos = parametros || {};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: evento }, datos));
    if (typeof window.gtag === 'function') {
      window.gtag('event', evento, datos);
    }
  }

  /* Disponible para llamadas puntuales desde otros scripts. */
  window.trackEvent = track;

  if (gaId) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { anonymize_ip: true });
  }

  function seccionDe(elemento) {
    const seccion = elemento.closest('section[id], footer, header');
    if (!seccion) return 'sin_seccion';
    return seccion.id || seccion.tagName.toLowerCase();
  }

  document.addEventListener('click', function (evento) {
    const enlace = evento.target.closest('a');
    if (!enlace) return;

    const href = enlace.getAttribute('href') || '';
    const texto = (enlace.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);

    if (/wa\.me|w\.app|whatsapp/i.test(href)) {
      track('whatsapp_click', { seccion: seccionDe(enlace), texto: texto });
    } else if (href.indexOf('tel:') === 0) {
      track('llamar_click', { seccion: seccionDe(enlace) });
    } else if (href.indexOf('mailto:') === 0) {
      track('email_click', { seccion: seccionDe(enlace) });
    }
  }, { passive: true });

  document.addEventListener('cotizador:calcular', function (evento) {
    const datos = evento.detail || {};
    track('cotizador_calcular', {
      servicio: datos.nombre,
      metros: datos.m,
      total: datos.total,
      urgente: !!datos.extraUrgente
    });
  });

  document.addEventListener('formulario:enviado', function () {
    track('formulario_enviado');
  });

  /* Profundidad de scroll: 25, 50, 75 y 100 %. */
  const hitos = [25, 50, 75, 100];
  const vistos = {};
  let pendiente = false;

  function medirScroll() {
    const recorrido = document.documentElement.scrollHeight - window.innerHeight;
    if (recorrido <= 0) return;
    const porcentaje = Math.round((window.scrollY / recorrido) * 100);

    hitos.forEach(function (hito) {
      if (porcentaje >= hito && !vistos[hito]) {
        vistos[hito] = true;
        track('scroll_' + hito);
      }
    });
  }

  window.addEventListener('scroll', function () {
    if (pendiente) return;
    pendiente = true;
    window.requestAnimationFrame(function () {
      medirScroll();
      pendiente = false;
    });
  }, { passive: true });
})();
