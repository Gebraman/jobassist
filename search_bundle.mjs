async function searchGql() {
  const url = 'https://cdn.ashbyprd.com/frontend_non_user/d1bff50522060ded06f7f753142defdf6130b6da/assets/index-uQAYHcsE.js';
  const res = await fetch(url);
  const text = await res.text();
  const queries = [...text.matchAll(/query\s+([A-Za-z0-9_]+)/g)].map(m => m[1]);
  console.log('Queries in bundle:', [...new Set(queries)]);
}

searchGql();
