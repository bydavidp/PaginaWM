/**
 * Servidor estático mínimo para desarrollo y previsualización.
 *
 * Uso:
 *   npm run dev              → sirve la raíz del proyecto en localhost:3000
 *   npm run preview          → sirve dist/ en localhost:3000
 *   node tools/serve.mjs dist 4200
 */
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = process.argv[2] ?? '.';
const PORT = Number(process.argv[3] ?? process.env.PORT ?? 3000);
const BASE = path.resolve(ROOT, target);

const MIME = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8'
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  let file = path.join(BASE, clean);

  /* Evita salir del directorio servido. */
  if (!file.startsWith(BASE)) return null;

  try {
    const info = await stat(file);
    if (info.isDirectory()) file = path.join(file, 'index.html');
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? '/');

  if (!file) {
    const notFound = path.join(BASE, '404.html');
    try {
      const html = await readFile(notFound);
      res.writeHead(404, { 'Content-Type': MIME['.html'] });
      res.end(html);
    } catch {
      res.writeHead(404, { 'Content-Type': MIME['.txt'] });
      res.end('404');
    }
    return;
  }

  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT} (${path.relative(ROOT, BASE) || '.'})`);
});
