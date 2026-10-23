import fs from 'fs';

const html = fs.readFileSync('jazzhr_page.html', 'utf8');

const regex = /<label[^>]*id=['"]([^'"]*resumator[^'"]*-label)['"][^>]*>([\s\S]*?)<\/label>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  const lblId = match[1];
  const forId = lblId.replace(/-label$/, '');
  const label = match[2].replace(/<[^>]+>/g, '').trim();
  console.log(`\n==========================================`);
  console.log(`FIELD [${forId}]: "${label}"`);

  const fieldIdx = html.indexOf(`id="${forId}"`) !== -1 ? html.indexOf(`id="${forId}"`) : html.indexOf(`id='${forId}'`);
  if (fieldIdx !== -1) {
    const chunk = html.slice(fieldIdx, fieldIdx + 1200);
    const tag = chunk.slice(0, chunk.indexOf('>') + 1);
    console.log('Tag:', tag);
    const options = [...chunk.matchAll(/<option[^>]*value=['"]([^'"]*)['"][^>]*>([\s\S]*?)<\/option>/g)].map(o => `val="${o[1]}" text="${o[2].trim()}"`);
    if (options.length > 0) {
      console.log('Options:\n ', options.join('\n  '));
    }
  }
}
