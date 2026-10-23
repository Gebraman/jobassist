import fs from 'fs';

const html = fs.readFileSync('workable_page.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
console.log('Script tags count:', scriptMatches.length);
for (let i = 0; i < scriptMatches.length; i++) {
  const content = scriptMatches[i][1].trim();
  if (content.length > 50) {
    console.log('Script ' + i + ' len: ' + content.length + ' preview: ' + content.slice(0, 150));
  }
}
