/**
 * Verifica que todas las referencias locales del HTML existan en disco.
 *
 * Uso:
 *   npm run check            → revisa la raíz del proyecto
 *   node tools/check-links.mjs dist   → revisa el build
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = path.resolve(ROOT, process.argv[2] ?? '.');

const EXTRA_REF_ATTRS = ['href', 'src', 'poster', 'data-full'];

function isLocal(ref) {
  return !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(ref);
}

function references(html) {
  const refs = [];

  for (const attr of EXTRA_REF_ATTRS) {
    for (const match of html.matchAll(new RegExp(`\\s${attr}="([^"]+)"`, 'gi'))) {
      refs.push(match[1]);
    }
  }

  for (const match of html.matchAll(/\ssrcset="([^"]+)"/gi)) {
    for (const candidate of match[1].split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) refs.push(url);
    }
  }

  return refs;
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let pages;
  try {
    pages = (await readdir(BASE)).filter((file) => file.endsWith('.html')).sort();
  } catch {
    console.error(`✗ No existe el directorio ${BASE}`);
    process.exit(1);
  }

  const problems = [];
  let checked = 0;

  for (const page of pages) {
    const html = await readFile(path.join(BASE, page), 'utf8');

    for (const ref of references(html)) {
      if (!isLocal(ref)) continue;

      const target = path.join(BASE, decodeURIComponent(ref.split(/[?#]/)[0]));
      checked += 1;

      if (!(await exists(target))) {
        problems.push(`${page}: ${ref}`);
      }
    }
  }

  console.log(`📄 ${pages.length} páginas, ${checked} referencias locales revisadas`);

  if (!problems.length) {
    console.log('✅ Sin enlaces ni assets rotos');
    return;
  }

  console.error(`\n⚠ ${problems.length} referencia(s) sin archivo:\n`);
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`✗ ${error.stack ?? error}`);
  process.exit(1);
});
