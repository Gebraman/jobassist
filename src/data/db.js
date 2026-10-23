import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = __dirname;

// In-memory data structures
export const leads = [];
export const subscriptions = [];

// Seed Plans matching reversed JobAssist paywall
export const plans = [
  {
    id: 'trial-7d',
    name: '7-Day Trial',
    badge: null,
    popular: false,
    priceFormattedUSD: '$1.99',
    priceFormattedETB: 'Br180.00',
    fullPriceFormattedUSD: null,
    fullPriceFormattedETB: null,
    savingsText: 'Intro Trial',
    savingsPercent: null,
    interval: '7 days',
    renewalTermsUSD: "Get 7 full days of access for just $1.99. After trial, we'll charge $29.99 every month until you cancel.",
    renewalTermsETB: "Get 7 full days of access for just Br180.00. After trial, we'll charge Br9,790.99 every month until you cancel.",
    dueTodayUSD: '$1.99',
    dueTodayETB: 'Br180.00'
  },
  {
    id: 'month-1',
    name: '1-Month Plan',
    badge: 'MOST POPULAR',
    popular: true,
    priceFormattedUSD: '$35.00',
    priceFormattedETB: 'Br4,332.99',
    fullPriceFormattedUSD: '$87.50',
    fullPriceFormattedETB: 'Br10,833.99',
    savingsText: 'Save 60%',
    savingsPercent: 60,
    interval: 'month',
    renewalTermsUSD: "Get your first month for just $35.00. After trial, we'll charge $87.50 every month until you cancel.",
    renewalTermsETB: "Get your first month for just Br4,332.99. After trial, we'll charge Br10,833.99 every month until you cancel.",
    dueTodayUSD: '$35.00',
    dueTodayETB: 'Br4,332.99'
  },
  {
    id: 'month-3',
    name: '3-Month Plan',
    badge: 'BEST VALUE',
    popular: false,
    priceFormattedUSD: '$75.00',
    priceFormattedETB: 'Br9,027.99',
    fullPriceFormattedUSD: '$227.00',
    fullPriceFormattedETB: 'Br27,086.99',
    savingsText: 'Save 67%',
    savingsPercent: 67,
    interval: '3 months',
    renewalTermsUSD: "Get 3 months of unlimited job matches for just $75.00. Renews quarterly at standard rate until you cancel.",
    renewalTermsETB: "Get 3 months of unlimited job matches for just Br9,027.99. Renews quarterly at standard rate until you cancel.",
    dueTodayUSD: '$75.00',
    dueTodayETB: 'Br9,027.99'
  }
];

// Seed FAQs with exact reversed answers
export const faqs = [
  {
    id: 'faq-1',
    q: 'How does the matching work?',
    a: 'We analyze your skills, experience, location, and preferences to find roles from 7M+ verified listings. Matches are refreshed continuously, so you always see the most relevant and up-to-date positions.'
  },
  {
    id: 'faq-2',
    q: 'Do I choose which jobs to apply to?',
    a: 'Yes, always. We show you matched roles, and you decide which ones to move forward with. Nothing is ever sent without your approval. You can skip any role – your preferences help improve future matches.'
  },
  {
    id: 'faq-3',
    q: 'How quickly will I start receiving matches?',
    a: 'Immediately after you complete your profile. Your first matches are generated within minutes. From there, new personalized recommendations are added daily based on the latest openings.'
  },
  {
    id: 'faq-4',
    q: 'What happens after my trial ends?',
    a: "There's no separate free trial – billing starts as soon as you sign up. You'll pay your introductory rate today for your initial period, then the recurring rate per billing cycle until you cancel. You'll have full access to every feature, and you can cancel anytime in under a minute from your account."
  },
  {
    id: 'faq-5',
    q: 'How do I cancel my subscription?',
    a: 'Cancellation is self-service and takes less than a minute:\n\n1. Login to your account\n2. Go to your profile settings\n3. Select to manage subscription\n4. Confirm cancellation\n\nYou will immediately see confirmation on screen and receive a confirmation email. Your subscription will remain active until the end of your current billing period. We do not require phone calls, emails, or manual approval to cancel.'
  }
];

// Seed Companies
export const companies = [
  {
    slug: 'openai',
    name: 'OpenAI',
    initial: 'O',
    color: '#10A37F',
    rolesCount: 142,
    location: 'San Francisco, CA · Remote',
    description: 'Pioneering artificial general intelligence that benefits all of humanity.'
  },
  {
    slug: 'apple',
    name: 'Apple',
    initial: 'A',
    color: '#000000',
    rolesCount: 318,
    location: 'Cupertino, CA · Hybrid',
    description: 'Hardware, software, and services empowering people worldwide to create.'
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    initial: 'M',
    color: '#00A4EF',
    rolesCount: 420,
    location: 'Redmond, WA · Remote & Hybrid',
    description: 'Empowering every person and organization on the planet to achieve more.'
  },
  {
    slug: 'google',
    name: 'Google',
    initial: 'G',
    color: '#4285F4',
    rolesCount: 512,
    location: 'Mountain View, CA · Remote',
    description: 'Organizing the world’s information and making it universally accessible.'
  },
  {
    slug: 'meta',
    name: 'Meta',
    initial: 'M',
    color: '#0668E1',
    rolesCount: 290,
    location: 'Menlo Park, CA · Remote',
    description: 'Building technologies that help people connect, find communities, and grow businesses.'
  },
  {
    slug: 'nvidia',
    name: 'NVIDIA',
    initial: 'N',
    color: '#76B900',
    rolesCount: 235,
    location: 'Santa Clara, CA · Hybrid',
    description: 'World leader in accelerated computing and GPU innovation.'
  },
  {
    slug: 'tesla',
    name: 'Tesla',
    initial: 'T',
    color: '#E82127',
    rolesCount: 184,
    location: 'Austin, TX · On-site & Hybrid',
    description: 'Accelerating the world’s transition to sustainable energy.'
  },
  {
    slug: 'brightwave',
    name: 'Brightwave',
    initial: 'B',
    color: '#1D4ED8',
    rolesCount: 48,
    location: 'New York, NY · Remote',
    description: 'Next-generation financial intelligence and quantitative AI search.'
  },
  {
    slug: 'northwind-labs',
    name: 'Northwind Labs',
    initial: 'N',
    color: '#7C3AED',
    rolesCount: 32,
    location: 'Seattle, WA · Remote',
    description: 'Enterprise data pipelines and collaborative engineering tooling.'
  }
];

// Seed Job Categories
export const categories = [
  { slug: 'it-software', name: 'IT & Software Development', icon: 'code', count: '84,210' },
  { slug: 'business-management', name: 'Business & Management', icon: 'briefcase', count: '62,450' },
  { slug: 'sales-bizdev', name: 'Sales & Business Development', icon: 'trending-up', count: '45,120' },
  { slug: 'marketing-pr', name: 'Marketing & Public Relations', icon: 'send', count: '38,900' },
  { slug: 'admin-office', name: 'Administrative & Office Support', icon: 'file-text', count: '51,300' },
  { slug: 'healthcare', name: 'Healthcare & Medical', icon: 'shield', count: '72,800' },
  { slug: 'logistics-transport', name: 'Logistics & Supply Chain', icon: 'compass', count: '33,400' },
  { slug: 'manufacturing-trades', name: 'Engineering & Manufacturing', icon: 'layers', count: '29,600' }
];

// Seed Jobs with realistic fit scoring
export const jobs = [
  {
    id: 'job-101',
    company: 'Brightwave',
    companySlug: 'brightwave',
    companyInitial: 'B',
    companyColor: '#1D4ED8',
    title: 'Senior Software Engineer',
    salary: '$150k – $190k',
    location: 'Remote · US & Worldwide',
    category: 'it-software',
    matchScore: 96,
    breakdown: { roleFit: 96, titleMatch: 95, locationFit: 94 },
    tags: ['Full-time', 'React', 'TypeScript', 'Node.js', 'Distributed Systems'],
    description: 'Lead engineering initiatives on our core quantitative intelligence platform. Build reliable, low-latency microservices and high-throughput data processing workflows.'
  },
  {
    id: 'job-102',
    company: 'Northwind Labs',
    companySlug: 'northwind-labs',
    companyInitial: 'N',
    companyColor: '#7C3AED',
    title: 'Product Manager, Developer Platform',
    salary: '$130k – $165k',
    location: 'Remote · US & Canada',
    category: 'it-software',
    matchScore: 92,
    breakdown: { roleFit: 92, titleMatch: 93, locationFit: 91 },
    tags: ['Full-time', 'Product Strategy', 'APIs', 'SaaS', 'B2B'],
    description: 'Drive the roadmap for next-generation developer toolkits. Collaborate closely with engineering, UX, and enterprise stakeholders.'
  },
  {
    id: 'job-103',
    company: 'OpenAI',
    companySlug: 'openai',
    companyInitial: 'O',
    companyColor: '#10A37F',
    title: 'Full Stack Engineer - Product AI',
    salary: '$180k – $240k',
    location: 'San Francisco, CA · Remote Friendly',
    category: 'it-software',
    matchScore: 95,
    breakdown: { roleFit: 95, titleMatch: 96, locationFit: 93 },
    tags: ['Full-time', 'Next.js', 'Python', 'LLMs', 'GraphQL'],
    description: 'Build intuitive, high-performance web interfaces and agentic workflows utilized by millions of creators and developers globally.'
  },
  {
    id: 'job-104',
    company: 'Microsoft',
    companySlug: 'microsoft',
    companyInitial: 'M',
    companyColor: '#00A4EF',
    title: 'Enterprise Account Executive',
    salary: '$140k – $220k (OTE)',
    location: 'Remote · US',
    category: 'sales-bizdev',
    matchScore: 90,
    breakdown: { roleFit: 90, titleMatch: 91, locationFit: 89 },
    tags: ['Full-time', 'Enterprise Sales', 'Cloud Solutions', 'Azure'],
    description: 'Grow strategic relationships across Fortune 500 accounts by positioning Azure infrastructure and modern workplace solutions.'
  },
  {
    id: 'job-105',
    company: 'Meta',
    companySlug: 'meta',
    companyInitial: 'M',
    companyColor: '#0668E1',
    title: 'Senior Marketing Growth Manager',
    salary: '$145k – $185k',
    location: 'Remote · US',
    category: 'marketing-pr',
    matchScore: 89,
    breakdown: { roleFit: 89, titleMatch: 90, locationFit: 88 },
    tags: ['Full-time', 'Performance Marketing', 'Paid Media', 'Attribution'],
    description: 'Oversee multi-million dollar performance media campaigns across digital networks, analyzing CPA, CAC, and LTV conversion funnels.'
  },
  {
    id: 'job-106',
    company: 'NVIDIA',
    companySlug: 'nvidia',
    companyInitial: 'N',
    companyColor: '#76B900',
    title: 'AI Systems Performance Architect',
    salary: '$190k – $260k',
    location: 'Santa Clara, CA · Hybrid',
    category: 'it-software',
    matchScore: 94,
    breakdown: { roleFit: 94, titleMatch: 95, locationFit: 92 },
    tags: ['Full-time', 'CUDA', 'Deep Learning', 'C++', 'Hardware Acceleration'],
    description: 'Benchmark and optimize large-scale transformer training clusters and GPU acceleration kernel pipelines.'
  }
];

// Persistence Helpers
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const SUBS_FILE = path.join(DATA_DIR, 'subscriptions.json');

export function loadStore() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
      leads.length = 0;
      leads.push(...data);
    }
    if (fs.existsSync(SUBS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SUBS_FILE, 'utf-8'));
      subscriptions.length = 0;
      subscriptions.push(...data);
    }
  } catch (err) {
    console.warn('Store load warning:', err.message);
  }
}

export function saveStore() {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    fs.writeFileSync(SUBS_FILE, JSON.stringify(subscriptions, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Store save warning:', err.message);
  }
}

// Initial load
loadStore();
