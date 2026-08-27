# Publicar el sitio en GitHub Pages

El repo ya está en GitHub (`bydavidp/PaginaWM`, rama `master`) y el sitio es
HTML estático, así que no hace falta build ni servidor.

URL final: **https://bydavidp.github.io/PaginaWM/**

---

## 1. Ver el sitio antes de publicar

Abre una terminal en `C:\Users\dpala\PROYECTOS\plagas-site` y corre:

```bash
npx serve .
```

Luego abre la URL que imprime (normalmente http://localhost:3000).

> Abrir `index.html` con doble clic también funciona, pero las rutas
> relativas y el mapa embebido se comportan mejor con servidor local.

Revisa en el navegador, con las DevTools en modo móvil (F12 → Ctrl+Shift+M):

- La barra fija de abajo con "Llamar" y "Cotizar por WhatsApp" solo aparece en móvil.
- El menú hamburguesa abre y cierra.
- El cotizador calcula y el botón de WhatsApp arma el mensaje.
- La galería filtra y el lightbox abre.
- El acordeón de FAQ en `services.html`.

---

## 2. Subir los cambios

```bash
cd C:\Users\dpala\PROYECTOS\plagas-site
git add -A
git commit -m "Rediseño visual, mejoras de conversión y SEO local"
git push origin master
```

---

## 3. Activar GitHub Pages

1. Entra a https://github.com/bydavidp/PaginaWM/settings/pages
2. En **Source**, elige `Deploy from a branch`.
3. En **Branch**, elige `master` y carpeta `/ (root)`. Guarda.
4. Espera 1–2 minutos. La URL aparece en esa misma pantalla.

---

## 4. Después de publicar

**Google Search Console** — https://search.google.com/search-console

1. Añade la propiedad `https://bydavidp.github.io/PaginaWM/` (tipo "Prefijo de URL").
2. Verifica con el método de etiqueta HTML: te dará un `<meta name="google-site-verification" ...>` para pegar en el `<head>` de `index.html`.
3. En **Sitemaps**, envía `sitemap.xml`.

**Google Business Profile** — https://business.google.com

Para un negocio local en Cali esto pesa más que el sitio web en sí. Crea la
ficha con la dirección real, horario, fotos de trabajos y el enlace al sitio.
Pide reseñas a clientes reales: es lo que hace aparecer el negocio en el mapa.

**Analítica** (opcional) — Google Analytics 4 o Plausible. Pega el script
antes de `</head>` en las cuatro páginas.

---

## 5. Cuando compres el dominio propio

Un dominio propio (`fumigacionesmagistral.com`) da mucha más confianza que una
URL de github.io. Cuando lo tengas:

1. Crea un archivo `CNAME` en la raíz del repo con una sola línea:
   ```
   www.fumigacionesmagistral.com
   ```
2. En tu proveedor de dominio, crea un registro `CNAME` de `www` →
   `bydavidp.github.io`.
3. En Settings → Pages, pon el dominio en **Custom domain** y marca
   **Enforce HTTPS**.
4. Reemplaza `https://bydavidp.github.io/PaginaWM/` por
   `https://www.fumigacionesmagistral.com/` en:
   - `index.html`, `services.html`, `about.html`, `contact.html`
     (canonical, `og:url`, `og:image` y los bloques `application/ld+json`)
   - `sitemap.xml`
   - `robots.txt`
5. Vuelve a enviar el sitemap en Search Console con la propiedad nueva.

---

## Pendientes de contenido

- **Fotos reales en la galería.** Ya integradas en `img/servicios/` (23 fotos + 2 videos en `img/video/`). Para agregar más: exportar a `img/servicios/NOMBRE.jpg` (max 1400px) y su miniatura a `img/servicios/thumb/NOMBRE.jpg` (max 700px), y sumar el `<figure class="galeria__item">` correspondiente en `index.html`.
  Seis fotos de trabajos reales (antes/después funcionan muy bien) convierten
  bastante más que ilustraciones genéricas.
- **Precios del cotizador.** Están en `index.html`, en los `data-precio` del
  `<select id="cot-tipo">`, y los extras en el mismo bloque. Confirma que sigan
  vigentes.
- **Aviso de privacidad y términos.** Los enlaces del footer apuntan a `#`.
- **Formspree.** El formulario de `contact.html` envía a
  `https://formspree.io/f/xqapwewq`. Verifica que esa cuenta esté activa y que
  los correos lleguen.
