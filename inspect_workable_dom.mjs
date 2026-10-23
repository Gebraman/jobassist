async function searchAttributes() {
  const url = 'https://dcvxs6ggqztsa.cloudfront.net/candidate/releases/careers.6901cd820c44d775.js';
  const res = await fetch(url);
  const text = await res.text();
  
  const attrMatches = [...text.matchAll(/data-[a-z-]+="([^"]+)"/g)].map(m => m[0]);
  console.log('data-* attributes:', [...new Set(attrMatches)].slice(0, 30));
}

searchAttributes();
