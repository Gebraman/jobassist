import fs from 'fs';

const html = fs.readFileSync('workable_page.html', 'utf8');
const scripts = [...html.matchAll(/src="([^">]+)"/g)].map(m => m[1]);
console.log('Scripts in workable_page.html:', scripts);
