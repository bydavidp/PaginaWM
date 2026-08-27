# Fumigaciones Magistrales Del Valle

> Sitio web premium para empresa de fumigación y control de plagas en Santiago de Cali.
>
> **Sitio en vivo:** https://bydavidp.github.io/PaginaWM/

<p align="left">
  <img alt="Estado" src="https://img.shields.io/badge/status-en%20producción-success?style=flat-square" />
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img alt="Anime.js" src="https://img.shields.io/badge/Anime.js-3.2.1-red?style=flat-square" />
  <img alt="Formspree" src="https://img.shields.io/badge/Formspree-activo-blue?style=flat-square" />
  <img alt="Schema.org" src="https://img.shields.io/badge/Schema.org-JSON--LD-37a779?style=flat-square" />
  <img alt="SEO" src="https://img.shields.io/badge/SEO-local%20Cali-orange?style=flat-square" />
</p>

---

## 📂 Estructura del proyecto

```
PaginaWM/
│
├── index.html                          # Inicio: hero, servicios, galería, testimonios, cotizador
├── services.html                       # Hub de servicios, proceso, garantías y FAQ
├── about.html                          # Timeline, valores, equipo y certificaciones
├── contact.html                        # Formulario Formspree + Google Maps
├── 404.html                            # Página de error
│
├── fumigacion-residencial-cali.html    # Landing: fumigación residencial
├── fumigacion-comercial-cali.html      # Landing: fumigación comercial
├── control-cucarachas-cali.html        # Landing: control de cucarachas
├── control-roedores-cali.html          # Landing: control de roedores
├── desinfeccion-ambientes-cali.html    # Landing: desinfección de ambientes
├── certificados-fumigacion-cali.html   # Landing: certificados de fumigación
├── recarga-extintores-cali.html        # Landing: recarga de extintores
│
├── css/
│   └── style.css                       # Tokens, componentes, responsive (mobile-first)
│
├── js/
│   ├── animations.js                   # Motor de animaciones (Anime.js + IntersectionObserver)
│   ├── particles.js                    # Niebla de fumigación y partículas del hero
│   └── script.js                       # Menú, testimonios, formulario, cotizador, galería
│
├── tools/
│   └── generar-servicios.js           # Generador de las 7 páginas de servicio
│
├── img/                                # Fotos reales (1400px + thumbs 700px), videos, favicons
├── favicon.ico                         # Favicon multi-tamaño con el logo
├── sitemap.xml                         # Las 11 URLs del sitio
├── robots.txt                          # Apunta al sitemap
├── DEPLOY.md                           # Guía de despliegue
└── README.md
```

> Las 7 páginas de servicio se generan con `tools/generar-servicios.js`
> (plantilla común: schema Service + FAQPage + BreadcrumbList, fotos reales,
> FAQ específica y CTA de WhatsApp por servicio). Se ejecuta con:
> `node tools/generar-servicios.js`

---

## 🚀 Inicio rápido

No requiere dependencias ni servidor especial. Abrir cualquier `*.html` desde el navegador funciona correctamente.

```bash
# Opción recomendada: servidor local para rutas limpias
npx serve .

# O alternativamente
python -m http.server 8000
```

---

## 🎯 Stack

| Capa | Herramienta |
|------|-------------|
| Estructura | HTML5 semántico + Open Graph + schema.org JSON-LD |
| Estilos | CSS3 con variables, clamp() y mobile-first |
| Interactividad | JavaScript vanilla sin frameworks |
| Animaciones | Anime.js 3.2.1 sobre CDN |
| Tipografía | Google Fonts · Inter |
| Formulario | Formspree con validación client-side |
| Mapas | Google Maps Embed (iframe) |
| Hosting | GitHub Pages |

---

## 🎨 Paleta y tipografía

| Uso | Valor |
|-----|-------|
| Rojo corporativo | `#E11D2E` |
| Rojo hover | `#B8121F` |
| Verde acento (seguro/limpio) | `#00B884` |
| Ámbar | `#FFB020` |
| Fondo / tinta | `#0B0E14` |
| Texto light | `#FFFFFF` |
| Texto muted | `#5C6675` |
| Fuente UI y display | Inter |

Los tokens viven en `:root` dentro de `css/style.css`.

---

## ✨ Qué incluye el sitio

### SEO local (Cali)

- 7 páginas de servicio individuales con H1 enfocado en la búsqueda
  ("Control de Cucarachas en Cali", "Fumigación Residencial en Cali"…)
- Schema `PestControlService` (negocio), `Service` con precios desde COP,
  `FAQPage` y `BreadcrumbList` en cada página
- `sitemap.xml` + `robots.txt`, canonical por página, meta geo (CO-VAC)
- Open Graph + Twitter Cards con imagen 1200×630 para WhatsApp y redes
- Alt descriptivos en las 35 imágenes reales (SEO de imágenes)

### Conversión

- **Cotizador** con precios estimados y envío a WhatsApp con mensaje pre-armado
- **Galería masonry** de 25 elementos con filtros (Residencial · Comercial ·
  Roedores · Zonas comunes · Extintores) y lightbox con navegación por teclado
- 2 videos reales comprimidos (720p, poster, reproducción al clic)
- CTA fijo móvil (Llamar / WhatsApp), flotante de WhatsApp y botón de teléfono
- Formulario de contacto con validación en tiempo real (Formspree)
- Fotos reales del equipo y de servicios realizados en toda la página

### Animaciones

| Animación | Tecnología |
|-----------|-----------|
| Niebla de fumigación en hero | Canvas 2D |
| Ondas de pulso expansivas | DOM dinámico + Anime.js timeline |
| Parallax 3D en hover | Perspectiva + mousemove |
| Orbes flotantes con glow | keyframes + backdrop-filter |
| Tarjetas con tilt 3D | mousemove · rotateX/Y |
| Contadores elásticos | elastic easing |
| SVGs auto-dibujables | stroke-dasharray + IntersectionObserver |
| Partículas al mover el cursor | requestAnimationFrame |
| Transición entre páginas | Overlay fullscreen |
| Parallax por scroll | Scroll-listener pasivo |
| Hover glow en tablas | Anime.js backgroundColor |

### Componentes

- **Navbar** dinámico con cambio de color por scroll
- **Menú móvil premium** fullscreen con entrada escalonada
- **Barra de progreso** fija de lectura
- **Botón volver arriba** con entrada animada
- **WhatsApp flotante** con pulso suave
- **Loader** de entrada con logo animado
- **Cookie consent** con localStorage
- **FAQ accordion** toggle único
- **Botones magnéticos** (efecto imán)
- **Carrusel de testimonios** con autoplay
- **Accesibilidad**: alt texts, aria-labels, focus-visible, touch targets ≥ 44px

---

## 🔧 Modificar

| Cambio | Lugar |
|-------|-------|
| Colores y tokens | Variables `:root` en `css/style.css` |
| Números de WhatsApp y teléfono | Enlaces `wa.me/…` y `tel:…` en los HTML (todos los archivos) |
| Precios del cotizador | `PRECIOS_BASE` en `js/script.js` |
| Textos de las páginas de servicio | `tools/generar-servicios.js` (y regenerar con `node tools/generar-servicios.js`) |
| Acción del formulario | Atributo `action=""` en `contact.html` |
| Textos del hero | Sección `.hero` en `index.html` |
| Sitemap | `sitemap.xml` (agregar la URL de cada página nueva) |
| Versión de caché CSS/JS | `?v=N` en los `<link>` y `<script>` de cada HTML |

---

## 🏗️ Cómo está organizado el JS

```
animations.js
├── Helpers: el(), els(), onVisibleEach(), observeElements()
├── 25+ animaciones temáticas organizadas por número
├── 4 animaciones 3D interactivas
├── Componentes UX: loader, WhatsApp, progress bar, back-to-top
├── Features premium: modal, FAQ, cookie, transiciones, magnéticos
├── Red de seguridad: contenido visible aunque fallen las animaciones
└── initAnimations() → entry point

script.js
├── Menú hamburguesa responsive
├── Carrusel de testimonios con autoplay
├── Validación de formulario + Formspree
├── Cotizador con precios y enlace a WhatsApp
├── Galería con filtros y lightbox (teclado incluido)
├── Smooth scroll para anclas
└── Ranura del loader

particles.js
└── Niebla de fumigación y partículas del hero (canvas)
```

---

## ♿ Accesibilidad

- Navegación completa por teclado (`focus-visible`)
- Etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<footer>`)
- ARIA labels y `aria-expanded` en elementos interactivos
- Lightbox operable con flechas y Escape
- Touch targets ≥ 44px
- `prefers-reduced-motion` respetado en media query

---

## 📄 Licencia

Uso interno. Todos los derechos reservados — Fumigaciones Magistrales Del Valle
