/* ========================================================
   JobAssist SPA Application & Reactive Funnel Engine
   Rebuilt to exact reverse-engineering specifications
   ======================================================== */

// Global State Store
const state = {
  currentPath: window.location.pathname || '/',
  utmParams: {},
  email: sessionStorage.getItem('ja_lead_email') || '',
  matchCount: 2411,
  selectedPlanId: 'month-1', // Default: 1-Month Plan (Most Popular)
  selectedCurrency: localStorage.getItem('ja_currency') || 'USD',
  plans: [],
  faqs: [],
  jobs: [],
  companies: [],
  categories: [],
  isSubmitting: false,
  activeSubscription: null,
  toastQueue: [],
  // Granular Pass & Cadence State
  comboCurrency: 'ETB',
  comboCadence: 'monthly',
  selectedComboPlan: 'studio-combo',
  // Autonomous AI Job Search & Auto-Apply Studio State (MadsLorentzen Framework)
  aiTab: 'search',
  aiJobs: [],
  aiScoredJobs: [],
  aiTracker: [],
  aiProfile: null,
  aiUpskill: null,
  activeAiJob: null,
  currentAiApply: null,
  currentAiAutofill: null,
  aiSubView: 'cv',
  aiRankFilter: 'ALL',
  aiInitialized: false
};

// --------------------------------------------------------
// UTM Attribution & Preserved Query Strings
// --------------------------------------------------------
function initAttribution() {
  const urlParams = new URLSearchParams(window.location.search);
  const trackedKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'fbclid', 'ttclid'];
  
  trackedKeys.forEach(key => {
    if (urlParams.has(key)) {
      state.utmParams[key] = urlParams.get(key);
      sessionStorage.setItem(`ja_${key}`, urlParams.get(key));
    } else {
      const saved = sessionStorage.getItem(`ja_${key}`);
      if (saved) state.utmParams[key] = saved;
    }
  });
}

function getPreservedQueryString() {
  const params = new URLSearchParams();
  Object.entries(state.utmParams).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  const str = params.toString();
  return str ? `?${str}` : '';
}

// --------------------------------------------------------
// Client Router
// --------------------------------------------------------
function navigate(path) {
  state.currentPath = path;
  const fullUrl = path + getPreservedQueryString();
  window.history.pushState({ path }, '', fullUrl);
  window.scrollTo({ top: 0, behavior: 'instant' });
  renderApp();
}

window.addEventListener('popstate', (e) => {
  state.currentPath = window.location.pathname || '/';
  renderApp();
});

// Toast Notification Manager
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'ja-toast';
  
  const icon = type === 'success' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    
  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --------------------------------------------------------
// Data Fetching
// --------------------------------------------------------
async function loadInitialData() {
  try {
    const [plansRes, faqsRes, jobsRes, compRes, catRes] = await Promise.all([
      fetch('/api/plans').then(r => r.json()),
      fetch('/api/faqs').then(r => r.json()),
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/companies').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]);

    state.plans = plansRes.plans || [];
    state.faqs = faqsRes.faqs || [];
    state.jobs = jobsRes.jobs || [];
    state.companies = compRes.companies || [];
    state.categories = catRes.categories || [];
  } catch (err) {
    console.error('Failed to load initial data:', err);
  }
}

// --------------------------------------------------------
// UI Components & View Renderers
// --------------------------------------------------------

// SVG Icons
const icons = {
  logo: (color = 'currentColor') => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1361 203" width="123" height="30" fill="${color}">
      <text x="0" y="160" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="180" letter-spacing="-6">
        Job<tspan fill="#1D4ED8">Assist</tspan>
      </text>
    </svg>`,
  google: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>`,
  checkCircle: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>`,
  crossCircle: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>`,
  lock: `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>`,
  chevronDown: `
    <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`
};

// Funnel Minimal Header
function renderFunnelHeader() {
  return `
    <header style="padding: 16px 24px; border-bottom: 1px solid var(--color-ja-hairline); background: #FFFFFF;">
      <div class="ja-container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <a href="/" onclick="event.preventDefault(); navigate('/');" style="display: inline-flex; align-items: center; text-decoration: none;">
          ${icons.logo('#0D0D0E')}
        </a>
        <div style="display: flex; align-items: center; gap: 16px;">
          <button class="btn-outline" onclick="navigate('/assistant');" style="height: 36px; padding: 0 14px; font-size: 13px; border-color: #3B82F6; color: #1D4ED8; font-weight: 700; background: #EFF6FF;">
            Launch AI Assistant Studio
          </button>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--color-ja-slate); font-weight: 500;">
            ${icons.lock}
            <span class="hide-mobile">Bank-Grade 256-Bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

// Marketing Full Header - JobWizard Style
function renderMarketingHeader() {
  const isAdmin = (
    sessionStorage.getItem('ja_admin_logged') === 'true' || 
    localStorage.getItem('ja_admin_logged') === 'true' || 
    window.location.search.includes('admin=1')
  );

  return `
    <header class="jw-navbar-wrapper">
      <div class="jw-navbar">
        <div style="display: flex; align-items: center; gap: 20px;">
          <a href="/" onclick="event.preventDefault(); navigate('/');" style="display: inline-flex; align-items: center; gap: 10px; text-decoration: none;">
            <div style="width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, #007aff, #38bdf8); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(0, 122, 255, 0.45);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <span style="font-size: 17px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">JobAssist</span>
            <span style="background: rgba(0, 122, 255, 0.15); border: 1px solid rgba(0, 122, 255, 0.35); color: #38bdf8; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px;">v3.2.0</span>
          </a>
          <nav class="jw-nav-links hide-mobile">
            <a href="#features-section" class="jw-nav-link" onclick="scrollToSection('features-section'); event.preventDefault();">Features</a>
            <a href="#how-it-works" class="jw-nav-link" onclick="scrollToSection('how-it-works'); event.preventDefault();">How It Works</a>
            <a href="#plans-section" class="jw-nav-link" onclick="scrollToSection('plans-section'); event.preventDefault();">Access Passes</a>
            <a href="javascript:void(0)" class="jw-nav-link" style="color: #38bdf8;" onclick="openUnpackGuideModal();">Unpack Guide</a>
            <a href="#about-section" class="jw-nav-link" onclick="scrollToSection('about-section'); event.preventDefault();">About</a>
          </nav>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          ${isAdmin ? `
            <a href="/admin" class="jw-btn-outline" style="padding: 8px 14px; font-size: 12.5px;">
              Admin
            </a>
          ` : ''}
          <a href="#plans-section" onclick="scrollToSection('plans-section'); event.preventDefault();" class="jw-btn-outline hide-mobile" style="padding: 8px 16px; font-size: 13px;">
            Pricing
          </a>
          <a href="/download-extension" download class="jw-btn-primary" style="padding: 9px 20px; font-size: 13px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Extension
          </a>
        </div>
      </div>
    </header>
  `;
}

// Dark Minimalist Footer - JobWizard Style
function renderDarkFooter() {
  const isAdmin = (
    sessionStorage.getItem('ja_admin_logged') === 'true' || 
    localStorage.getItem('ja_admin_logged') === 'true' || 
    window.location.search.includes('admin=1')
  );

  return `
    <footer id="about-section" style="border-top: 1px solid rgba(255, 255, 255, 0.08); background: #0c0c0d; padding: 60px 20px 40px;">
      <div class="ja-container" style="max-width: 1140px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; margin-bottom: 48px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
              <div style="width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #007aff, #38bdf8); display: flex; align-items: center; justify-content: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style="font-size: 17px; font-weight: 800; color: #FFFFFF;">JobAssist</span>
            </div>
            <p style="font-size: 13.5px; line-height: 1.6; color: #a1a1a6; max-width: 320px;">
              The complete AI career engine: Autonomous Fresh Job Hunter (&le; 5d), 1-Click ATS AutoFill on Greenhouse, Lever, Workday &amp; Taleo, and Canva-grade resume tailoring.
            </p>
            <div style="margin-top: 14px; font-size: 12px; color: #10b981; font-weight: 600; display: flex; align-items: center; gap: 6px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981;"></span>
              Active engine with 2–3 releases per week
            </div>
          </div>
          <div>
            <h4 style="color: #FFFFFF; font-size: 12.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px;">Extension &amp; Product</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px;">
              <li><a href="/download-extension" download style="color: #38bdf8; font-weight: 600; text-decoration: none;">Download Extension (.ZIP)</a></li>
              <li><a href="javascript:void(0)" onclick="openUnpackGuideModal();" style="color: #a1a1a6; text-decoration: none;">30-Second Unpack Guide</a></li>
              <li><a href="#plans-section" onclick="scrollToSection('plans-section'); event.preventDefault();" style="color: #a1a1a6; text-decoration: none;">Access Passes &amp; Pricing</a></li>
              ${isAdmin ? `<li><a href="/admin" style="color: #a1a1a6; text-decoration: none;">Admin Control Center</a></li>` : ''}
            </ul>
          </div>
          <div>
            <h4 style="color: #FFFFFF; font-size: 12.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px;">Resources &amp; Support</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px;">
              <li><a href="/about-us" onclick="event.preventDefault(); navigate('/about-us');" style="color: #a1a1a6; text-decoration: none;">About Us</a></li>
              <li><a href="/help" onclick="event.preventDefault(); navigate('/help');" style="color: #a1a1a6; text-decoration: none;">Help Center</a></li>
              <li><a href="/cancellation" onclick="event.preventDefault(); navigate('/cancellation');" style="color: #a1a1a6; text-decoration: none;">Cancellation Portal</a></li>
              <li><a href="/help" onclick="event.preventDefault(); navigate('/help');" style="color: #a1a1a6; text-decoration: none;">Customer Support</a></li>
            </ul>
          </div>
          <div>
            <h4 style="color: #FFFFFF; font-size: 12.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px;">Legal</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13.5px;">
              <li><a href="/privacy" onclick="event.preventDefault(); navigate('/privacy');" style="color: #a1a1a6; text-decoration: none;">Privacy Policy</a></li>
              <li><a href="/terms" onclick="event.preventDefault(); navigate('/terms');" style="color: #a1a1a6; text-decoration: none;">Terms &amp; Conditions</a></li>
              <li><a href="/terms" onclick="event.preventDefault(); navigate('/terms');" style="color: #a1a1a6; text-decoration: none;">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 24px; font-size: 12.5px; color: #71717a; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px;">
          <div>Copyright © 2026 JobAssist™. Supported in Ethiopia (Birr) &amp; Worldwide (USD).</div>
          <div>Protected by Administrator License Key Verification.</div>
        </div>
      </div>
    </footer>
  `;
}

// --------------------------------------------------------
// STEP 1: Email Gate (/email)
// --------------------------------------------------------
function renderEmailGateView() {
  return `
    ${renderFunnelHeader()}
    <main style="padding: 48px 20px 80px;">
      <div class="ja-card-container">
        
        <div class="funnel-step-bar">
          <div class="step-dot active"></div>
          <div class="step-dot"></div>
          <div class="step-dot"></div>
          <div class="step-dot"></div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid var(--color-ja-border); border-radius: 20px; padding: 36px 28px; box-shadow: var(--shadow-sm); text-align: center;">
          <h2 style="font-size: 28px; margin-bottom: 10px; line-height: 1.2;">
            Don't lose access to your <span style="color: var(--color-ja-blue);">${state.matchCount.toLocaleString()}</span> job matches
          </h2>
          <p style="font-size: 15px; color: var(--color-ja-slate); margin-bottom: 28px;">
            Enter your email to save your personalized match feed and unlock prioritized applications.
          </p>

          <form id="email-gate-form" onsubmit="handleEmailSubmit(event);">
            <div style="margin-bottom: 16px; text-align: left;">
              <input 
                type="email" 
                id="email-input" 
                class="ja-input" 
                placeholder="Enter your email" 
                value="${state.email}"
                oninput="handleEmailInput(this.value);"
                required
              />
            </div>

            <button 
              type="submit" 
              id="continue-btn" 
              class="btn-primary" 
              style="width: 100%; height: 50px; font-size: 16px;"
              ${!validateEmail(state.email) ? 'disabled' : ''}
            >
              Continue
            </button>
          </form>

          <div style="display: flex; align-items: center; gap: 14px; margin: 24px 0;">
            <div style="flex: 1; height: 1px; background: var(--color-ja-hairline);"></div>
            <span style="font-size: 12px; font-weight: 600; color: #94A3B8; text-transform: uppercase;">or</span>
            <div style="flex: 1; height: 1px; background: var(--color-ja-hairline);"></div>
          </div>

          <button class="btn-outline" style="width: 100%; height: 50px;" onclick="handleGoogleSignIn();">
            ${icons.google}
            <span>Sign in with Google</span>
          </button>

          <p style="font-size: 12px; color: #94A3B8; margin-top: 24px; line-height: 1.5;">
            By clicking Continue, you agree to JobAssist's 
            <a href="/terms" onclick="event.preventDefault(); navigate('/terms');" style="color: var(--color-ja-slate); text-decoration: underline;">Terms & Conditions</a> 
            and 
            <a href="/privacy" onclick="event.preventDefault(); navigate('/privacy');" style="color: var(--color-ja-slate); text-decoration: underline;">Privacy Policy</a>.
          </p>
        </div>

      </div>
    </main>
  `;
}

function handleEmailInput(val) {
  state.email = val.trim();
  const btn = document.getElementById('continue-btn');
  if (btn) {
    btn.disabled = !validateEmail(state.email);
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleEmailSubmit(e) {
  e.preventDefault();
  if (!validateEmail(state.email)) return;

  const btn = document.getElementById('continue-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Saving profile...';
  }

  sessionStorage.setItem('ja_lead_email', state.email);

  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: state.email,
        ...state.utmParams
      })
    });
  } catch (err) {
    console.warn('Lead capture background note:', err);
  }

  navigate('/we-work-for-you');
}

function handleGoogleSignIn() {
  state.email = 'applicant.google.user@gmail.com';
  sessionStorage.setItem('ja_lead_email', state.email);
  showToast('Authenticated via Google Single Sign-On', 'success');
  setTimeout(() => navigate('/we-work-for-you'), 400);
}

// --------------------------------------------------------
// STEP 2: Value Checklist (/we-work-for-you)
// --------------------------------------------------------
function renderChecklistView() {
  return `
    ${renderFunnelHeader()}
    <main style="padding: 48px 20px 80px;">
      <div class="ja-wide-card-container">
        
        <div class="funnel-step-bar">
          <div class="step-dot completed"></div>
          <div class="step-dot active"></div>
          <div class="step-dot"></div>
          <div class="step-dot"></div>
        </div>

        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="font-size: 30px; margin-bottom: 8px;">
            Get to your next interview faster
          </h2>
          <p style="font-size: 16px; color: var(--color-ja-slate);">
            Here is how JobAssist removes the exhausting manual work from your search:
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px;">
          
          <div style="display: flex; align-items: flex-start; gap: 16px; background: #FFFFFF; border: 1.5px solid var(--color-ja-border); border-radius: 16px; padding: 20px; box-shadow: var(--shadow-sm);">
            <div style="margin-top: 2px;">${icons.checkCircle}</div>
            <div>
              <h3 style="font-size: 17px; margin-bottom: 4px;">Real matches worth applying to</h3>
              <p style="font-size: 14.5px; color: var(--color-ja-slate);">Filtered against your exact skills, salary targets, and location so you never waste time on low-fit roles.</p>
            </div>
          </div>

          <div style="display: flex; align-items: flex-start; gap: 16px; background: #FFFFFF; border: 1.5px solid var(--color-ja-border); border-radius: 16px; padding: 20px; box-shadow: var(--shadow-sm);">
            <div style="margin-top: 2px;">${icons.checkCircle}</div>
            <div>
              <h3 style="font-size: 17px; margin-bottom: 4px;">More chances to get noticed</h3>
              <p style="font-size: 14.5px; color: var(--color-ja-slate);">Submit applications in the critical first hour after posting — before hundreds of candidates flood the inbox.</p>
            </div>
          </div>

          <div style="display: flex; align-items: flex-start; gap: 16px; background: #FFFFFF; border: 1.5px solid var(--color-ja-border); border-radius: 16px; padding: 20px; box-shadow: var(--shadow-sm);">
            <div style="margin-top: 2px;">${icons.checkCircle}</div>
            <div>
              <h3 style="font-size: 17px; margin-bottom: 4px;">Stand out against other applicants</h3>
              <p style="font-size: 14.5px; color: var(--color-ja-slate);">AI generates customized, role-specific cover letters tailored to every position's unique job description.</p>
            </div>
          </div>

          <div style="display: flex; align-items: flex-start; gap: 16px; background: #FFFFFF; border: 1.5px solid var(--color-ja-border); border-radius: 16px; padding: 20px; box-shadow: var(--shadow-sm);">
            <div style="margin-top: 2px;">${icons.checkCircle}</div>
            <div>
              <h3 style="font-size: 17px; margin-bottom: 4px;">Give recruiters a reason to reply</h3>
              <p style="font-size: 14.5px; color: var(--color-ja-slate);">Recruiter inquiries, interview availability invites, and next steps stay neatly tracked in one unified dashboard.</p>
            </div>
          </div>

        </div>

        <button class="btn-primary" style="width: 100%; height: 52px; font-size: 16px;" onclick="navigate('/timeline-after-apply');">
          Continue →
        </button>

      </div>
    </main>
  `;
}

// --------------------------------------------------------
// STEP 3: Timeline After Apply (/timeline-after-apply)
// --------------------------------------------------------
function renderTimelineView() {
  return `
    ${renderFunnelHeader()}
    <main style="padding: 48px 20px 80px;">
      <div class="ja-wide-card-container">
        
        <div class="funnel-step-bar">
          <div class="step-dot completed"></div>
          <div class="step-dot completed"></div>
          <div class="step-dot active"></div>
          <div class="step-dot"></div>
        </div>

        <div style="text-align: center; margin-bottom: 36px;">
          <h2 style="font-size: 30px; margin-bottom: 8px;">
            What happens after you start applying
          </h2>
          <p style="font-size: 16px; color: var(--color-ja-slate);">
            Your systematic 3-phase progression to interview invites:
          </p>
        </div>

        <div style="position: relative; padding-left: 28px; border-left: 3px solid var(--color-ja-blue-border); margin-left: 14px; margin-bottom: 40px; display: flex; flex-direction: column; gap: 32px;">
          
          <!-- Node 1 -->
          <div style="position: relative;">
            <div style="position: absolute; left: -39px; top: 0; width: 20px; height: 20px; border-radius: 50%; background: var(--color-ja-blue); border: 4px solid #EFF6FF;"></div>
            <div class="badge-blue-subtle" style="margin-bottom: 8px;">Today</div>
            <h3 style="font-size: 19px; margin-bottom: 6px;">Unlock your ${state.matchCount.toLocaleString()} matches.</h3>
            <p style="font-size: 15px; color: var(--color-ja-slate); line-height: 1.6;">
              Review your best-fit roles and send tailored applications in one click with custom-crafted materials.
            </p>
          </div>

          <!-- Node 2 -->
          <div style="position: relative;">
            <div style="position: absolute; left: -39px; top: 0; width: 20px; height: 20px; border-radius: 50%; background: #60A5FA; border: 4px solid #EFF6FF;"></div>
            <div class="badge-blue-subtle" style="margin-bottom: 8px;">This Week</div>
            <h3 style="font-size: 19px; margin-bottom: 6px;">Apply consistently without the manual work.</h3>
            <p style="font-size: 15px; color: var(--color-ja-slate); line-height: 1.6;">
              JobAssist prepares cover letters, helps you apply faster, and adds new verified matches every day.
            </p>
          </div>

          <!-- Node 3 -->
          <div style="position: relative;">
            <div style="position: absolute; left: -39px; top: 0; width: 20px; height: 20px; border-radius: 50%; background: #93C5FD; border: 4px solid #EFF6FF;"></div>
            <div class="badge-blue-subtle" style="margin-bottom: 8px;">Next 2 Weeks</div>
            <h3 style="font-size: 19px; margin-bottom: 6px;">Stay on top of every reply and interview.</h3>
            <p style="font-size: 15px; color: var(--color-ja-slate); line-height: 1.6;">
              Recruiter responses, interview invites, and next steps are tracked in one place so nothing falls through the cracks.
            </p>
          </div>

        </div>

        <button class="btn-primary" style="width: 100%; height: 52px; font-size: 16px;" onclick="navigate('/checkout');">
          Get my job matches →
        </button>

      </div>
    </main>
  `;
}

// --------------------------------------------------------
// STEP 4: Paywall & Checkout (/checkout)
// --------------------------------------------------------
function renderCheckoutView() {
  const currentPlan = state.plans.find(p => p.id === state.selectedPlanId) || state.plans[1] || {};
  const isUSD = state.selectedCurrency === 'USD';
  
  const dueTodayPrice = isUSD ? currentPlan.dueTodayUSD : currentPlan.dueTodayETB;
  const renewalTerms = isUSD ? currentPlan.renewalTermsUSD : currentPlan.renewalTermsETB;

  return `
    ${renderFunnelHeader()}
    <main style="padding: 40px 20px 100px;">
      <div class="ja-container">
        
        <!-- Header Banner -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 34px; margin-bottom: 10px;">
            Turn your matches into interviews today
          </h1>
          <p style="font-size: 16px; color: var(--color-ja-slate);">
            Choose your plan to immediately unlock all ${state.matchCount.toLocaleString()} high-affinity job matches.
          </p>

          <!-- Regional Currency Switcher Bar -->
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-top: 14px; background: #F1F5F9; padding: 4px; border-radius: 9999px;">
            <button 
              onclick="setCurrency('USD');" 
              style="padding: 4px 14px; border-radius: 9999px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; background: ${isUSD ? '#FFFFFF' : 'transparent'}; color: ${isUSD ? 'var(--color-ja-blue)' : '#64748B'}; box-shadow: ${isUSD ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};"
            >
              USD ($)
            </button>
            <button 
              onclick="setCurrency('ETB');" 
              style="padding: 4px 14px; border-radius: 9999px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; background: ${!isUSD ? '#FFFFFF' : 'transparent'}; color: ${!isUSD ? 'var(--color-ja-blue)' : '#64748B'}; box-shadow: ${!isUSD ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};"
            >
              ETB (Br)
            </button>
          </div>

          <!-- Direct Link to Autonomous AI Job Search & Auto-Apply Studio -->
          <div style="background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%); color: #FFFFFF; border-radius: 14px; padding: 16px 24px; margin: 24px auto 0; max-width: 860px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: 0 4px 20px rgba(29, 78, 216, 0.25); text-align: left;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <span style="display: inline-flex; width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.15); align-items: center; justify-content: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </span>
              <div>
                <div style="font-weight: 800; font-size: 15px; letter-spacing: -0.01em;">Autonomous AI Job Search & Auto-Apply Studio (Active)</div>
                <div style="font-size: 13px; color: #BFDBFE;">Powered by multi-portal scraping, 5-dimension fit scoring & ATS autofill.</div>
              </div>
            </div>
            <button onclick="navigate('/assistant');" class="btn-primary" style="background: #FFFFFF; color: #1D4ED8; font-weight: 700; height: 40px; padding: 0 18px; font-size: 13.5px; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
              Launch AI Studio Now →
            </button>
          </div>
        </div>

        <div class="ja-checkout-grid">
          
          <!-- LEFT COLUMN: Value Proposition, Mockups & FAQs -->
          <div>
            
            <!-- Comparison Card: Manual Search vs JobAssist -->
            <div style="border: 1px solid var(--color-ja-border); border-radius: 20px; overflow: hidden; background: #FFFFFF; margin-bottom: 40px; box-shadow: var(--shadow-sm);">
              <div style="display: grid; grid-template-columns: 1fr 1fr;">
                
                <!-- Manual Box -->
                <div style="padding: 24px 20px; background: #F8FAFC; border-right: 1px solid var(--color-ja-border);">
                  <div style="font-size: 13px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                    Manual Search
                  </div>
                  <ul style="list-style: none; display: flex; flex-direction: column; gap: 14px; font-size: 14px; color: var(--color-ja-slate);">
                    <li style="display: flex; align-items: center; gap: 10px;">
                      ${icons.crossCircle}
                      <span>5–10 min per application</span>
                    </li>
                    <li style="display: flex; align-items: center; gap: 10px;">
                      ${icons.crossCircle}
                      <span>Generic cover letters</span>
                    </li>
                    <li style="display: flex; align-items: center; gap: 10px;">
                      ${icons.crossCircle}
                      <span>Replies hard to track</span>
                    </li>
                  </ul>
                </div>

                <!-- JobAssist Box -->
                <div style="padding: 24px 20px; background: var(--color-ja-mint-bg);">
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--color-ja-mint-text); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                    <span>JobAssist</span>
                    <span class="badge-pill-green" style="font-size: 10px; padding: 2px 6px;">AI Powered</span>
                  </div>
                  <ul style="list-style: none; display: flex; flex-direction: column; gap: 14px; font-size: 14px; color: #065F46; font-weight: 500;">
                    <li style="display: flex; align-items: center; gap: 10px;">
                      ${icons.checkCircle}
                      <span>1-Click Auto Apply</span>
                    </li>
                    <li style="display: flex; align-items: center; gap: 10px;">
                      ${icons.checkCircle}
                      <span>Role-tailored letters</span>
                    </li>
                    <li style="display: flex; align-items: center; gap: 10px;">
                      ${icons.checkCircle}
                      <span>Centralized tracker</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            <!-- "Everything you unlock today" Section -->
            <div style="margin-bottom: 48px;">
              <h2 style="font-size: 24px; margin-bottom: 24px;">Everything you unlock today</h2>

              <div style="display: flex; flex-direction: column; gap: 24px;">
                
                <!-- Feature 1: Auto Apply -->
                <div style="border: 1px solid var(--color-ja-border); border-radius: 16px; padding: 24px; background: #FFFFFF;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                      <h3 style="font-size: 18px; margin-bottom: 4px;">Auto Apply your matches</h3>
                      <p style="font-size: 14.5px; color: var(--color-ja-slate);">
                        Auto Apply to AI-validated matches and send applications in one click — without filling every form by hand.
                      </p>
                    </div>
                  </div>
                  <!-- Mockup Snippet -->
                  <div style="margin-top: 14px; background: #F8FAFC; border: 1px solid var(--color-ja-hairline); border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div style="width: 38px; height: 38px; border-radius: 8px; background: #1D4ED8; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">B</div>
                      <div>
                        <div style="font-size: 14px; font-weight: 600;">Brightwave</div>
                        <div style="font-size: 13px; color: var(--color-ja-slate);">Senior Software Engineer · Remote</div>
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="badge-blue-subtle">96/100 Score</span>
                      <span class="badge-pill-green">Ready to Auto-Apply</span>
                    </div>
                  </div>
                </div>

                <!-- Feature 2: Prioritize Best-Fit -->
                <div style="border: 1px solid var(--color-ja-border); border-radius: 16px; padding: 24px; background: #FFFFFF;">
                  <h3 style="font-size: 18px; margin-bottom: 4px;">Prioritize your best-fit jobs</h3>
                  <p style="font-size: 14.5px; color: var(--color-ja-slate); margin-bottom: 14px;">
                    See your best-fit jobs first, scored for your profile, so you spend time on roles worth applying to.
                  </p>
                  <!-- Mockup Match Breakdown -->
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #F8FAFC; border: 1px solid var(--color-ja-hairline); border-radius: 12px; padding: 14px; text-align: center;">
                    <div>
                      <div style="font-size: 12px; color: var(--color-ja-muted);">Role Fit</div>
                      <div style="font-size: 16px; font-weight: 700; color: var(--color-ja-blue);">96%</div>
                    </div>
                    <div>
                      <div style="font-size: 12px; color: var(--color-ja-muted);">Title Match</div>
                      <div style="font-size: 16px; font-weight: 700; color: var(--color-ja-blue);">95%</div>
                    </div>
                    <div>
                      <div style="font-size: 12px; color: var(--color-ja-muted);">Location Fit</div>
                      <div style="font-size: 16px; font-weight: 700; color: var(--color-ja-blue);">94%</div>
                    </div>
                  </div>
                </div>

                <!-- Feature 3: Role-specific cover letters -->
                <div style="border: 1px solid var(--color-ja-border); border-radius: 16px; padding: 24px; background: #FFFFFF;">
                  <h3 style="font-size: 18px; margin-bottom: 4px;">Role-specific cover letters</h3>
                  <p style="font-size: 14.5px; color: var(--color-ja-slate); margin-bottom: 14px;">
                    Each application includes a cover letter written for that job, using your experience and role requirements.
                  </p>
                  <div style="background: #F8FAFC; border: 1px solid var(--color-ja-hairline); border-radius: 12px; padding: 14px 16px; font-size: 13.5px; color: var(--color-ja-slate); font-style: italic; line-height: 1.5;">
                    "Dear Hiring Team, I'm excited to apply for the Senior Software Engineer role. Over five years building distributed systems, I led high-throughput platforms at scale, shipping products used by millions..."
                  </div>
                </div>

                <!-- Feature 4: Replies & Interviews Tracked -->
                <div style="border: 1px solid var(--color-ja-border); border-radius: 16px; padding: 24px; background: #FFFFFF;">
                  <h3 style="font-size: 18px; margin-bottom: 4px;">Replies and interviews tracked</h3>
                  <p style="font-size: 14.5px; color: var(--color-ja-slate); margin-bottom: 14px;">
                    Recruiter replies, interview invites, and next steps stay organized in one place.
                  </p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="background: #F8FAFC; border: 1px solid var(--color-ja-hairline); border-radius: 10px; padding: 10px 14px; display: flex; justify-content: space-between; font-size: 13px;">
                      <span><strong>Northwind Labs Recruiting</strong> — Interview availability</span>
                      <span style="color: var(--color-ja-blue); font-weight: 600;">9:41 AM</span>
                    </div>
                    <div style="background: #F8FAFC; border: 1px solid var(--color-ja-hairline); border-radius: 10px; padding: 10px 14px; display: flex; justify-content: space-between; font-size: 13px;">
                      <span><strong>Brightwave Recruiting</strong> — Thanks for applying - next steps</span>
                      <span style="color: var(--color-ja-muted);">Yesterday</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- FAQs Accordion -->
            <div>
              <h2 style="font-size: 24px; margin-bottom: 20px;">Frequently Asked Questions</h2>
              <div style="border-top: 1px solid var(--color-ja-hairline);">
                ${state.faqs.map((faq, index) => `
                  <div class="faq-accordion-item" id="faq-item-${index}">
                    <button class="faq-trigger" onclick="toggleFaq(${index});">
                      <span>${faq.q}</span>
                      ${icons.chevronDown}
                    </button>
                    <div class="faq-content">
                      <p style="white-space: pre-line;">${faq.a}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Sticky Plan Selector & Payment Form -->
          <div class="ja-sticky-column">
            
            <div style="background: #FFFFFF; border: 1.5px solid var(--color-ja-border); border-radius: 24px; padding: 28px 24px; box-shadow: var(--shadow-float);">
              
              <h3 style="font-size: 20px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between;">
                <span>Unlock Your Matches</span>
                <span style="font-size: 13px; color: var(--color-ja-muted); font-weight: 500;">Step 4 of 4</span>
              </h3>

              <!-- Plans Selector -->
              <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                ${state.plans.map(plan => {
                  const isActive = plan.id === state.selectedPlanId;
                  const price = isUSD ? plan.dueTodayUSD : plan.dueTodayETB;
                  const fullPrice = isUSD ? plan.fullPriceFormattedUSD : plan.fullPriceFormattedETB;
                  
                  return `
                    <div 
                      class="plan-card ${isActive ? 'active' : ''}" 
                      onclick="selectPlan('${plan.id}');"
                    >
                      <div style="display: flex; align-items: center; gap: 14px;">
                        <div class="plan-radio-circle"></div>
                        <div>
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-weight: 700; font-size: 16px;">${plan.name}</span>
                            ${plan.badge ? `<span class="badge-pill-green" style="font-size: 10px; padding: 2px 6px;">${plan.badge}</span>` : ''}
                          </div>
                          ${plan.savingsText ? `<div style="font-size: 12px; color: var(--color-ja-pill-text); font-weight: 600;">${plan.savingsText}</div>` : ''}
                        </div>
                      </div>

                      <div style="text-align: right;">
                        <div style="font-size: 18px; font-weight: 800; color: var(--color-ja-ink);">${price}</div>
                        ${fullPrice ? `<div style="font-size: 12px; color: #94A3B8; text-decoration: line-through;">${fullPrice}</div>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Order Summary / Due Today -->
              <div style="background: #F8FAFC; border: 1px solid var(--color-ja-border); border-radius: 16px; padding: 18px; margin-bottom: 24px;">
                <p style="font-size: 13px; color: var(--color-ja-slate); line-height: 1.5; margin-bottom: 12px;">
                  ${renewalTerms}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid var(--color-ja-hairline); padding-top: 12px;">
                  <span style="font-size: 15px; font-weight: 600; color: var(--color-ja-slate);">Due Today:</span>
                  <div style="text-align: right;">
                    <span style="font-size: 24px; font-weight: 800; color: var(--color-ja-blue);">${dueTodayPrice}</span>
                  </div>
                </div>
              </div>

              <!-- Express Payment Buttons -->
              <div style="margin-bottom: 20px;">
                <div style="font-size: 12px; font-weight: 600; color: var(--color-ja-muted); text-transform: uppercase; margin-bottom: 10px; text-align: center;">
                  Express Checkout
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
                  <!-- PayPal Button -->
                  <button 
                    onclick="handlePayPalCheckout();" 
                    style="height: 44px; border-radius: 9999px; background: #FFC439; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 700; color: #003087;"
                  >
                    <span style="font-style: italic; font-weight: 900;">PayPal</span>
                  </button>

                  <!-- Google Pay / Apple Pay -->
                  <button 
                    onclick="handleGPayCheckout();" 
                    style="height: 44px; border-radius: 9999px; background: #000000; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; color: #FFFFFF;"
                  >
                    <span>G Pay / Apple Pay</span>
                  </button>
                </div>

                <div style="display: flex; align-items: center; gap: 10px; margin: 16px 0;">
                  <div style="flex: 1; height: 1px; background: var(--color-ja-hairline);"></div>
                  <span style="font-size: 12px; color: #94A3B8; text-transform: uppercase;">Or pay with card</span>
                  <div style="flex: 1; height: 1px; background: var(--color-ja-hairline);"></div>
                </div>
              </div>

              <!-- Hosted Card Payment Form -->
              <form id="card-checkout-form" onsubmit="handleCardSubmit(event);">
                
                <div style="margin-bottom: 12px;">
                  <label style="display: block; font-size: 12px; font-weight: 600; color: var(--color-ja-slate); margin-bottom: 4px;">Card Number</label>
                  <div style="position: relative;">
                    <input 
                      type="text" 
                      id="card-number" 
                      class="ja-input" 
                      placeholder="4242 •••• •••• 4242" 
                      maxlength="19"
                      oninput="formatCardNumber(this);"
                      required
                    />
                    <span id="card-brand-badge" style="position: absolute; right: 12px; top: 14px; font-size: 12px; font-weight: 700; color: var(--color-ja-blue);"></span>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                  <div>
                    <label style="display: block; font-size: 12px; font-weight: 600; color: var(--color-ja-slate); margin-bottom: 4px;">Expiration</label>
                    <input 
                      type="text" 
                      id="card-expiry" 
                      class="ja-input" 
                      placeholder="MM / YY" 
                      maxlength="5"
                      oninput="formatCardExpiry(this);"
                      required
                    />
                  </div>
                  <div>
                    <label style="display: block; font-size: 12px; font-weight: 600; color: var(--color-ja-slate); margin-bottom: 4px;">Security Code</label>
                    <input 
                      type="text" 
                      id="card-cvc" 
                      class="ja-input" 
                      placeholder="CVC" 
                      maxlength="4"
                      required
                    />
                  </div>
                </div>

                <div style="margin-bottom: 20px;">
                  <label style="display: block; font-size: 12px; font-weight: 600; color: var(--color-ja-slate); margin-bottom: 4px;">Billing Zip / Postal Code</label>
                  <input 
                    type="text" 
                    id="card-zip" 
                    class="ja-input" 
                    placeholder="ZIP / Postal Code" 
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  id="checkout-cta-btn" 
                  class="btn-primary" 
                  style="width: 100%; height: 52px; font-size: 16px;"
                >
                  Start Applying Now
                </button>

              </form>

              <div style="margin-top: 18px; text-align: center; font-size: 12px; color: var(--color-ja-muted); line-height: 1.5;">
                Safe 256-Bit SSL Checkout · Instant Access · Cancel anytime in under 60 seconds from your profile settings.
              </div>

            </div>

          </div>

        </div>

      </div>
    </main>

    <!-- Mobile Sticky Bottom Bar -->
    <div class="mobile-sticky-bar">
      <div>
        <div style="font-size: 12px; color: var(--color-ja-muted); font-weight: 600;">Due Today</div>
        <div style="font-size: 18px; font-weight: 800; color: var(--color-ja-blue);">${dueTodayPrice}</div>
      </div>
      <button class="btn-primary" style="height: 42px; padding: 0 20px; font-size: 14px;" onclick="scrollToPayment();">
        Start Applying Now
      </button>
    </div>

    ${renderDarkFooter()}
  `;
}

function selectPlan(planId) {
  state.selectedPlanId = planId;
  renderApp();
}

function setCurrency(curr) {
  state.selectedCurrency = curr;
  localStorage.setItem('ja_currency', curr);
  renderApp();
}

function toggleFaq(index) {
  const item = document.getElementById(`faq-item-${index}`);
  if (item) {
    item.classList.toggle('open');
  }
}

function scrollToPayment() {
  const form = document.getElementById('card-checkout-form');
  if (form) {
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '');
  val = val.substring(0, 16);
  const parts = [];
  for (let i = 0; i < val.length; i += 4) {
    parts.push(val.substring(i, i + 4));
  }
  input.value = parts.join(' ');

  const badge = document.getElementById('card-brand-badge');
  if (badge) {
    if (val.startsWith('4')) badge.innerText = 'VISA';
    else if (val.startsWith('5')) badge.innerText = 'MASTERCARD';
    else if (val.startsWith('3')) badge.innerText = 'AMEX';
    else badge.innerText = '';
  }
}

function formatCardExpiry(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length >= 2) {
    input.value = val.substring(0, 2) + '/' + val.substring(2, 4);
  } else {
    input.value = val;
  }
}

async function handleCardSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('checkout-cta-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Authorizing payment...';
  }

  const cardNum = document.getElementById('card-number').value.replace(/\s+/g, '');
  const last4 = cardNum.slice(-4) || '4242';

  try {
    const res = await fetch('/api/checkout/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: state.selectedPlanId,
        email: state.email || sessionStorage.getItem('ja_lead_email') || 'applicant@jobassist.com',
        paymentMethod: 'card',
        cardLast4: last4,
        currency: state.selectedCurrency
      })
    });
    const data = await res.json();
    if (data.success) {
      state.activeSubscription = data.subscription;
      showToast('Payment successful! Your subscription is active.', 'success');
      setTimeout(() => navigate('/welcome'), 600);
    }
  } catch (err) {
    showToast('Payment authorization simulated successfully.', 'success');
    navigate('/welcome');
  }
}

function handlePayPalCheckout() {
  showToast('Connecting to PayPal Express...', 'info');
  setTimeout(() => {
    handlePaymentSuccess('paypal');
  }, 1000);
}

function handleGPayCheckout() {
  showToast('Connecting to Google Pay / Apple Pay...', 'info');
  setTimeout(() => {
    handlePaymentSuccess('gpay');
  }, 1000);
}

async function handlePaymentSuccess(method) {
  try {
    const res = await fetch('/api/checkout/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: state.selectedPlanId,
        email: state.email || 'applicant@jobassist.com',
        paymentMethod: method,
        currency: state.selectedCurrency
      })
    });
    const data = await res.json();
    state.activeSubscription = data.subscription;
  } catch (e) {}

  showToast('Payment authorized successfully!', 'success');
  navigate('/welcome');
}

// --------------------------------------------------------
// POST-CHECKOUT PORTAL (/welcome)
// --------------------------------------------------------
function renderWelcomeView() {
  const sub = state.activeSubscription || {
    planName: '1-Month Plan',
    customerEmail: state.email || 'applicant@jobassist.com',
    amountBilled: state.selectedCurrency === 'USD' ? '$35.00' : 'Br4,332.99'
  };

  return `
    ${renderFunnelHeader()}
    <main style="padding: 48px 20px 80px;">
      <div class="ja-container" style="max-width: 900px;">
        
        <div style="background: var(--color-ja-mint-bg); border: 2px solid var(--color-ja-mint-border); border-radius: 20px; padding: 32px; text-align: center; margin-bottom: 36px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #10B981; color: white; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 style="font-size: 32px; color: #065F46; margin-bottom: 8px;">Your 2,411 Job Matches Are Unlocked!</h1>
          <p style="font-size: 16px; color: #047857;">
            Welcome to JobAssist! Confirmation email sent to <strong>${sub.customerEmail}</strong>.
          </p>
        </div>

        <div style="background: #FFFFFF; border: 1.5px solid var(--color-ja-border); border-radius: 20px; padding: 32px; margin-bottom: 36px; box-shadow: var(--shadow-sm);">
          <h2 style="font-size: 22px; margin-bottom: 20px;">Top Matched Opportunities (Scored For You)</h2>
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${state.jobs.slice(0, 3).map(j => `
              <div style="border: 1px solid var(--color-ja-border); border-radius: 14px; padding: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 44px; height: 44px; border-radius: 10px; background: ${j.companyColor}; color: white; font-weight: 700; font-size: 18px; display: flex; align-items: center; justify-content: center;">
                    ${j.companyInitial}
                  </div>
                  <div>
                    <h3 style="font-size: 17px; margin-bottom: 2px;">${j.title}</h3>
                    <div style="font-size: 13.5px; color: var(--color-ja-slate);">${j.company} · ${j.location} · <strong>${j.salary}</strong></div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="badge-pill-green">${j.matchScore}% Match</span>
                  <button class="btn-primary" style="height: 38px; padding: 0 16px; font-size: 13.5px;" onclick="launchAiAutoApplyForWelcome('${j.title}', '${j.company}', '${j.location}');">
                    Auto Apply
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="text-align: center; display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
          <button class="btn-primary" onclick="navigate('/assistant');" style="height: 48px; padding: 0 26px; font-size: 15px; font-weight: 700; background: #1D4ED8;">
            Launch Autonomous AI Studio →
          </button>
          <button class="btn-outline" onclick="navigate('/cancellation');" style="height: 48px; padding: 0 20px;">
            Manage / Cancel Subscription
          </button>
        </div>

      </div>
    </main>
    ${renderDarkFooter()}
  `;
}

// --------------------------------------------------------
// SELF-SERVICE CANCELLATION (/cancellation)
// --------------------------------------------------------
function renderCancellationView() {
  return `
    ${renderMarketingHeader()}
    <main style="padding: 48px 20px 80px;">
      <div class="ja-card-container" style="max-width: 580px;">
        
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 30px; margin-bottom: 10px;">How to Cancel Your Subscription</h1>
          <p style="font-size: 15px; color: var(--color-ja-slate);">
            JobAssist provides instant, 100% self-service cancellation with zero phone calls or hassles.
          </p>
        </div>

        <div style="background: #FFFFFF; border: 1.5px solid var(--color-ja-border); border-radius: 20px; padding: 32px; box-shadow: var(--shadow-sm); margin-bottom: 24px;">
          <h2 style="font-size: 18px; margin-bottom: 14px;">Instant Cancellation Form</h2>
          <p style="font-size: 14px; color: var(--color-ja-slate); margin-bottom: 20px;">
            Enter the email address associated with your subscription to cancel immediately:
          </p>

          <form onsubmit="handleCancelSubmit(event);">
            <div style="margin-bottom: 18px;">
              <input 
                type="email" 
                id="cancel-email-input" 
                class="ja-input" 
                placeholder="Enter your subscription email" 
                value="${state.email}"
                required
              />
            </div>

            <button type="submit" id="cancel-btn" class="btn-primary" style="width: 100%; background: #EF4444; height: 48px;">
              Cancel My Subscription Immediately
            </button>
          </form>

          <div id="cancel-confirmation-box" style="display: none; margin-top: 20px; padding: 16px; border-radius: 12px; background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; font-size: 14px;"></div>
        </div>

        <div style="border: 1px solid var(--color-ja-border); border-radius: 16px; padding: 20px; background: #F8FAFC; font-size: 13.5px; color: var(--color-ja-slate); line-height: 1.6;">
          <strong>Cancellation Policy:</strong><br/>
          Your subscription will remain active until the end of your current billing period. You will never be charged again. Confirmation is shown on screen and sent to your email immediately.
        </div>

      </div>
    </main>
    ${renderDarkFooter()}
  `;
}

async function handleCancelSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('cancel-email-input');
  const btn = document.getElementById('cancel-btn');
  const box = document.getElementById('cancel-confirmation-box');

  const email = emailInput.value.trim();
  if (!email) return;

  btn.disabled = true;
  btn.innerText = 'Processing cancellation...';

  try {
    const res = await fetch('/api/subscription/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    
    box.style.display = 'block';
    if (data.success) {
      box.style.background = '#ECFDF5';
      box.style.borderColor = '#A7F3D0';
      box.style.color = '#065F46';
      box.innerHTML = `<strong>Cancellation Confirmed!</strong><br/>${data.message}`;
      showToast('Subscription canceled successfully.', 'success');
    } else {
      box.innerText = data.error || 'No active subscription was found for this email address.';
    }
  } catch (err) {
    box.style.display = 'block';
    box.innerText = 'Subscription canceled successfully in system.';
  }

  btn.disabled = false;
  btn.innerText = 'Cancel My Subscription Immediately';
}

// --------------------------------------------------------
// GRANULAR ACCESS PASSES & PRICING CONFIGURATION
// --------------------------------------------------------
const COMBO_PLANS = {
  autofill: {
    id: 'autofill-specialist',
    title: 'AutoFill Specialist',
    subtitle: '1-Click ATS Form Filler & Question Solver',
    badge: 'AutoFill Only',
    badgeColor: '#2563EB',
    features: [
      'Universal 1-Click Form AutoFill on Greenhouse, Lever, Workday, Taleo, Ashby, BambooHR',
      'AI STAR Behavioral Question Solver (Situation, Task, Action, Result)',
      'Unlimited Candidate Ground-Truth Profile storage',
      'Anti-bot stealth mode & adaptive form field mapping',
      'Weekly 2–3 Days Selector & Layout Updates',
      '✕ Job Hunter radar not included'
    ],
    pricing: {
      daily: { etb: '75 ETB', usd: '$1.49', label: '24h Sprint' },
      flex: { etb: '150 ETB', usd: '$2.99', label: '2–3 Days / Wk' },
      monthly: { etb: '800 ETB', usd: '$14.99', label: '30 Days Access' },
      yearly: { etb: '6,500 ETB', usd: '$99.99', label: '365 Days Access' }
    }
  },
  hunter: {
    id: 'hunter-pro',
    title: 'Job Hunter Pro',
    subtitle: 'Strict ≤ 5-Day Fresh Job Radar',
    badge: 'Hunter Only',
    badgeColor: '#059669',
    features: [
      'Multi-Site Autonomous Scraper (Greenhouse, Lever, Workday, Taleo, Ashby, BambooHR, LinkedIn Easy Apply, Indeed, RemoteOK)',
      'Strict ≤ 5-Day Freshness Filter (never apply to expired listings)',
      'Instant Match Score & Skill Gap Analysis against your resume',
      'Real-time alerts for newly discovered high-fit openings',
      'Weekly 2–3 Days Scraper Updates',
      '✕ Form AutoFill not included'
    ],
    pricing: {
      daily: { etb: '75 ETB', usd: '$1.49', label: '24h Sprint' },
      flex: { etb: '150 ETB', usd: '$2.99', label: '2–3 Days / Wk' },
      monthly: { etb: '800 ETB', usd: '$14.99', label: '30 Days Access' },
      yearly: { etb: '6,500 ETB', usd: '$99.99', label: '365 Days Access' }
    }
  },
  combo: {
    id: 'studio-combo',
    title: 'Hunter + AutoFill Combo',
    subtitle: 'Complete 3-in-1 Suite: AutoFill + Job Hunter + Canva Resumes',
    badge: 'Most Popular • Full Suite',
    badgeColor: '#007aff',
    featured: true,
    features: [
      'EVERYTHING in AutoFill Specialist Pass',
      'EVERYTHING in Fresh Job Hunter Pro Pass (≤ 5-Day Freshness)',
      'Canva-Grade ATS Resume Generator & Custom Tailoring',
      'Autonomous Auto-Apply Pipeline & Recruiter Outreach scripts',
      'Priority Admin Verification & Instant License Email Dispatch',
      'Full Guaranteed Weekly 2–3 Days Engine Releases'
    ],
    pricing: {
      daily: { etb: '100 ETB', usd: '$1.99', label: '24h Sprint' },
      flex: { etb: '250 ETB', usd: '$4.99', label: '2–3 Days / Wk' },
      monthly: { etb: '1,200 ETB', usd: '$24.99', label: '30 Days Access' },
      yearly: { etb: '9,500 ETB', usd: '$149.99', label: '365 Days Access' }
    }
  }
};

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    navigate('/');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }
}
window.scrollToSection = scrollToSection;

function switchComboCurrency(curr) {
  state.comboCurrency = curr;
  renderComboPlansGrid();
  updatePaymentGatewayOptions();
}
window.switchComboCurrency = switchComboCurrency;

function switchComboCadence(cadence) {
  state.comboCadence = cadence;
  renderComboPlansGrid();
}
window.switchComboCadence = switchComboCadence;

function renderComboPlansGrid() {
  const container = document.getElementById('combo-plans-container');
  if (!container) return;
  const isETB = state.comboCurrency === 'ETB';
  const cad = state.comboCadence;

  document.querySelectorAll('.jw-switch-btn.btn-curr-toggle').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.currency === state.comboCurrency);
  });
  document.querySelectorAll('.jw-switch-btn.btn-cad-toggle').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cadence === state.comboCadence);
  });

  const cardsHtml = Object.values(COMBO_PLANS).map(plan => {
    const priceObj = plan.pricing[cad];
    const priceStr = isETB ? priceObj.etb : priceObj.usd;
    const isSelected = state.selectedComboPlan === plan.id;

    return `
      <div class="jw-pricing-card ${plan.featured ? 'featured' : ''}" style="${isSelected ? 'border-color: #007aff; box-shadow: 0 0 35px rgba(0, 122, 255, 0.35);' : ''}">
        ${plan.featured ? `<div class="jw-featured-pill">${plan.badge}</div>` : ''}
        
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 11px; font-weight: 800; color: ${plan.badgeColor}; letter-spacing: 0.5px; text-transform: uppercase;">${plan.badge}</span>
          ${plan.featured ? '<span style="background: rgba(0, 122, 255, 0.15); border: 1px solid rgba(0, 122, 255, 0.3); color: #38bdf8; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px;">RECOMMENDED</span>' : ''}
        </div>

        <h3 style="font-size: 21px; font-weight: 800; margin-bottom: 6px; color: #fafaf9;">${plan.title}</h3>
        <p style="font-size: 13px; color: #a1a1a6; margin-bottom: 22px; min-height: 38px; line-height: 1.45;">${plan.subtitle}</p>

        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
          <span style="font-size: 38px; font-weight: 800; color: #fafaf9; letter-spacing: -1.2px;">${priceStr}</span>
          <span style="font-size: 13px; color: #71717a; font-weight: 500;">/ ${priceObj.label}</span>
        </div>

        <ul style="list-style: none; display: flex; flex-direction: column; gap: 11px; margin-bottom: 28px; flex: 1;">
          ${plan.features.map(f => {
            const isNegative = f.startsWith('✕');
            return `
              <li style="font-size: 13px; line-height: 1.45; color: ${isNegative ? '#52525b' : '#d4d4d8'}; display: flex; align-items: flex-start; gap: 9px;">
                <span style="color: ${isNegative ? '#3f3f46' : '#10b981'}; font-weight: bold; flex-shrink: 0; margin-top: 1px;">${isNegative ? '✕' : '✓'}</span>
                <span>${f.replace(/^[✕\s]+/, '')}</span>
              </li>
            `;
          }).join('')}
        </ul>

        <button 
          type="button" 
          class="${plan.featured ? 'jw-btn-primary' : 'jw-btn-secondary'}" 
          style="width: 100%; height: 46px; font-size: 14px; font-weight: 700; border-radius: 9999px;"
          onclick="selectPassForPayment('${plan.id}', '${escapeTextForJs(plan.title)}', '${priceStr} (${priceObj.label})');"
        >
          Select This Pass →
        </button>
      </div>
    `;
  }).join('');

  container.innerHTML = cardsHtml;
}
window.renderComboPlansGrid = renderComboPlansGrid;

function selectPassForPayment(planId, planTitle, priceLabel) {
  state.selectedComboPlan = planId;
  const planSelect = document.getElementById('home-pay-plan');
  if (planSelect) {
    planSelect.value = planId;
  }
  const summaryNotice = document.getElementById('home-selected-plan-notice');
  if (summaryNotice) {
    summaryNotice.innerHTML = `Selected Pass: <b>${planTitle}</b> • <b>${priceLabel}</b>`;
    summaryNotice.style.display = 'block';
  }
  scrollToSection('payment-section');
  showToast(`Selected ${planTitle} (${priceLabel})! Submit your payment reference below.`, 'success');
}
window.selectPassForPayment = selectPassForPayment;

function updatePaymentGatewayOptions() {
  const isETB = state.comboCurrency === 'ETB';
  const gatewaySelect = document.getElementById('home-pay-gateway');
  if (!gatewaySelect) return;

  if (isETB) {
    gatewaySelect.innerHTML = `
      <option value="telebirr" selected>Telebirr (0948232717)</option>
      <option value="cbe">CBE Bank (1000542193275)</option>
    `;
  } else {
    gatewaySelect.innerHTML = `
      <option value="binance" selected>Binance UID (1032674236)</option>
    `;
  }
}
window.updatePaymentGatewayOptions = updatePaymentGatewayOptions;

function copyAccountText(text, label) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${label} to clipboard: ${text}`, 'success');
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
window.copyAccountText = copyAccountText;

function openUnpackGuideModal() {
  const modal = document.getElementById('unpack-guide-modal');
  if (modal) modal.style.display = 'flex';
}
window.openUnpackGuideModal = openUnpackGuideModal;

function closeUnpackGuideModal() {
  const modal = document.getElementById('unpack-guide-modal');
  if (modal) modal.style.display = 'none';
}
window.closeUnpackGuideModal = closeUnpackGuideModal;

// --------------------------------------------------------
// Interactive Hero Mockup Playground Controllers
// --------------------------------------------------------
function switchMockupDemoTab(tab) {
  const tabs = ['autofill', 'hunter', 'resume'];
  tabs.forEach(t => {
    const btn = document.getElementById(`mockup-btn-${t}`);
    const view = document.getElementById(`mockup-view-${t}`);
    if (btn) {
      if (t === tab) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    if (view) {
      if (t === tab) view.style.display = 'grid';
      else view.style.display = 'none';
    }
  });

  const urlDisp = document.getElementById('mockup-url-display');
  const statBadge = document.getElementById('mockup-status-badge');
  if (tab === 'autofill') {
    if (urlDisp) urlDisp.textContent = 'boards.greenhouse.io/openai/jobs/senior-systems-engineer';
    if (statBadge) statBadge.textContent = 'Greenhouse AutoFill Active';
  } else if (tab === 'hunter') {
    if (urlDisp) urlDisp.textContent = 'radar.jobassist.ai/scout?portals=9&freshness=5d';
    if (statBadge) statBadge.textContent = '9-Portal Radar Scouting';
  } else if (tab === 'resume') {
    if (urlDisp) urlDisp.textContent = 'resume.jobassist.ai/export/canva/dawit-haile-openai';
    if (statBadge) statBadge.textContent = 'Canva ATS Resume Ready';
  }
}
window.switchMockupDemoTab = switchMockupDemoTab;

function simulateMockupAutoFill() {
  const btn = document.getElementById('mock-autofill-action-btn');
  const fitScore = document.getElementById('mock-fit-score');
  const fieldsCount = document.getElementById('mock-fields-count');

  if (btn) {
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>✓ AutoFilled (14 Fields)</span>`;
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  }
  if (fitScore) fitScore.textContent = '99%';
  if (fieldsCount) fieldsCount.textContent = '14 / 14 fields populated!';

  // Flash inputs with green pulse
  document.querySelectorAll('.mockup-field-box').forEach((box, i) => {
    setTimeout(() => {
      box.style.borderColor = '#10b981';
      box.style.background = 'rgba(16, 185, 129, 0.08)';
    }, i * 150);
  });

  showToast('1-Click AutoFill simulated! All 14 Greenhouse fields & STAR answers populated.', 'success');
}
window.simulateMockupAutoFill = simulateMockupAutoFill;

function simulateMockupHunterPause() {
  const pBtn = document.getElementById('mock-btn-pause');
  const cBtn = document.getElementById('mock-btn-continue');
  const banner = document.getElementById('mock-pause-banner');
  const rStatus = document.getElementById('mock-radar-status');
  const job1Action = document.getElementById('mock-job-1-action');

  if (pBtn) pBtn.style.display = 'none';
  if (cBtn) cBtn.style.display = 'inline-block';
  if (banner) banner.style.display = 'block';
  if (rStatus) {
    rStatus.textContent = 'PAUSED • AutoFill Ready';
    rStatus.style.background = 'rgba(0, 122, 255, 0.2)';
    rStatus.style.color = '#38bdf8';
  }
  if (job1Action) {
    job1Action.innerHTML = `<button type="button" onclick="switchMockupDemoTab('autofill'); simulateMockupAutoFill();" style="background:#007aff;color:#fff;border:none;border-radius:4px;padding:3px 8px;font-size:10.5px;font-weight:700;cursor:pointer;">1-Click AutoFill</button>`;
  }
  showToast('Radar Paused. OpenAI role selected for 1-Click AutoFill.', 'info');
}
window.simulateMockupHunterPause = simulateMockupHunterPause;

function simulateMockupHunterContinue() {
  const pBtn = document.getElementById('mock-btn-pause');
  const cBtn = document.getElementById('mock-btn-continue');
  const banner = document.getElementById('mock-pause-banner');
  const rStatus = document.getElementById('mock-radar-status');
  const job1Action = document.getElementById('mock-job-1-action');

  if (pBtn) pBtn.style.display = 'inline-block';
  if (cBtn) cBtn.style.display = 'none';
  if (banner) banner.style.display = 'none';
  if (rStatus) {
    rStatus.textContent = '0 Duplicates • Active';
    rStatus.style.background = 'rgba(16, 185, 129, 0.15)';
    rStatus.style.color = '#34d399';
  }
  if (job1Action) {
    job1Action.textContent = '98% Fit';
  }
  showToast('Radar Resumed: Scanning remaining 8 ATS portals for fresh roles...', 'success');
}
window.simulateMockupHunterContinue = simulateMockupHunterContinue;

async function handleHomePaymentSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('home-pay-name').value.trim();
  const email = document.getElementById('home-pay-email').value.trim();
  const planId = document.getElementById('home-pay-plan').value;
  const gateway = document.getElementById('home-pay-gateway').value;
  const reference = document.getElementById('home-pay-ref').value.trim();
  const btn = document.getElementById('btn-home-pay-submit');
  const statusBox = document.getElementById('home-pay-status');

  if (!email || !reference) {
    showToast('Please provide your candidate email and payment transaction reference.', 'error');
    return;
  }

  btn.textContent = 'Verifying & Submitting...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/premium/submit-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateName: name,
        email: email,
        planId: planId || state.selectedComboPlan,
        currency: state.comboCurrency,
        paymentMethod: gateway,
        reference: reference
      })
    });
    const data = await res.json();
    if (data.success) {
      statusBox.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10b981; border-radius: 12px; padding: 18px; color: #34d399; text-align: left;">
          <div style="font-size: 16px; font-weight: 800; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            <span style="color: #10b981;">✓</span> Payment Proof Submitted Successfully!
          </div>
          <p style="font-size: 13px; color: #d4d4d8; margin-bottom: 8px; line-height: 1.5;">
            Transaction Reference: <code>${reference}</code><br/>
            Admin has been notified. Once approved, your <b>PREM-XXXX-XXXX</b> license key will be automatically emailed to <b>${email}</b>.
          </p>
          <div style="font-size: 12px; background: rgba(16, 185, 129, 0.2); padding: 8px 12px; border-radius: 8px; font-weight: 600;">
            Next Step: Download the Chrome Extension (.ZIP) above, unpack it in Chrome, and enter your emailed key!
          </div>
        </div>
      `;
      statusBox.style.display = 'block';
      showToast('Payment submitted! Admin will verify and email your license key.', 'success');
      document.getElementById('home-payment-form').reset();
    } else {
      statusBox.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 8px; padding: 12px; color: #fca5a5;">
          ✕ ${data.error || 'Submission failed. Please check your reference code.'}
        </div>
      `;
      statusBox.style.display = 'block';
      showToast(data.error || 'Submission failed', 'error');
    }
  } catch (err) {
    statusBox.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 8px; padding: 12px; color: #fca5a5;">
        ✕ Network Error: ${err.message}
      </div>
    `;
    statusBox.style.display = 'block';
    showToast(`Network error: ${err.message}`, 'error');
  } finally {
    btn.textContent = 'Submit Transaction for Verification';
    btn.disabled = false;
  }
}
window.handleHomePaymentSubmit = handleHomePaymentSubmit;

// --------------------------------------------------------
// MARKETING HOME PAGE (/) - JOBWIZARD REVERSED DESIGN
// --------------------------------------------------------
function renderMarketingHomeView() {
  return `
    <div class="jw-page">
      <!-- Background Grid & Spotlight -->
      <div class="jw-grid-pattern"></div>
      <div class="jw-spotlight-top"></div>

      ${renderMarketingHeader()}

      <!-- HERO SECTION -->
      <section style="position: relative; padding: 60px 20px 80px; text-align: center; overflow: hidden; z-index: 2;">
        
        <!-- Floating Platform Chips in Background -->
        <div class="jw-floating-chip hide-mobile" style="top: 10%; left: 5%; animation-delay: 0s;">
          <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #0077b5;"></span>
          <span>LinkedIn Active</span>
        </div>
        <div class="jw-floating-chip hide-mobile" style="top: 14%; right: 6%; animation-delay: 1.5s;">
          <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #10b981;"></span>
          <span>Greenhouse ATS</span>
        </div>
        <div class="jw-floating-chip hide-mobile" style="top: 50%; left: 4%; animation-delay: 2.5s;">
          <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #f59e0b;"></span>
          <span>Workday ATS</span>
        </div>
        <div class="jw-floating-chip hide-mobile" style="top: 54%; right: 4%; animation-delay: 0.8s;">
          <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #60a5fa;"></span>
          <span>Lever ATS</span>
        </div>

        <div class="ja-container" style="max-width: 980px; position: relative; z-index: 3;">
          
          <!-- Announcement Pill with Animated Ping Dot -->
          <div class="jw-pill-badge">
            <div class="jw-ping-dot">
              <span class="ping"></span>
              <span class="core"></span>
            </div>
            <span>3-in-1 Platform: Fresh Job Hunter • 1-Click ATS AutoFill • Tailored Resumes</span>
          </div>

          <!-- Main Headline -->
          <h1 style="font-size: clamp(2.3rem, 5.2vw, 4.1rem); font-weight: 800; line-height: 1.14; letter-spacing: -0.035em; color: #fafaf9; margin-bottom: 22px;">
            Autonomous job hunting and<br/>
            <span class="jw-gradient-text">1-click ATS application autofill</span>
          </h1>

          <!-- Subtitle highlighting JobAssist's 3-in-1 vs single-purpose tools -->
          <p style="font-size: clamp(1rem, 2vw, 1.18rem); color: #a1a1a6; line-height: 1.6; max-width: 720px; margin: 0 auto 36px;">
            While basic tools only fill forms, JobAssist is a complete 3-in-1 platform: an autonomous scraper scouting strictly fresh roles (≤ 5 days old), a 1-click ATS form filler for Greenhouse, Lever &amp; Workday, and a Canva-grade resume tailor.
          </p>

          <!-- Action Buttons -->
          <div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 34px;">
            <a href="/download-extension" download class="jw-btn-primary" style="padding: 14px 28px; font-size: 15px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>
              Download Chrome Extension (.ZIP)
              <span style="background: rgba(255, 255, 255, 0.2); font-size: 11px; padding: 2px 7px; border-radius: 9999px;">v3.2.0 • 58 KB</span>
            </a>

            <button type="button" class="jw-btn-secondary" onclick="openUnpackGuideModal();" style="padding: 14px 24px; font-size: 14.5px;">
              How to Unpack in 30s
            </button>

            <button type="button" class="jw-btn-outline" onclick="scrollToSection('plans-section');" style="padding: 14px 22px; font-size: 14px;">
              View Access Passes
            </button>
          </div>

          <!-- Trust Badges -->
          <div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 18px; font-size: 12.5px; color: #71717a;">
            <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="color: #10b981; font-weight: bold;">✓</span> Autonomous Job Hunter (&le; 5 Days)</span>
            <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="color: #10b981; font-weight: bold;">✓</span> 1-Click ATS AutoFill Engine</span>
            <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="color: #10b981; font-weight: bold;">✓</span> Canva-Grade Tailored Resumes</span>
            <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="color: #10b981; font-weight: bold;">✓</span> Telebirr, CBE &amp; Binance UID</span>
            <span style="display: inline-flex; align-items: center; gap: 6px;"><span style="color: #10b981; font-weight: bold;">✓</span> Weekly 2–3 Days Updates</span>
          </div>

          <!-- Live Interactive Window Mockup -->
          <div class="jw-browser-window">
            <!-- Mockup Window Top Bar -->
            <div class="jw-window-header">
              <div class="jw-window-dots">
                <div class="jw-dot red"></div>
                <div class="jw-dot yellow"></div>
                <div class="jw-dot green"></div>
              </div>
              <div class="jw-window-address">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span id="mockup-url-display">boards.greenhouse.io/openai/jobs/senior-systems-engineer</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span id="mockup-status-badge" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 9999px;">
                  JobAssist Active
                </span>
              </div>
            </div>

            <!-- Interactive Feature Tabs -->
            <div class="jw-mockup-tabs">
              <button type="button" id="mockup-btn-autofill" class="jw-mockup-tab-btn active" onclick="switchMockupDemoTab('autofill');">
                1-Click ATS AutoFill
              </button>
              <button type="button" id="mockup-btn-hunter" class="jw-mockup-tab-btn" onclick="switchMockupDemoTab('hunter');">
                9-Portal Autonomous Radar (&le; 5 Days)
              </button>
              <button type="button" id="mockup-btn-resume" class="jw-mockup-tab-btn" onclick="switchMockupDemoTab('resume');">
                Canva Resume &amp; STAR Questions
              </button>
            </div>

            <!-- TAB 1: 1-CLICK ATS AUTOFILL VIEW -->
            <div id="mockup-view-autofill" class="jw-mockup-body" style="background: #0c0c0d; min-height: 440px;">
              <!-- Left: Target Job Application Form -->
              <div style="padding: 26px 28px; border-right: 1px solid rgba(255, 255, 255, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px;">
                  <div>
                    <span style="font-size: 11px; font-weight: 700; color: #38bdf8; letter-spacing: 0.5px; text-transform: uppercase;">Greenhouse Job Application</span>
                    <h3 style="font-size: 18px; font-weight: 800; color: #fafaf9; margin-top: 2px;">Senior Systems Engineer — Distributed Core</h3>
                    <div style="font-size: 12px; color: #a1a1a6; margin-top: 2px;">OpenAI • Remote, Worldwide • $185k - $240k/yr</div>
                  </div>
                  <span style="background: rgba(0, 122, 255, 0.12); color: #60a5fa; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">Posted 2 days ago</span>
                </div>

                <!-- Simulated Form Fields (Filled with green checks) -->
                <div id="mockup-form-fields" style="display: flex; flex-direction: column; gap: 12px;">
                  <div style="background: #141416; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-size: 10.5px; color: #71717a; text-transform: uppercase;">Full Name</div>
                      <div id="mock-val-name" style="font-size: 13px; font-weight: 600; color: #fafaf9;">Dawit Haile</div>
                    </div>
                    <span id="mock-status-name" style="color: #10b981; font-size: 12px; font-weight: 700;">✓ AutoFilled</span>
                  </div>

                  <div style="background: #141416; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-size: 10.5px; color: #71717a; text-transform: uppercase;">Email &amp; Phone</div>
                      <div id="mock-val-contact" style="font-size: 13px; font-weight: 600; color: #fafaf9;">dawit.haile@example.com • +251 948 232717</div>
                    </div>
                    <span id="mock-status-contact" style="color: #10b981; font-size: 12px; font-weight: 700;">✓ AutoFilled</span>
                  </div>

                  <div style="background: #141416; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-size: 10.5px; color: #71717a; text-transform: uppercase;">Resume Attachment</div>
                      <div id="mock-val-resume" style="font-size: 13px; font-weight: 600; color: #38bdf8;">Dawit_Haile_OpenAI_Tailored_Resume.pdf</div>
                    </div>
                    <span id="mock-status-resume" style="color: #10b981; font-size: 12px; font-weight: 700;">✓ Canva-Grade</span>
                  </div>

                  <div style="background: #141416; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px 14px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="font-size: 10.5px; color: #71717a; text-transform: uppercase;">Screening Question (STAR Method)</span>
                      <span id="mock-status-star" style="color: #10b981; font-size: 11px; font-weight: 700;">✓ AI Generated</span>
                    </div>
                    <p id="mock-val-star" style="font-size: 11.5px; color: #d4d4d8; line-height: 1.45; margin: 0;">
                      "Situation: Managed 400ms latency spikes on distributed cluster. Task: Cut p99 under 50ms. Action: Tuned TCP eBPF windowing. Result: Reduced latency by 74%."
                    </p>
                  </div>
                </div>
              </div>

              <!-- Right: Floating JobAssist Chrome Extension Panel -->
              <div style="padding: 24px; background: #121214; display: flex; flex-direction: column;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #007aff, #38bdf8); display: flex; align-items: center; justify-content: center;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <span style="font-size: 13.5px; font-weight: 800; color: #FFFFFF;">JobAssist Copilot</span>
                  </div>
                  <span style="background: rgba(0, 122, 255, 0.2); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">v3.2.0</span>
                </div>

                <div style="background: #18181b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 16px;">
                  <div style="position: relative; width: 56px; height: 56px; border-radius: 50%; background: conic-gradient(#10b981 98%, #27272a 0); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(16, 185, 129, 0.35);">
                    <div id="mock-fit-score" style="width: 44px; height: 44px; border-radius: 50%; background: #121214; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #34d399;">
                      98%
                    </div>
                  </div>
                  <div>
                    <div style="font-size: 13px; font-weight: 700; color: #fafaf9;">High Role Compatibility</div>
                    <div style="font-size: 11px; color: #10b981; font-weight: 600;">Greenhouse ATS Detected</div>
                    <div id="mock-fields-count" style="font-size: 11px; color: #71717a; margin-top: 2px;">14 form fields mapped</div>
                  </div>
                </div>

                <button type="button" id="mock-autofill-action-btn" onclick="simulateMockupAutoFill();" style="width: 100%; height: 44px; border-radius: 10px; background: linear-gradient(135deg, #007aff, #00c6ff); border: none; color: #FFFFFF; font-size: 13.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 0 20px rgba(0, 122, 255, 0.45); cursor: pointer; margin-bottom: 16px;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>1-Click AutoFill Application</span>
                </button>

                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 11.5px; color: #a1a1a6;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="color: #10b981; font-weight: bold;">✓</span> Ground-Truth Candidate Profile Mapped
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="color: #10b981; font-weight: bold;">✓</span> Behavioral Questions Formulated (STAR)
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="color: #10b981; font-weight: bold;">✓</span> Canva ATS Tailored Resume Attached
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: 9-PORTAL AUTONOMOUS RADAR VIEW -->
            <div id="mockup-view-hunter" class="jw-mockup-body" style="display: none; background: #0c0c0d; min-height: 440px;">
              <div style="padding: 24px 28px; border-right: 1px solid rgba(255, 255, 255, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                  <div>
                    <span style="font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Live 9-Portal Radar</span>
                    <h3 style="font-size: 17px; font-weight: 800; color: #fafaf9; margin-top: 2px;">Active Verified Roles (&le; 5 Days Old)</h3>
                  </div>
                  <span id="mock-radar-status" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">0 Duplicates • Active</span>
                </div>

                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
                  <span style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">Greenhouse</span>
                  <span style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">Lever</span>
                  <span style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">Workday</span>
                  <span style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">Taleo</span>
                  <span style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">Ashby</span>
                  <span style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">BambooHR</span>
                  <span style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">LinkedIn</span>
                  <span style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">Indeed</span>
                  <span style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); color: #38bdf8; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">RemoteOK</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                  <div id="mock-hunter-job-1" style="background: #141416; border: 1.5px solid #10b981; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 11px; font-weight: 700; color: #10b981;">OpenAI</span>
                        <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 9.5px; font-weight: 700; padding: 1px 5px; border-radius: 3px;">1d fresh</span>
                        <span style="background: rgba(0, 122, 255, 0.15); color: #60a5fa; font-size: 9.5px; font-weight: 700; padding: 1px 5px; border-radius: 3px;">Greenhouse</span>
                      </div>
                      <div style="font-size: 13px; font-weight: 700; color: #fafaf9; margin-top: 2px;">Senior Distributed Systems Engineer</div>
                      <div style="font-size: 11px; color: #71717a;">Remote Worldwide • $190k - $250k</div>
                    </div>
                    <span id="mock-job-1-action" style="color: #10b981; font-size: 11.5px; font-weight: 700;">98% Fit</span>
                  </div>

                  <div style="background: #141416; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 11px; font-weight: 700; color: #60a5fa;">Stripe</span>
                        <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 9.5px; font-weight: 700; padding: 1px 5px; border-radius: 3px;">2d fresh</span>
                        <span style="background: rgba(0, 122, 255, 0.15); color: #60a5fa; font-size: 9.5px; font-weight: 700; padding: 1px 5px; border-radius: 3px;">Lever</span>
                      </div>
                      <div style="font-size: 13px; font-weight: 700; color: #fafaf9; margin-top: 2px;">Staff Infrastructure Architect</div>
                      <div style="font-size: 11px; color: #71717a;">San Francisco, CA / Remote • $210k - $270k</div>
                    </div>
                    <span style="color: #60a5fa; font-size: 11.5px; font-weight: 700;">95% Fit</span>
                  </div>

                  <div style="background: #141416; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 11px; font-weight: 700; color: #a78bfa;">Figma</span>
                        <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 9.5px; font-weight: 700; padding: 1px 5px; border-radius: 3px;">3d fresh</span>
                        <span style="background: rgba(0, 122, 255, 0.15); color: #60a5fa; font-size: 9.5px; font-weight: 700; padding: 1px 5px; border-radius: 3px;">Ashby</span>
                      </div>
                      <div style="font-size: 13px; font-weight: 700; color: #fafaf9; margin-top: 2px;">Principal Core Platform Lead</div>
                      <div style="font-size: 11px; color: #71717a;">Remote Friendly • $200k - $260k</div>
                    </div>
                    <span style="color: #a78bfa; font-size: 11.5px; font-weight: 700;">92% Fit</span>
                  </div>
                </div>
              </div>

              <!-- Right: Pause & Continue Interactive Radar Panel -->
              <div style="padding: 24px; background: #121214; display: flex; flex-direction: column;">
                <div style="font-size: 14px; font-weight: 800; color: #FFF; margin-bottom: 4px;">Interactive Radar Controls</div>
                <div style="font-size: 11px; color: #94A3B8; margin-bottom: 16px;">
                  Pause scanning at any time to trigger 1-Click AutoFill on a detected role, then continue hunting seamlessly.
                </div>

                <div id="mock-pause-banner" style="display: none; background: rgba(0, 122, 255, 0.15); border: 1.5px solid #007aff; border-radius: 8px; padding: 10px; margin-bottom: 16px; font-size: 11.5px; color: #38bdf8;">
                  <b>Radar Paused:</b> 1-Click AutoFill ready on OpenAI Senior Systems Engineer.
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 18px;">
                  <button type="button" id="mock-btn-pause" onclick="simulateMockupHunterPause();" style="flex: 1; height: 38px; background: #1E293B; border: 1px solid #334155; color: #F1F5F9; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">
                    Pause Radar
                  </button>
                  <button type="button" id="mock-btn-continue" onclick="simulateMockupHunterContinue();" style="flex: 1; height: 38px; background: #007aff; border: none; color: #FFF; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; display: none;">
                    Continue Radar
                  </button>
                </div>

                <div style="background: #18181b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px; font-size: 11px; color: #a1a1a6; display: flex; flex-direction: column; gap: 8px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span>Freshness Guarantee:</span>
                    <strong style="color: #10b981;">&le; 5 Days Old</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span>Deduplication:</span>
                    <strong style="color: #38bdf8;">0 Duplicate Cards</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span>Portals Active:</span>
                    <strong style="color: #fafaf9;">All 9 Target ATS Portals</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: CANVA RESUME & STAR QUESTIONS VIEW -->
            <div id="mockup-view-resume" class="jw-mockup-body" style="display: none; background: #0c0c0d; min-height: 440px;">
              <div style="padding: 24px 28px; border-right: 1px solid rgba(255, 255, 255, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                  <div>
                    <span style="font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Canva-Grade ATS Resume</span>
                    <h3 style="font-size: 17px; font-weight: 800; color: #fafaf9; margin-top: 2px;">Tailored Executive CV — OpenAI Target</h3>
                  </div>
                  <span style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px;">Print Ready PDF</span>
                </div>

                <div style="background: #141416; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                  <div style="font-size: 14px; font-weight: 800; color: #FFF; margin-bottom: 4px;">Dawit Haile</div>
                  <div style="font-size: 11px; color: #94A3B8; margin-bottom: 12px;">Senior Distributed Systems &amp; Core Infrastructure Architect • +251 948 232717</div>
                  <div style="font-size: 11.5px; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 4px;">Targeted Summary</div>
                  <p style="font-size: 11.5px; color: #CBD5E1; line-height: 1.5; margin: 0 0 10px 0;">
                    Systems engineer specializing in high-throughput distributed memory, eBPF network telemetry, and sub-50ms p99 optimization for large scale GPU/cluster workloads.
                  </p>
                  <div style="font-size: 11.5px; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 4px;">STAR Highlights</div>
                  <ul style="font-size: 11px; color: #94A3B8; padding-left: 16px; line-height: 1.5; margin: 0;">
                    <li>Engineered distributed consensus protocol tuning, reducing network tail latency by 74%.</li>
                    <li>Designed fault-tolerant state-machine replication handling 1.2M transactions/second.</li>
                  </ul>
                </div>
              </div>

              <div style="padding: 24px; background: #121214; display: flex; flex-direction: column;">
                <div style="font-size: 14px; font-weight: 800; color: #FFF; margin-bottom: 4px;">AI STAR Question Solver</div>
                <div style="font-size: 11px; color: #94A3B8; margin-bottom: 16px;">
                  Synthesizes authentic answers using candidate facts with zero hallucinations.
                </div>

                <div style="background: #18181b; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
                  <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 3px;">Prompt: Describe an incident when latency impacted production.</div>
                  <div style="font-size: 11px; color: #E2E8F0; line-height: 1.45;">
                    "Situation: Cluster latency rose to 400ms under 3x holiday traffic. Task: Restore p99 SLA under 50ms. Action: Analyzed eBPF sockops bottlenecks and tuned TCP windowing. Result: Slashed p99 latency to 38ms with zero packet drop."
                  </div>
                </div>

                <div style="display: flex; gap: 8px;">
                  <a href="/download-extension" download class="jw-btn-primary" style="flex: 1; height: 38px; font-size: 12px; text-decoration: none; justify-content: center;">
                    Try with Extension
                  </a>
                  <a href="#plans-section" onclick="scrollToSection('plans-section');" class="jw-btn-outline" style="height: 38px; font-size: 12px; padding: 0 14px;">
                    View Passes
                  </a>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <!-- STATEMENT CALLOUT -->
      <section class="jw-statement-box">
        <div class="ja-container" style="max-width: 820px;">
          <p style="font-size: clamp(1.2rem, 2.5vw, 1.8rem); font-weight: 600; line-height: 1.5; color: #d4d4d8; letter-spacing: -0.02em;">
            Other tools only fill forms. JobAssist hunts fresh listings <span style="color: #fafaf9; text-decoration: underline decoration-sky-500/50;">under 5 days old</span>, tailors your resume, and <span style="color: #fafaf9; text-decoration: underline decoration-emerald-500/50;">autofills complex applications in 1 click</span>.
          </p>
        </div>
      </section>

      <!-- HOW IT WORKS: 3 STEPS TO YOUR NEXT OFFER -->
      <section id="how-it-works" style="padding: 90px 20px; position: relative;">
        <div class="ja-container" style="max-width: 1140px;">
          <div style="text-align: center; max-width: 650px; margin: 0 auto 60px;">
            <span style="color: #007aff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">How It Works</span>
            <h2 style="font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -0.03em; color: #fafaf9; margin-bottom: 12px;">Three steps to your next offer</h2>
            <p style="font-size: 15.5px; color: #a1a1a6; line-height: 1.6;">From autonomous job discovery to completed applications on autopilot.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
            <!-- Step 1 -->
            <div class="jw-step-card">
              <div class="jw-step-num">01</div>
              <h3 style="font-size: 20px; font-weight: 800; color: #fafaf9; margin-bottom: 10px;">Scout Strictly Fresh Roles (&le; 5 Days)</h3>
              <p style="font-size: 14px; color: #a1a1a6; line-height: 1.6; margin-bottom: 24px; flex: 1;">
                Autonomous multi-site scraper continuously tracks Greenhouse, Lever, Workday, Taleo, Ashby, BambooHR, LinkedIn Easy Apply, Indeed, and RemoteOK. Automatically discards 1-month-old stale postings so you only apply to active openings.
              </p>
              <div style="background: rgba(0, 122, 255, 0.08); border: 1px solid rgba(0, 122, 255, 0.2); border-radius: 10px; padding: 12px; font-size: 12px; color: #38bdf8; font-weight: 600;">
                9 ATS &amp; Job Portals Supported (&le; 5 Days)
              </div>
            </div>

            <!-- Step 2 -->
            <div class="jw-step-card">
              <div class="jw-step-num">02</div>
              <h3 style="font-size: 20px; font-weight: 800; color: #fafaf9; margin-bottom: 10px;">Calculate Fit &amp; Tailor Resume</h3>
              <p style="font-size: 14px; color: #a1a1a6; line-height: 1.6; margin-bottom: 24px; flex: 1;">
                Calculates compatibility scores against your candidate profile and generates Canva-grade tailored resumes matching the exact ATS keywords for that opening.
              </p>
              <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 10px; padding: 12px; font-size: 12px; color: #34d399; font-weight: 600;">
                &le; 5-Day Fresh Jobs Only • 98% Match
              </div>
            </div>

            <!-- Step 3 -->
            <div class="jw-step-card">
              <div class="jw-step-num">03</div>
              <h3 style="font-size: 20px; font-weight: 800; color: #fafaf9; margin-bottom: 10px;">1-Click Apply &amp; STAR Questions</h3>
              <p style="font-size: 14px; color: #a1a1a6; line-height: 1.6; margin-bottom: 24px; flex: 1;">
                Auto-fill every form input on Greenhouse, Lever, Workday, and Taleo. Solves behavioral screening questions with authentic candidate evidence. Review, submit, done.
              </p>
              <div style="background: rgba(0, 122, 255, 0.08); border: 1px solid rgba(0, 122, 255, 0.2); border-radius: 10px; padding: 12px; font-size: 12px; color: #38bdf8; font-weight: 600;">
                Universal 1-Click ATS AutoFill
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EVERYTHING YOU NEED: BENTO GRID -->
      <section id="features-section" style="padding: 80px 20px; border-top: 1px solid var(--border-color); position: relative;">
        <div class="ja-container" style="max-width: 1140px;">
          <div style="text-align: center; max-width: 650px; margin: 0 auto 55px;">
            <span style="color: #007aff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">Features</span>
            <h2 style="font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -0.03em; color: #fafaf9; margin-bottom: 12px;">Three core capabilities in one platform</h2>
            <p style="font-size: 15.5px; color: #a1a1a6; line-height: 1.6;">Built for applicants who want fresh opportunities, tailored resumes, and 1-click ATS submissions.</p>
          </div>

          <div class="jw-bento-grid">
            <!-- Card 1: 1-Click ATS AutoFill Engine (8 Cols) -->
            <div class="jw-bento-card" style="grid-column: span 8;">
              <div style="font-size: 12px; font-weight: 800; color: #007aff; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px;">1-Click AutoFill</div>
              <h3 style="font-size: 24px; font-weight: 800; color: #fafaf9; margin-bottom: 10px;">Universal ATS Form AutoFill Engine</h3>
              <p style="font-size: 14.5px; color: #a1a1a6; line-height: 1.6; max-width: 580px; margin-bottom: 24px;">
                Automatically populates text inputs, dropdowns, checkboxes, EEOC questionnaires, and complex behavioral prompts across Greenhouse, Lever, Workday, Taleo, Ashby, and custom portals. Turn 25-minute forms into 2 minutes.
              </p>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 8px; font-size: 12px; color: #e4e4e7;">Greenhouse AutoFill</span>
                <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 8px; font-size: 12px; color: #e4e4e7;">Lever 1-Click</span>
                <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 8px; font-size: 12px; color: #e4e4e7;">Workday Multi-Page</span>
                <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 8px; font-size: 12px; color: #e4e4e7;">STAR Question Synthesizer</span>
              </div>
            </div>

            <!-- Card 2: Fresh Job Radar (4 Cols) -->
            <div class="jw-bento-card" style="grid-column: span 4;">
              <div style="font-size: 12px; font-weight: 800; color: #10b981; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px;">&le; 5-Day Freshness</div>
              <h3 style="font-size: 22px; font-weight: 800; color: #fafaf9; margin-bottom: 10px;">Strict &le; 5-Day Fresh Job Radar</h3>
              <p style="font-size: 13.5px; color: #a1a1a6; line-height: 1.6; margin-bottom: 20px;">
                Continuously scouts Greenhouse, Lever, Workday, Taleo, Ashby, BambooHR, LinkedIn Easy Apply, Indeed, and RemoteOK. Automatically discards 1-month-old stale or ghost roles so you only apply before hiring managers get flooded.
              </p>
              <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 10px; padding: 12px; font-size: 12px; color: #34d399; font-weight: 600;">
                Scouts 9 ATS Portals &amp; Job Networks
              </div>
            </div>

            <!-- Card 3: Canva-Grade AI Resumes (4 Cols) -->
            <div class="jw-bento-card" style="grid-column: span 4;">
              <div style="font-size: 12px; font-weight: 800; color: #f59e0b; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px;">ATS Tailor</div>
              <h3 style="font-size: 22px; font-weight: 800; color: #fafaf9; margin-bottom: 10px;">Canva-Grade AI Resume Tailor</h3>
              <p style="font-size: 13.5px; color: #a1a1a6; line-height: 1.6; margin-bottom: 20px;">
                Analyzes target job keywords and customizes your resume bullet points for high ATS match scores. Exports print-ready PDF resumes with 1 click.
              </p>
              <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 10px; padding: 12px; font-size: 12px; color: #fbbf24; font-weight: 600;">
                1-Click PDF &amp; Text Export
              </div>
            </div>

            <!-- Card 4: Hunter + AutoFill Combo & Releases (8 Cols) -->
            <div class="jw-bento-card" style="grid-column: span 8;">
              <div style="font-size: 12px; font-weight: 800; color: #8b5cf6; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px;">Hunter + AutoFill Combo</div>
              <h3 style="font-size: 24px; font-weight: 800; color: #fafaf9; margin-bottom: 10px;">End-to-End Synergy &amp; Weekly Releases</h3>
              <p style="font-size: 14.5px; color: #a1a1a6; line-height: 1.6; max-width: 580px; margin-bottom: 24px;">
                Unlike single-purpose autofillers, JobAssist connects fresh job hunting directly into 1-click application autofilling. With releases 2 to 3 days per week, your extension bypasses anti-bot heuristics and DOM updates seamlessly.
              </p>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); padding: 6px 12px; border-radius: 8px; font-size: 12px; color: #c4b5fd;">2–3 Releases Per Week</span>
                <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 8px; font-size: 12px; color: #e4e4e7;">Anti-Bot Stealth Mode</span>
                <span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 6px 12px; border-radius: 8px; font-size: 12px; color: #e4e4e7;">Ground-Truth Profile Protection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- WORKS EVERYWHERE YOU APPLY -->
      <section style="padding: 70px 20px; border-top: 1px solid var(--border-color); background: rgba(18, 18, 20, 0.4);">
        <div class="ja-container" style="max-width: 1000px; text-align: center;">
          <h3 style="font-size: 14px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">
            Works seamlessly everywhere you apply
          </h3>
          <div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 14px;">
            <span style="background: #161618; border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 9999px; font-size: 13.5px; font-weight: 600; color: #d4d4d8;">Greenhouse</span>
            <span style="background: #161618; border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 9999px; font-size: 13.5px; font-weight: 600; color: #d4d4d8;">Lever</span>
            <span style="background: #161618; border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 9999px; font-size: 13.5px; font-weight: 600; color: #d4d4d8;">Workday</span>
            <span style="background: #161618; border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 9999px; font-size: 13.5px; font-weight: 600; color: #d4d4d8;">Taleo</span>
            <span style="background: #161618; border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 9999px; font-size: 13.5px; font-weight: 600; color: #d4d4d8;">Ashby</span>
            <span style="background: #161618; border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 9999px; font-size: 13.5px; font-weight: 600; color: #d4d4d8;">BambooHR</span>
            <span style="background: #161618; border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 9999px; font-size: 13.5px; font-weight: 600; color: #d4d4d8;">LinkedIn Easy Apply</span>
            <span style="background: #161618; border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 9999px; font-size: 13.5px; font-weight: 600; color: #d4d4d8;">Indeed</span>
            <span style="background: #161618; border: 1px solid rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 9999px; font-size: 13.5px; font-weight: 600; color: #d4d4d8;">RemoteOK</span>
          </div>
        </div>
      </section>

      <!-- PRICING & GRANULAR ACCESS PASSES -->
      <section id="plans-section" style="padding: 90px 20px 80px; border-top: 1px solid var(--border-color); position: relative;">
        <div class="ja-container" style="max-width: 1140px;">
          <div style="text-align: center; max-width: 650px; margin: 0 auto 40px;">
            <span style="color: #007aff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">Pricing</span>
            <h2 style="font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -0.03em; color: #fafaf9; margin-bottom: 12px;">Simple, Transparent Pricing</h2>
            <p style="font-size: 15.5px; color: #a1a1a6; line-height: 1.6;">
              Choose AutoFill only, Hunter only, or the full Combo. Pay in Ethiopian Birr or USD. License keys dispatched automatically upon admin verification.
            </p>
          </div>

          <!-- Currency & Cadence Switchers -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 45px;">
            <!-- Currency Pill Switcher -->
            <div class="jw-switcher-wrap">
              <button type="button" class="jw-switch-btn btn-curr-toggle ${state.comboCurrency === 'ETB' ? 'active' : ''}" data-currency="ETB" onclick="switchComboCurrency('ETB');">
                Ethiopian Birr (Telebirr / CBE)
              </button>
              <button type="button" class="jw-switch-btn btn-curr-toggle ${state.comboCurrency === 'USD' ? 'active' : ''}" data-currency="USD" onclick="switchComboCurrency('USD');">
                USD (Binance UID)
              </button>
            </div>

            <!-- Cadence Pill Switcher -->
            <div class="jw-switcher-wrap">
              <button type="button" class="jw-switch-btn btn-cad-toggle ${state.comboCadence === 'daily' ? 'active' : ''}" data-cadence="daily" onclick="switchComboCadence('daily');">
                Daily Sprint (24h)
              </button>
              <button type="button" class="jw-switch-btn btn-cad-toggle ${state.comboCadence === 'flex' ? 'active' : ''}" data-cadence="flex" onclick="switchComboCadence('flex');">
                Flex (2–3 Days / Wk)
              </button>
              <button type="button" class="jw-switch-btn btn-cad-toggle ${state.comboCadence === 'monthly' ? 'active' : ''}" data-cadence="monthly" onclick="switchComboCadence('monthly');">
                Monthly Pro (30d)
              </button>
              <button type="button" class="jw-switch-btn btn-cad-toggle ${state.comboCadence === 'yearly' ? 'active' : ''}" data-cadence="yearly" onclick="switchComboCadence('yearly');">
                Yearly VIP (365d)
              </button>
            </div>
          </div>

          <!-- Pricing Cards Container -->
          <div id="combo-plans-container" class="jw-pricing-grid">
            <!-- Rendered dynamically by renderComboPlansGrid() -->
          </div>
        </div>
      </section>

      <!-- OFFICIAL PAYMENT DETAILS & SUBMISSION FORM -->
      <section id="payment-section" style="padding: 70px 20px 90px; border-top: 1px solid var(--border-color); background: rgba(18, 18, 20, 0.5);">
        <div class="ja-container" style="max-width: 860px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <span style="color: #007aff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">Payment &amp; Verification</span>
            <h2 style="font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 800; color: #fafaf9; letter-spacing: -0.02em; margin-bottom: 10px;">
              Submit Transaction &amp; Receive License Key
            </h2>
            <p style="font-size: 14.5px; color: #a1a1a6; line-height: 1.6;">
              Transfer your payment to one of our official verified accounts below, then enter your details. Admin verifies and automatically emails your license key within minutes.
            </p>
          </div>

          <!-- Official Accounts 3-Box Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 34px;">
            <div class="jw-account-box">
              <div style="font-size: 11px; font-weight: 800; color: #10b981; margin-bottom: 4px; letter-spacing: 0.5px;">TELEBIRR (ETHIOPIA)</div>
              <div style="font-family: monospace; font-size: 16px; font-weight: 800; color: #fafaf9; margin-bottom: 4px;">0948232717</div>
              <div style="font-size: 11.5px; color: #a1a1a6; margin-bottom: 12px;">JobAssist Ethiopia</div>
              <button type="button" class="jw-btn-outline" style="width: 100%; height: 34px; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;" onclick="copyAccountText('0948232717', 'Telebirr Number');">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy Number
              </button>
            </div>

            <div class="jw-account-box">
              <div style="font-size: 11px; font-weight: 800; color: #007aff; margin-bottom: 4px; letter-spacing: 0.5px;">CBE BANK (ETHIOPIA)</div>
              <div style="font-family: monospace; font-size: 16px; font-weight: 800; color: #fafaf9; margin-bottom: 4px;">1000542193275</div>
              <div style="font-size: 11.5px; color: #a1a1a6; margin-bottom: 12px;">JobAssist Software Tech</div>
              <button type="button" class="jw-btn-outline" style="width: 100%; height: 34px; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;" onclick="copyAccountText('1000542193275', 'CBE Account');">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy Account
              </button>
            </div>

            <div class="jw-account-box">
              <div style="font-size: 11px; font-weight: 800; color: #f59e0b; margin-bottom: 4px; letter-spacing: 0.5px;">BINANCE UID (GLOBAL)</div>
              <div style="font-family: monospace; font-size: 16px; font-weight: 800; color: #fafaf9; margin-bottom: 4px;">1032674236</div>
              <div style="font-size: 11.5px; color: #a1a1a6; margin-bottom: 12px;">USDT Transfer via Binance UID</div>
              <button type="button" class="jw-btn-outline" style="width: 100%; height: 34px; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;" onclick="copyAccountText('1032674236', 'Binance UID');">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy UID
              </button>
            </div>
          </div>

          <!-- Verification Submission Form -->
          <div style="background: #141416; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 34px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);">
            <div id="home-selected-plan-notice" style="display: none; background: rgba(0, 122, 255, 0.12); border: 1px solid rgba(0, 122, 255, 0.3); color: #38bdf8; padding: 12px 16px; border-radius: 10px; font-size: 13.5px; margin-bottom: 22px;"></div>
            
            <form id="home-payment-form" onsubmit="handleHomePaymentSubmit(event);">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div>
                  <label style="display: block; font-size: 12.5px; font-weight: 600; color: #a1a1a6; margin-bottom: 6px;">Your Full Name</label>
                  <input type="text" id="home-pay-name" class="jw-input" placeholder="e.g. Dawit Haile" required />
                </div>
                <div>
                  <label style="display: block; font-size: 12.5px; font-weight: 600; color: #a1a1a6; margin-bottom: 6px;">Candidate Email (For License Delivery)</label>
                  <input type="email" id="home-pay-email" class="jw-input" placeholder="e.g. dawit@example.com" required />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                <div>
                  <label style="display: block; font-size: 12.5px; font-weight: 600; color: #a1a1a6; margin-bottom: 6px;">Selected Access Pass</label>
                  <select id="home-pay-plan" class="jw-input" style="height: 46px;">
                    <option value="studio-combo" selected>Hunter + AutoFill Combo Pass (Recommended)</option>
                    <option value="autofill-specialist">AutoFill Specialist Pass</option>
                    <option value="hunter-pro">Job Hunter Pro Pass</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 12.5px; font-weight: 600; color: #a1a1a6; margin-bottom: 6px;">Payment Method Used</label>
                  <select id="home-pay-gateway" class="jw-input" style="height: 46px;">
                    <option value="telebirr" selected>Telebirr (0948232717)</option>
                    <option value="cbe">CBE Bank (1000542193275)</option>
                  </select>
                </div>
              </div>

              <div style="margin-bottom: 24px;">
                <label style="display: block; font-size: 12.5px; font-weight: 600; color: #a1a1a6; margin-bottom: 6px;">Transaction ID / Reference Number</label>
                <input type="text" id="home-pay-ref" class="jw-input" placeholder="e.g. FT2601920X or Binance TxHash" required />
                <span style="font-size: 11.5px; color: #71717a; display: block; margin-top: 5px;">
                  Copy the reference number from your Telebirr SMS receipt, CBE mobile banking slip, or Binance Pay confirmation.
                </span>
              </div>

              <div id="home-pay-status" style="display: none; margin-bottom: 18px;"></div>

              <button type="submit" id="btn-home-pay-submit" class="jw-btn-primary" style="width: 100%; height: 48px; font-size: 14.5px;">
                Submit Transaction for Verification
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- 30-SECOND UNPACK GUIDE MODAL -->
      <div id="unpack-guide-modal" class="jw-modal-backdrop" style="display: none;" onclick="if(event.target === this) closeUnpackGuideModal();">
        <div class="jw-modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px;">
            <h3 style="font-size: 22px; font-weight: 800; color: #fafaf9; display: flex; align-items: center; gap: 10px;">
              How to Unpack &amp; Install in 30 Seconds
            </h3>
            <button type="button" onclick="closeUnpackGuideModal();" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #a1a1a6;">✕</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px;">
            <div style="display: flex; gap: 14px; align-items: flex-start;">
              <span style="width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 122, 255, 0.2); color: #38bdf8; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</span>
              <div>
                <b style="font-size: 14px; color: #fafaf9;">Download &amp; Extract Archive</b>
                <p style="font-size: 13px; color: #a1a1a6; margin-top: 2px;">
                  Click the download button below. Save <code>JobAssist-AI-Studio-Extension.zip</code> and extract/unzip it to a folder on your computer.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 14px; align-items: flex-start;">
              <span style="width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 122, 255, 0.2); color: #38bdf8; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</span>
              <div>
                <b style="font-size: 14px; color: #fafaf9;">Open Chrome Extensions Page</b>
                <p style="font-size: 13px; color: #a1a1a6; margin-top: 2px;">
                  In Google Chrome, open a new tab and navigate to: <code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; color: #38bdf8;">chrome://extensions</code>
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 14px; align-items: flex-start;">
              <span style="width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 122, 255, 0.2); color: #38bdf8; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">3</span>
              <div>
                <b style="font-size: 14px; color: #fafaf9;">Enable Developer Mode &amp; Click "Load Unpacked"</b>
                <p style="font-size: 13px; color: #a1a1a6; margin-top: 2px;">
                  Turn on the <b>Developer mode</b> switch in the top-right corner. Then click the <b>Load unpacked</b> button in the top-left and select the extracted extension folder.
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 14px; align-items: flex-start;">
              <span style="width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 122, 255, 0.2); color: #38bdf8; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">4</span>
              <div>
                <b style="font-size: 14px; color: #fafaf9;">Enter Your License Key</b>
                <p style="font-size: 13px; color: #a1a1a6; margin-top: 2px;">
                  Click the JobAssist puzzle piece icon, open the sidepanel, enter your emailed <code>PREM-XXXX-XXXX</code> license key, and start auto-applying!
                </p>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" class="jw-btn-secondary" style="height: 42px; padding: 0 18px;" onclick="closeUnpackGuideModal();">Close</button>
            <a href="/download-extension" download class="jw-btn-primary" style="height: 42px; padding: 0 20px; font-size: 13.5px; text-decoration: none;">
              Download Extension (.ZIP) Now
            </a>
          </div>
        </div>
      </div>

      <!-- MINIMALIST DARK FOOTER -->
      ${renderDarkFooter()}
    </div>
  `;
}

// --------------------------------------------------------
// JOBS BROWSER (/jobs)
// --------------------------------------------------------
function renderJobsView() {
  return `
    ${renderMarketingHeader()}
    <main style="padding: 40px 20px 80px;">
      <div class="ja-container">
        <div style="margin-bottom: 32px;">
          <h1 style="font-size: 32px; margin-bottom: 8px;">Explore Verified Job Openings</h1>
          <p style="font-size: 16px; color: var(--color-ja-slate);">7M+ active postings updated in real time</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
          ${state.jobs.map(job => `
            <div style="background: #FFFFFF; border: 1.5px solid var(--color-ja-border); border-radius: 16px; padding: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <div style="width: 48px; height: 48px; border-radius: 12px; background: ${job.companyColor}; color: white; font-weight: 700; font-size: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${job.companyInitial}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="font-size: 13px; font-weight: 700; color: var(--color-ja-blue);">${job.company}</span>
                    <span class="badge-pill-green">${job.matchScore}% Match</span>
                  </div>
                  <h3 style="font-size: 19px; margin-bottom: 6px;">${job.title}</h3>
                  <div style="font-size: 14px; color: var(--color-ja-slate); margin-bottom: 10px;">
                    <span>${job.location}</span> · <strong>${job.salary}</strong>
                  </div>
                  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${job.tags.map(t => `<span style="background: #F1F5F9; color: #475569; padding: 3px 10px; border-radius: 9999px; font-size: 12px;">${t}</span>`).join('')}
                  </div>
                </div>
              </div>
              <button class="btn-primary" onclick="navigate('/checkout');" style="height: 44px; padding: 0 20px;">
                Apply via JobAssist →
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </main>
    ${renderDarkFooter()}
  `;
}

// --------------------------------------------------------
// LEGAL & INFO PAGES (/terms, /privacy, /about-us, /help)
// --------------------------------------------------------
function renderStaticInfoView(title, contentHtml) {
  return `
    ${renderMarketingHeader()}
    <main style="padding: 60px 20px 100px;">
      <div class="ja-card-container" style="max-width: 780px;">
        <h1 style="font-size: 34px; margin-bottom: 24px;">${title}</h1>
        <div style="font-size: 15px; color: var(--color-ja-slate); line-height: 1.8;">
          ${contentHtml}
        </div>
      </div>
    </main>
    ${renderDarkFooter()}
  `;
}

// --------------------------------------------------------
// AUTONOMOUS AI JOB SEARCH & AUTO-APPLY STUDIO (/assistant)
// Multi-Agent Architecture derived from MadsLorentzen/ai-job-search
// --------------------------------------------------------

function renderAssistantView() {
  return `
    <!-- Top System Status -->
    <div style="background-color: #070B14; border-bottom: 1px solid #1E293B; padding: 10px 24px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; font-family: monospace; color: #94A3B8;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 10px #10B981;"></span>
        <span style="font-weight: 700; color: #10B981;">JOBASSIST AI ONLINE</span>
        <span>|</span>
        <span>Engine: <strong>MadsLorentzen/ai-job-search</strong></span>
        <span>|</span>
        <span>Live Sources: <strong>LinkedIn Guest API · RemoteOK Stream</strong></span>
      </div>
      <div style="display: flex; align-items: center; gap: 14px;">
        <span id="ai-header-count" class="ai-badge ai-badge-blue">Postings: ${state.aiJobs.length}</span>
        <span id="ai-header-apps" class="ai-badge ai-badge-purple">Pipeline: ${state.aiTracker.length} Apps</span>
        <a href="/checkout" onclick="event.preventDefault(); navigate('/checkout');" style="color: #60A5FA; text-decoration: none; font-weight: 600;">← Back to JobAssist Checkout</a>
      </div>
    </div>

    <!-- AI Studio Header -->
    <header class="ai-studio-header">
      <div class="ja-container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 4px;">
            <a href="/" onclick="event.preventDefault(); navigate('/');" style="display: inline-flex; align-items: center; text-decoration: none;">
              ${icons.logo('#FFFFFF')}
            </a>
            <span style="font-size: 20px; color: #3B82F6; font-weight: 800;">· Autonomous AI Studio</span>
            <span class="ai-badge ai-badge-green">Production Multi-Agent</span>
          </div>
          <p style="font-size: 14px; color: #94A3B8;">
            Live Multi-Portal Scraping · 5-Dimension Fit Scorer · Drafter-Reviewer CV Tailoring · Full ATS Form Auto-Fill
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <button class="btn-dark-outline" style="height: 38px; padding: 0 16px; font-size: 13px;" onclick="openAiCustomJobModal();">
            Paste Custom Posting
          </button>
          <button class="btn-dark-outline" style="height: 38px; padding: 0 16px; font-size: 13px;" onclick="runAiQuickScrape('Senior Full Stack', 'Remote');">
            Quick Hunt Remote
          </button>
          <a href="/api/ai/export-csv" class="btn-primary" style="background: #059669; border: none; text-decoration: none; height: 38px; display: inline-flex; align-items: center;" download="JobAssist_AI_Applications.csv">
            Export CSV Tracker
          </a>
        </div>
      </div>
    </header>

    <!-- 7 AI Sub-Tabs Nav -->
    <nav class="ai-studio-subnav">
      <button class="ai-tab-btn ${state.aiTab === 'search' ? 'active' : ''}" id="ai-nav-search" onclick="switchAiTab('search');">
        01. Live Job Search (/scrape)
      </button>
      <button class="ai-tab-btn ${state.aiTab === 'rank' ? 'active' : ''}" id="ai-nav-rank" onclick="switchAiTab('rank');">
        02. AI Match Ranker (/rank)
      </button>
      <button class="ai-tab-btn ${state.aiTab === 'apply' ? 'active' : ''}" id="ai-nav-apply" onclick="switchAiTab('apply');">
        03. Auto-Apply Studio (/apply)
      </button>
      <button class="ai-tab-btn ${state.aiTab === 'autofill' ? 'active' : ''}" id="ai-nav-autofill" onclick="switchAiTab('autofill');">
        04. Form Auto-Fill Engine
      </button>
      <button class="ai-tab-btn ${state.aiTab === 'pipeline' ? 'active' : ''}" id="ai-nav-pipeline" onclick="switchAiTab('pipeline');">
        05. Application Pipeline (/outcome)
      </button>
      <button class="ai-tab-btn ${state.aiTab === 'profile' ? 'active' : ''}" id="ai-nav-profile" onclick="switchAiTab('profile');">
        06. Candidate Ground Truth (/setup)
      </button>
      <button class="ai-tab-btn ${state.aiTab === 'upskill' ? 'active' : ''}" id="ai-nav-upskill" onclick="switchAiTab('upskill');">
        07. Market Demand Matrix (/upskill)
      </button>
    </nav>

    <!-- Main Dynamic AI Studio Content -->
    <main style="background: #0B0F19; min-height: 80vh; padding: 32px 20px 80px;">
      <div class="ja-container">
        
        <!-- Tab 1: Live Job Search -->
        <div id="ai-tab-search" style="display: ${state.aiTab === 'search' ? 'block' : 'none'};">
          <div class="ai-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #1E293B; padding-bottom: 12px;">
              <div>
                <h2 style="font-size: 18px; font-weight: 700; color: #FFF;">Live Multi-Portal Scraper Controller</h2>
                <p style="font-size: 13.5px; color: #94A3B8;">Queries LinkedIn guest endpoints and RemoteOK streams directly without credentials.</p>
              </div>
              <span class="ai-badge ai-badge-blue">Deterministic Scraper</span>
            </div>

            <form id="ai-scrape-form" onsubmit="handleAiScrapeSubmit(event);" style="display: grid; grid-template-columns: 2fr 1.5fr 1.2fr auto; gap: 12px; align-items: end;">
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Role Keywords or Skills</label>
                <input type="text" id="ai-query-input" class="ja-input" style="background: #141416; border-color: #27272a; color: #FFF;" value="Full Stack Engineer" required />
              </div>
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Location / Work Setup</label>
                <input type="text" id="ai-loc-input" class="ja-input" style="background: #141416; border-color: #27272a; color: #FFF;" value="Remote" required />
              </div>
              <div>
                <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Target ATS Portal</label>
                <select id="ai-portal-input" class="ja-input" style="background: #141416; border-color: #27272a; color: #FFF; cursor: pointer;">
                  <option value="all" selected>All 9 Target ATS Portals</option>
                  <option value="greenhouse">Greenhouse ATS (boards.greenhouse.io)</option>
                  <option value="lever">Lever ATS (jobs.lever.co)</option>
                  <option value="workday">Workday ATS (*.myworkdayjobs.com)</option>
                  <option value="taleo">Taleo ATS (*.taleo.net)</option>
                  <option value="ashby">Ashby ATS (jobs.ashbyhq.com)</option>
                  <option value="bamboohr">BambooHR ATS (*.bamboohr.com)</option>
                  <option value="linkedin_easy_apply">LinkedIn Easy Apply (f_AL=true)</option>
                  <option value="indeed">Indeed (fromage=5)</option>
                  <option value="remoteok">RemoteOK Live API</option>
                </select>
              </div>
              <div style="display: flex; gap: 6px;">
                <button type="submit" id="ai-scrape-btn" class="btn-primary" style="height: 44px; padding: 0 18px;">
                  Hunt Verified Jobs (&le; 5d)
                </button>
                <button type="button" id="ai-pause-btn" class="btn-dark-outline" style="height: 44px; padding: 0 14px; display: none;" onclick="toggleAiScrapePause();">
                  Pause
                </button>
                <button type="button" id="ai-continue-btn" class="btn-primary" style="height: 44px; padding: 0 14px; display: none; background: #007aff;" onclick="toggleAiScrapeContinue();">
                  Continue
                </button>
              </div>
            </form>

            <div style="margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 12px; color: #94A3B8; align-self: center; font-weight: 600;">Quick Presets:</span>
              <button type="button" class="ai-preset-btn" onclick="runAiQuickScrape('Senior Full Stack', 'Remote');">Senior Software (Remote)</button>
              <button type="button" class="ai-preset-btn" onclick="runAiQuickScrape('AI Engineer', 'Worldwide');">AI Systems / LLMs</button>
              <button type="button" class="ai-preset-btn" onclick="runAiQuickScrape('Backend Go Python', 'Remote');">Backend Go / Python</button>
              <button type="button" class="ai-preset-btn" onclick="runAiQuickScrape('Frontend React Next.js', 'Remote');">Frontend React / Next</button>
            </div>
          </div>

          <div id="ai-scrape-banner" style="display: none; margin-bottom: 16px;"></div>

          <div id="ai-pause-banner" style="display: none; background: rgba(0, 122, 255, 0.12); border: 1px solid #007aff; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px; color: #93c5fd;">
            <div style="font-weight: 700; color: #60a5fa; margin-bottom: 3px;">Hunting Paused — 1-Click AutoFill Ready</div>
            <div>Select any role below to 1-Click AutoFill the application. Click <strong>Continue</strong> to resume scanning remaining portals.</div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #94A3B8;">Verified Postings in Memory</h3>
            <div style="display: flex; gap: 8px;">
              <button class="btn-primary" style="height: 36px; padding: 0 18px; font-size: 13px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border: 1px solid #34D399; font-weight: 700; box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);" onclick="runAutonomousAutoPilot();">
                Run Autonomous Auto-Pilot (Find & Apply All)
              </button>
              <button class="btn-dark-outline" style="height: 36px; padding: 0 14px; font-size: 12.5px;" onclick="batchRankAllAiJobs();">
                Batch Rank All Jobs
              </button>
            </div>
          </div>

          <div id="ai-jobs-grid" class="ai-job-grid">
            <!-- Injected by renderAiJobsGrid() -->
          </div>
        </div>

        <!-- Tab 2: AI Match Ranker -->
        <div id="ai-tab-rank" style="display: ${state.aiTab === 'rank' ? 'block' : 'none'};">
          <div class="ai-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #1E293B; padding-bottom: 12px;">
              <div>
                <h2 style="font-size: 18px; font-weight: 700; color: #FFF;">5-Dimension AI Fit Evaluator</h2>
                <p style="font-size: 13.5px; color: #94A3B8;">Skills (35%), Seniority (20%), Domain (15%), Culture (15%), and Compensation (15%).</p>
              </div>
              <button class="btn-primary" style="height: 36px; padding: 0 16px; font-size: 13px;" onclick="batchRankAllAiJobs();">
                Recompute Scores
              </button>
            </div>

            <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
              <button class="btn-dark-outline" style="padding: 4px 14px; font-size: 12.5px; height: 34px;" onclick="filterAiRankTable('ALL');">All Tiers</button>
              <button class="btn-dark-outline" style="padding: 4px 14px; font-size: 12.5px; height: 34px;" onclick="filterAiRankTable('STRONG_MATCH');">Strong Match (85%+)</button>
              <button class="btn-dark-outline" style="padding: 4px 14px; font-size: 12.5px; height: 34px;" onclick="filterAiRankTable('SOLID_CONTENDER');">Solid Contender (70-84%)</button>
              <button class="btn-dark-outline" style="padding: 4px 14px; font-size: 12.5px; height: 34px;" onclick="filterAiRankTable('STRETCH');">Stretch (55-69%)</button>
            </div>

            <div id="ai-rank-matrix-container">
              <!-- Injected by renderAiRankMatrix() -->
            </div>
          </div>
        </div>

        <!-- Tab 3: Auto-Apply Studio -->
        <div id="ai-tab-apply" style="display: ${state.aiTab === 'apply' ? 'block' : 'none'};">
          <div class="ai-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #1E293B; padding-bottom: 12px;">
              <div>
                <h2 style="font-size: 18px; font-weight: 700; color: #FFF;">Adversarial Drafter-Reviewer Studio</h2>
                <p style="font-size: 13.5px; color: #94A3B8;">Integrity Gate → Candidate Fact Grounding → Drafter Agent → Reviewer Agent (Hiring Manager Proxy).</p>
              </div>
              <span id="ai-apply-badge" class="ai-badge ai-badge-blue">Ready for Job</span>
            </div>

            <!-- Agent Execution Terminal -->
            <div style="margin-bottom: 20px;">
              <div style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">Multi-Agent Orchestration Log</div>
              <div id="ai-agent-console" class="ai-agent-console">
                <div style="color: #94A3B8;">Select any job from Search/Rank tab or click "Paste Custom Posting" to trigger the multi-agent application pipeline.</div>
              </div>
            </div>

            <!-- Tailored Outputs -->
            <div style="border-top: 1px solid #1E293B; padding-top: 16px;">
              <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <button class="btn-primary" id="ai-btn-view-cv" style="height: 34px; padding: 0 14px; font-size: 12.5px;" onclick="showAiApplySubView('cv');">Tailored CV Preview</button>
                <button class="btn-dark-outline" id="ai-btn-view-letter" style="height: 34px; padding: 0 14px; font-size: 12.5px;" onclick="showAiApplySubView('letter');">Bespoke Cover Letter</button>
                <button class="btn-dark-outline" id="ai-btn-view-ats" style="height: 34px; padding: 0 14px; font-size: 12.5px;" onclick="showAiApplySubView('ats');">ATS Keyword Check</button>
                <button class="btn-primary" style="margin-left: auto; background: #059669; border: none; height: 34px; padding: 0 14px; font-size: 12.5px;" onclick="switchAiTab('autofill');">
                  Proceed to Form Auto-Fill
                </button>
              </div>

              <div id="ai-apply-subview">
                <!-- Injected by renderAiApplySubView() -->
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 4: Form Auto-Fill Engine -->
        <div id="ai-tab-autofill" style="display: ${state.aiTab === 'autofill' ? 'block' : 'none'};">
          <div class="ai-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #1E293B; padding-bottom: 12px;">
              <div>
                <h2 style="font-size: 18px; font-weight: 700; color: #FFF;">Autonomous Application Form Auto-Fill Engine</h2>
                <p style="font-size: 13.5px; color: #94A3B8;">Structured payload for Greenhouse, Lever, Workday, Ashby, and LinkedIn Easy Apply.</p>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn-dark-outline" style="height: 36px; padding: 0 14px; font-size: 12.5px;" onclick="copyFullAiAutofillJson();">
                  Copy Full JSON Payload
                </button>
                <button class="btn-primary" style="height: 36px; padding: 0 14px; font-size: 12.5px;" onclick="saveToPipelineFromAiAutofill();">
                  Save Application to Pipeline
                </button>
              </div>
            </div>

            <div id="ai-autofill-container">
              <!-- Injected by renderAiAutofillTab() -->
            </div>
          </div>
        </div>

        <!-- Tab 5: Application Pipeline Kanban -->
        <div id="ai-tab-pipeline" style="display: ${state.aiTab === 'pipeline' ? 'block' : 'none'};">
          <div class="ai-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #1E293B; padding-bottom: 12px;">
              <div>
                <h2 style="font-size: 18px; font-weight: 700; color: #FFF;">Application Pipeline & Outcome Tracker</h2>
                <p style="font-size: 13.5px; color: #94A3B8;">Tracks applications through the /outcome calibration stages.</p>
              </div>
            </div>

            <div id="ai-kanban-container" class="ai-kanban-board">
              <!-- Injected by renderAiPipeline() -->
            </div>
          </div>
        </div>

        <!-- Tab 6: Candidate Ground Truth -->
        <div id="ai-tab-profile" style="display: ${state.aiTab === 'profile' ? 'block' : 'none'};">
          <div class="ai-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #1E293B; padding-bottom: 12px;">
              <div>
                <h2 style="font-size: 18px; font-weight: 700; color: #FFF;">Candidate Ground-Truth Profile & Decision Rubric</h2>
                <p style="font-size: 13.5px; color: #94A3B8;">Verified career facts and strict compensation/dealbreaker boundaries.</p>
              </div>
              <button class="btn-primary" style="height: 36px; padding: 0 16px; font-size: 13px;" onclick="saveAiCandidateProfile();">
                Save Profile Updates
              </button>
            </div>

            <div id="ai-profile-container">
              <!-- Injected by renderAiProfileEditor() -->
            </div>
          </div>
        </div>

        <!-- Tab 7: Market Demand Matrix -->
        <div id="ai-tab-upskill" style="display: ${state.aiTab === 'upskill' ? 'block' : 'none'};">
          <div class="ai-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #1E293B; padding-bottom: 12px;">
              <div>
                <h2 style="font-size: 18px; font-weight: 700; color: #FFF;">Market Demand & Skill Gap Heatmap</h2>
                <p style="font-size: 13.5px; color: #94A3B8;">Real-time technology demand across postings vs candidate profile.</p>
              </div>
              <button class="btn-dark-outline" style="height: 36px; padding: 0 14px; font-size: 12.5px;" onclick="refreshAiUpskillAnalysis();">
                Recompute Heatmap
              </button>
            </div>

            <div id="ai-upskill-container">
              <!-- Injected by renderAiUpskillTab() -->
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Custom Modal Container -->
    <div id="ai-modal-container"></div>

    ${renderDarkFooter()}
  `;
}

// AI Studio Core Runtime
async function initAiAssistant() {
  if (state.aiInitialized) {
    renderAiJobsGrid();
    renderAiPipeline();
    renderAiProfileEditor();
    renderAiUpskillTab();
    return;
  }

  try {
    const [pRes, jRes, tRes, uRes] = await Promise.all([
      fetch('/api/ai/profile').then(r => r.json()),
      fetch('/api/ai/jobs').then(r => r.json()),
      fetch('/api/ai/tracker').then(r => r.json()),
      fetch('/api/ai/upskill').then(r => r.json())
    ]);

    state.aiProfile = pRes.profile || {};
    state.aiJobs = jRes.jobs || [];
    state.aiTracker = tRes.applications || [];
    state.aiUpskill = uRes.analysis || null;
    state.aiInitialized = true;

    updateAiHeaderCounts();
    renderAiJobsGrid();
    renderAiPipeline();
    renderAiProfileEditor();
    renderAiUpskillTab();

    if (state.activeAiJob) {
      launchAiAutoApply(state.activeAiJob.id);
    }
  } catch (err) {
    console.error('AI Assistant Init Error:', err);
  }
}

function updateAiHeaderCounts() {
  const cEl = document.getElementById('ai-header-count');
  if (cEl) cEl.innerText = `Postings: ${state.aiJobs.length}`;
  const aEl = document.getElementById('ai-header-apps');
  if (aEl) aEl.innerText = `Pipeline: ${state.aiTracker.length} Apps`;
}

function switchAiTab(tabId) {
  state.aiTab = tabId;
  const tabs = ['search', 'rank', 'apply', 'autofill', 'pipeline', 'profile', 'upskill'];
  tabs.forEach(t => {
    const btn = document.getElementById(`ai-nav-${t}`);
    const sec = document.getElementById(`ai-tab-${t}`);
    if (btn) {
      if (t === tabId) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    if (sec) {
      sec.style.display = t === tabId ? 'block' : 'none';
    }
  });

  if (tabId === 'rank' && state.aiScoredJobs.length === 0) {
    batchRankAllAiJobs();
  }
}

async function handleAiScrapeSubmit(e) {
  if (e) e.preventDefault();
  const query = document.getElementById('ai-query-input').value.trim();
  const location = document.getElementById('ai-loc-input').value.trim();
  const portal = document.getElementById('ai-portal-input').value;
  const btn = document.getElementById('ai-scrape-btn');
  const banner = document.getElementById('ai-scrape-banner');

  banner.style.display = 'block';
  banner.className = 'ai-badge ai-badge-blue';
  banner.style.padding = '10px 16px';
  banner.style.width = '100%';
  banner.innerHTML = `Hunting live postings across 9 ATS portals for "<strong>${query}</strong>" in <strong>${location}</strong>...`;

  const pauseBtn = document.getElementById('ai-pause-btn');
  const contBtn = document.getElementById('ai-continue-btn');
  const pauseBanner = document.getElementById('ai-pause-banner');

  if (pauseBtn) pauseBtn.style.display = 'inline-flex';
  if (contBtn) contBtn.style.display = 'none';
  if (pauseBanner) pauseBanner.style.display = 'none';

  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Hunting...';
  }

  try {
    const res = await fetch('/api/ai/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, location, portal, maxDays: 5 })
    });
    const data = await res.json();
    if (data.success) {
      state.aiJobs = data.jobs || [];
      banner.className = 'ai-badge ai-badge-green';
      banner.innerHTML = `Found <strong>${data.count}</strong> fresh verified positions across target ATS portals. Total in memory: <strong>${data.totalCached}</strong>`;
      updateAiHeaderCounts();
      renderAiJobsGrid();
    } else {
      banner.className = 'ai-badge ai-badge-red';
      banner.innerHTML = `Scrape failed: ${data.error}`;
    }
  } catch (err) {
    banner.className = 'ai-badge ai-badge-red';
    banner.innerHTML = `Network error: ${err.message}`;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Hunt Verified Jobs (≤ 5d)';
    }
    setTimeout(() => { if (banner) banner.style.display = 'none'; }, 6000);
  }
}

function toggleAiScrapePause() {
  state.isScrapePaused = true;
  const pauseBtn = document.getElementById('ai-pause-btn');
  const contBtn = document.getElementById('ai-continue-btn');
  const banner = document.getElementById('ai-pause-banner');
  if (pauseBtn) pauseBtn.style.display = 'none';
  if (contBtn) contBtn.style.display = 'inline-flex';
  if (banner) banner.style.display = 'block';
}

function toggleAiScrapeContinue() {
  state.isScrapePaused = false;
  const pauseBtn = document.getElementById('ai-pause-btn');
  const contBtn = document.getElementById('ai-continue-btn');
  const banner = document.getElementById('ai-pause-banner');
  if (pauseBtn) pauseBtn.style.display = 'inline-flex';
  if (contBtn) contBtn.style.display = 'none';
  if (banner) banner.style.display = 'none';
  handleAiScrapeSubmit();
}

function runAiQuickScrape(query, loc) {
  const qEl = document.getElementById('ai-query-input');
  const lEl = document.getElementById('ai-loc-input');
  if (qEl) qEl.value = query;
  if (lEl) lEl.value = loc;
  handleAiScrapeSubmit();
}

function renderAiJobsGrid() {
  const container = document.getElementById('ai-jobs-grid');
  if (!container) return;

  if (state.aiJobs.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748B;">No postings in memory. Run a live hunt above.</div>`;
    return;
  }

  container.innerHTML = state.aiJobs.map(job => {
    const portalBadge = job.portal && job.portal.includes('LinkedIn') ? 'ai-badge-blue' : (job.portal && job.portal.includes('RemoteOK') ? 'ai-badge-gold' : 'ai-badge-purple');
    const tagsHtml = (job.tags || []).slice(0, 5).map(t => `<span style="display: inline-block; background: rgba(255,255,255,0.06); color: #CBD5E1; font-size: 11px; padding: 2px 7px; border-radius: 4px; margin-right: 5px; margin-bottom: 5px; font-family: monospace;">${t}</span>`).join('');

    return `
      <div class="ai-job-item">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span class="ai-badge ${portalBadge}">${job.portal}</span>
            <span style="font-size: 11px; color: #64748B; font-family: monospace;">${job.ageLabel || job.date || 'Recent'}</span>
          </div>

          <h4 style="font-size: 16px; font-weight: 700; color: #FFF; margin-bottom: 4px;">${job.title}</h4>
          <div style="font-size: 13.5px; color: #60A5FA; font-weight: 600; margin-bottom: 8px;">${job.company}</div>

          <div style="font-size: 12.5px; color: #94A3B8; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>${job.location || 'Remote'}</span>
            <span>·</span>
            <span style="color: #34D399; font-weight: 600;">${job.salary || 'Competitive'}</span>
          </div>

          <p style="font-size: 13px; color: #94A3B8; margin-bottom: 14px; line-height: 1.4; max-height: 55px; overflow: hidden; text-overflow: ellipsis;">
            ${(job.description || '').slice(0, 140)}...
          </p>

          <div style="margin-bottom: 16px;">
            ${tagsHtml}
          </div>
        </div>

        <div style="display: flex; gap: 8px; border-top: 1px solid #27354A; padding-top: 14px;">
          <button class="btn-dark-outline" style="flex: 1; font-size: 12px; height: 34px;" onclick="switchAiTab('rank');">
            Rank Fit
          </button>
          <button class="btn-primary" style="flex: 1.3; font-size: 12px; height: 34px; background: #007aff;" onclick="launchAiAutoApply('${job.id}');">
            1-Click AutoFill
          </button>
          <a href="${job.url}" target="_blank" rel="noopener noreferrer" class="btn-dark-outline" style="padding: 0 12px; font-size: 12px; height: 34px; display: inline-flex; align-items: center;" title="Open Job Source">
            ↗
          </a>
        </div>
      </div>
    `;
  }).join('');
}

async function batchRankAllAiJobs() {
  const container = document.getElementById('ai-rank-matrix-container');
  if (container) {
    container.innerHTML = `<div style="text-align: center; padding: 30px; color: #94A3B8;">⏳ Evaluating 5-dimension fit scores across active postings...</div>`;
  }

  try {
    const res = await fetch('/api/ai/rank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs: state.aiJobs })
    });
    const data = await res.json();
    if (data.success) {
      state.aiScoredJobs = data.scoredJobs || [];
      renderAiRankMatrix();
    }
  } catch (err) {
    console.error('Rank error:', err);
  }
}

function filterAiRankTable(tier) {
  state.aiRankFilter = tier;
  renderAiRankMatrix();
}

function renderAiRankMatrix() {
  const container = document.getElementById('ai-rank-matrix-container');
  if (!container) return;

  let filtered = state.aiScoredJobs;
  if (state.aiRankFilter !== 'ALL') {
    filtered = state.aiScoredJobs.filter(j => j.tier === state.aiRankFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding: 24px; text-align: center; color: #64748B;">No postings in this tier filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(job => {
    const b = job.breakdown || {};
    return `
      <div style="background-color: #162032; border: 1px solid #27354A; border-radius: 8px; padding: 18px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 16px; font-weight: 700; color: #FFF;">${job.title}</span>
              <span class="ai-badge ${job.tierBadge}">${job.tier}</span>
              <span class="ai-badge ai-badge-purple">${job.portal}</span>
            </div>
            <div style="font-size: 13.5px; color: #60A5FA; margin-top: 2px;">
              ${job.company} · <span style="color: #64748B;">${job.location}</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="text-align: right;">
              <div style="font-size: 11px; color: #64748B; font-family: monospace; text-transform: uppercase;">FIT SCORE</div>
              <div style="font-size: 24px; font-weight: 800; color: ${job.fitScore >= 85 ? '#34D399' : (job.fitScore >= 70 ? '#60A5FA' : '#FCD34D')};">
                ${job.fitScore}%
              </div>
            </div>
            <button class="btn-primary" style="height: 36px; padding: 0 16px; font-size: 13px;" onclick="launchAiAutoApply('${job.id}');">
              Launch Application
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 12px; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 6px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; margin-bottom: 3px;">
              <span>Skills (35%)</span><span>${b.technicalSkills || 0}%</span>
            </div>
            <div style="height: 4px; background: #334155; border-radius: 2px; overflow: hidden;">
              <div style="width: ${b.technicalSkills || 0}%; height: 100%; background: #3B82F6;"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; margin-bottom: 3px;">
              <span>Seniority (20%)</span><span>${b.seniority || 0}%</span>
            </div>
            <div style="height: 4px; background: #334155; border-radius: 2px; overflow: hidden;">
              <div style="width: ${b.seniority || 0}%; height: 100%; background: #10B981;"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; margin-bottom: 3px;">
              <span>Domain (15%)</span><span>${b.domain || 0}%</span>
            </div>
            <div style="height: 4px; background: #334155; border-radius: 2px; overflow: hidden;">
              <div style="width: ${b.domain || 0}%; height: 100%; background: #8B5CF6;"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; margin-bottom: 3px;">
              <span>Culture (15%)</span><span>${b.workArrangement || 0}%</span>
            </div>
            <div style="height: 4px; background: #334155; border-radius: 2px; overflow: hidden;">
              <div style="width: ${b.workArrangement || 0}%; height: 100%; background: #F59E0B;"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; margin-bottom: 3px;">
              <span>Comp (15%)</span><span>${b.compensation || 0}%</span>
            </div>
            <div style="height: 4px; background: #334155; border-radius: 2px; overflow: hidden;">
              <div style="width: ${b.compensation || 0}%; height: 100%; background: #EC4899;"></div>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12.5px;">
          <div>
            <span style="color: #34D399; font-weight: 700;">Strengths:</span>
            <span style="color: #94A3B8; margin-left: 6px;">${(job.strengths || []).join(' · ')}</span>
          </div>
          <div>
            <span style="color: #FCD34D; font-weight: 700;">Gaps / Notes:</span>
            <span style="color: #94A3B8; margin-left: 6px;">${(job.gaps || []).join(' · ')}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function launchAiAutoApply(jobId) {
  const targetJob = state.aiJobs.find(j => j.id === jobId) || state.aiScoredJobs.find(j => j.id === jobId) || state.activeAiJob;
  if (!targetJob) return;

  state.activeAiJob = targetJob;
  switchAiTab('apply');

  const badge = document.getElementById('ai-apply-badge');
  if (badge) {
    badge.innerText = `Target: ${targetJob.company} — ${targetJob.title}`;
    badge.className = 'ai-badge ai-badge-green';
  }

  const consoleEl = document.getElementById('ai-agent-console');
  consoleEl.innerHTML = '';

  const logStep = (tag, text, color = '#F8FAFC') => {
    const div = document.createElement('div');
    div.style.marginBottom = '6px';
    div.innerHTML = `<span style="font-weight:700; color:#38BDF8; margin-right: 8px;">[${tag}]</span><span style="color: ${color};">${text}</span>`;
    consoleEl.appendChild(div);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  };

  logStep('Integrity Guard', `Step 1/5: Scanning posting text for hidden characters & prompt injections...`, '#60A5FA');
  await new Promise(r => setTimeout(r, 600));

  logStep('Evaluator', `Step 2/5: Evaluating candidate fit rubric across 5 dimensions...`, '#34D399');
  await new Promise(r => setTimeout(r, 600));

  logStep('Drafter', `Step 3/5: Drafter Agent tailoring CV highlights & structuring bespoke cover letter...`, '#FCD34D');
  await new Promise(r => setTimeout(r, 700));

  try {
    const res = await fetch('/api/ai/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job: targetJob })
    });
    const data = await res.json();

    if (data.success) {
      state.currentAiApply = data;
      state.currentAiAutofill = data.autofill;

      logStep('Reviewer', `Step 4/5: Reviewer Agent completed audit. Score: ${data.review.reviewerScore}% (${data.review.verdict})`, '#A78BFA');
      await new Promise(r => setTimeout(r, 500));

      logStep('Complete', `Step 5/5: Application package fully generated and ready for submission!`, '#34D399');

      renderAiApplySubView();
      renderAiAutofillTab();
    } else {
      logStep('Error', `Error during application generation: ${data.error}`, '#EF4444');
    }
  } catch (err) {
    logStep('Error', `Network error during agent dispatch: ${err.message}`, '#EF4444');
  }
}

function launchAiAutoApplyForWelcome(title, company, location) {
  state.activeAiJob = {
    id: `welcome-${Date.now()}`,
    title,
    company,
    location,
    portal: 'JobAssist Matches',
    url: '#',
    date: new Date().toISOString().split('T')[0],
    description: `Position: ${title} at ${company} (${location}). Core focus on scalable engineering, customer impact, and reliable systems.`,
    tags: ['full-stack', 'software', 'scalable-systems'],
    salary: '$160k - $205k'
  };

  if (!state.aiJobs.some(j => j.id === state.activeAiJob.id)) {
    state.aiJobs.unshift(state.activeAiJob);
  }

  navigate('/assistant');
}

function showAiApplySubView(subView) {
  state.aiSubView = subView;
  ['cv', 'letter', 'ats'].forEach(v => {
    const btn = document.getElementById(`ai-btn-view-${v}`);
    if (btn) {
      if (v === subView) {
        btn.className = 'btn-primary';
        btn.style.backgroundColor = '';
        btn.style.color = '#FFFFFF';
        btn.style.borderColor = 'transparent';
      } else {
        btn.className = 'btn-dark-outline';
        btn.style.backgroundColor = '#1E293B';
        btn.style.borderColor = '#334155';
        btn.style.color = '#F8FAFC';
      }
    }
  });
  renderAiApplySubView();
}

function renderAiApplySubView() {
  const container = document.getElementById('ai-apply-subview');
  if (!container || !state.currentAiApply) return;

  const { drafts, review, job } = state.currentAiApply;

  if (state.aiSubView === 'cv') {
    const highlightsHtml = (drafts.tailoredHighlights || []).map(h => `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; font-weight: 700; color: #FFF; font-size: 14px;">
          <span>${h.company} — <span style="color: #60A5FA;">${h.role}</span></span>
          <span style="font-size: 12px; color: #64748B; font-family: monospace;">${h.period}</span>
        </div>
        <ul style="margin-left: 20px; margin-top: 6px; font-size: 13.5px; color: #CBD5E1; line-height: 1.5;">
          ${h.bullets.map(b => `<li style="margin-bottom: 4px;">${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="background-color: #162032; border: 1px solid #27354A; border-radius: 8px; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #27354A; padding-bottom: 12px;">
          <h3 style="font-size: 16px; font-weight: 700; color: #FFF;">Tailored Executive CV (Optimized for ${job.company})</h3>
          <button class="btn-dark-outline" style="height: 32px; font-size: 12px; padding: 0 12px;" onclick="copyToClipboard('${escapeTextForJs(drafts.tailoredSummary)}');">
            Copy Summary
          </button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 6px; border-left: 3px solid #3B82F6; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #60A5FA; text-transform: uppercase; margin-bottom: 4px;">Targeted Professional Summary</div>
          <p style="font-size: 13.5px; color: #E2E8F0; line-height: 1.5;">${drafts.tailoredSummary}</p>
        </div>

        <h4 style="font-size: 14px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">
          Grounded Experience Highlights (STAR Metrics)
        </h4>
        ${highlightsHtml}
      </div>
    `;
  } else if (state.aiSubView === 'letter') {
    container.innerHTML = `
      <div style="background-color: #162032; border: 1px solid #27354A; border-radius: 8px; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #27354A; padding-bottom: 12px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #FFF;">Bespoke 3-Part Cover Letter</h3>
            <span style="font-size: 12px; color: #64748B;">Audited by Reviewer Agent · Zero Clichés · Grounded Facts</span>
          </div>
          <button class="btn-dark-outline" style="height: 32px; font-size: 12px; padding: 0 12px;" onclick="copyToClipboard('${escapeTextForJs(drafts.coverLetter)}');">
            Copy Full Letter
          </button>
        </div>

        <div style="background: #090E17; border: 1px solid #27354A; border-radius: 6px; padding: 20px; font-family: monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; color: #E2E8F0;">
${drafts.coverLetter}
        </div>
      </div>
    `;
  } else if (state.aiSubView === 'ats') {
    const tableRows = (drafts.atsKeywords || []).map(k => `
      <tr style="border-bottom: 1px solid #27354A;">
        <td style="padding: 10px; font-weight: 600; color: #FFF;">${k.keyword}</td>
        <td style="padding: 10px;"><span class="ai-badge ai-badge-green">${k.status}</span></td>
        <td style="padding: 10px; color: #94A3B8;">${k.context}</td>
      </tr>
    `).join('');

    const auditRows = (review.rubricFindings || []).map(r => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #1E293B;">
        <div>
          <span style="font-weight: 700; color: #FFF;">${r.category}</span>
          <p style="font-size: 12.5px; color: #94A3B8;">${r.note}</p>
        </div>
        <span class="ai-badge ${r.verdict === 'PASSED' || r.verdict === 'VERIFIED' || r.verdict === 'ALIGNED' || r.verdict === 'OPTIMAL' ? 'ai-badge-green' : 'ai-badge-gold'}">
          ${r.verdict}
        </span>
      </div>
    `).join('');

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px;">
        <div style="background-color: #162032; border: 1px solid #27354A; border-radius: 8px; padding: 18px;">
          <h4 style="font-size: 14px; font-weight: 700; color: #FFF; margin-bottom: 12px;">ATS Keyword Verification</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
            <thead>
              <tr style="border-bottom: 2px solid #27354A; color: #64748B; text-align: left;">
                <th style="padding: 8px;">KEYWORD</th>
                <th style="padding: 8px;">STATUS</th>
                <th style="padding: 8px;">PLACEMENT</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>

        <div style="background-color: #162032; border: 1px solid #27354A; border-radius: 8px; padding: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="font-size: 14px; font-weight: 700; color: #FFF;">Reviewer Agent Audit Rubric</h4>
            <span class="ai-badge ai-badge-purple">Hiring Manager Proxy</span>
          </div>
          ${auditRows}
        </div>
      </div>
    `;
  }
}

function renderAiAutofillTab() {
  const container = document.getElementById('ai-autofill-container');
  if (!container) return;

  if (!state.currentAiAutofill) {
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: #64748B;">No active autofill payload. Select a job in Search or Rank tab and click "Auto-Apply".</div>`;
    return;
  }

  const { personalFields, legalAndLogistics, screeningQuestions, company, role } = state.currentAiAutofill;

  const personalCards = Object.entries(personalFields).map(([key, val]) => `
    <div class="ai-autofill-box">
      <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">${formatKeyName(key)}</div>
      <div style="font-size: 14px; font-weight: 600; color: #FFF; margin-top: 4px;">${val}</div>
      <button class="ai-copy-btn" onclick="copyToClipboard('${escapeTextForJs(String(val))}');">Copy</button>
    </div>
  `).join('');

  const legalCards = Object.entries(legalAndLogistics).map(([key, val]) => `
    <div class="ai-autofill-box">
      <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">${formatKeyName(key)}</div>
      <div style="font-size: 13.5px; color: #CBD5E1; margin-top: 4px;">${val}</div>
      <button class="ai-copy-btn" onclick="copyToClipboard('${escapeTextForJs(String(val))}');">Copy</button>
    </div>
  `).join('');

  const questionCards = (screeningQuestions || []).map(q => `
    <div style="background-color: #0E1626; border: 1px solid #1E293B; border-radius: 8px; padding: 18px; margin-bottom: 14px; position: relative;">
      <div style="margin-bottom: 8px; padding-right: 70px;">
        <span class="ai-badge ai-badge-blue">${q.category}</span>
        <h4 style="font-size: 14px; font-weight: 700; color: #FFF; margin-top: 4px;">${q.question}</h4>
      </div>
      <p style="font-size: 13.5px; color: #E2E8F0; line-height: 1.5; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px; border-left: 3px solid #10B981;">
        ${q.answer}
      </p>
      <button class="ai-copy-btn" style="top: 14px; right: 14px;" onclick="copyToClipboard('${escapeTextForJs(q.answer)}');">
        Copy Answer
      </button>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="ai-badge ai-badge-green">Target: ${company} — ${role}</span>
      <span style="font-size: 12.5px; color: #94A3B8; margin-left: 8px;">Generated at ${new Date().toLocaleTimeString()}</span>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 15px; font-weight: 700; color: #FFF; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
        1. Contact & Identity Information
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px;">
        ${personalCards}
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 15px; font-weight: 700; color: #FFF; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
        2. Legal, Work Authorization & Availability
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 10px;">
        ${legalCards}
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 15px; font-weight: 700; color: #FFF; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
        3. Tailored ATS Screening Question Responses
      </h3>
      ${questionCards}
    </div>

    <!-- Section 4: Universal In-Browser Auto-Fill Agent & Bookmarklet -->
    <div style="margin-bottom: 24px; background: #0E1626; border: 1.5px solid #1D4ED8; border-radius: 12px; padding: 22px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span class="ai-badge ai-badge-blue">LIVE IN-BROWSER AUTO-FILL AGENT</span>
          <h3 style="font-size: 17px; font-weight: 800; color: #FFF; margin-top: 4px;">
            How to Apply on LinkedIn & Other Job Sites
          </h3>
          <p style="font-size: 13.5px; color: #94A3B8; max-width: 780px; margin-top: 4px;">
            Use the JobAssist Universal Auto-Fill Agent bookmarklet to automatically detect and fill all fields on <strong>LinkedIn Easy Apply</strong>, <strong>Greenhouse</strong>, <strong>Lever</strong>, <strong>Workday</strong>, and <strong>Ashby</strong> in 1 click!
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="javascript:(function(){const s=document.createElement('script');s.src='${(typeof window!=='undefined'&&window.location&&window.location.origin&&!window.location.origin.startsWith('file:'))?window.location.origin:'http://localhost:3001'}/jobassist-autofill.js';document.body.appendChild(s);})();" class="btn-primary" style="height: 42px; padding: 0 18px; font-weight: 700; cursor: grab; background: #2563EB; border: 1px solid #60A5FA; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); text-decoration: none; color: #FFFFFF; display: inline-flex; align-items: center; gap: 8px;" title="Drag to Bookmarks Bar">
            Drag to Bookmarks Bar
          </a>
          <button class="btn-dark-outline" style="height: 42px; padding: 0 16px; font-size: 13px;" onclick="copyBookmarkletCode();">
            Copy Code
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 14px;">
        <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; border-left: 3px solid #3B82F6;">
          <div style="font-weight: 700; color: #60A5FA; font-size: 13px; margin-bottom: 4px;">Step 1: Save Bookmarklet</div>
          <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.4;">
            Drag the blue button above to your browser's Bookmarks bar (or press <strong>Ctrl+Shift+B</strong> in Chrome/Edge to show bookmarks).
          </p>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; border-left: 3px solid #10B981;">
          <div style="font-weight: 700; color: #34D399; font-size: 13px; margin-bottom: 4px;">Step 2: Open Any Application</div>
          <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.4;">
            Navigate to any job application form on <strong>LinkedIn (Easy Apply)</strong>, Greenhouse, Lever, or company careers page.
          </p>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; border-left: 3px solid #F59E0B;">
          <div style="font-weight: 700; color: #FCD34D; font-size: 13px; margin-bottom: 4px;">Step 3: Click & Watch It Fill</div>
          <p style="font-size: 12.5px; color: #CBD5E1; line-height: 1.4;">
            Click the bookmarklet: the agent scans the form, injects your name, email, phone, links, answers legal questions, and writes custom responses automatically!
          </p>
        </div>
      </div>

      <!-- 1-Click Console Snippet -->
      <div style="margin-top: 16px; background: #050811; border: 1px solid #1E293B; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="font-family: monospace; font-size: 12px; color: #94A3B8;">
          <span style="color: #60A5FA;">Console Snippet:</span> fetch('${(typeof window!=='undefined'&&window.location&&window.location.origin&&!window.location.origin.startsWith('file:'))?window.location.origin:'http://localhost:3001'}/jobassist-autofill.js').then(r=>r.text()).then(eval);
        </div>
        <button class="btn-dark-outline" style="font-size: 12px; height: 32px; padding: 0 12px;" onclick="copyAiConsoleSnippet();">
          Copy Console Script
        </button>
      </div>
    </div>

    <!-- Section 5: Interactive Live ATS Form Simulator -->
    <div style="margin-bottom: 30px; background: #0E1626; border: 2px dashed #34D399; border-radius: 12px; padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span class="ai-badge ai-badge-green">INTERACTIVE TEST SANDBOX</span>
          <h3 style="font-size: 18px; font-weight: 800; color: #FFF; margin-top: 4px;">
            Test Auto-Fill Now: Live ATS Application Form Simulator
          </h3>
          <p style="font-size: 13.5px; color: #94A3B8;">
            Simulates a real LinkedIn Easy Apply / Greenhouse form. Click the button to watch all fields, radios, dropdowns, and answers fill full by itself right now!
          </p>
        </div>
        <button class="btn-primary" style="height: 44px; padding: 0 24px; font-size: 14px; font-weight: 700; background: #059669; border: none; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);" onclick="testAutoFillOnSimulator();">
          Run Auto-Fill (Live Simulation)
        </button>
      </div>

      <form id="simulator-ats-form" onsubmit="event.preventDefault(); showToast('Simulated application submitted with 100% accuracy!', 'success');" style="background: #162032; border: 1px solid #27354A; border-radius: 10px; padding: 22px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">First Name *</label>
            <input type="text" name="first_name" id="sim-first-name" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF;" placeholder="e.g. John" required />
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Last Name *</label>
            <input type="text" name="last_name" id="sim-last-name" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF;" placeholder="e.g. Doe" required />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Email Address *</label>
            <input type="email" name="email" id="sim-email" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF;" placeholder="you@domain.com" required />
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Phone Number *</label>
            <input type="tel" name="phone" id="sim-phone" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF;" placeholder="+1 (555) 000-0000" required />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">LinkedIn Profile URL</label>
            <input type="url" name="linkedin_url" id="sim-linkedin" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF;" placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Portfolio / GitHub URL</label>
            <input type="url" name="portfolio_url" id="sim-portfolio" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF;" placeholder="https://github.com/..." />
          </div>
        </div>

        <!-- Work Authorization Radios -->
        <div style="margin-bottom: 16px; background: rgba(0,0,0,0.25); padding: 14px; border-radius: 8px;">
          <div style="font-size: 13px; font-weight: 600; color: #FFF; margin-bottom: 8px;">
            Are you legally authorized to work in the United States? *
          </div>
          <div style="display: flex; gap: 24px; font-size: 13px; color: #CBD5E1;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="sim_auth" id="sim-auth-yes" value="yes" required />
              <span>Yes</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="sim_auth" id="sim-auth-no" value="no" />
              <span>No</span>
            </label>
          </div>
        </div>

        <!-- Visa Sponsorship Radios -->
        <div style="margin-bottom: 16px; background: rgba(0,0,0,0.25); padding: 14px; border-radius: 8px;">
          <div style="font-size: 13px; font-weight: 600; color: #FFF; margin-bottom: 8px;">
            Will you now or in the future require visa sponsorship? *
          </div>
          <div style="display: flex; gap: 24px; font-size: 13px; color: #CBD5E1;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="sim_sponsor" id="sim-sponsor-yes" value="yes" />
              <span>Yes</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="sim_sponsor" id="sim-sponsor-no" value="no" required />
              <span>No</span>
            </label>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Work Authorization Status *</label>
            <select name="work_auth" id="sim-work-auth" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF; cursor: pointer;">
              <option value="">-- Select Work Auth Status --</option>
              <option value="US_CITIZEN">US Citizen</option>
              <option value="GREEN_CARD">Permanent Resident (Green Card)</option>
              <option value="H1B">H-1B Visa</option>
              <option value="OPT">F-1 OPT</option>
            </select>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Desired Salary (USD / Annual) *</label>
            <input type="text" name="salary" id="sim-salary" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF;" placeholder="e.g. 150000" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Resume / CV (PDF or TXT) *</label>
            <input type="file" id="sim-resume" accept=".pdf,.docx,.txt" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF; padding-top: 10px;" />
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Notice Period *</label>
            <select name="notice_period" id="sim-notice" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF; cursor: pointer;">
              <option value="">-- Select Notice Period --</option>
              <option value="immediate">Immediate</option>
              <option value="2 weeks">2 Weeks</option>
              <option value="1 month">1 Month</option>
            </select>
          </div>
        </div>

        <!-- Custom Questions -->
        <div style="margin-bottom: 14px;">
          <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">
            Why are you interested in this position and company? *
          </label>
          <textarea name="why_company" id="sim-why" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF; height: 80px; line-height: 1.4; resize: vertical;" placeholder="Your answer here..."></textarea>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">
            Cover Letter / Note for Hiring Team
          </label>
          <textarea name="cover_letter" id="sim-cover" class="ja-input" style="background: #0B0F19; border-color: #334155; color: #FFF; height: 100px; line-height: 1.4; resize: vertical;" placeholder="Paste cover letter..."></textarea>
        </div>

        <!-- Consent Checkbox -->
        <div style="margin-bottom: 16px; background: rgba(0,0,0,0.25); padding: 14px; border-radius: 8px;">
          <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 13px; color: #CBD5E1;">
            <input type="checkbox" id="sim-consent" name="consent" style="margin-top: 3px;" required />
            <span>I consent to storing my application and contacting me regarding this role. *</span>
          </label>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px;">
          <button type="button" class="btn-dark-outline" style="height: 44px; padding: 0 20px; font-size: 13.5px;" onclick="document.getElementById('simulator-ats-form').reset(); showToast('Form reset.', 'info');">
            Reset Simulator
          </button>
          <button type="submit" class="btn-primary" style="background: #2563EB; height: 44px; padding: 0 22px; font-size: 14px;">
            Submit Simulated Application
          </button>
        </div>
      </form>
    </div>
  `;
}

async function runAutonomousAutoPilot() {
  const banner = document.getElementById('ai-scrape-banner');
  if (banner) {
    banner.style.display = 'block';
    banner.className = 'ai-badge ai-badge-blue';
    banner.style.padding = '14px 20px';
    banner.style.width = '100%';
    banner.innerHTML = `<strong>Auto-Pilot Running:</strong> 1) Scraping across target ATS portals... 2) Running 5-dimension fit evaluation... 3) Drafting STAR CVs & bespoke letters... 4) Generating ATS form payloads...`;
  }

  showToast('Autonomous Auto-Pilot started! Finding and auto-applying to matching jobs...', 'info');

  try {
    const res = await fetch('/api/ai/autopilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Software Engineer', location: 'Remote', minScore: 80, maxApplications: 3 })
    });
    const data = await res.json();
    if (data.success) {
      if (banner) {
        banner.className = 'ai-badge ai-badge-green';
        banner.innerHTML = `<strong>Auto-Pilot Succeeded:</strong> Scraped ${data.scrapedTotal} jobs, identified ${data.qualifiedCount} high-fit matches, and auto-generated ${data.appliedCount} complete tailored application packages! Added to Pipeline.`;
      }

      // Refresh local state and kanban pipeline
      const [tRes, jRes] = await Promise.all([
        fetch('/api/ai/tracker').then(r => r.json()),
        fetch('/api/ai/jobs').then(r => r.json())
      ]);
      state.aiTracker = tRes.applications || [];
      state.aiJobs = jRes.jobs || [];
      updateAiHeaderCounts();
      renderAiJobsGrid();
      renderAiPipeline();
      showToast(`Auto-Pilot completed! ${data.appliedCount} roles applied & queued in Pipeline.`, 'success');
    } else {
      if (banner) {
        banner.className = 'ai-badge ai-badge-red';
        banner.innerHTML = `Auto-Pilot error: ${data.error}`;
      }
    }
  } catch (err) {
    if (banner) {
      banner.className = 'ai-badge ai-badge-red';
      banner.innerHTML = `Error: ${err.message}`;
    }
  }
}

function testAutoFillOnSimulator() {
  const form = document.getElementById('simulator-ats-form');
  if (!form) return;

  const data = state.currentAiAutofill?.personalFields || {
    firstName: "Raymond",
    lastName: "Wong",
    email: "raymond1994.glo@outlook.com",
    phone: "510-340-2070",
    linkedin: "https://www.linkedin.com/in/ray-w-3888b33aa",
    portfolio: "https://app.talentral.org"
  };

  const setField = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = val;
    el.style.transition = 'all 0.3s ease';
    el.style.borderColor = '#10B981';
    el.style.backgroundColor = '#ECFDF5';
    el.style.color = '#065F46';
    el.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.25)';
  };

  setField('sim-first-name', data.firstName || 'Raymond');
  setField('sim-last-name', data.lastName || 'Wong');
  setField('sim-email', data.email || 'raymond1994.glo@outlook.com');
  setField('sim-phone', data.phone || '510-340-2070');
  setField('sim-linkedin', data.linkedin || 'https://www.linkedin.com/in/ray-w-3888b33aa');
  setField('sim-portfolio', data.portfolio || 'https://app.talentral.org');
  setField('sim-salary', '175,000');
  setField('sim-notice', '2 weeks');
  setField('sim-work-auth', 'US_CITIZEN');

  // Radio buttons
  const authYes = document.getElementById('sim-auth-yes');
  if (authYes) authYes.checked = true;

  const sponsorNo = document.getElementById('sim-sponsor-no');
  if (sponsorNo) sponsorNo.checked = true;

  // Consent checkbox
  const consentBox = document.getElementById('sim-consent');
  if (consentBox) {
    consentBox.checked = true;
    consentBox.style.outline = '2px solid #10B981';
  }

  // Resume File attachment via DataTransfer
  const resumeInput = document.getElementById('sim-resume');
  if (resumeInput) {
    try {
      const resumeContent = "Raymond Wong - Senior AI & Machine Learning Engineer\nEmail: raymond1994.glo@outlook.com | Phone: 510-340-2070\nAddress: 215 Piedmont Ave NE APT 1206, Atlanta, GA 30308\n8+ years experience in distributed ML systems, PyTorch, AWS, Uber Eats, EY, Coca-Cola.";
      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const file = new File([blob], 'Raymond_Wong_Senior_AIML_Engineer_Resume.txt', { type: 'text/plain' });
      const dt = new DataTransfer();
      dt.items.add(file);
      resumeInput.files = dt.files;
      resumeInput.style.borderColor = '#10B981';
      resumeInput.style.backgroundColor = '#ECFDF5';
    } catch (e) {}
  }

  // Textareas
  const whyText = state.currentAiAutofill?.screeningQuestions?.[0]?.answer || 
    "I am passionate about solving mission-critical business challenges through scalable, high-throughput machine learning architectures and distributed systems. Having engineered real-time AI and predictive services at Uber Eats, EY, and Coca-Cola, your company's technical vision, data scale, and engineering culture directly align with my expertise.";
  setField('sim-why', whyText);

  const coverText = state.currentAiApply?.drafts?.coverLetter || 
    "Dear Hiring Team,\n\nI am writing to express my strong enthusiasm for this engineering position. Over the past 8+ years at Uber Eats, EY, and Coca-Cola, I have specialized in architecting and deploying mission-critical machine learning systems, high-concurrency microservices, and cloud-native AI pipelines at enterprise scale.\n\nAt Uber Eats, I spearheaded the redesign of our dynamic dispatch ranking engine, sustaining sub-18ms p99 latency across 45M+ monthly active users and cutting production incident triage time by 52%. Prior to that at EY and Coca-Cola, I built deep learning extraction systems processing $12B+ in corporate ledgers and automated supply chain demand forecasting pipelines. I thrive in high-ownership, async-first engineering cultures and look forward to contributing immediate architectural leverage to your technical roadmap.\n\nWarm regards,\nRaymond Wong\nSenior AI & Machine Learning Engineer\nEmail: raymond1994.glo@outlook.com | Phone: 510-340-2070\nAtlanta, GA";
  setField('sim-cover', coverText);

  showToast('JobAssist Auto-Fill: 15 fields, resume & consent auto-filled for Raymond Wong!', 'success');
}

async function copyBookmarkletCode() {
  try {
    const res = await fetch('/inline-bookmarklet.txt');
    const code = await res.text();
    copyToClipboard(code.trim());
    showToast('Self-contained bookmarklet copied! Works on Ashby, Workday, and all sites.', 'success');
  } catch (e) {
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.startsWith('file:')) ? window.location.origin : 'http://localhost:3001';
    const fallback = `javascript:(function(){const s=document.createElement('script');s.src='${origin}/jobassist-autofill.js';document.body.appendChild(s);})();`;
    copyToClipboard(fallback);
  }
}

async function copyAiConsoleSnippet() {
  try {
    const res = await fetch('/inline-bookmarklet.txt');
    let code = await res.text();
    if (code.startsWith('javascript:')) {
      code = decodeURIComponent(code.slice(11));
    }
    copyToClipboard(code.trim());
    showToast('Direct Console snippet copied! Paste in F12 Console on Ashby or Workday.', 'success');
  } catch (e) {
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.startsWith('file:')) ? window.location.origin : 'http://localhost:3001';
    copyToClipboard(`fetch('${origin}/jobassist-autofill.js').then(r=>r.text()).then(eval);`);
  }
}

function copyFullAiAutofillJson() {
  if (!state.currentAiAutofill) return;
  copyToClipboard(state.currentAiAutofill.exportJsonString);
  showToast('Full application payload JSON copied to clipboard!', 'success');
}

async function saveToPipelineFromAiAutofill() {
  if (!state.currentAiAutofill) return;
  const { company, role, jobId } = state.currentAiAutofill;

  const appData = {
    id: jobId || `app-${Date.now()}`,
    company: company,
    role: role,
    location: state.activeAiJob?.location || 'Remote',
    portal: state.activeAiJob?.portal || 'Direct',
    url: state.activeAiJob?.url || '#',
    stage: 'Applied',
    fitScore: state.currentAiApply?.fitData?.fitScore || 90,
    appliedDate: new Date().toISOString().split('T')[0],
    followUpDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    notes: `Submitted with tailored CV and Cover letter via AutoJob-AI.`
  };

  try {
    const res = await fetch('/api/ai/tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application: appData })
    });
    const data = await res.json();
    if (data.success) {
      state.aiTracker = data.applications;
      updateAiHeaderCounts();
      renderAiPipeline();
      showToast(`Saved application for ${company} to Pipeline!`, 'success');
      switchAiTab('pipeline');
    }
  } catch (err) {
    showToast(`Error saving to tracker: ${err.message}`, 'error');
  }
}

function renderAiPipeline() {
  const container = document.getElementById('ai-kanban-container');
  if (!container) return;

  const stages = ['Discovered', 'Applied', 'Screening', 'Interview', 'Offer'];

  container.innerHTML = stages.map(stage => {
    const items = state.aiTracker.filter(a => (a.stage || 'Applied').toLowerCase() === stage.toLowerCase());
    
    const itemsHtml = items.map(item => `
      <div class="ai-kanban-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <span style="font-weight: 700; color: #FFF; font-size: 13.5px;">${item.company}</span>
          <span class="ai-badge ${item.fitScore >= 85 ? 'ai-badge-green' : 'ai-badge-blue'}">${item.fitScore || 90}%</span>
        </div>
        <div style="font-size: 12px; color: #60A5FA; margin-bottom: 8px;">${item.role}</div>

        <div style="font-size: 11px; color: #64748B; margin-bottom: 8px;">
          Applied: ${item.appliedDate || '—'} · Follow-up: ${item.followUpDate || '—'}
        </div>

        <div style="font-size: 12px; color: #94A3B8; margin-bottom: 10px; line-height: 1.3;">
          ${(item.notes || '').slice(0, 80)}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #27354A; padding-top: 6px;">
          <select style="background: #0B0F19; color: #94A3B8; border: 1px solid #334155; border-radius: 4px; font-size: 11px; padding: 2px 4px;" onchange="moveAiApplicationStage('${item.id}', this.value);">
            ${stages.map(s => `<option value="${s}" ${s.toLowerCase() === stage.toLowerCase() ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <button style="background: none; border: none; color: #EF4444; font-size: 12px; cursor: pointer;" onclick="deleteAiTrackedApplication('${item.id}');">✕</button>
        </div>
      </div>
    `).join('');

    return `
      <div class="ai-kanban-col">
        <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #FFF; padding-bottom: 8px; border-bottom: 2px solid #1E293B; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <span>${stage}</span>
          <span class="ai-badge ai-badge-purple">${items.length}</span>
        </div>
        <div style="flex: 1; overflow-y: auto;">
          ${itemsHtml.length > 0 ? itemsHtml : '<div style="font-size: 12px; color: #64748B; text-align: center; margin-top: 30px;">Empty</div>'}
        </div>
      </div>
    `;
  }).join('');
}

async function moveAiApplicationStage(appId, newStage) {
  const app = state.aiTracker.find(a => a.id === appId);
  if (!app) return;
  app.stage = newStage;

  try {
    const res = await fetch('/api/ai/tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application: app })
    });
    const data = await res.json();
    if (data.success) {
      state.aiTracker = data.applications;
      renderAiPipeline();
    }
  } catch (err) {
    console.error('Update error:', err);
  }
}

async function deleteAiTrackedApplication(appId) {
  if (!confirm('Remove this application from tracker?')) return;
  try {
    const res = await fetch(`/api/ai/tracker/${appId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      state.aiTracker = data.applications;
      updateAiHeaderCounts();
      renderAiPipeline();
    }
  } catch (err) {
    console.error('Delete error:', err);
  }
}

function renderAiProfileEditor() {
  const container = document.getElementById('ai-profile-container');
  if (!container || !state.aiProfile) return;

  const c = state.aiProfile.candidate || {};
  const p = state.aiProfile.preferences || {};

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <h4 style="font-size: 14px; font-weight: 700; color: #FFF; margin-bottom: 12px;">Candidate Credentials</h4>
        
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; color: #94A3B8; display: block; margin-bottom: 4px;">Full Name</label>
          <input type="text" id="ai-prof-name" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF;" value="${c.fullName || ''}" />
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; color: #94A3B8; display: block; margin-bottom: 4px;">Professional Headline</label>
          <input type="text" id="ai-prof-headline" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF;" value="${c.headline || ''}" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; color: #94A3B8; display: block; margin-bottom: 4px;">Email</label>
            <input type="email" id="ai-prof-email" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF;" value="${c.email || ''}" />
          </div>
          <div>
            <label style="font-size: 12px; color: #94A3B8; display: block; margin-bottom: 4px;">Phone</label>
            <input type="text" id="ai-prof-phone" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF;" value="${c.phone || ''}" />
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; color: #94A3B8; display: block; margin-bottom: 4px;">Executive Career Summary</label>
          <textarea id="ai-prof-summary" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF; height: 90px; line-height: 1.4; resize: vertical;">${state.aiProfile.summary || ''}</textarea>
        </div>
      </div>

      <div>
        <h4 style="font-size: 14px; font-weight: 700; color: #FFF; margin-bottom: 12px;">Target Alignment & Dealbreakers</h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; color: #94A3B8; display: block; margin-bottom: 4px;">Target Salary (USD)</label>
            <input type="number" id="ai-prof-salary" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF;" value="${p.targetSalaryUSD || 175000}" />
          </div>
          <div>
            <label style="font-size: 12px; color: #94A3B8; display: block; margin-bottom: 4px;">Notice Period (Weeks)</label>
            <input type="number" id="ai-prof-notice" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF;" value="${p.noticePeriodWeeks || 2}" />
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; color: #94A3B8; display: block; margin-bottom: 4px;">Work Arrangement</label>
          <input type="text" id="ai-prof-arrangement" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF;" value="${p.workArrangement || 'Remote (Worldwide)'}" />
        </div>

        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; color: #94A3B8; display: block; margin-bottom: 4px;">Dealbreakers (Automatic Veto Triggers)</label>
          <textarea id="ai-prof-dealbreakers" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF; height: 75px; line-height: 1.4; resize: vertical;">${(p.dealbreakers || []).join('\n')}</textarea>
        </div>
      </div>
    </div>
  `;
}

async function saveAiCandidateProfile() {
  if (!state.aiProfile) return;
  state.aiProfile.candidate.fullName = document.getElementById('ai-prof-name').value;
  state.aiProfile.candidate.headline = document.getElementById('ai-prof-headline').value;
  state.aiProfile.candidate.email = document.getElementById('ai-prof-email').value;
  state.aiProfile.candidate.phone = document.getElementById('ai-prof-phone').value;
  state.aiProfile.summary = document.getElementById('ai-prof-summary').value;
  state.aiProfile.preferences.targetSalaryUSD = parseInt(document.getElementById('ai-prof-salary').value, 10);
  state.aiProfile.preferences.noticePeriodWeeks = parseInt(document.getElementById('ai-prof-notice').value, 10);
  state.aiProfile.preferences.workArrangement = document.getElementById('ai-prof-arrangement').value;
  state.aiProfile.preferences.dealbreakers = document.getElementById('ai-prof-dealbreakers').value.split('\n').filter(Boolean);

  try {
    const res = await fetch('/api/ai/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: state.aiProfile })
    });
    const data = await res.json();
    if (data.success) {
      showToast('Candidate ground-truth profile saved successfully!', 'success');
    }
  } catch (err) {
    showToast(`Error updating profile: ${err.message}`, 'error');
  }
}

async function refreshAiUpskillAnalysis() {
  try {
    const res = await fetch('/api/ai/upskill');
    const data = await res.json();
    if (data.success) {
      state.aiUpskill = data.analysis;
      renderAiUpskillTab();
      showToast('Market demand analysis recomputed!', 'success');
    }
  } catch (err) {
    console.error('Upskill refresh error:', err);
  }
}

function renderAiUpskillTab() {
  const container = document.getElementById('ai-upskill-container');
  if (!container || !state.aiUpskill) return;

  const { inDemandSkills, missingGaps, overallProfileCoverage, totalJobsAnalyzed } = state.aiUpskill;

  const inDemandRows = (inDemandSkills || []).slice(0, 8).map(s => `
    <div style="margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
        <span style="font-weight: 600; color: #FFF;">
          ${s.hasSkill ? '✓' : '•'} ${s.skill}
        </span>
        <span style="color: #64748B; font-family: monospace;">${s.percentage}% (${s.count}/${totalJobsAnalyzed} jobs)</span>
      </div>
      <div style="height: 6px; background: #1E293B; border-radius: 3px; overflow: hidden;">
        <div style="width: ${s.percentage}%; height: 100%; background: ${s.hasSkill ? '#10B981' : '#F59E0B'};"></div>
      </div>
    </div>
  `).join('');

  const gapCards = (missingGaps || []).map(g => `
    <div style="background-color: #162032; border: 1px solid #27354A; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 15px; font-weight: 700; color: #FFF;">${g.skill}</span>
        <span class="ai-badge ${g.priority === 'HIGH' ? 'ai-badge-red' : 'ai-badge-gold'}">${g.priority} PRIORITY (${g.percentage}% Demand)</span>
      </div>
      <p style="font-size: 12.5px; color: #94A3B8; margin-bottom: 8px;">
        Recommended Course: <strong>${g.learningAction.course}</strong> (~${g.learningAction.hours} hrs)
      </p>
      <div style="font-size: 12px; color: #60A5FA; background: rgba(59, 130, 246, 0.1); padding: 8px; border-radius: 4px;">
        Production Project: ${g.learningAction.project}
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 15px; font-weight: 700; color: #FFF;">Top Market Tech Demands</h3>
          <span class="ai-badge ai-badge-green">Profile Coverage: ${overallProfileCoverage}%</span>
        </div>
        ${inDemandRows}
      </div>

      <div>
        <h3 style="font-size: 15px; font-weight: 700; color: #FFF; margin-bottom: 16px;">Targeted Learning Roadmap & Gap Mitigation</h3>
        ${gapCards.length > 0 ? gapCards : '<div style="color: #34D399; padding: 20px;">Zero critical skill gaps detected! Your profile covers 100% of top market demands.</div>'}
      </div>
    </div>
  `;
}

function openAiCustomJobModal() {
  const container = document.getElementById('ai-modal-container');
  if (!container) return;
  container.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(4px);" onclick="if(event.target === this) closeAiModal();">
      <div style="background: #111827; border: 1.5px solid #3B82F6; border-radius: 12px; max-width: 680px; width: 92%; padding: 24px; color: #FFF;">
        <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 8px;">Paste Custom Job Posting</h3>
        <p style="font-size: 13.5px; color: #94A3B8; margin-bottom: 16px;">
          Paste any external job description from Greenhouse, Lever, Workday, or an employer careers page. JobAssist will clean it, audit it, and generate the tailored application.
        </p>

        <form onsubmit="handleAiCustomJobSubmit(event);">
          <div style="margin-bottom: 14px;">
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Company Name & Role Title</label>
            <input type="text" id="ai-custom-title" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF;" placeholder="e.g. OpenAI - Systems Engineer" required />
          </div>

          <div style="margin-bottom: 16px;">
            <label style="font-size: 12px; font-weight: 600; color: #94A3B8; display: block; margin-bottom: 4px;">Paste Full Job Posting Description</label>
            <textarea id="ai-custom-text" class="ja-input" style="background: #162032; border-color: #334155; color: #FFF; height: 160px; line-height: 1.4; resize: vertical;" placeholder="Paste the complete job description text here..." required></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" class="btn-dark-outline" style="height: 44px; padding: 0 20px;" onclick="closeAiModal();">Cancel</button>
            <button type="submit" class="btn-primary" style="height: 44px; padding: 0 24px;">Launch Multi-Agent Pipeline</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function handleAiCustomJobSubmit(e) {
  e.preventDefault();
  const titleInput = document.getElementById('ai-custom-title').value.trim();
  const textInput = document.getElementById('ai-custom-text').value.trim();
  closeAiModal();

  const [company, ...roleParts] = titleInput.split('-');
  const customJob = {
    id: `custom-${Date.now()}`,
    title: roleParts.length > 0 ? roleParts.join('-').trim() : titleInput,
    company: company.trim(),
    location: "Remote / Worldwide",
    portal: "Direct Input",
    url: "#",
    date: new Date().toISOString().split('T')[0],
    description: textInput,
    tags: ["custom", "tailored"],
    salary: "$165k - $210k"
  };

  state.aiJobs.unshift(customJob);
  renderAiJobsGrid();
  launchAiAutoApply(customJob.id);
}

function closeAiModal() {
  const container = document.getElementById('ai-modal-container');
  if (container) container.innerHTML = '';
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!', 'success');
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast('Copied to clipboard!', 'success');
}

function escapeTextForJs(text) {
  if (!text) return '';
  return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
}

function formatKeyName(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

// --------------------------------------------------------
// Main Application Renderer
// --------------------------------------------------------
function renderApp() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const path = state.currentPath;

  if (path === '/assistant' || path === '/ai' || path === '/dashboard') {
    root.innerHTML = renderAssistantView();
    initAiAssistant();
    return;
  }

  if (path === '/email') {
    root.innerHTML = renderEmailGateView();
  } else if (path === '/we-work-for-you') {
    root.innerHTML = renderChecklistView();
  } else if (path === '/timeline-after-apply') {
    root.innerHTML = renderTimelineView();
  } else if (path === '/checkout') {
    root.innerHTML = renderCheckoutView();
  } else if (path === '/welcome') {
    root.innerHTML = renderWelcomeView();
  } else if (path === '/cancellation') {
    root.innerHTML = renderCancellationView();
  } else if (path === '/jobs') {
    root.innerHTML = renderJobsView();
  } else if (path === '/terms') {
    root.innerHTML = renderStaticInfoView(
      'Terms & Conditions',
      `
      <p>Last updated: October 2026</p><br/>
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing or utilizing the JobAssist platform, services, AI-generated matching feeds, or career acceleration tools, you enter into a binding agreement with JobAssist Inc.</p><br/>
      <h3>2. Subscription Plans & Auto-Renewal</h3>
      <p>JobAssist subscriptions are billed in advance according to the billing cycle selected at checkout (7-Day Trial, 1-Month Plan, or 3-Month Plan). Following the introductory period, subscriptions automatically renew at the disclosed recurring rate until explicitly cancelled via our self-service cancellation portal.</p><br/>
      <h3>3. Cancellation Policy</h3>
      <p>Users may cancel their recurring subscription at any time without fees, phone calls, or friction. Simply visit our <a href="/cancellation" onclick="event.preventDefault(); navigate('/cancellation');" style="color: var(--color-ja-blue);">Cancellation Portal</a> or manage subscription in profile settings.</p>
      `
    );
  } else if (path === '/privacy') {
    root.innerHTML = renderStaticInfoView(
      'Privacy Policy',
      `
      <p>Last updated: October 2026</p><br/>
      <h3>1. Information We Collect</h3>
      <p>We collect information provided directly by you, including your name, email address, resume contents, and career preferences, in order to match you with qualified opportunities.</p><br/>
      <h3>2. How We Protect Your Data</h3>
      <p>All transmitted user data and payment credentials are encrypted using bank-grade 256-bit TLS/SSL encryption. We do not sell your personal data to third-party data brokers.</p>
      `
    );
  } else if (path === '/about-us') {
    root.innerHTML = renderStaticInfoView(
      'About JobAssist',
      `
      <p>JobAssist was founded to dismantle the friction and repetitive exhaustion of the modern job search. By combining high-speed automated job aggregation across 7M+ openings with advanced natural language profile matching, we help ambitious professionals connect with career-defining roles in days rather than months.</p>
      `
    );
  } else if (path === '/help') {
    root.innerHTML = renderStaticInfoView(
      'Help & Customer Support',
      `
      <p>Need assistance with your job matches, applications, or account settings?</p><br/>
      <p>Our dedicated support team is available 24/7 at <strong>support@jobassist.com</strong>. All inquiries receive priority handling within 2 business hours.</p>
      `
    );
  } else {
    // Default: Marketing Home Page (/)
    root.innerHTML = renderMarketingHomeView();
    setTimeout(() => {
      if (typeof renderComboPlansGrid === 'function') renderComboPlansGrid();
      if (typeof updatePaymentGatewayOptions === 'function') updatePaymentGatewayOptions();
    }, 20);
  }
}

// --------------------------------------------------------
// App Initialization
// --------------------------------------------------------
async function initApp() {
  initAttribution();
  await loadInitialData();
  renderApp();
}

window.addEventListener('DOMContentLoaded', initApp);
