async function getManifest() {
  const url = 'https://cdn.ashbyprd.com/frontend_non_user/d1bff50522060ded06f7f753142defdf6130b6da/.vite/manifest.json';
  const res = await fetch(url);
  const json = await res.json();
  console.log(json);
}

getManifest();
