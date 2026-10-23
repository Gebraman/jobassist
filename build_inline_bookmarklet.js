// Builds two production tools:
// 1. Self-contained 100% Inline Bookmarklet (Zero CSP Block, No HTTP Mixed-Content, Works Everywhere)
// 2. Unpacked Chrome/Edge Extension (The Gold Standard, 100% immune to all CSP and CORS)

import fs from 'fs';
import path from 'path';

const candidate = {
  name: 'Raymond Wong',
  first: 'Raymond',
  last: 'Wong',
  email: 'raymond1994.glo@outlook.com',
  phone: '510-340-2070',
  loc: 'Atlanta, GA',
  addr: '215 Piedmont Ave NE APT 1206',
  city: 'Atlanta',
  state: 'GA',
  zip: '30308',
  country: 'United States',
  dob: '12/09/1994',
  ssn4: '0928',
  title: 'Senior AI/ML Engineer',
  company: 'Uber Eats',
  school: 'University of Florida',
  degree: "Master's Degree",
  linkedin: 'https://www.linkedin.com/in/ray-w-3888b33aa',
  github: 'https://github.com/raymondwong-ai',
  portfolio: 'https://app.talentral.org',
  salary: '175000',
  notice: '2 weeks',
  why: 'I am passionate about building enterprise-scale AI/ML systems and high-throughput architectures. My background at Uber Eats, EY, and Coca-Cola directly aligns with your technical roadmap.',
  achieve: 'Architected dynamic delivery dispatch ranking systems at Uber Eats sustaining sub-18ms p99 latency across 45M+ users and delivering a 7.4% dispatch efficiency improvement.',
  tech: '8+ years building enterprise AI/ML solutions in Python, Go, and TypeScript, containerized on Kubernetes and AWS (SageMaker, ECS, EKS, Lambda, S3, RDS).',
  letter: 'Dear Hiring Team,\\n\\nI am writing to express my strong enthusiasm for this engineering position. Over the past 8+ years at Uber Eats, EY, and Coca-Cola, I have specialized in architecting and deploying mission-critical machine learning systems, high-concurrency microservices, and cloud-native AI pipelines at enterprise scale.\\n\\nWarm regards,\\nRaymond Wong\\nSenior AI & Machine Learning Engineer\\nEmail: raymond1994.glo@outlook.com | Phone: 510-340-2070'
};

// Compact self-contained script (No fetch! Runs immediately in page context!)
const compactCode = `(() => {
  const c = ${JSON.stringify(candidate)};
  let cnt = 0;
  const setVal = (el, val) => {
    if (!el) return;
    const prev = el.value;
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && desc.set) desc.set.call(el, val);
    else el.value = val;
    if (el._valueTracker) el._valueTracker.setValue(prev);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
    el.style.transition = 'all 0.3s ease';
    el.style.borderColor = '#10B981';
    el.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.3)';
    el.style.backgroundColor = '#ECFDF5';
    el.style.color = '#065F46';
  };
  const ctx = el => ((el.id||'')+' '+(el.name||'')+' '+(el.placeholder||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.getAttribute('data-testid')||'')+' '+(el.closest('label,div,section,p')?.innerText||'')).toLowerCase();

  // 1. Text Inputs
  document.querySelectorAll('input').forEach(i => {
    const t = (i.type || 'text').toLowerCase();
    if (['hidden','submit','checkbox','radio','file'].includes(t)) return;
    const x = ctx(i);
    if (t === 'email' || x.includes('email')) { setVal(i, c.email); cnt++; }
    else if (t === 'tel' || x.includes('phone') || x.includes('mobile')) { setVal(i, c.phone); cnt++; }
    else if (x.includes('first name') || x.includes('given name')) { setVal(i, c.first); cnt++; }
    else if (x.includes('last name') || x.includes('family name') || x.includes('surname')) { setVal(i, c.last); cnt++; }
    else if (x.includes('name') && !x.includes('company') && !x.includes('school') && !x.includes('user')) { setVal(i, c.name); cnt++; }
    else if (x.includes('address line 1') || x.includes('street address') || (x.includes('address') && !x.includes('email'))) { setVal(i, c.addr); cnt++; }
    else if (x.includes('city')) { setVal(i, c.city); cnt++; }
    else if (x.includes('state') || x.includes('province')) { setVal(i, c.state); cnt++; }
    else if (x.includes('zip') || x.includes('postal')) { setVal(i, c.zip); cnt++; }
    else if (x.includes('location')) { setVal(i, c.loc); cnt++; }
    else if (x.includes('dob') || x.includes('birth')) { setVal(i, c.dob); cnt++; }
    else if (x.includes('ssn') || x.includes('social security')) { setVal(i, c.ssn4); cnt++; }
    else if (x.includes('linkedin')) { setVal(i, c.linkedin); cnt++; }
    else if (x.includes('github') || x.includes('git')) { setVal(i, c.github); cnt++; }
    else if (x.includes('portfolio') || x.includes('website') || x.includes('url')) { setVal(i, c.portfolio); cnt++; }
    else if (x.includes('salary') || x.includes('compensation')) { setVal(i, c.salary); cnt++; }
    else if (x.includes('notice') || x.includes('start date') || x.includes('availability')) { setVal(i, c.notice); cnt++; }
    else if (x.includes('employer') || x.includes('current company')) { setVal(i, c.company); cnt++; }
    else if (x.includes('title') || x.includes('current role')) { setVal(i, c.title); cnt++; }
  });

  // 2. Select Dropdowns
  document.querySelectorAll('select').forEach(s => {
    const x = ctx(s);
    const opts = Array.from(s.options);
    let opt;
    if (x.includes('work-auth') || x.includes('work auth') || x.includes('authorized') || x.includes('citizenship') || x.includes('status')) {
      opt = opts.find(o => { const t = (o.text+' '+o.value).toLowerCase(); return t.includes('citizen') || t.includes('permanent') || t.includes('authorized') || t === 'yes'; });
    } else if (x.includes('sponsor') || x.includes('visa')) {
      opt = opts.find(o => { const t = (o.text+' '+o.value).toLowerCase(); return t === 'no' || t.includes('not require') || t === 'false'; });
    } else if (x.includes('gender') || x.includes('sex')) {
      opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('male'));
    } else if (x.includes('race') || x.includes('ethnicity')) {
      opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('asian'));
    } else if (x.includes('veteran')) {
      opt = opts.find(o => { const t = (o.text+' '+o.value).toLowerCase(); return t.includes('not a protected') || t.includes('not a veteran') || t === 'no'; });
    } else if (x.includes('disability')) {
      opt = opts.find(o => { const t = (o.text+' '+o.value).toLowerCase(); return t.includes('do not have') || t.includes("don't have") || t === 'no'; });
    } else if (x.includes('country')) {
      opt = opts.find(o => { const t = (o.text+' '+o.value).toLowerCase(); return t.includes('united states') || t === 'us'; });
    } else if (x.includes('notice') || x.includes('availability')) {
      opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('2 week'));
    }
    if (opt) { setVal(s, opt.value); cnt++; }
  });

  // 3. Textareas
  document.querySelectorAll('textarea').forEach(t => {
    const x = ctx(t);
    if (x.includes('cover') || x.includes('letter') || x.includes('note') || x.includes('recruiter')) { setVal(t, c.letter); cnt++; }
    else if (x.includes('why') || x.includes('interest')) { setVal(t, c.why); cnt++; }
    else if (x.includes('achievement') || x.includes('proud')) { setVal(t, c.achieve); cnt++; }
    else if (x.includes('experience') || x.includes('technical')) { setVal(t, c.tech); cnt++; }
    else { setVal(t, c.why); cnt++; }
  });

  // 4. Radio Buttons
  document.querySelectorAll('input[type="radio"]').forEach(r => {
    const x = (r.closest('fieldset,div,section,tr')?.innerText || '').toLowerCase();
    const v = (r.value||'').toLowerCase();
    const t = (r.parentElement?.innerText||'').toLowerCase();
    if ((x.includes('authorized') || x.includes('eligibility')) && (v.includes('yes') || t.includes('yes') || v === '1')) {
      r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); cnt++;
    } else if ((x.includes('sponsor') || x.includes('visa')) && (v.includes('no') || t.includes('no') || v === '0')) {
      r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); cnt++;
    } else if (x.includes('veteran') && (t.includes('not a protected') || t.includes('not a veteran'))) {
      r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); cnt++;
    } else if (x.includes('disability') && (t.includes('do not have') || t.includes('no disability'))) {
      r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); cnt++;
    }
  });

  // 5. Checkboxes (Consent / Terms)
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    const x = ctx(cb);
    if (x.includes('consent') || x.includes('agree') || x.includes('terms') || x.includes('privacy') || x.includes('store') || x.includes('policy')) {
      cb.checked = true;
      cb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      cb.dispatchEvent(new Event('change', { bubbles: true }));
      cnt++;
    }
  });

  // 6. Resume file attachment if file input present
  document.querySelectorAll('input[type="file"]').forEach(fi => {
    try {
      const dt = new DataTransfer();
      const f = new File([c.letter], 'Raymond_Wong_Senior_AIML_Engineer_Resume.txt', { type: 'text/plain' });
      dt.items.add(f);
      fi.files = dt.files;
      fi.dispatchEvent(new Event('change', { bubbles: true }));
      fi.style.outline = '2px solid #10B981';
      cnt++;
    } catch(e) {}
  });

  // Toast Notification
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999999;background:#065F46;color:#FFF;border:2px solid #34D399;border-radius:10px;padding:14px 20px;font-family:sans-serif;font-size:14px;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,0.5);';
  toast.innerHTML = '⚡ JobAssist AutoFill: ' + cnt + ' fields populated for Raymond Wong!';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
})();`;

// Minify into single-line bookmarklet
const minified = 'javascript:' + encodeURIComponent(compactCode.replace(/\s+/g, ' ').trim());
console.log('Minified Bookmarklet Length:', minified.length);
fs.writeFileSync('jobassist_app/public/inline-bookmarklet.txt', minified, 'utf8');

// Build Chrome Extension!
const extDir = 'jobassist_app/extension';
if (!fs.existsSync(extDir)) fs.mkdirSync(extDir, { recursive: true });

const manifest = {
  manifest_version: 3,
  name: "JobAssist AutoFill Agent (Raymond Wong)",
  version: "3.0.0",
  description: "1-Click Autonomous AutoFill for Ashby, Workday, Workable, Indeed, Greenhouse, Lever, and all ATS platforms.",
  action: {
    default_title: "⚡ Fill Application Form (Raymond Wong)"
  },
  permissions: ["activeTab", "scripting"],
  background: {
    service_worker: "background.js"
  },
  icons: {
    "16": "icon.png",
    "48": "icon.png",
    "128": "icon.png"
  }
};

fs.writeFileSync(path.join(extDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

const bgScript = `
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});
`;
fs.writeFileSync(path.join(extDir, 'background.js'), bgScript.trim(), 'utf8');

// The extension content script runs directly in the page with full extension authority (Zero CSP restrictions!)
fs.writeFileSync(path.join(extDir, 'content.js'), compactCode, 'utf8');

console.log('Extension files built successfully at:', extDir);
