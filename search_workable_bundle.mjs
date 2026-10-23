async function searchWorkableBundle() {
  const url = 'https://dcvxs6ggqztsa.cloudfront.net/candidate/releases/careers.6901cd820c44d775.js';
  const res = await fetch(url);
  const text = await res.text();
  console.log('Bundle length:', text.length);
  const matches = [...text.matchAll(/\/api\/v[0-9]\/[a-zA-Z0-9_\-\/]+/g)].map(m => m[0]);
  console.log('API routes in bundle:', [...new Set(matches)]);
}

searchWorkableBundle();
