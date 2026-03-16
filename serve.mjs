import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;

const mime = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.mp4': 'video/mp4',
  '.ico': 'image/x-icon', '.txt': 'text/plain', '.mjs': 'text/javascript',
};

createServer(async (req, res) => {
  let url = req.url.split('?')[0];

  if (url === '/') {
    res.writeHead(302, { Location: '/portfolio/index.html' });
    res.end();
    return;
  }

  const filePath = join(__dirname, decodeURIComponent(url));
  const ct = mime[extname(filePath).toLowerCase()] || 'application/octet-stream';

  let fileStat;
  try {
    fileStat = await stat(filePath);
  } catch {
    res.writeHead(404);
    res.end('Not found: ' + url);
    return;
  }

  const fileSize = fileStat.size;
  const rangeHeader = req.headers['range'];

  if (rangeHeader) {
    // ── Partial content (range request) — required for video streaming ──
    const [, rangeStr] = rangeHeader.match(/bytes=(\d*)-(\d*)/) || [];
    const parts = rangeHeader.replace('bytes=', '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      'Content-Range':  `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges':  'bytes',
      'Content-Length': chunkSize,
      'Content-Type':   ct,
    });
    createReadStream(filePath, { start, end }).pipe(res);
  } else {
    // ── Full file ──
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Accept-Ranges':  'bytes',
      'Content-Type':   ct,
    });
    createReadStream(filePath).pipe(res);
  }

}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
