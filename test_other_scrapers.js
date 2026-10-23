async function testOtherBoards() {
  // Test RemoteOK with date filtering
  try {
    const res = await fetch('https://remoteok.com/api', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.ok) {
      const data = await res.json();
      const freshRok = data.slice(1).filter(j => {
        if (!j.date) return false;
        const days = (Date.now() - new Date(j.date).getTime()) / (1000 * 3600 * 24);
        return days <= 5;
      });
      console.log(`RemoteOK: ${freshRok.length} fresh jobs posted <= 5 days ago`);
      if (freshRok[0]) {
        console.log('Sample RemoteOK:', { title: freshRok[0].position, company: freshRok[0].company, date: freshRok[0].date });
      }
    }
  } catch(e) {
    console.error('RemoteOK err:', e.message);
  }

  // Test WeWorkRemotely RSS
  try {
    const res = await fetch('https://weworkremotely.com/categories/remote-programming-jobs.rss', { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.ok) {
      const xml = await res.text();
      const items = xml.split('<item>').slice(1);
      console.log(`WeWorkRemotely RSS: ${items.length} items`);
    }
  } catch(e) {
    console.error('WWR err:', e.message);
  }
}

testOtherBoards();
