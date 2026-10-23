const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function testLinkedInFresh(query = 'Bookkeeper') {
  // f_TPR=r432000 is the official LinkedIn filter for past 5 days (432,000 seconds)
  // sortBy=DD sorts Date Descending (newest first)
  const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(query)}&location=Remote&f_TPR=r432000&sortBy=DD&start=0`;
  console.log('Querying:', url);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'X-Requested-With': 'XMLHttpRequest'
      },
      signal: AbortSignal.timeout(10000)
    });

    console.log('Response Status:', res.status);
    const html = await res.text();
    const chunks = html.split('data-entity-urn="urn:li:jobPosting:').slice(1);
    console.log(`Parsed ${chunks.length} job chunks`);

    const jobs = [];
    for (const chunk of chunks.slice(0, 8)) {
      const titleMatch = chunk.match(/class="base-search-card__title"[^>]*>([\s\S]*?)<\/h3>/i);
      const compMatch = chunk.match(/class="base-search-card__subtitle"[^>]*>([\s\S]*?)<\/h4>/i);
      const dateMatch = chunk.match(/datetime="([^"]+)"/i);
      const timeAgoMatch = chunk.match(/class="job-search-card__listdate[^"]*"[^>]*>([\s\S]*?)<\/time>/i);

      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      const company = compMatch ? compMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      const postDate = dateMatch ? dateMatch[1] : '';
      const timeAgo = timeAgoMatch ? timeAgoMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      jobs.push({ title, company, postDate, timeAgo });
    }

    console.log('Results:', jobs);
  } catch(err) {
    console.error('Scrape error:', err.message);
  }
}

testLinkedInFresh();
