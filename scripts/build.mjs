import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const publicFiles = ['index.html', 'styles.css', 'app.js', 'data.mjs'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of publicFiles) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

fs.writeFileSync(path.join(dist, '_redirects'), '/* /index.html 200\n', 'utf8');
console.log(`Static production build created in ${dist}`);

