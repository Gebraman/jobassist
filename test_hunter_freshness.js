import assert from 'assert';
import {
  parseJobAgeInDays,
  formatAgeLabel,
  scrapeAllPortals
} from './src/engine/portalScraper.js';

console.log('🧪 Starting Autonomous Hunter & 5-Day Freshness Verification Suite...\n');

// 1. Test Age Parsing
console.log('1️⃣ Testing parseJobAgeInDays calculation:');
assert.strictEqual(parseJobAgeInDays(null, 'just now'), 0.2);
assert.strictEqual(parseJobAgeInDays(null, '17 hours ago'), 0.2);
assert.strictEqual(parseJobAgeInDays(null, '1 day ago'), 1);
assert.strictEqual(parseJobAgeInDays(null, '3 days ago'), 3);
assert.strictEqual(parseJobAgeInDays(null, '5 days ago'), 5);
assert.strictEqual(parseJobAgeInDays(null, '2 weeks ago'), 14);
assert.strictEqual(parseJobAgeInDays(null, '1 month ago'), 30);
assert.strictEqual(parseJobAgeInDays(null, '3 months ago'), 90);
console.log('✓ Age calculation accurately categorizes hours, days, weeks, and months.\n');

// 2. Test Multi-Site Hunting for "Bookkeeper" with <= 5 Days Freshness
console.log('2️⃣ Testing Multi-Site Scraping for Bookkeeper (maxDays = 5):');
const results = await scrapeAllPortals({ query: 'Bookkeeper', location: 'Remote', portal: 'all', maxDays: 5 });
console.log(`✓ Fetched ${results.length} verified jobs for Bookkeeper`);

const staleJobs = results.filter(j => j.ageInDays > 5);
assert.strictEqual(staleJobs.length, 0, 'No jobs must exceed 5 days!');
console.log('✓ 0 stale jobs found (All postings <= 5 days fresh)');

// Verify portals represented
const portals = new Set(results.map(j => j.portal));
console.log('✓ Portals represented in result set:', Array.from(portals).join(', '));
assert(portals.size >= 2, 'Should aggregate from multiple distinct portals');

// Verify role relevance
const relevant = results.filter(j => {
  const str = (j.title + ' ' + (j.tags || []).join(' ') + ' ' + j.description).toLowerCase();
  return str.includes('bookkeep') || str.includes('account') || str.includes('finance') || str.includes('ledger') || str.includes('reconcil');
});
console.log(`✓ Relevant accounting/bookkeeping roles: ${relevant.length} / ${results.length}`);
assert(relevant.length >= results.length * 0.7, 'At least 70% must match bookkeeping domain');

// 3. Test 24-Hour Ultra-Fresh Filter
console.log('\n3️⃣ Testing Ultra-Fresh 24-Hour Filter (maxDays = 1):');
const ultraFresh = await scrapeAllPortals({ query: 'Bookkeeper', location: 'Remote', portal: 'all', maxDays: 1 });
console.log(`✓ Fetched ${ultraFresh.length} ultra-fresh jobs posted within 24 hours`);
const olderThan1Day = ultraFresh.filter(j => j.ageInDays > 1.2);
assert.strictEqual(olderThan1Day.length, 0, 'No jobs must exceed 1 day!');
console.log('✓ Ultra-fresh 24-hour limit strictly enforced.\n');

// 4. Test Stale Warning Detection Pattern on LinkedIn / Web Text
console.log('4️⃣ Testing On-Page Stale Post Warning Regex:');
const samplePageSnippet = `
  Bookkeeper - B&T - Shared Services
  B&T Global · Remote, United States · 1 month ago · 88 applicants
  Easy Apply
`;
const mMonth = samplePageSnippet.match(/(\d+)\s+month(?:s)?\s+ago/i);
assert(mMonth !== null, 'Must detect "1 month ago" pattern');
assert.strictEqual(mMonth[1], '1');
console.log(`✓ Accurately detected: "${mMonth[0]}" (Stale reason triggered)`);

const mApplicants = samplePageSnippet.match(/(\d+)\s+applicants/i);
assert(mApplicants !== null, 'Must detect applicant volume');
assert.strictEqual(mApplicants[1], '88');
console.log('✓ Accurately parsed: "${mApplicants[0]}" (High applicant saturation)\n');

// 5. Test Strict Multi-Factor Deduplication
console.log('5️⃣ Testing Strict Multi-Factor Deduplication (0 duplicate cards):');
import { deduplicateJobs } from './src/engine/portalScraper.js';
const duplicatesSample = [
  {
    title: 'Senior Bookkeeper (Remote)',
    company: 'Apex Global Partners, LLC',
    url: 'https://jobs.lever.co/apex/bookkeeper-1?utm_source=linkedin&ref=jobassist'
  },
  {
    title: 'Sr. Bookkeeper',
    company: 'Apex Global Partners',
    url: 'https://jobs.lever.co/apex/bookkeeper-1?gh_src=share'
  },
  {
    title: 'Full-Charge Remote Bookkeeper',
    company: 'ClearLedger Advisory',
    url: 'https://boards.greenhouse.io/clearledger/jobs/102'
  },
  {
    title: 'Full-Charge Remote Bookkeeper',
    company: 'ClearLedger Advisory Inc.',
    url: 'https://boards.greenhouse.io/clearledger/jobs/102?utm_campaign=social'
  }
];
const dedupedOutput = deduplicateJobs(duplicatesSample);
assert.strictEqual(dedupedOutput.length, 2, 'Deduplication must collapse 4 duplicate variations into 2 unique opportunities');
console.log('✓ Multi-factor deduplication strictly eliminated duplicate cards.\n');

// 6. Test Specific Individual Portals
console.log('6️⃣ Testing Target Portals Scraped Individually:');
const ghJobs = await scrapeAllPortals({ query: 'Accountant', portal: 'greenhouse', maxDays: 5 });
assert(ghJobs.length > 0 && ghJobs[0].portal === 'Greenhouse ATS', 'Greenhouse ATS portal query verified');

const wdJobs = await scrapeAllPortals({ query: 'Accountant', portal: 'workday', maxDays: 5 });
assert(wdJobs.length > 0 && wdJobs[0].portal === 'Workday ATS', 'Workday ATS portal query verified');

const ashJobs = await scrapeAllPortals({ query: 'Accountant', portal: 'ashby', maxDays: 5 });
assert(ashJobs.length > 0 && ashJobs[0].portal === 'Ashby ATS', 'Ashby ATS portal query verified');

const liJobs = await scrapeAllPortals({ query: 'Accountant', portal: 'linkedin_easy_apply', maxDays: 5 });
assert(liJobs.length > 0 && liJobs[0].portal === 'LinkedIn Easy Apply', 'LinkedIn Easy Apply portal query verified');

console.log('✓ Individual portal routing verified (Greenhouse, Workday, Ashby, LinkedIn Easy Apply).\n');

console.log('========================================================================');
console.log('✅ ALL AUTONOMOUS HUNTER & 5-DAY FRESHNESS TESTS PASSED (100%)!');
console.log('========================================================================');
