// Dev-only helper: receives a POSTed data URL and writes it to tools/build/.
// Used to pull a canvas render out of the browser for visual inspection, since
// the browser screenshot path is unavailable. Not part of the site.
import http from 'node:http';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('build');
mkdirSync(OUT, { recursive: true });

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }

  let body = '';
  req.on('data', (d) => { body += d; });
  req.on('end', () => {
    try {
      const name = (req.url || '/x').replace(/[^a-z0-9._-]/gi, '') || 'out.png';
      const b64 = body.includes(',') ? body.split(',')[1] : body;
      const file = path.join(OUT, name);
      writeFileSync(file, Buffer.from(b64, 'base64'));
      console.log('wrote', file, Buffer.from(b64, 'base64').length, 'bytes');
      res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
    } catch (e) {
      res.writeHead(500).end(String(e));
    }
  });
}).listen(8778, '127.0.0.1', () => console.log('receiver on http://127.0.0.1:8778'));
