import { mkdir, copyFile, writeFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await copyFile('src/app.html', 'dist/index.html');
const manifest = {
  name: 'Mada Commerce Premium', short_name: 'Mada Commerce', start_url: './', display: 'standalone',
  background_color: '#0f172a', theme_color: '#0f172a', lang: 'fr'
};
await writeFile('dist/manifest.webmanifest', JSON.stringify(manifest, null, 2));
console.log('Build complete: dist/index.html');
