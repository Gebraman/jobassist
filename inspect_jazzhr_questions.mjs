import fs from 'fs';

const html = fs.readFileSync('jazzhr_page.html', 'utf8');

const regex = /<label[^>]*for="([^"]*resumator-questionnaire[^"]*)"[^>]*>([\s\S]*?)<\/label>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  const forId = match[1];
  const label = match[2].replace(/<[^>]+>/g, '').trim();
  console.log(`\nQUESTION FOR [${forId}]:`);
  console.log(`Label: "${label}"`);

  // Find the select or input matching forId
  const idx = html.indexOf(`id="${forId}"`);
  if (idx !== -1) {
    const chunk = html.slice(idx, idx + 1000);
    const options = [...chunk.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/g)].map(o => `val="${o[1]}" text="${o[2].trim()}"`);
    if (options.length > 0) {
      console.log('Options:', options);
    }
  }
}
