const fs = require('fs');
const path = require('path');

const BASE = 'https://bydavidp.github.io/PaginaWM';
const DIR = path.resolve(__dirname, '..');
const PHONE1 = '573147781700';
const PHONE2 = '573237994005';

const NAV = `  <!-- ═══ HEADER / NAVBAR ═══ -->
  <header class="nav" role="banner">
    <div class="container">
      <a href="index.html" class="nav__logo" aria-label="Fumigaciones Magistrales Del Valle - Inicio">
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="18" stroke="#E11D2E" stroke-width="2.5" fill="none"/>
          <path d="M20 8 L20 14 M20 26 L20 32 M8 20 L14 20 M26 20 L32 20" stroke="#E11D2E" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="20" cy="20" r="4" fill="#E11D2E"/>
          <path d="M20 5 A15 15 0 0 1 35 20" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 3" opacity="0.6"/>
          <path d="M20 35 A15 15 0 0 1 5 20" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 3" opacity="0.6"/>
        </svg>
        <div class="nav__logo-text">
          Fumigaciones Magistrales
          <span>Del Valle</span>
        </div>
      </a>

      <button class="nav__toggle" aria-expanded="false" aria-label="Abrir menú de navegación">
        <span class="nav__toggle-line"></span>
        <span class="nav__toggle-line"></span>
        <span class="nav__toggle-line"></span>
      </button>

      <nav class="nav__links" role="navigation" aria-label="Navegación principal">
        <a href="index.html" class="nav__link">Inicio</a>
        <a href="services.html" class="nav__link nav__link--active">Servicios</a>
        <a href="about.html" class="nav__link">Nosotros</a>
        <a href="contact.html" class="nav__link">Contacto</a>
        <a href="contact.html" class="nav__cta">Solicitar Cotización</a>
      </nav>
    </div>
  </header>`;

const LOADER = `  <!-- ═══ PAGE LOADER ═══ -->
  <div class="page-loader" id="pageLoader">
    <svg class="page-loader__logo" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="#E11D2E" stroke-width="2.5" fill="none"/>
      <path d="M20 8 L20 14 M20 26 L20 32 M8 20 L14 20 M26 20 L32 20" stroke="#E11D2E" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="20" cy="20" r="4" fill="#E11D2E"/>
    </svg>
    <span class="page-loader__text">Fumigaciones Magistrales</span>
    <span class="page-loader__sub">Del Valle</span>
  </div>`;

const WHATSAPP_SVG_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

const FOOTER = `  <!-- ═══ FOOTER ═══ -->
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="index.html" class="footer__logo" aria-label="Fumigaciones Magistrales Del Valle - Inicio">
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="18" stroke="#E11D2E" stroke-width="2.5" fill="none"/>
              <path d="M20 8 L20 14 M20 26 L20 32 M8 20 L14 20 M26 20 L32 20" stroke="#E11D2E" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="20" cy="20" r="4" fill="#E11D2E"/>
            </svg>
            <span class="footer__logo-text">Fumigaciones Magistrales Del Valle</span>
          </a>
          <p class="footer__desc">
            Expertos en fumigación y control integral de plagas en Santiago de Cali.
            Protegemos tu hogar y negocio con soluciones profesionales, seguras y efectivas.
          </p>
          <div class="footer__social">
            <a href="https://w.app/fumigacionesmagistral" class="footer__social-link" aria-label="WhatsApp" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="${WHATSAPP_SVG_PATH}"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 class="footer__col-title">Navegación</h3>
          <nav class="footer__links" aria-label="Navegación del pie de página">
            <a href="index.html" class="footer__link">Inicio</a>
            <a href="services.html" class="footer__link">Servicios</a>
            <a href="about.html" class="footer__link">Nosotros</a>
            <a href="contact.html" class="footer__link">Contacto</a>
          </nav>
        </div>

        <div>
          <h3 class="footer__col-title">Servicios</h3>
          <nav class="footer__links" aria-label="Servicios">
            <a href="fumigacion-residencial-cali.html" class="footer__link">Fumigación Residencial</a>
            <a href="fumigacion-comercial-cali.html" class="footer__link">Fumigación Comercial</a>
            <a href="control-cucarachas-cali.html" class="footer__link">Control de Cucarachas</a>
            <a href="control-roedores-cali.html" class="footer__link">Control de Roedores</a>
            <a href="desinfeccion-ambientes-cali.html" class="footer__link">Desinfección de Ambientes</a>
            <a href="certificados-fumigacion-cali.html" class="footer__link">Certificados de Fumigación</a>
            <a href="recarga-extintores-cali.html" class="footer__link">Recarga de Extintores</a>
          </nav>
        </div>

        <div>
          <h3 class="footer__col-title">Contacto</h3>
          <div class="footer__links">
            <div class="footer__contact-item">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M15.5 12.5L11 8.5l-2 2-3-3 2-2L4 1.5l-3 3C1 10 6 15 12.5 15l3-2.5z"/>
              </svg>
              <span>
                <a href="tel:+${PHONE1}">(+57) 314 778 1700</a><br>
                <a href="tel:+${PHONE2}">(+57) 323 799 4005</a>
              </span>
            </div>
            <div class="footer__contact-item">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M1 3l7 5 7-5M1 4v9h14V4"/>
              </svg>
              <span><a href="mailto:fumigacionesmagistraldelvalle@gmail.com">fumigacionesmagistraldelvalle@gmail.com</a></span>
            </div>
            <div class="footer__contact-item">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 1C4.5 1 2 3.5 2 7c0 4 6 8 6 8s6-4 6-8c0-3.5-2.5-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
              </svg>
              <span>Santiago de Cali, Valle del Cauca</span>
            </div>
            <div class="footer__contact-item">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 4v4l3 2" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
              <span>Lun–Vie 8:00–17:00, Sáb 8:00–12:00</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copyright">&copy; 2026 Fumigaciones Magistrales Del Valle. Todos los derechos reservados.</p>
        <div class="footer__legal">
          <a href="#" class="footer__legal-link">Aviso de Privacidad</a>
          <a href="#" class="footer__legal-link">Términos y Condiciones</a>
        </div>
      </div>
    </div>
  </footer>

  <a href="https://wa.me/${PHONE1}?text=${encodeURIComponent('Hola, necesito información sobre sus servicios de fumigación')}"
     class="whatsapp-float"
     target="_blank"
     rel="noopener"
     aria-label="Contactar por WhatsApp">
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="${WHATSAPP_SVG_PATH}"/>
    </svg>
  </a>

  <!-- ═══ CTA FIJO MÓVIL ═══ -->
  <div class="mobile-cta" role="group" aria-label="Contacto rápido">
    <a href="tel:+${PHONE1}" class="mobile-cta__btn mobile-cta__btn--call">
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M15.5 12.5L11 8.5l-2 2-3-3 2-2L4 1.5l-3 3C1 10 6 15 12.5 15l3-2.5z"/></svg>
      Llamar
    </a>
    <a href="https://wa.me/${PHONE1}?text=${encodeURIComponent('Hola, quiero una cotización de fumigación en Cali')}"
       class="mobile-cta__btn mobile-cta__btn--wa" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WHATSAPP_SVG_PATH}"/></svg>
      Cotizar por WhatsApp
    </a>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js" defer></script>
  <script src="js/animations.js?v=4" defer></script>
  <script src="js/script.js?v=4" defer></script>`;

const TRUSTBAR = `    <!-- ═══ TRUST BAR ═══ -->
    <section class="trustbar" aria-label="Por qué confiar en nosotros">
      <div class="container">
        <div class="trustbar__grid">
          <div class="trustbar__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/>
            </svg>
            <span>Garantía escrita<br>en cada servicio</span>
          </div>
          <div class="trustbar__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>
            </svg>
            <span>Atención el mismo día<br>y urgencias 24/7</span>
          </div>
          <div class="trustbar__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/>
            </svg>
            <span>Productos seguros para<br>niños y mascotas</span>
          </div>
          <div class="trustbar__item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>
            </svg>
            <span>Certificado sanitario<br>para tu negocio</span>
          </div>
        </div>
      </div>
    </section>`;

const ALL_SERVICES = [
  { slug: 'fumigacion-residencial-cali.html', name: 'Fumigación Residencial' },
  { slug: 'fumigacion-comercial-cali.html', name: 'Fumigación Comercial' },
  { slug: 'control-cucarachas-cali.html', name: 'Control de Cucarachas' },
  { slug: 'control-roedores-cali.html', name: 'Control de Roedores' },
  { slug: 'desinfeccion-ambientes-cali.html', name: 'Desinfección de Ambientes' },
  { slug: 'certificados-fumigacion-cali.html', name: 'Certificados de Fumigación' },
  { slug: 'recarga-extintores-cali.html', name: 'Recarga de Extintores' }
];

function checkIcon() {
  return '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><polyline points="3 9 7 13 15 5"/></svg>';
}

function schemaJSON(service) {
  const provider = {
    '@type': 'PestControlService',
    '@id': `${BASE}/#business`,
    name: 'Fumigaciones Magistrales Del Valle',
    telephone: `+57 ${PHONE1.slice(2, 5)} ${PHONE1.slice(5, 8)} ${PHONE1.slice(8)}`,
    areaServed: 'Santiago de Cali',
    url: `${BASE}/`
  };
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.schemaName,
    serviceType: service.schemaName,
    description: service.desc,
    provider,
    areaServed: ['Santiago de Cali', 'Yumbo', 'Jamundí', 'Palmira'],
    image: `${BASE}/${service.image}`
  };
  if (service.price) {
    serviceSchema.offers = {
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: String(service.price),
      description: `Desde $${service.price.toLocaleString('es-CO')} COP por 100 m²`
    };
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${BASE}/services.html` },
      { '@type': 'ListItem', position: 3, name: service.shortName, item: `${BASE}/${service.slug}` }
    ]
  };
  return [serviceSchema, faq, breadcrumb]
    .map((s) => '  <script type="application/ld+json">\n' + JSON.stringify(s, null, 4) + '\n  </script>')
    .join('\n');
}

function featureItem(text) {
  return `              <div class="service-detail__feature">
                ${checkIcon()}
                <span>${text}</span>
              </div>`;
}

function tableRow(feat, detail) {
  return `              <tr>
                <td>${feat}</td>
                <td class="check">✓</td>
                <td>${detail}</td>
              </tr>`;
}

function galleryBlock(service) {
  const imgs = service.gallery.map((g) => `          <figure class="service-photo">
            <img src="${g.src}" alt="${g.alt}" loading="lazy" decoding="async" />
            <figcaption class="service-photo__caption">${g.caption}</figcaption>
          </figure>`).join('\n');
  return `    <!-- ═══ TRABAJO REAL ═══ -->
    <section class="section section--light" aria-label="Fotos reales de trabajos de ${service.shortName.toLowerCase()} en Cali">
      <div class="container">
        <div class="section__header animate">
          <span class="section__label">Trabajo real</span>
          <h2 class="section__title">Así trabajamos en ${service.context}</h2>
          <p class="section__subtitle">Fotos reales de servicios realizados por nuestro equipo en Santiago de Cali.</p>
        </div>
        <div class="gallery-strip animate" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem;">
${imgs}
        </div>
      </div>
    </section>`;
}

function faqBlock(service) {
  const items = service.faqs.map((f, i) => `          <div class="faq-item">
            <button class="faq-question" aria-expanded="false" aria-controls="faq-${service.faqId}-${i + 1}">
              <span>${f.q}</span>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10 3 L10 17 M3 10 L17 10"/></svg>
            </button>
            <div class="faq-answer" id="faq-${service.faqId}-${i + 1}" role="region">
              <p>${f.a}</p>
            </div>
          </div>`).join('\n');
  return `    <!-- ═══ FAQ ═══ -->
    <section class="section" id="faq">
      <div class="container">
        <div class="section__header animate">
          <span class="section__label">FAQ</span>
          <h2 class="section__title">Preguntas frecuentes sobre ${service.faqTopic}</h2>
          <p class="section__subtitle">Resolvemos las dudas más comunes de nuestros clientes en Cali.</p>
        </div>
        <div class="faq-list">
${items}
        </div>
      </div>
    </section>`;
}

function otherServicesBlock(service) {
  const links = ALL_SERVICES
    .filter((s) => s.slug !== service.slug)
    .map((s) => `          <a href="${s.slug}" class="btn btn--secondary" style="justify-content:center;">${s.name}</a>`)
    .join('\n');
  return `    <!-- ═══ OTROS SERVICIOS ═══ -->
    <section class="section section--light" aria-label="Otros servicios de fumigación en Cali">
      <div class="container">
        <div class="section__header animate">
          <span class="section__label">Más soluciones</span>
          <h2 class="section__title">Otros servicios que ofrecemos en Cali</h2>
        </div>
        <div class="services-links animate" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.75rem;">
${links}
        </div>
      </div>
    </section>`;
}

function ctaBlock(service) {
  return `    <!-- ═══ CTA FINAL ═══ -->
    <section class="cta-banner" id="cotizacion">
      <div class="container">
        <div class="cta-banner__content animate--scale">
          <h2 class="cta-banner__title">${service.ctaTitle}</h2>
          <p class="cta-banner__text">
            Escríbenos por WhatsApp y recibe una cotización personalizada en minutos, sin compromiso.
            Atendemos en Cali, Yumbo, Jamundí y Palmira.
          </p>
          <div class="cta-banner__actions">
            <a href="https://wa.me/${PHONE1}?text=${encodeURIComponent(service.waMsg)}"
               class="btn btn--whatsapp btn--large" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="${WHATSAPP_SVG_PATH}"/></svg>
              Cotizar por WhatsApp
            </a>
            <a href="tel:+${PHONE1}" class="btn btn--secondary btn--large">Llamar ahora</a>
          </div>
        </div>
      </div>
    </section>`;
}

function renderPage(service) {
  const head = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${service.desc}">
  <title>${service.title}</title>
  <link rel="canonical" href="${BASE}/${service.slug}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#0B0E14">
  <meta name="geo.region" content="CO-VAC">
  <meta name="geo.placename" content="Santiago de Cali">
  <meta property="og:title" content="${service.title}">
  <meta property="og:description" content="${service.desc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${BASE}/${service.slug}">
  <meta property="og:image" content="${BASE}/img/og-fumigaciones-magistrales-cali.jpg">
  <meta name="twitter:image" content="${BASE}/img/og-fumigaciones-magistrales-cali.jpg">
  <meta property="og:locale" content="es_CO">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css?v=4">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon.png">
  <link rel="icon" href="favicon.ico">

${schemaJSON(service)}
</head>
<body>
${LOADER}

${NAV}

  <main>
    <!-- ═══ HERO SECONDARY ═══ -->
    <section class="hero-secondary">
      <div class="hero-secondary__bg"></div>
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Inicio</a>
          <span>/</span>
          <a href="services.html">Servicios</a>
          <span>/</span>
          <span class="breadcrumb__current">${service.shortName}</span>
        </nav>
        <h1 class="section__title animate">${service.h1}</h1>
        <p class="section__subtitle animate">${service.heroSubtitle}</p>
      </div>
    </section>

${TRUSTBAR}

    <!-- ═══ SERVICIO PRINCIPAL ═══ -->
    <section class="section" id="servicio">
      <div class="container">
        <div class="service-detail animate">
          <div class="service-detail__visual">
            <figure class="service-photo">
              <img src="${service.image}" alt="${service.imageAlt}" loading="eager" decoding="async" />
              <figcaption class="service-photo__caption">${service.imageCaption}</figcaption>
            </figure>
          </div>
          <div class="service-detail__content">
            <span class="service-detail__label">Servicio en Cali</span>
            <h2 class="service-detail__title">${service.h2}</h2>
            <p class="service-detail__desc">${service.body}</p>
            <div class="service-detail__features">
${service.features.map(featureItem).join('\n')}
            </div>
            <a href="contact.html" class="btn btn--primary" style="width: fit-content;">Solicitar Cotización</a>
          </div>
        </div>

        <div class="table-wrap animate">
          <table class="feature-table">
            <caption class="sr-only">Características del servicio de ${service.shortName.toLowerCase()} en Cali</caption>
            <thead>
              <tr>
                <th scope="col">Característica</th>
                <th scope="col">Incluido</th>
                <th scope="col">Detalle</th>
              </tr>
            </thead>
            <tbody>
${service.table.map((r) => tableRow(r[0], r[1])).join('\n')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

${galleryBlock(service)}

${faqBlock(service)}

${otherServicesBlock(service)}

${ctaBlock(service)}
  </main>

${FOOTER}
</body>
</html>
`;
  fs.writeFileSync(path.join(DIR, service.slug), head, 'utf8');
  console.log('generado:', service.slug);
}

const services = [
  {
    slug: 'fumigacion-residencial-cali.html',
    shortName: 'Fumigación Residencial',
    schemaName: 'Fumigación residencial',
    title: 'Fumigación Residencial en Cali con Garantía de 90 Días | Fumigaciones Magistrales Del Valle',
    desc: 'Fumigación de casas y apartamentos en Cali con garantía escrita de 90 días. Técnicos certificados y productos seguros para niños y mascotas. Cotiza gratis por WhatsApp.',
    h1: 'Fumigación Residencial en Cali',
    heroSubtitle: 'Protege tu casa o apartamento en Cali de cucarachas, roedores, comején y zancudos con tratamientos seguros y garantizados.',
    h2: 'Tu hogar libre de plagas, con garantía escrita',
    body: 'Protege a tu familia y tu hogar en Cali con nuestros tratamientos de fumigación residencial. Usamos productos aprobados por el INVIMA, sin riesgo para niños ni mascotas, con resultados visibles desde la primera aplicación. Cada servicio incluye inspección técnica, aplicación profesional y garantía de 90 días.',
    image: 'img/servicios/fumigacion-cocina-apartamento-cali.jpg',
    imageAlt: 'Fumigación residencial en la cocina de un apartamento en Cali',
    imageCaption: 'Tratamiento residencial en cocina, Cali',
    context: 'hogares de Cali',
    faqId: 'res',
    faqTopic: 'la fumigación residencial en Cali',
    ctaTitle: '¿Listo para tener tu casa libre de plagas?',
    waMsg: 'Hola, quiero una cotización de fumigación residencial en Cali',
    price: 80000,
    features: [
      'Inspección inicial gratuita',
      'Productos aprobados por el INVIMA',
      'Garantía de 90 días en todos los tratamientos',
      'Programas de mantenimiento mensual o bimestral'
    ],
    table: [
      ['Diagnóstico', 'Inspección técnica completa'],
      ['Productos eco-amigables', 'Biodegradables y seguros'],
      ['Garantía', '90 días directa'],
      ['Seguimiento', 'Visita de control a los 30 días']
    ],
    gallery: [
      { src: 'img/servicios/fumigacion-cocina-apartamento-cali.jpg', alt: 'Fumigación de la cocina de un apartamento en Cali', caption: 'Cocina de apartamento, Cali' },
      { src: 'img/servicios/control-cucarachas-cocina-residencial-cali.jpg', alt: 'Control de cucarachas en la cocina de una casa en Cali', caption: 'Control de cucarachas en vivienda' },
      { src: 'img/servicios/tratamiento-jardineras-cali.jpg', alt: 'Tratamiento de jardineras de una casa en Cali', caption: 'Tratamiento en jardineras' }
    ],
    faqs: [
      { q: '¿Cada cuánto se debe fumigar una casa en Cali?', a: 'Recomendamos fumigar cada 3 a 6 meses según la zona y el tipo de plaga. En zonas húmedas o cerca de lotes, alcantarillas y zonas verdes, el mantenimiento mensual o bimestral es la mejor forma de evitar reinfestaciones.' },
      { q: '¿Los productos que usan son seguros para niños y mascotas?', a: 'Sí. Utilizamos productos avalados por el INVIMA y la EPA, aplicados por técnicos certificados. Recomendamos ausentar a personas y mascotas durante la aplicación y ventilar el área 2-3 horas después. Te damos instrucciones específicas según el tratamiento.' },
      { q: '¿Cuánto tarda la fumigación de una casa o apartamento?', a: 'Entre 45 minutos y 2 horas, según el tamaño del inmueble y el nivel de infestación. La inspección inicial te permite conocer el tiempo estimado antes de agendar.' },
      { q: '¿Qué preparación necesita mi casa antes de la fumigación?', a: 'Guardar alimentos, cubrir utensilios de cocina y retirar juguetes y ropa de los muebles bajos. Nuestro equipo te entrega una lista de preparación al confirmar la cita.' }
    ]
  },
  {
    slug: 'fumigacion-comercial-cali.html',
    shortName: 'Fumigación Comercial',
    schemaName: 'Fumigación comercial',
    title: 'Fumigación Comercial en Cali para Restaurantes, Hoteles y Oficinas | Fumigaciones Magistrales Del Valle',
    desc: 'Fumigación comercial en Cali para restaurantes, hoteles, bodegas y oficinas. Certificados de fumigación, horario nocturno y planes por giro comercial. Cotiza gratis.',
    h1: 'Fumigación Comercial en Cali',
    heroSubtitle: 'Mantén tu negocio en Cali libre de plagas y cumple con las normativas sanitarias con planes a la medida de tu operación.',
    h2: 'Protección profesional para tu negocio en Cali',
    body: 'Soluciones profesionales de fumigación para restaurantes, tiendas, hoteles, bodegas y oficinas en Cali. Cumplimos con las normativas sanitarias colombianas más exigentes, entregamos certificados de fumigación y trabajamos en horarios que no afectan tu operación.',
    image: 'img/servicios/desinfeccion-gimnasio-cali.jpg',
    imageAlt: 'Fumigación y desinfección de un gimnasio comercial en Cali',
    imageCaption: 'Control de plagas en gimnasio, Cali',
    context: 'negocios de Cali',
    faqId: 'com',
    faqTopic: 'la fumigación comercial en Cali',
    ctaTitle: '¿Tu negocio necesita fumigación certificada?',
    waMsg: 'Hola, quiero una cotización de fumigación comercial en Cali para mi negocio',
    price: 150000,
    features: [
      'Programas personalizados por giro comercial',
      'Certificados de fumigación para establecimientos',
      'Servicio en horario extendido y fines de semana',
      'Reportes digitales por visita'
    ],
    table: [
      ['Plan personalizado', 'Según giro y tamaño del negocio'],
      ['Certificación sanitaria', 'Constancia de servicio'],
      ['Garantía', '180 días para comercios'],
      ['Emergencia 24h', 'Respuesta en menos de 4 horas']
    ],
    gallery: [
      { src: 'img/servicios/desinfeccion-gimnasio-cali.jpg', alt: 'Desinfección de un gimnasio comercial en Cali', caption: 'Gimnasio comercial, Cali' },
      { src: 'img/servicios/nebulizacion-bodega-zona-carga-cali.jpg', alt: 'Nebulización en la zona de carga de una bodega en Cali', caption: 'Nebulización en bodega' },
      { src: 'img/servicios/fumigacion-bodega-almacen-cali.jpg', alt: 'Fumigación de bodega de almacenamiento en Cali', caption: 'Fumigación en bodega' }
    ],
    faqs: [
      { q: '¿Necesito un certificado de fumigación para mi restaurante en Cali?', a: 'Sí. La mayoría de establecimientos de alimentos y comercios en Cali requieren constancia de fumigación vigente para renovar permisos sanitarios. Emitimos el certificado con la vigencia que exige la autoridad sanitaria.' },
      { q: '¿Pueden fumigar mi negocio fuera del horario de atención?', a: 'Sí. Trabajamos en horario extendido, nocturno y fines de semana para no interrumpir tu operación. Agendamos la visita en el horario que más te convenga.' },
      { q: '¿Cada cuánto debe fumigarse un negocio en Cali?', a: 'Depende del giro. Restaurantes y negocios de alimentos cada 1-2 meses; oficinas y tiendas cada 3-6 meses. Diseñamos un plan de mantenimiento según el riesgo de tu operación.' },
      { q: '¿Atienden negocios fuera de Cali?', a: 'Sí, atendemos también Yumbo, Jamundí, Palmira y demás municipios del Valle del Cauca con la misma garantía y soporte.' }
    ]
  },
  {
    slug: 'control-cucarachas-cali.html',
    shortName: 'Control de Cucarachas',
    schemaName: 'Control de cucarachas',
    title: 'Control de Cucarachas en Cali | Eliminación Garantizada | Fumigaciones Magistrales Del Valle',
    desc: 'Control de cucarachas en Cali con gel insecticida, aspersión y barreras. Eliminación garantizada en casas, apartamentos, restaurantes y oficinas. Cotiza gratis.',
    h1: 'Control de Cucarachas en Cali',
    heroSubtitle: 'Eliminamos la infestación de cucarachas de tu casa o negocio en Cali con tratamientos focalizados y garantía de 90 días.',
    h2: 'Adiós a las cucarachas, con garantía',
    body: 'Las cucarachas se esconden detrás de electrodomésticos, bajo el lavaplatos y en grietas. Nuestro tratamiento en Cali combina gel insecticida de acción retardada, aspersión en zócalos y tratamiento de grietas para eliminar la colonia completa, no solo las que se ven.',
    image: 'img/servicios/gel-cucarachas-mobiliario-cocina-cali.jpg',
    imageAlt: 'Aplicación de gel contra cucarachas en el mobiliario de una cocina en Cali',
    imageCaption: 'Gel contra cucarachas en mobiliario',
    context: 'cocinas y negocios de Cali',
    faqId: 'cuc',
    faqTopic: 'el control de cucarachas en Cali',
    ctaTitle: '¿Cucarachas en tu cocina o negocio?',
    waMsg: 'Hola, tengo un problema de cucarachas y quiero una cotización en Cali',
    price: 90000,
    features: [
      'Aplicación de gel insecticida focalizado',
      'Aspersión en zócalos y rincones',
      'Tratamiento de grietas y hendiduras',
      'Garantía de 90 días en todos los tratamientos'
    ],
    table: [
      ['Diagnóstico', 'Identificación de focos y nidos'],
      ['Gel insecticida', 'Acción retardada que llega al nido'],
      ['Aspersión', 'Zócalos, rincones y desagües'],
      ['Garantía', '90 días directa']
    ],
    gallery: [
      { src: 'img/servicios/gel-cucarachas-mobiliario-cocina-cali.jpg', alt: 'Gel contra cucarachas en mobiliario de cocina en Cali', caption: 'Gel en mobiliario de cocina' },
      { src: 'img/servicios/control-cucarachas-cocina-residencial-cali.jpg', alt: 'Control de cucarachas bajo el mobiliario de una cocina en Cali', caption: 'Tratamiento bajo mobiliario' },
      { src: 'img/servicios/control-cucarachas-cocina-oficina-cali.jpg', alt: 'Control de cucarachas en la cocina de una oficina en Cali', caption: 'Cocina de oficina, Cali' },
      { src: 'img/servicios/control-cucarachas-electrodomesticos-cali.jpg', alt: 'Control de cucarachas detrás de electrodomésticos en Cali', caption: 'Tratamiento de electrodomésticos' }
    ],
    faqs: [
      { q: '¿Por qué vuelven las cucarachas después de fumigar?', a: 'Porque la mayoría de productos solo elimina las cucarachas visibles. Nuestro gel de acción retardada llega al nido y elimina la colonia completa. Además sellamos los puntos de entrada para evitar reinfestaciones.' },
      { q: '¿El gel para cucarachas es seguro para mi familia?', a: 'Sí. Se aplica en puntos focalizados fuera del alcance de niños y mascotas: bisagras, cajones, detrás de electrodomésticos. Además es inodoro y no mancha.' },
      { q: '¿Cuánto tarda en verse el resultado?', a: 'Entre 24 y 72 horas la actividad baja notablemente y en 1-2 semanas la colonia se elimina por completo. Incluimos revisión a los 30 días sin costo.' },
      { q: '¿Debo desocupar la cocina para el tratamiento?', a: 'Solo debes guardar alimentos y utensilios. El tratamiento es focalizado y no requiere desalojar la vivienda por más de 2 horas.' }
    ]
  },
  {
    slug: 'control-roedores-cali.html',
    shortName: 'Control de Roedores',
    schemaName: 'Control de roedores',
    title: 'Control de Roedores en Cali | Ratas y Ratones | Fumigaciones Magistrales Del Valle',
    desc: 'Control de ratas y ratones en Cali con estaciones de cebo certificadas, sellado de accesos y monitoreo. Garantía escrita. Cotiza gratis por WhatsApp.',
    h1: 'Control de Roedores en Cali',
    heroSubtitle: 'Eliminamos ratas y ratones de tu casa, conjunto o negocio en Cali con un método integral: exclusión, eliminación y prevención.',
    h2: 'Control integral de ratas y ratones',
    body: 'Las ratas y ratones no solo causan daños materiales, también representan un grave riesgo sanitario. En Cali, nuestro método integral combina inspección, sellado de puntos de entrada, estaciones de cebo certificadas y monitoreo continuo para resultados duraderos.',
    image: 'img/servicios/cebado-roedores-exteriores-cali.jpg',
    imageAlt: 'Instalación de cebos para control de roedores en exteriores en Cali',
    imageCaption: 'Cebado para roedores en exteriores',
    context: 'conjuntos y negocios de Cali',
    faqId: 'roe',
    faqTopic: 'el control de roedores en Cali',
    ctaTitle: '¿Viste roedores en tu propiedad?',
    waMsg: 'Hola, tengo un problema de roedores y quiero una cotización en Cali',
    price: 120000,
    features: [
      'Inspección y sellado de puntos de entrada',
      'Estaciones de cebo certificadas',
      'Saneamiento de áreas afectadas',
      'Monitoreo continuo con reportes'
    ],
    table: [
      ['Inspección', 'Rutas, nidos y accesos'],
      ['Exclusión', 'Sellado de puntos de entrada'],
      ['Cebado', 'Estaciones certificadas'],
      ['Monitoreo', 'Reportes periódicos']
    ],
    gallery: [
      { src: 'img/servicios/cebado-roedores-exteriores-cali.jpg', alt: 'Cebos para roedores en exteriores en Cali', caption: 'Cebado en exteriores' },
      { src: 'img/servicios/control-roedores-caja-registro-cali.jpg', alt: 'Control de roedores en caja de registro en Cali', caption: 'Tratamiento en caja de registro' },
      { src: 'img/servicios/control-roedores-alcantarillado-cali.jpg', alt: 'Control de roedores en alcantarillado en Cali', caption: 'Control en alcantarillado' }
    ],
    faqs: [
      { q: '¿Cómo saben dónde están los roedores?', a: 'Identificamos rastros como heces, marcas de grasa, senderos y roeduras, además de los accesos al inmueble. Con esa información ubicamos las estaciones de cebo en los puntos de mayor actividad.' },
      { q: '¿El control de roedores es seguro si tengo mascotas?', a: 'Sí. Usamos estaciones de cebo cerradas y seguras, instaladas fuera del alcance de perros y gatos, y recomendamos ubicaciones estratégicas para evitar cualquier contacto.' },
      { q: '¿Cuánto tarda en eliminarse una plaga de roedores?', a: 'La actividad baja en los primeros 7-10 días. El control total depende del nivel de infestación; en la mayoría de casos se logra entre 2 y 4 semanas con el monitoreo incluido.' },
      { q: '¿Qué pasa si los roedores reaparecen?', a: 'El servicio incluye garantía por escrito. Si hay actividad de roedores dentro del período de garantía, regresamos a reforzar el tratamiento sin costo adicional.' }
    ]
  },
  {
    slug: 'desinfeccion-ambientes-cali.html',
    shortName: 'Desinfección de Ambientes',
    schemaName: 'Desinfección de ambientes',
    title: 'Desinfección de Ambientes en Cali | Tratamientos Preventivos | Fumigaciones Magistrales Del Valle',
    desc: 'Desinfección de ambientes y superficies en Cali para hogares, oficinas y colegios. Productos biodegradables, planes preventivos mensuales o bimestrales.',
    h1: 'Desinfección de Ambientes en Cali',
    heroSubtitle: 'Desinfecta tu hogar, oficina o colegio en Cali con productos autorizados y planes de mantenimiento preventivo.',
    h2: 'Ambientes limpios y desinfectados todo el año',
    body: 'Mantén tu hogar o negocio libre de plagas y microorganismos con nuestros planes de mantenimiento preventivo en Cali. Incluye desinfección de ambientes y superficies, nebulización y tratamientos perimetrales con productos biodegradables y seguros.',
    image: 'img/servicios/desinfeccion-banos-institucionales-cali.jpg',
    imageAlt: 'Desinfección de baños de un establecimiento institucional en Cali',
    imageCaption: 'Desinfección de baños institucionales',
    context: 'espacios de Cali',
    faqId: 'des',
    faqTopic: 'la desinfección de ambientes en Cali',
    ctaTitle: '¿Necesitas un plan de desinfección periódico?',
    waMsg: 'Hola, quiero una cotización de desinfección de ambientes en Cali',
    price: 60000,
    features: [
      'Planes mensuales, bimestrales o trimestrales',
      'Desinfección de ambientes y superficies',
      'Nebulización de áreas de alto tránsito',
      'Productos biodegradables y seguros'
    ],
    table: [
      ['Plan preventivo', 'Mensual, bimestral o trimestral'],
      ['Superficies', 'Escritorios, baños, cocinas'],
      ['Nebulización', 'Áreas de alto tránsito'],
      ['Seguimiento', 'Visitas de control periódicas']
    ],
    gallery: [
      { src: 'img/servicios/desinfeccion-banos-institucionales-cali.jpg', alt: 'Desinfección de baños en Cali', caption: 'Baños institucionales' },
      { src: 'img/servicios/desinfeccion-gimnasio-cali.jpg', alt: 'Desinfección de gimnasio en Cali', caption: 'Gimnasio, Cali' },
      { src: 'img/servicios/desinfeccion-aula-jardin-infantil-cali.jpg', alt: 'Desinfección de aula de jardín infantil en Cali', caption: 'Aula de jardín infantil' }
    ],
    faqs: [
      { q: '¿Cada cuánto se recomienda desinfectar un espacio en Cali?', a: 'Depende del tránsito de personas. Oficinas y colegios: mensual o bimestral. Hogares: cada 3-6 meses. Nuestros planes incluyen visitas de control para mantener el nivel de protección.' },
      { q: '¿La desinfección es eficaz contra virus y bacterias?', a: 'Sí. Usamos desinfectantes de grado sanitario con registro INVIMA que eliminan bacterias, hongos y virus en superficies de contacto frecuente como manijas, escritorios y baños.' },
      { q: '¿Se puede trabajar durante la desinfección?', a: 'Recomendamos programar el servicio en horarios de menor afluencia. Dependiendo del producto, el área puede usarse entre 30 minutos y 2 horas después de la aplicación.' },
      { q: '¿Qué áreas cubre el servicio?', a: 'Superficies de contacto frecuente, baños, cocinas, zonas comunes, aulas, oficinas y áreas exteriores de alto tránsito. Te entregamos un plan por áreas según tu espacio.' }
    ]
  },
  {
    slug: 'certificados-fumigacion-cali.html',
    shortName: 'Certificados de Fumigación',
    schemaName: 'Certificado de fumigación',
    title: 'Certificados de Fumigación en Cali para Establecimientos | Fumigaciones Magistrales Del Valle',
    desc: 'Certificado de fumigación en Cali para restaurantes, tiendas y establecimientos. Válido ante autoridades sanitarias, emisión rápida y renovación periódica.',
    h1: 'Certificados de Fumigación en Cali',
    heroSubtitle: 'Certificado de fumigación para tu restaurante, tienda o negocio en Cali, válido ante las autoridades sanitarias y con renovación periódica.',
    h2: 'Cumple la normativa sanitaria de tu establecimiento',
    body: '¿Necesitas el certificado de fumigación para tu restaurante, tienda o negocio en Cali? Emitimos certificados que cumplen con los requisitos exigidos por las autoridades sanitarias de Colombia. Incluye inspección técnica, tratamiento y documentación.',
    image: 'img/servicios/fumigacion-archivo-casilleros-cali.jpg',
    imageAlt: 'Fumigación de área de archivo y casilleros en un establecimiento en Cali',
    imageCaption: 'Tratamiento en área de archivo',
    context: 'establecimientos de Cali',
    faqId: 'cert',
    faqTopic: 'los certificados de fumigación en Cali',
    ctaTitle: '¿Tu negocio necesita el certificado de fumigación?',
    waMsg: 'Hola, necesito un certificado de fumigación para mi establecimiento en Cali',
    price: 100000,
    features: [
      'Certificado válido ante autoridades sanitarias',
      'Inspección técnica del establecimiento',
      'Programación que no afecta tu operación',
      'Renovación periódica con descuento'
    ],
    table: [
      ['Documentación', 'Certificado emitido'],
      ['Inspección incluida', 'Vigencia 30/60/90 días'],
      ['Tratamiento', 'Según tipo de plaga'],
      ['Renovación', 'Descuento para clientes frecuentes']
    ],
    gallery: [
      { src: 'img/servicios/fumigacion-archivo-casilleros-cali.jpg', alt: 'Fumigación de archivo y casilleros en Cali', caption: 'Área de archivo y casilleros' },
      { src: 'img/servicios/desinfeccion-aula-jardin-infantil-cali.jpg', alt: 'Desinfección en jardín infantil de Cali', caption: 'Jardín infantil, Cali' },
      { src: 'img/servicios/nebulizacion-zonas-comunes-cali.jpg', alt: 'Nebulización de zonas comunes en Cali', caption: 'Zonas comunes' }
    ],
    faqs: [
      { q: '¿Qué vigencia tiene el certificado de fumigación?', a: 'Según el requerimiento de la autoridad sanitaria, emitimos certificados con vigencia de 30, 60 o 90 días. Te asesoramos sobre la vigencia que exige tu actividad comercial.' },
      { q: '¿El certificado sirve para la Secretaría de Salud?', a: 'Sí. Nuestros certificados cumplen con los requisitos exigidos por las autoridades sanitarias colombianas para establecimientos de alimentos y comercios en general.' },
      { q: '¿Cuánto demora la emisión del certificado?', a: 'El certificado se entrega el mismo día del servicio, una vez realizada la inspección y el tratamiento. Si lo necesitas urgente, agenda con prioridad.' },
      { q: '¿El precio incluye la fumigación?', a: 'Sí. El servicio incluye inspección, tratamiento según el tipo de plaga y la emisión del certificado con la vigencia acordada.' }
    ]
  },
  {
    slug: 'recarga-extintores-cali.html',
    shortName: 'Recarga de Extintores',
    schemaName: 'Recarga y mantenimiento de extintores',
    title: 'Recarga y Mantenimiento de Extintores en Cali | Fumigaciones Magistrales Del Valle',
    desc: 'Recarga de extintores ABC, CO2 y solkaflam en Cali. Prueba hidrostática, señalización y programa anual para conjuntos y empresas. Cotiza gratis.',
    h1: 'Recarga y Mantenimiento de Extintores en Cali',
    heroSubtitle: 'Recarga, prueba hidrostática y señalización de extintores para conjuntos residenciales, empresas y locales en Cali.',
    h2: 'Extintores listos cuando más los necesites',
    body: 'Además del control de plagas, atendemos la seguridad contra incendios de tu conjunto, empresa o local en Cali: recarga, prueba hidrostática, señalización y reposición de extintores según la normativa vigente. Un solo proveedor para el mantenimiento integral de tu edificación.',
    image: 'img/servicios/extintores-mantenimiento-cali.jpg',
    imageAlt: 'Extintores recargados y señalizados listos para entrega en Cali',
    imageCaption: 'Recarga y mantenimiento de extintores, Cali',
    context: 'conjuntos y empresas de Cali',
    faqId: 'ext',
    faqTopic: 'la recarga de extintores en Cali',
    ctaTitle: '¿Tus extintores están al día?',
    waMsg: 'Hola, quiero una cotización de recarga de extintores en Cali',
    price: null,
    features: [
      'Recarga de extintores de todo tipo (ABC, CO2, solkaflam)',
      'Prueba hidrostática según normativa',
      'Inspección, señalización y ubicación reglamentaria',
      'Recogida y entrega en sitio, sin dejar el área desprotegida'
    ],
    table: [
      ['Recarga', 'ABC, CO2 y solkaflam'],
      ['Prueba hidrostática', 'Según normativa vigente'],
      ['Señalización', 'Ubicación reglamentaria'],
      ['Programa anual', 'Para conjuntos y empresas']
    ],
    gallery: [
      { src: 'img/servicios/extintores-mantenimiento-cali.jpg', alt: 'Extintores recargados listos para entrega en Cali', caption: 'Extintores listos para entrega' }
    ],
    faqs: [
      { q: '¿Cada cuánto se debe recargar un extintor?', a: 'Todo extintor debe recargarse al menos una vez al año, o inmediatamente después de cualquier uso, aunque sea parcial. La prueba hidrostática se realiza cada 5 años según la normativa.' },
      { q: '¿Qué es la prueba hidrostática?', a: 'Es una prueba de presión que verifica que el cilindro soporta la presión de trabajo sin fugas ni deformaciones. Es obligatoria cada 5 años y garantiza que el extintor funcionará cuando se necesite.' },
      { q: '¿Recargan los extintores en el sitio o los recogen?', a: 'Ofrecemos ambas opciones. Recogemos y entregamos en sitio, y durante la recarga dejamos extintores de respaldo para que tu edificación nunca quede desprotegida.' },
      { q: '¿Qué tipos de extintores recargan?', a: 'ABC (polvo químico seco), CO2 y solkaflam (agentes limpios), en todas las capacidades. También hacemos reposición de extintores que no pasan la inspección.' }
    ]
  }
];

services.forEach(renderPage);
console.log('Listo. Páginas generadas:', services.length);
