import fs from 'fs';

const html = fs.readFileSync('ashby_page.html', 'utf8');
const manifestMatches = [...html.matchAll(/frontend_non_user\/[a-f0-9]+\/([^"'\s]+)/g)].map(m => m[0]);
console.log('Manifest matches:', manifestMatches);
