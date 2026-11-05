/* ═══════════════════════════════════════
   CONVERSION BOOST — popup exit-intent con oferta
   - Se muestra 1 vez por sesión (sessionStorage) y nunca si ya contactó.
   - Disparadores: cursor sale por arriba (desktop), scroll-up rápido tras 15 s,
     o 45 s de visita sin conversión.
   - Todos los eventos pasan por window.trackEvent (GA4).
   ═══════════════════════════════════════ */
(function () {
  'use strict';

  var WA = (window.SITE_CONFIG && window.SITE_CONFIG.whatsapp) || '573147781700';
  var track = typeof window.trackEvent === 'function' ? window.trackEvent : function () {};
  var KEY = 'wm_exit_intent_v1';
  var mostrado = false;
  var convertido = false;
  var MSG = 'Hola! Vi la oferta del 10% de descuento en su página y quiero cotizar un servicio de fumigación en Cali.';

  try { mostrado = sessionStorage.getItem(KEY) === '1'; } catch (e) {}

  /* Si el usuario ya contactó (WhatsApp, teléfono o email), no molestar. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/wa\.me|w\.app|whatsapp/i.test(href) || href.indexOf('tel:') === 0 || href.indexOf('mailto:') === 0) {
      convertido = true;
      cerrarPopup();
    }
  }, { passive: true });

  var overlay = document.createElement('div');
  overlay.className = 'exit-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Oferta especial por tiempo limitado');
  overlay.innerHTML =
    '<div class="exit-modal__card">' +
      '<button type="button" class="exit-modal__close" aria-label="Cerrar">&times;</button>' +
      '<span class="exit-modal__badge">Solo por esta semana</span>' +
      '<h3 class="exit-modal__title">Espera… <em>10% de descuento</em> en tu primer servicio</h3>' +
      '<p class="exit-modal__text">Cuéntanos qué plaga te está molestando por WhatsApp y agenda hoy mismo. Cupos limitados esta semana en Cali y área metropolitana.</p>' +
      '<a class="exit-modal__cta" href="#" target="_blank" rel="noopener">Quiero mi 10% de descuento</a>' +
      '<button type="button" class="exit-modal__no">No, gracias</button>' +
    '</div>';
  document.body.appendChild(overlay);

  var cta = overlay.querySelector('.exit-modal__cta');
  cta.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(MSG);
  overlay.querySelector('.exit-modal__close').addEventListener('click', function () { cerrarPopup(); track('popup_descuento_cerrado'); });
  overlay.querySelector('.exit-modal__no').addEventListener('click', function () { cerrarPopup(); track('popup_descuento_rechazado'); });
  cta.addEventListener('click', function () { track('popup_descuento_clic'); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) { cerrarPopup(); track('popup_descuento_cerrado'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarPopup(); });

  function cerrarPopup() { overlay.classList.remove('exit-modal--open'); }

  function mostrarPopup(origen) {
    if (mostrado || convertido) return;
    mostrado = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    overlay.classList.add('exit-modal--open');
    track('popup_descuento_visto', { origen: origen });
  }

  /* Desktop: el cursor sale de la ventana por arriba. */
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY < 10) mostrarPopup('exit_intent');
  });

  /* Scroll-up rápido hacia el inicio de la página tras 15 s. */
  var ultimoY = window.scrollY;
  var t0 = Date.now();
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (Date.now() - t0 > 15000 && ultimoY - y > 400 && y < 600) mostrarPopup('scroll_intent');
    ultimoY = y;
  }, { passive: true });

  /* Respaldo: 45 s en la página sin convertir. */
  setTimeout(function () { mostrarPopup('tiempo'); }, 45000);
})();