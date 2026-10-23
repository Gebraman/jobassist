import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extDir = path.join(__dirname, 'extension');
const pubDir = path.join(__dirname, 'public');

// 1. Synchronize content script to public bookmarklet
const content = fs.readFileSync(path.join(extDir, 'content.js'), 'utf8');
fs.writeFileSync(path.join(pubDir, 'jobassist-autofill.js'), content, 'utf8');
console.log('✓ Synchronized jobassist-autofill.js');

// 2. Build unpacked extension zip distribution package
try {
  const zipDest = path.join(pubDir, 'JobAssist-AI-Studio-Extension.zip');
  execSync(`powershell -Command "Compress-Archive -Path '${extDir}\\*' -DestinationPath '${zipDest}' -Force"`);
  const stats = fs.statSync(zipDest);
  console.log(`✓ Rebuilt JobAssist-AI-Studio-Extension.zip (${Math.round(stats.size / 1024)} KB)`);
} catch(e) {
  console.warn('Zip rebuild notice:', e.message);
}
