# Herramientas del proyecto

Scripts de desarrollo, build y verificación. Todos los `.mjs` son ESM y no
necesitan dependencias más allá de `esbuild` (declarada en `package.json`).

| Script | Uso | Qué hace |
|--------|-----|----------|
| `build.mjs` | `npm run build` | Minifica CSS/JS con esbuild, copia el sitio a `dist/` y versiona las referencias con un hash de contenido. Verifica la sintaxis de cada JS generado y que toda referencia local exista. |
| `serve.mjs` | `npm run dev` / `npm run preview` | Servidor estático sin dependencias. Acepta directorio y puerto: `node tools/serve.mjs dist 4200`. |
| `check-links.mjs` | `npm run check` | Recorre todos los HTML y comprueba que cada `href`, `src`, `srcset`, `poster` y `data-full` local exista. Con `dist` como argumento revisa el build. |
| `audit-html.py` | `npm run audit` | Balance de etiquetas, IDs duplicados y referencias locales. Acepta un directorio: `python tools/audit-html.py dist`. Solo requiere Python 3. |
| `add-faq-schema.mjs` | `npm run faq` | Añade `FAQPage` a las páginas de servicio. Idempotente: si la página ya lo tiene, no la toca. |
| `generar-servicios.mjs` | `npm run generate` | Genera las 7 landing pages de servicio desde una plantilla común. |

## Flujo recomendado

```bash
npm install            # primera vez
npm run dev            # desarrollo en localhost:3000

npm run build          # build de producción en dist/
npm run check:dist     # ¿falta algún asset?
npm run audit:dist     # ¿HTML bien formado?
npm run preview        # revisar dist/ en el navegador
```

## Reglas

- **El fuente no se minifica.** Los HTML de la raíz apuntan a
  `css/style.css` y `js/*.js` legibles. Solo `dist/` lleva `.min.*`.
- **No se versionan artefactos.** `dist/` y `node_modules/` están en
  `.gitignore`.
- **Nada de minificadores con regex.** Usan esbuild, que respeta strings,
  regex, `calc()` y `clamp()`.
- **La versión de caché la calcula el build** (`?v=<hash>`); en la raíz se sube
  a mano (`?v=N`) cuando cambian CSS o JS, porque GitHub Pages publica la raíz.
