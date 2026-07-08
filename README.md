# Fumigaciones Magistral — FM

> Sitio web premium para empresa de fumigación y control de plagas en Santiago de Cali.

<p align="left">
  <img alt="Estado" src="https://img.shields.io/badge/status-en%20producción-success?style=flat-square" />
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img alt="Anime.js" src="https://img.shields.io/badge/Anime.js-3.2.1-red?style=flat-square" />
  <img alt="Formspree" src="https://img.shields.io/badge/Formspree-activo-blue?style=flat-square" />
  <img alt="Google Maps" src="https://img.shields.io/badge/Google_Maps-Embed-4285F4?style=flat-square" />
</p>

---

## 📂 Estructura del proyecto

```
plagas-site/
│
├── index.html              # Inicio con hero, contadores, servicios y CTA
├── services.html           # Servicios, proceso, garantías y FAQ
├── about.html              # Timeline, valores, equipo y certificaciones
├── contact.html            # Formulario Formspree + Google Maps
│
├── css/
│   └── style.css           # Variables, diseño, componentes, responsive
│
├── js/
│   ├── animations.js       # Motor de animaciones (Anime.js + Observer)
│   └── script.js           # Menú, carrusel, formulario, navegación
│
└── README.md
```

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
| Estructura | HTML5 semántico con Open Graph y meta SEO |
| Estilos | CSS3 con variables, clamp() y mobile-first |
| Interactividad | JavaScript vanilla sin frameworks |
| Animaciones | Anime.js 3.2.1 sobre CDN |
| Tipografía | Google Fonts · Inter + Playfair Display |
| Formulario | Formspree con validación client-side |
| Mapas | Google Maps Embed (iframe) |

---

## 🎨 Paleta y tipografía

| Uso | Valor |
|-----|-------|
| Rojo corporativo | `#CC0000` |
| Rojo hover | `#AA0000` |
| Dorado | `#D4A847` |
| Fondo | `#0A0A0A` |
| Texto light | `#FFFFFF` |
| Texto muted | `#999999` |
| Fuente UI | Inter |
| Fuente display | Playfair Display |

---

## ✨ Qué incluye el sitio

### Animaciones

| Animación | Tecnología |
|-----------|-----------|
| Niebla de fumigación en hero | Canvas 2D · 400 partículas |
| Escudo 3D rotatorio | CSS transforms + Anime.js |
| Ondas de pulso expansivas | DOM dinámico + Anime.js timeline |
| Parallax 3D en hover | Perspectiva + mousemove |
| Orbes flotantes con glow | keyframes + backdrop-filter |
| Tarjetas con tilt 3D | mousemove · rotateX/Y |
| Contadores elásticos + confeti | elastic easing |
| SVGs auto-dibujables | stroke-dasharray + IntersectionObserver |
| Partículas al mover el cursor | requestAnimationFrame |
| Transición entre páginas | Overlay fullscreen |
| Parallax por scroll | Scroll-listener pasivo |
| Hover glow en tablas | Anime.js backgroundColor |

### Componentes

- **Navbar** dinámico con cambio de color por scroll
- **Barra de progreso** fija de lectura
- **Botón volver arriba** con entrada animada
- **WhatsApp flotante** con pulso suave
- **Loader** de entrada con logo animado
- **Cookie consent** con localStorage
- **Modal** de detalle de servicio
- **FAQ accordion** toggle único
- **Botones magnéticos** (efecto imán)
- **focus-visible** en links y botones
- **Accesibilidad**: alt texts, aria-labels, semántica mejorada

---

## 🔧 Modificar

| Cambio | Lugar |
|-------|-------|
| Colores y tokens | Variables `:root` en `style.css` |
| Número de WhatsApp | `whatsappFloat()` en `animations.js` |
| Acción del formulario | Atributo `action=""` en `contact.html` |
| Teléfonos de contacto | Texto en `contact.html` |
| Textos del hero | Sección `.hero` en `index.html` |

---

## 🏗️ Cómo está organizado el JS

```
animations.js
├── Helpers: el(), els(), onVisibleEach(), observeElements()
├── Helper genérico: staggerReveal() para evitar código duplicado
├── 25+ animaciones temáticas organizadas por número
├── 4 animaciones 3D interactivas
├── Componentes UX: loader, WhatsApp, progress bar, back-to-top
├── Features premium: modal, FAQ, cookie, transiciones, magnéticos
└── initAnimations() → entry point

script.js
├── Menú hamburguesa responsive
├── Carrusel de testimonios con autoplay
├── Validación de formulario + Formspree
├── smooth scroll para anclas
└── ranura del loader
```

---

## ♿ Accesibilidad

- Navegación completa por teclado (`focus-visible`)
- Etiquetas semánticas (`<header>`, `<main>`, `<section>`, `<footer>`)
- ARIA labels en elementos interactivos
- Orden de foco lógico
- `prefers-reduced-motion` respetado en media query

---

## 📄 Licencia

Uso interno. Todos los derechos reservados — Fumigaciones Magistral FM
