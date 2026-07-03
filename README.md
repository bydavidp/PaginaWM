# Fumigaciones magistral — FM

Sitio web profesional para una empresa de fumigación y control de plagas en Santiago de Cali.

## Tech Stack

- **HTML5** semántico con metadatos Open Graph
- **CSS3** con variables, glassmorphism, animaciones clave
- **JavaScript** vanilla con [Anime.js](https://animejs.com) v3.2.1
- Google Fonts (Inter + Playfair Display)
- Formulario conectado a [Formspree](https://formspree.io)
- Google Maps embed

## Estructura

```
plagas-site/
├── index.html          # Página principal
├── services.html       # Servicios detallados + FAQ
├── about.html          # Nosotros, equipo, certificaciones
├── contact.html        # Formulario + mapa + contacto
├── css/
│   └── style.css       # ~2600 líneas, diseño completo
├── js/
│   ├── animations.js   # Animaciones con Anime.js
│   └── script.js       # Menú, formulario, testimonios
└── README.md
```

## Características

### Páginas
- **Inicio**: Hero con niebla animada (400 partículas canvas), contadores elásticos, confeti, cards con tilt 3D, testimonios, CTA con efecto scan
- **Servicios**: 7 servicios detallados con tabs, tabla comparativa, proceso en 4 pasos, garantías, FAQ accordion
- **Nosotros**: Timeline animado, valores, equipo, certificaciones
- **Contacto**: Formulario con validación + Formspree, Google Maps, info de contacto

### Animaciones (Anime.js)
- Neblina de partículas en hero
- Escudo 3D rotatorio
- Ondas de pulso expansivas
- Parallax 3D en hero
- Orbes flotantes con luz volumétrica
- Tilt magnético en tarjetas
- Contador con efecto elástico + confeti
- SVGs que se dibujan solos al hacer scroll
- Spray de partículas al mover el mouse
- Transición suave entre páginas

### UX
- Glassmorphism en navbar con cambio de color según sección
- Barra de progreso de lectura
- Botón volver arriba
- WhatsApp flotante
- Loader de entrada animado
- Cookie consent banner
- Modales de servicio al hacer click en "Ver más"
- Botones magnéticos que siguen el cursor
- Navegación por teclado con focus-visible
- Responsive mobile-first

## Cómo usar

Abre cualquier archivo `.html` en el navegador. No necesita build ni servidor.

```bash
# Si tienes Python
python -m http.server 8000

# O con Node
npx serve .
```

## Personalización

- **Colores**: variables CSS en `:root` en `style.css`
- **WhatsApp**: editar número en `js/animations.js` (función `whatsappFloat`)
- **Formulario**: cambiar action de Formspree en `contact.html`

## Licencia

Uso interno. Todos los derechos reservados — Fumigaciones magistral FM.
