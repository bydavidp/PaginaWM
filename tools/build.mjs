/**
 * Build de producción.
 *
 * Toma el sitio tal como está en la raíz (HTML + CSS + JS legibles),
 * minifica los assets con esbuild y deja el resultado listo para publicar
 * en `dist/`. El código fuente nunca se modifica.
 *
 * Uso:  npm run build
 */
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const CSS_ENTRY = 'css/style.css';
const JS_ENTRIES = [
  'js/anime-loader.js',
  'js/animations.js',
  'js/particles.js',
  'js/script.js',
  'js/config.js',
  'js/analytics.js'
];
/** Se copian sin tocar: ya vienen minificados de fábrica. */
const JS_VENDOR = ['js/vendor/anime.min.js'];
const STATIC_DIRS = ['img', 'fonts'];
const STATIC_FILES = ['favicon.ico', 'robots.txt', 'sitemap.xml', '_headers', '.nojekyll'];

const TARGET = ['chrome100', 'firefox100', 'safari15', 'edge100'];

/** Reescribe referencias locales a los assets minificados con versión nueva. */
const REF_RULES = [
  { from: /(href=")css\/style\.css(?:\?v=[\w.-]+)?(")/g, to: '$1css/style.min.css?v=__V__$2' },
  { from: /(src=")js\/([\w-]+)\.js(?:\?v=[\w.-]+)?(")/g, to: '$1js/$2.min.js?v=__V__$3' }
];

const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

function checkSyntax(file) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (error) {
    fail(`JS inválido tras minificar: ${path.relative(ROOT, file)}\n${error.stderr?.toString() ?? ''}`);
  }
}

async function minifyCss() {
  const source = await readFile(path.join(ROOT, CSS_ENTRY), 'utf8');
  const { code } = await transform(source, { loader: 'css', minify: true, target: TARGET });

  const output = path.join(DIST, 'css', 'style.min.css');
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, code);

  return { source: Buffer.byteLength(source), output: Buffer.byteLength(code) };
}

async function minifyJs() {
  const totals = { source: 0, output: 0 };
  const generated = [];

  for (const entry of JS_ENTRIES) {
    const source = await readFile(path.join(ROOT, entry), 'utf8');
    const { code } = await transform(source, { loader: 'js', minify: true, target: TARGET });

    const output = path.join(DIST, entry.replace(/\.js$/, '.min.js'));
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, code);
    checkSyntax(output);

    totals.source += Buffer.byteLength(source);
    totals.output += Buffer.byteLength(code);
    generated.push(output);
  }

  return { totals, generated };
}

/** Copia recursivamente un directorio del proyecto a dist/. */
async function copyDir(name) {
  const from = path.join(ROOT, name);
  try {
    await stat(from);
  } catch {
    return false;
  }
  await cp(from, path.join(DIST, name), { recursive: true });
  return true;
}

async function copyStatic() {
  const pages = (await readdir(ROOT)).filter((file) => file.endsWith('.html'));
  for (const page of pages) {
    await cp(path.join(ROOT, page), path.join(DIST, page));
  }

  for (const dir of STATIC_DIRS) {
    await copyDir(dir);
  }

  for (const file of [...STATIC_FILES, ...JS_VENDOR]) {
    try {
      await cp(path.join(ROOT, file), path.join(DIST, file), { recursive: true });
    } catch {
      /* Archivo opcional que no existe en este checkout. */
    }
  }

  return pages;
}

/** Hash corto del contenido minificado: cambia solo si cambia algún asset. */
async function buildVersion(files) {
  const hash = crypto.createHash('sha256');
  for (const file of files.sort()) {
    hash.update(await readFile(file));
  }
  return hash.digest('hex').slice(0, 8);
}

async function stampHtml(pages, version) {
  for (const page of pages) {
    const file = path.join(DIST, page);
    let html = await readFile(file, 'utf8');
    for (const rule of REF_RULES) {
      html = html.replace(rule.from, rule.to);
    }
    await writeFile(file, html.replaceAll('__V__', version));
  }

  /* anime-loader.js arma la ruta del vendor desde JavaScript. */
  const loader = path.join(DIST, 'js', 'anime-loader.min.js');
  const code = await readFile(loader, 'utf8');
  await writeFile(loader, code.replace(/anime\.min\.js\?v=[\w.-]+/g, `anime.min.js?v=${version}`));
}

/** Comprueba que toda referencia local del HTML existe dentro de dist/. */
async function verifyReferences(pages) {
  const missing = [];

  for (const page of pages) {
    const html = await readFile(path.join(DIST, page), 'utf8');
    const refs = new Set();

    for (const match of html.matchAll(/(?:href|src|poster|data-full)="([^"]+)"/g)) {
      refs.add(match[1]);
    }
    for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of match[1].split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) refs.add(url);
      }
    }

    for (const ref of refs) {
      if (/^(?:[a-z]+:|\/\/|#)/i.test(ref)) continue;
      const target = path.join(DIST, decodeURIComponent(ref.split(/[?#]/)[0]));
      try {
        await stat(target);
      } catch {
        missing.push(`${page}: ${ref}`);
      }
    }
  }

  if (missing.length) {
    fail(`Referencias locales sin archivo en dist/:\n  - ${missing.join('\n  - ')}`);
  }
}

async function main() {
  console.log('🚀 Build de Fumigaciones Magistrales Del Valle\n');

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  console.log('🎨 Minificando CSS...');
  const css = await minifyCss();
  console.log(`   ✓ style.min.css: ${kb(css.source)} → ${kb(css.output)}\n`);

  console.log('⚡ Minificando JavaScript...');
  const { totals, generated } = await minifyJs();
  generated.forEach((file) => console.log(`   ✓ ${path.basename(file)}`));
  console.log(`   Total: ${kb(totals.source)} → ${kb(totals.output)}\n`);

  console.log('📁 Copiando páginas y assets estáticos...');
  const pages = await copyStatic();
  console.log(`   ✓ ${pages.length} páginas, ${STATIC_DIRS.join(' y ')}\n`);

  const version = await buildVersion([
    ...generated,
    path.join(DIST, 'css', 'style.min.css'),
    ...JS_VENDOR.map((file) => path.join(DIST, file))
  ]);
  await stampHtml(pages, version);
  console.log(`🔖 Versión de assets: v=${version}\n`);

  await verifyReferences(pages);
  console.log('🔍 Referencias locales verificadas\n');

  console.log(`✅ Build listo en dist/ (${pages.length} páginas)`);
}

main().catch((error) => fail(error.stack ?? String(error)));
