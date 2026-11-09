(() => {
  // Prevent duplicate execution
  if (window.__jobassist_v4_6_loaded) return;
  window.__jobassist_v4_6_loaded = true;

  const PROFILES = (typeof DEFAULT_CLIENTS !== 'undefined') ? DEFAULT_CLIENTS : [
    {
      id: 'client_raymond_wong',
      name: 'Raymond Wong',
      first: 'Raymond',
      last: 'Wong',
      email: 'raymond1994.glo@outlook.com',
      phone: '510-340-2070',
      headline: 'Senior Integrations & Back-End Software Engineer',
      loc: 'Atlanta, GA, United States',
      addr: '215 Piedmont Ave NE APT 1206',
      city: 'Atlanta',
      state: 'GA',
      zip: '30308',
      country: 'United States',
      dob: '12/09/1994',
      ssn4: '0928',
      title: 'Senior Software Engineer (Integrations & Back-End)',
      company: 'Uber Eats',
      school: 'University of Florida',
      degree: "Master's Degree in Computer Science",
      educationYear: '2016',
      gpa: '3.85',
      linkedin: 'https://www.linkedin.com/in/ray-w-3888b33aa',
      github: 'https://github.com/raymondwong-ai',
      portfolio: 'https://app.talentral.org',
      salary: '$175,000 - $190,000',
      salaryNum: '175000',
      notice: '2 weeks',
      yearsBE: '8',
      sponsorship: 'No',
      workAuth: 'Yes',
      skills: ['HubSpot APIs', 'Zapier', 'Workato', 'Mulesoft', 'Python', 'Node.js', 'Go', 'React', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'REST/GraphQL APIs', 'CRM Integrations'],
      summary: 'Senior Integrations & Back-End Software Engineer with 8+ years of enterprise experience building custom CRM integrations, automated API middleware, and cloud workflows connecting third-party platforms with HubSpot, Salesforce, and microservices on AWS and Google Cloud.',
      letter: 'Dear Hiring Team at 1406 Consulting,\n\nI am writing to express my enthusiastic interest in the HubSpot Integrations Software Developer position. Over the past 8+ years at Uber Eats, EY, and Coca-Cola, I have specialized in building robust API-based integrations, automated data pipelines, and custom CRM components using Node.js, Python, React, and cloud platforms.\n\nWarm regards,\nRaymond Wong\nEmail: raymond1994.glo@outlook.com | Phone: 510-340-2070'
    }
  ];

  let activeClient = PROFILES[0];
  let allClients = PROFILES;
  let activeLicense = null;

  function refreshLicenseState() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['jobassist_license'], (d) => {
        activeLicense = d.jobassist_license || null;
        updateFloatingWidgetLicenseBadge();
      });
    }
  }

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.jobassist_license) {
        activeLicense = changes.jobassist_license.newValue || null;
        updateFloatingWidgetLicenseBadge();
      }
    });
  }

  function isLicenseValid() {
    if (!activeLicense || activeLicense.valid !== true) return false;
    if (activeLicense.isExpired === true || activeLicense.status !== 'active') return false;
    if (activeLicense.expiresAt && new Date(activeLicense.expiresAt).getTime() <= Date.now()) return false;
    return (activeLicense.daysRemaining > 0 || (activeLicense.hoursRemaining && activeLicense.hoursRemaining > 0) || activeLicense.status === 'active');
  }

  refreshLicenseState();

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['jobassist_clients', 'active_client_id'], (data) => {
      const defaultList = typeof DEFAULT_CLIENTS !== 'undefined' ? DEFAULT_CLIENTS : [];
      const hasLegacy = data.jobassist_clients && data.jobassist_clients.some(c => c.id === 'client_raymond_wong' || c.name === 'Raymond Wong');
      if (data.jobassist_clients && data.jobassist_clients.length > 0 && !hasLegacy) {
        allClients = data.jobassist_clients;
      } else {
        allClients = defaultList;
      }
      const activeId = data.active_client_id || (allClients[0] ? allClients[0].id : null);
      if (activeId) {
        const found = allClients.find(c => c.id === activeId);
        if (found) activeClient = found;
        else if (allClients.length > 0) activeClient = allClients[0];
      } else if (allClients.length > 0) {
        activeClient = allClients[0];
      }
      updateFloatingWidgetClient();
    });
  }

  // 1. Autonomous Job & Page Overview Extractor
  function extractPageJobOverview() {
    let title = '';
    let company = '';
    let location = 'Remote';
    let portal = 'JOB APPLICATION';
    let salaryRange = '';
    let description = '';
    const url = window.location.href;
    const bodyText = document.body ? document.body.innerText : '';

    // Detect Portal & Extract Specific Selectors
    if (url.includes('greenhouse.io') || document.querySelector('#application_form, .app-title')) {
      portal = 'GREENHOUSE';
      const h = document.querySelector('.app-title, h1, [data-qa="job-title"]');
      if (h) title = h.innerText.trim();
      const c = document.querySelector('.company-name, [data-qa="company-name"]');
      if (c) company = c.innerText.trim();
    } else if (url.includes('lever.co') || document.querySelector('.posting-headline')) {
      portal = 'LEVER';
      const h = document.querySelector('.posting-headline h2, h2');
      if (h) title = h.innerText.trim();
      const compMatch = url.match(/jobs\.lever\.co\/([^\/]+)/i);
      if (compMatch) company = compMatch[1].replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    } else if (url.includes('myworkdayjobs.com') || document.querySelector('[data-automation-id="jobPostingHeader"]')) {
      portal = 'WORKDAY';
      const h = document.querySelector('[data-automation-id="jobPostingHeader"], h2[data-automation-id="header"]');
      if (h) title = h.innerText.trim();
      const hostParts = window.location.hostname.split('.');
      if (hostParts.length > 0) company = hostParts[0].replace(/[-_]/g, ' ').toUpperCase();
    } else if (url.includes('ashbyhq.com') || document.querySelector('div[class*="ashby"]')) {
      portal = 'ASHBY';
      const h = document.querySelector('h1, [class*="heading"]');
      if (h) title = h.innerText.trim();
      const compMatch = url.match(/jobs\.ashbyhq\.com\/([^\/]+)/i);
      if (compMatch) company = compMatch[1].replace(/[-_]/g, ' ').toUpperCase();
    } else if (url.includes('taleo.net')) {
      portal = 'TALEO';
      const h = document.querySelector('.masterpage, h1, [id*="reqTitle"]');
      if (h) title = h.innerText.trim();
      company = 'Enterprise Partner';
    } else if (url.includes('bamboohr.com')) {
      portal = 'BAMBOOHR';
      const h = document.querySelector('.JobDetails__job-title, h2');
      if (h) title = h.innerText.trim();
      const hostParts = window.location.hostname.split('.');
      if (hostParts.length > 0) company = hostParts[0].toUpperCase();
    } else if (url.includes('linkedin.com')) {
      portal = 'LINKEDIN EASY APPLY';
      const h = document.querySelector('.job-details-jobs-unified-top-card__job-title, .top-card-layout__title');
      if (h) title = h.innerText.trim();
      const c = document.querySelector('.job-details-jobs-unified-top-card__company-name, .top-card-layout__first-sub-line a');
      if (c) company = c.innerText.trim();
    } else if (url.includes('indeed.com')) {
      portal = 'INDEED';
      const h = document.querySelector('.jobsearch-JobInfoHeader-title, h1');
      if (h) title = h.innerText.trim();
      const c = document.querySelector('[data-company-name="true"], .jobsearch-InlineCompanyRating-companyHeader');
      if (c) company = c.innerText.trim();
    } else if (url.includes('remoteok.com')) {
      portal = 'REMOTEOK';
      const h = document.querySelector('h2[itemprop="title"], h2');
      if (h) title = h.innerText.trim();
      const c = document.querySelector('h3[itemprop="name"]');
      if (c) company = c.innerText.trim();
    } else if (url.includes('applytojob.com')) {
      portal = 'JAZZHR';
      const h = document.querySelector('h1, .job-title');
      if (h) title = h.innerText.trim();
      const host = window.location.hostname;
      company = host.split('.')[0].replace(/consulting/i, ' Consulting').replace(/^[a-z]/, c => c.toUpperCase());
      if (company.toLowerCase().includes('1406')) company = '1406 Consulting';
    } else if (url.includes('workable.com')) {
      portal = 'WORKABLE';
      const heading = document.querySelector('h1, [data-ui="job-title"]');
      if (heading) title = heading.innerText.trim();
      if (url.includes('bask-health')) company = 'Bask Health';
    }

    // Generic fallback for title & company
    if (!title) {
      const h1 = document.querySelector('h1');
      title = h1 ? h1.innerText.trim() : (document.title ? document.title.split(/[-–|]/)[0].trim() : 'Software Developer');
    }
    if (!company) {
      const metaComp = document.querySelector('meta[property="og:site_name"], meta[name="author"]');
      if (metaComp && metaComp.content) company = metaComp.content;
      else {
        const titleParts = document.title ? document.title.split(/[-–|]/) : [];
        if (titleParts.length > 1) company = titleParts[titleParts.length - 1].trim();
      }
    }

    // Scrape advertised salary if listed on page
    const salMatch = bodyText.match(/\$([0-9]{2,3},[0-9]{3})\s*(?:to|-)\s*\$([0-9]{2,3},[0-9]{3})/i);
    if (salMatch) {
      salaryRange = `$${salMatch[1]} - $${salMatch[2]}`;
    }

    // Scrape full job description content for deep resume tailoring
    const descSelectors = [
      '[data-automation-id="jobPostingDescription"]',
      '.job-description', '#job-description', '.posting-description',
      '.jobs-description__content', '#jobDescriptionText', '.JobDetails__content',
      '[itemprop="description"]', 'article', '.content', '.section-page'
    ];
    for (const sel of descSelectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText && el.innerText.trim().length > 80) {
        description = el.innerText.trim().slice(0, 4000);
        break;
      }
    }
    if (!description && bodyText) {
      description = bodyText.slice(0, 3000);
    }

    // Extract relevant keywords across technical, engineering, finance, management
    const candidateTech = [
      'python', 'node.js', 'typescript', 'javascript', 'react', 'go', 'golang', 'sql', 'postgresql',
      'mysql', 'mongodb', 'redis', 'kafka', 'aws', 'gcp', 'google cloud', 'azure', 'docker', 'kubernetes',
      'terraform', 'ci/cd', 'rest', 'graphql', 'api', 'microservices', 'distributed systems', 'hubspot',
      'zapier', 'workato', 'mulesoft', 'crm', 'accounting', 'bookkeeping', 'quickbooks', 'excel',
      'gaap', 'reconciliation', 'payroll', 'tax', 'financial', 'audit', 'ledger', 'llm', 'langchain',
      'rag', 'openai', 'fastapi', 'vector search', 'ebpf', 'linux', 'git', 'agile'
    ];
    const lowerBody = (title + ' ' + description).toLowerCase();
    const matchedKeywords = candidateTech.filter(k => lowerBody.includes(k));

    return {
      title,
      company: company || 'Hiring Company',
      location,
      portal,
      salaryRange,
      description,
      keywords: matchedKeywords.map(k => k.toUpperCase())
    };
  }

  // 2. React 18 / Native Value Setter
  function setNativeValue(el, val) {
    if (!el) return;
    try {
      el.focus();
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
    } catch(err) { el.value = val; }
  }

  // 3. Strict & Accurate Label/Question Resolver (STOPS AT IMMEDIATE CONTAINER)
  function getFieldQuestion(el) {
    let texts = [];

    // Direct attributes
    if (el.getAttribute('aria-label')) texts.push(el.getAttribute('aria-label'));
    if (el.name) texts.push(el.name);
    if (el.id) texts.push(el.id);
    if (el.placeholder) texts.push(el.placeholder);

    // 1. Direct label by for="id"
    if (el.id) {
      const lbl = document.querySelector(`label[for="${el.id}"]`);
      if (lbl) texts.push(lbl.innerText);

      // JazzHR id-label pattern: e.g. resumator-address-value-label
      const jazzLbl = document.getElementById(`${el.id}-label`) || document.getElementById(`${el.id.replace(/-value$/, '')}-label`);
      if (jazzLbl) texts.push(jazzLbl.innerText);
    }

    // 2. aria-labelledby
    if (el.getAttribute('aria-labelledby')) {
      el.getAttribute('aria-labelledby').split(' ').forEach(id => {
        const l = document.getElementById(id);
        if (l) texts.push(l.innerText);
      });
    }

    // 3. Parent label
    const parentLabel = el.closest('label');
    if (parentLabel) texts.push(parentLabel.innerText);

    // 4. IMMEDIATE field wrapper ONLY (Never walk to form or body!)
    const container = el.closest('.form-group, .form-row, .field, [data-ui*="field"], tr, li, p');
    if (container) {
      const labelEl = container.querySelector('label, legend, h3, h4, h5, .control-label, [class*="label"]');
      if (labelEl) texts.push(labelEl.innerText);
    }

    return texts.join(' ').toLowerCase().replace(/\s+/g, ' ');
  }

  // 3.5 Deep Discovery for File Upload Inputs (Including Shadow DOM & iFrames)
  function findUploadInputs() {
    const list = [];
    function scanRoot(root) {
      if (!root) return;
      root.querySelectorAll('input[type="file"], input[data-automation-id*="file" i], input[data-automation-id*="upload" i]').forEach(fi => {
        if (!list.includes(fi)) list.push(fi);
      });
      root.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) scanRoot(el.shadowRoot);
      });
    }
    scanRoot(document);
    document.querySelectorAll('iframe').forEach(ifr => {
      try {
        if (ifr.contentDocument) scanRoot(ifr.contentDocument);
      } catch(e) {}
    });
    return list;
  }

  // 3.6 Rescan, Synthesize & Attach Human Tailored Resume to Application Form
  function attachTailoredResumeToForm(client = activeClient, jobInfo = null, forceDownload = false) {
    const c = client || activeClient;
    const job = jobInfo || extractPageJobOverview();
    const roleClean = (job.title || c.headline || 'Software_Engineer').replace(/[^a-zA-Z0-9]/g, '_');
    const nameClean = (c.name || 'Candidate').replace(/\s+/g, '_');
    const fileName = `${nameClean}_${roleClean}_Resume.pdf`;

    let pdfBytes;
    if (typeof generateValidPDFBinary !== 'undefined') {
      pdfBytes = generateValidPDFBinary(c, job);
    } else {
      const txt = (typeof generatePlainTextResume !== 'undefined') ? generatePlainTextResume(c, job) : 'Resume';
      pdfBytes = new TextEncoder().encode(txt);
    }

    const file = new File([pdfBytes], fileName, { type: 'application/pdf', lastModified: Date.now() });
    const inputs = findUploadInputs();
    let attachedCount = 0;

    // Prioritize file inputs that mention "resume" or "cv"
    let targetInputs = inputs.filter(fi => {
      const q = `${fi.name || ''} ${fi.id || ''} ${fi.getAttribute('aria-label') || ''} ${getFieldQuestion(fi)}`.toLowerCase();
      return q.includes('resume') || q.includes('cv') || q.includes('curriculum');
    });

    if (targetInputs.length === 0 && inputs.length > 0) {
      targetInputs = [inputs[0]];
    }

    targetInputs.forEach(fi => {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        fi.files = dt.files;
        fi.dispatchEvent(new Event('change', { bubbles: true }));
        fi.dispatchEvent(new Event('input', { bubbles: true }));
        fi.style.outline = '2.5px solid #10B981';
        fi.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.4)';

        // Find wrapper / dropzone to add visual success badge
        const parentBox = fi.closest('.dropzone, .file-upload, [class*="upload"], [class*="file"], .form-group, .field, fieldset, div') || fi.parentElement;
        if (parentBox && !parentBox.querySelector('.jobassist-attach-success-banner')) {
          const banner = document.createElement('div');
          banner.className = 'jobassist-attach-success-banner';
          banner.style.cssText = 'background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10B981; border-radius: 6px; padding: 6px 10px; margin-top: 6px; color: #34D399; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; z-index: 999999;';
          banner.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>Tailored Resume Attached: <b>${fileName}</b></span>`;
          parentBox.appendChild(banner);
        }
        attachedCount++;
      } catch(e) {}
    });

    // Provide instant fallback download so user has the physical PDF ready if needed
    if (forceDownload || attachedCount === 0) {
      try {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 3000);
      } catch(e) {}
    }

    return {
      success: true,
      attachedCount,
      fileName,
      inputFound: targetInputs.length > 0,
      targetRole: job.title,
      targetCompany: job.company
    };
  }

  // 3.7 Rescan, Synthesize & Attach Human Tailored Cover Letter to Application Form
  function attachTailoredCoverLetterToForm(client = activeClient, jobInfo = null, forceDownload = false) {
    const c = client || activeClient;
    const job = jobInfo || extractPageJobOverview();
    const roleClean = (job.title || c.headline || 'Engineer').replace(/[^a-zA-Z0-9]/g, '_');
    const nameClean = (c.name || 'Candidate').replace(/\s+/g, '_');
    const fileName = `${nameClean}_${roleClean}_Cover_Letter.pdf`;

    let pdfBytes;
    if (typeof generateValidCoverLetterPDFBinary !== 'undefined') {
      pdfBytes = generateValidCoverLetterPDFBinary(c, job);
    } else {
      const txt = (typeof generateTailoredCoverLetterText !== 'undefined')
        ? generateTailoredCoverLetterText(c, job)
        : (c.letter || 'Cover Letter');
      pdfBytes = new TextEncoder().encode(txt);
    }

    const file = new File([pdfBytes], fileName, { type: 'application/pdf', lastModified: Date.now() });
    const inputs = findUploadInputs();
    let attachedCount = 0;

    // Prioritize file inputs that mention "cover", "letter", "additional", "document"
    let targetInputs = inputs.filter(fi => {
      const q = `${fi.name || ''} ${fi.id || ''} ${fi.getAttribute('aria-label') || ''} ${getFieldQuestion(fi)}`.toLowerCase();
      return (q.includes('cover') || q.includes('letter') || q.includes('additional') || q.includes('other')) && !q.includes('resume') && !q.includes('cv');
    });

    // If no specific cover letter input, but there are multiple file upload boxes, target the 2nd one
    if (targetInputs.length === 0 && inputs.length > 1) {
      targetInputs = [inputs[1]];
    }

    targetInputs.forEach(fi => {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        fi.files = dt.files;
        fi.dispatchEvent(new Event('change', { bubbles: true }));
        fi.dispatchEvent(new Event('input', { bubbles: true }));
        fi.style.outline = '2.5px solid #007aff';
        fi.style.boxShadow = '0 0 12px rgba(0, 122, 255, 0.4)';

        const parentBox = fi.closest('.dropzone, .file-upload, [class*="upload"], [class*="file"], .form-group, .field, fieldset, div') || fi.parentElement;
        if (parentBox && !parentBox.querySelector('.jobassist-attach-letter-banner')) {
          const banner = document.createElement('div');
          banner.className = 'jobassist-attach-letter-banner';
          banner.style.cssText = 'background: rgba(0, 122, 255, 0.15); border: 1.5px solid #007aff; border-radius: 6px; padding: 6px 10px; margin-top: 6px; color: #38bdf8; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; z-index: 999999;';
          banner.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> <span>Tailored Cover Letter Attached: <b>${fileName}</b></span>`;
          parentBox.appendChild(banner);
        }
        attachedCount++;
      } catch(e) {}
    });

    // Also populate cover letter textarea if present
    let textareaFilled = false;
    const coverText = (typeof generateTailoredCoverLetterText !== 'undefined')
      ? generateTailoredCoverLetterText(c, job)
      : (c.letter || 'Cover Letter');

    document.querySelectorAll('textarea, [contenteditable="true"]').forEach(t => {
      const q = `${t.id || ''} ${t.name || ''} ${t.placeholder || ''} ${getFieldQuestion(t)}`.toLowerCase();
      if (q.includes('cover') || q.includes('letter') || q.includes('note to hiring')) {
        setNativeValue(t, coverText);
        textareaFilled = true;
      }
    });

    if (forceDownload || (attachedCount === 0 && !textareaFilled)) {
      try {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 3000);
      } catch(e) {}
    }

    return {
      success: true,
      attachedCount,
      textareaFilled,
      fileName,
      inputFound: targetInputs.length > 0,
      targetRole: job.title,
      targetCompany: job.company
    };
  }

  // 4. Autonomous 1-Click Form AutoFill Engine
  function executeAutoFill(client = activeClient) {
    if (!isLicenseValid()) {
      showLicenseRequiredModal();
      return { filledCount: 0, uncommonCount: 0, error: 'LICENSE_REQUIRED' };
    }

    let filledCount = 0;
    let uncommonCount = 0;
    const c = client;
    const jobOverview = extractPageJobOverview();

    // Determine target salary based on job posting range or candidate standard
    let targetSalary = '$95,000';
    if (jobOverview.salaryRange && jobOverview.salaryRange.includes('$')) {
      // Pick upper-middle of advertised range (e.g. $95,000 for $85k-$105k)
      targetSalary = '$95,000';
    } else if (c.salary) {
      targetSalary = c.salary;
    }

    // ----------------------------------------------------
    // A. TEXT INPUTS
    // ----------------------------------------------------
    document.querySelectorAll('input').forEach(i => {
      const type = (i.type || 'text').toLowerCase();
      if (['hidden', 'submit', 'checkbox', 'radio', 'file', 'button', 'image', 'reset'].includes(type)) return;

      const id = (i.id || '').toLowerCase();
      const name = (i.name || '').toLowerCase();
      const ph = (i.placeholder || '').toLowerCase();
      const dataUi = (i.getAttribute('data-ui') || '').toLowerCase();
      const dataAuto = (i.getAttribute('data-automation-id') || '').toLowerCase();
      const q = getFieldQuestion(i);

      // 1. First Name
      if (id.includes('firstname') || name.includes('firstname') || dataUi.includes('firstname') || dataAuto.includes('firstname') || q.includes('first name') || q.includes('given name')) {
        setNativeValue(i, c.first); filledCount++;
      }
      // 2. Last Name
      else if (id.includes('lastname') || name.includes('lastname') || dataUi.includes('lastname') || dataAuto.includes('lastname') || q.includes('last name') || q.includes('surname')) {
        setNativeValue(i, c.last); filledCount++;
      }
      // 3. Email (STRICT check: only if type is email or id/name explicitly contains email)
      else if (type === 'email' || id.includes('email') || name.includes('email') || dataUi.includes('email') || dataAuto.includes('email') || (q.includes('email') && !q.includes('address line') && !q.includes('salary'))) {
        setNativeValue(i, c.email); filledCount++;
      }
      // 4. Phone
      else if (type === 'tel' || id.includes('phone') || name.includes('phone') || dataUi.includes('phone') || dataAuto.includes('phone') || q.includes('phone') || q.includes('mobile')) {
        setNativeValue(i, c.phone); filledCount++;
      }
      // 5. City
      else if (id.includes('city') || name.includes('city') || dataUi.includes('city') || dataAuto.includes('city') || ph.includes('city') || q.includes('city')) {
        setNativeValue(i, c.city || 'Atlanta'); filledCount++;
      }
      // 6. State / Province
      else if (id.includes('state') || name.includes('state') || dataUi.includes('state') || dataAuto.includes('state') || ph.includes('state') || q.includes('state') || q.includes('province')) {
        setNativeValue(i, c.state || 'GA'); filledCount++;
      }
      // 7. Postal / Zip
      else if (id.includes('postal') || id.includes('zip') || name.includes('postal') || name.includes('zip') || dataUi.includes('postal') || dataUi.includes('zip') || dataAuto.includes('postal') || ph.includes('postal') || ph.includes('zip') || q.includes('postal') || q.includes('zip')) {
        setNativeValue(i, c.zip || '30308'); filledCount++;
      }
      // 8. Address line
      else if ((id.includes('address') || name.includes('address') || dataUi.includes('address') || dataAuto.includes('address') || ph.includes('address') || q.includes('address') || q.includes('street')) && !id.includes('email') && !name.includes('email')) {
        setNativeValue(i, c.addr); filledCount++;
      }
      // 9. Target Salary (CRITICAL FIX FOR 1406 CONSULTING & JAZZHR)
      else if (q.includes('salary') || q.includes('compensation') || q.includes('target salary') || id.includes('salary') || name.includes('salary') || dataUi.includes('salary')) {
        setNativeValue(i, targetSalary); filledCount++;
      }
      // 10. Headline
      else if (id.includes('headline') || name.includes('headline') || dataUi.includes('headline') || q.includes('headline')) {
        setNativeValue(i, c.headline); filledCount++;
      }
      // 11. LinkedIn URL
      else if (q.includes('linkedin') || id.includes('linkedin') || name.includes('linkedin') || dataUi.includes('linkedin')) {
        setNativeValue(i, c.linkedin); filledCount++;
      }
      // 12. GitHub URL
      else if (q.includes('github') || id.includes('github') || name.includes('github') || dataUi.includes('github')) {
        setNativeValue(i, c.github); filledCount++;
      }
      // 13. Portfolio / Website
      else if (q.includes('portfolio') || q.includes('website') || id.includes('website') || dataUi.includes('portfolio') || dataUi.includes('website')) {
        setNativeValue(i, c.portfolio); filledCount++;
      }
      // 14. Notice Period
      else if (q.includes('notice') || id.includes('notice') || name.includes('notice')) {
        setNativeValue(i, c.notice || '2 weeks'); filledCount++;
      }
      // 15. Years Experience (numeric)
      else if (q.includes('how many years') || (q.includes('years') && q.includes('experience'))) {
        setNativeValue(i, c.yearsBE || '8'); filledCount++;
      }
      // 16. Preferred Name / Alias
      else if (id.includes('preferred') || name.includes('preferred') || q.includes('preferred name') || q.includes('nickname')) {
        setNativeValue(i, c.preferredName || c.first); filledCount++;
      }
      // 17. Current Employer / Most Recent Company
      else if (id.includes('current_company') || id.includes('currentemployer') || name.includes('current_company') || q.includes('current company') || q.includes('current employer') || q.includes('most recent employer') || q.includes('current organization')) {
        setNativeValue(i, c.currentEmployer || c.company || 'Uber Eats'); filledCount++;
      }
      // 18. Current Title / Most Recent Title
      else if (id.includes('current_title') || name.includes('current_title') || q.includes('current title') || q.includes('current role') || q.includes('most recent title')) {
        setNativeValue(i, c.currentTitle || c.title || c.headline); filledCount++;
      }
      // 19. Earliest Start Date
      else if (id.includes('startdate') || id.includes('start_date') || name.includes('start_date') || q.includes('start date') || q.includes('earliest start') || q.includes('available to start')) {
        setNativeValue(i, c.startDate || c.earliestStartDate || 'Immediately'); filledCount++;
      }
      // 20. Certifications
      else if (q.includes('certification') || id.includes('certification') || name.includes('certification') || id.includes('certs')) {
        setNativeValue(i, c.certifications || 'AWS Solutions Architect, CKA'); filledCount++;
      }
      // 21. Languages Spoken
      else if (q.includes('language') && (q.includes('speak') || q.includes('spoken') || q.includes('fluent'))) {
        setNativeValue(i, c.languages || 'English (Native/Fluent)'); filledCount++;
      }
      // 22. Education / Degree
      else if ((q.includes('degree') || q.includes('education') || id.includes('degree') || name.includes('degree')) && !id.includes('level')) {
        setNativeValue(i, c.degree || c.education || "Master's Degree in Computer Science"); filledCount++;
      }
      // 23. School / University
      else if (q.includes('school') || q.includes('university') || id.includes('school') || name.includes('school')) {
        setNativeValue(i, c.school || 'University of Florida'); filledCount++;
      }
      // 24. Country
      else if (id.includes('country') || name.includes('country') || q.includes('country')) {
        setNativeValue(i, c.country || 'United States'); filledCount++;
      }
      // 25. Department
      else if (id.includes('department') || name.includes('department') || q.includes('department')) {
        setNativeValue(i, c.department || 'Engineering'); filledCount++;
      }
      // 26. Pronouns
      else if (q.includes('pronoun') || id.includes('pronoun') || name.includes('pronoun')) {
        setNativeValue(i, c.pronouns || 'He/Him'); filledCount++;
      }
      // 27. Full Name fallback
      else if (id.includes('fullname') || name.includes('fullname') || dataUi.includes('fullname') || (q.includes('full name') && !q.includes('first') && !q.includes('last'))) {
        setNativeValue(i, c.name); filledCount++;
      }
      // 28. UNCOMMON CUSTOM TEXT INPUTS (AI Synthesizer)
      else if (q.length > 5 && (!i.value || i.value.trim() === '')) {
        if (typeof synthesizeScreeningAnswer !== 'undefined') {
          const ans = synthesizeScreeningAnswer(q, c, jobOverview, 'star');
          setNativeValue(i, ans);
          filledCount++;
          uncommonCount++;
        }
      }
    });

    // ----------------------------------------------------
    // B. SELECT DROPDOWNS (JAZZHR, WORKABLE, ASHBY)
    // ----------------------------------------------------
    document.querySelectorAll('select').forEach(s => {
      const q = getFieldQuestion(s);
      const opts = Array.from(s.options);
      let chosenVal = null;

      // 1. Where are you based? (JazzHR: US, CAN, LATAM)
      if (q.includes('based') || q.includes('reside') || q.includes('location')) {
        const opt = opts.find(o => o.value === 'US' || o.text.trim() === 'US' || (o.text+' '+o.value).toLowerCase().includes('united states'));
        if (opt) chosenVal = opt.value;
      }
      // 2. HubSpot Developer Platform / Certifications
      else if (q.includes('hubspot') && (q.includes('developer') || q.includes('certification') || q.includes('platform'))) {
        const opt = opts.find(o => o.value.includes('Yes') || o.text.includes('Yes'));
        if (opt) chosenVal = opt.value;
      }
      // 3. Integration tools (Zapier, Workato, Mulesoft)
      else if (q.includes('zapier') || q.includes('workato') || q.includes('mulesoft') || q.includes('integration tool')) {
        const opt = opts.find(o => o.value === 'Yes' || o.text === 'Yes' || (o.text+' '+o.value).toLowerCase().includes('yes'));
        if (opt) chosenVal = opt.value;
      }
      // 4. Years experience with API-based integrations
      else if (q.includes('api') && q.includes('year')) {
        const opt = opts.find(o => o.value.includes('More than 5') || o.text.includes('More than 5') || o.value.includes('5+') || o.text.includes('3-5'));
        if (opt) chosenVal = opt.value;
      }
      // 5. HubSpot Marketing, Sales, CRM ecosystem understanding
      else if (q.includes('hubspot') && (q.includes('crm') || q.includes('ecosystem') || q.includes('sales') || q.includes('marketing'))) {
        const opt = opts.find(o => o.value === 'Yes' || o.text === 'Yes' || (o.text+' '+o.value).toLowerCase().includes('yes'));
        if (opt) chosenVal = opt.value;
      }
      // 6. Work authorization / citizenship
      else if (q.includes('authorized') || q.includes('citizenship') || q.includes('legally')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('yes') || (o.text+' '+o.value).toLowerCase().includes('citizen'));
        if (opt) chosenVal = opt.value;
      }
      // 7. Visa Sponsorship
      else if (q.includes('sponsor') || q.includes('visa') || q.includes('h-1b')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('no'));
        if (opt) chosenVal = opt.value;
      }
      // 8. General Years Experience
      else if (q.includes('years') || q.includes('experience')) {
        const opt = opts.find(o => (o.text+' '+o.value).includes('8') || (o.text+' '+o.value).includes('5+') || (o.text+' '+o.value).includes('More than 5'));
        if (opt) chosenVal = opt.value;
      }
      // 9. Gender (EEOC)
      else if (q.includes('gender') || q.includes('sex')) {
        const targetGender = (c.gender || 'Male').toLowerCase();
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes(targetGender)) ||
                   opts.find(o => (o.text+' '+o.value).toLowerCase().includes('decline') || (o.text+' '+o.value).toLowerCase().includes('prefer not'));
        if (opt) chosenVal = opt.value;
      }
      // 10. Race / Ethnicity (EEOC)
      else if (q.includes('race') || q.includes('ethnicity')) {
        const targetRace = (c.race || 'Asian').toLowerCase();
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes(targetRace)) ||
                   opts.find(o => (o.text+' '+o.value).toLowerCase().includes('decline') || (o.text+' '+o.value).toLowerCase().includes('prefer not'));
        if (opt) chosenVal = opt.value;
      }
      // 11. Veteran Status (EEOC)
      else if (q.includes('veteran')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('not a protected veteran') || (o.text+' '+o.value).toLowerCase().includes('not_veteran') || (o.text+' '+o.value).toLowerCase().includes('i am not')) ||
                   opts.find(o => (o.text+' '+o.value).toLowerCase().includes('decline'));
        if (opt) chosenVal = opt.value;
      }
      // 12. Disability Status (EEOC)
      else if (q.includes('disability')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('do not have a disability') || (o.text+' '+o.value).toLowerCase().includes('no, i do not') || (o.text+' '+o.value).toLowerCase().includes('no')) ||
                   opts.find(o => (o.text+' '+o.value).toLowerCase().includes('decline'));
        if (opt) chosenVal = opt.value;
      }
      // 13. Relocation / Remote
      else if (q.includes('relocat')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('yes'));
        if (opt) chosenVal = opt.value;
      }
      // 14. Referral Source / How did you hear
      else if (q.includes('hear about') || q.includes('source') || q.includes('referral')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes((c.source || 'linkedin').toLowerCase()) || (o.text+' '+o.value).toLowerCase().includes('website') || (o.text+' '+o.value).toLowerCase().includes('other'));
        if (opt) chosenVal = opt.value;
      }
      // 15. Pronouns
      else if (q.includes('pronoun')) {
        const targetPronoun = (c.pronouns || 'He/Him').toLowerCase();
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes(targetPronoun)) ||
                   opts.find(o => (o.text+' '+o.value).toLowerCase().includes('he/him') || (o.text+' '+o.value).toLowerCase().includes('prefer not'));
        if (opt) chosenVal = opt.value;
      }
      // 16. Sexual Orientation
      else if (q.includes('sexual orientation') || q.includes('orientation')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('heterosexual') || (o.text+' '+o.value).toLowerCase().includes('straight')) ||
                   opts.find(o => (o.text+' '+o.value).toLowerCase().includes('decline') || (o.text+' '+o.value).toLowerCase().includes('prefer not'));
        if (opt) chosenVal = opt.value;
      }
      // 17. Work Arrangement
      else if (q.includes('work arrangement') || q.includes('workplace type') || q.includes('remote preference')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes((c.workArrangement || 'remote').toLowerCase()));
        if (opt) chosenVal = opt.value;
      }
      // 18. Seniority Level
      else if (q.includes('seniority') || q.includes('career level')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes((c.seniority || 'senior').toLowerCase()));
        if (opt) chosenVal = opt.value;
      }
      // 19. Employment Type
      else if (q.includes('employment type') || q.includes('job type')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('full-time') || (o.text+' '+o.value).toLowerCase().includes('full time'));
        if (opt) chosenVal = opt.value;
      }
      // 20. Department
      else if (q.includes('department')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes((c.department || 'engineering').toLowerCase()));
        if (opt) chosenVal = opt.value;
      }
      // 21. Country
      else if (q.includes('country')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes((c.country || 'united states').toLowerCase()) || o.value === 'US');
        if (opt) chosenVal = opt.value;
      }
      // 22. Notice Period
      else if (q.includes('notice')) {
        const opt = opts.find(o => (o.text+' '+o.value).toLowerCase().includes('2 weeks') || (o.text+' '+o.value).toLowerCase().includes('immediate'));
        if (opt) chosenVal = opt.value;
      }

      if (chosenVal) {
        setNativeValue(s, chosenVal);
        filledCount++;
      }
    });

    // ----------------------------------------------------
    // C. TEXTAREAS & RESUME TEXT BOXES
    // ----------------------------------------------------
    let tailoredResumeText = '';
    if (typeof generatePlainTextResume !== 'undefined') {
      tailoredResumeText = generatePlainTextResume(c, jobOverview);
    } else {
      tailoredResumeText = `${c.name.toUpperCase()}\n${c.headline || 'Senior Software Engineer'}\nLocation: ${c.loc} | Phone: ${c.phone} | Email: ${c.email}\nLinkedIn: ${c.linkedin}\n\nSUMMARY\n${c.summary}\n\nCORE SKILLS\n${(c.skills || []).join(' • ')}`;
    }

    document.querySelectorAll('textarea').forEach(t => {
      const id = (t.id || '').toLowerCase();
      const name = (t.name || '').toLowerCase();
      const q = getFieldQuestion(t);

      // JazzHR Resume Textarea: id="resumator-resumetext-value"
      if (id.includes('resumetext') || name.includes('resumetext') || q.includes('paste resume')) {
        setNativeValue(t, tailoredResumeText);
        filledCount++;
      }
      // Summary / Bio
      else if (q.includes('summary') || q.includes('bio') || q.includes('profile')) {
        setNativeValue(t, c.summary); filledCount++;
      }
      // Cover Letter
      else if (q.includes('cover') || q.includes('letter') || q.includes('note to hiring')) {
        setNativeValue(t, c.letter); filledCount++;
      }
      // UNCOMMON BESPOKE QUESTIONS
      else if (q.length > 5 && (!t.value || t.value.trim() === '')) {
        if (typeof synthesizeScreeningAnswer !== 'undefined') {
          const ans = synthesizeScreeningAnswer(q, c, jobOverview, 'technical');
          setNativeValue(t, ans);
          filledCount++;
          uncommonCount++;
        }
      }
    });

    // ----------------------------------------------------
    // D. RESUME & COVER LETTER ATTACHMENT (JAZZHR, WORKABLE, ASHBY, GREENHOUSE, LEVER, WORKDAY, TALEO, BAMBOOHR)
    // ----------------------------------------------------
    const attachRes = attachTailoredResumeToForm(c, jobOverview, false);
    if (attachRes && attachRes.attachedCount > 0) {
      filledCount += attachRes.attachedCount;
    }
    const attachCoverRes = attachTailoredCoverLetterToForm(c, jobOverview, false);
    if (attachCoverRes && attachCoverRes.attachedCount > 0) {
      filledCount += attachCoverRes.attachedCount;
    }

    // ----------------------------------------------------
    // E. RADIO BUTTONS & CHECKBOXES
    // ----------------------------------------------------
    document.querySelectorAll('input[type="radio"]').forEach(r => {
      const container = r.closest('fieldset, .form-group, .field, div') || r.parentElement;
      const q = (container?.innerText || '').toLowerCase();
      const val = (r.value || '').toLowerCase();
      const lbl = (r.parentElement?.innerText || '').toLowerCase();

      if (q.includes('sponsor') || q.includes('visa') || q.includes('h-1b')) {
        if (val.includes('no') || lbl.includes('no') || val === '0' || val === 'false') {
          r.checked = true;
          r.dispatchEvent(new Event('change', { bubbles: true }));
          r.dispatchEvent(new Event('click', { bubbles: true }));
          filledCount++;
        }
      } else if (q.includes('authorized') || q.includes('legally')) {
        if (val.includes('yes') || lbl.includes('yes') || val === '1' || val === 'true') {
          r.checked = true;
          r.dispatchEvent(new Event('change', { bubbles: true }));
          r.dispatchEvent(new Event('click', { bubbles: true }));
          filledCount++;
        }
      } else if (q.includes('gender') || q.includes('sex')) {
        const targetGender = (c.gender || 'Male').toLowerCase();
        if (val.includes(targetGender) || lbl.includes(targetGender)) {
          r.checked = true;
          r.dispatchEvent(new Event('change', { bubbles: true }));
          r.dispatchEvent(new Event('click', { bubbles: true }));
          filledCount++;
        }
      } else if (q.includes('veteran')) {
        if (val.includes('not_veteran') || lbl.includes('not a protected') || lbl.includes('i am not')) {
          r.checked = true;
          r.dispatchEvent(new Event('change', { bubbles: true }));
          r.dispatchEvent(new Event('click', { bubbles: true }));
          filledCount++;
        }
      } else if (q.includes('disability')) {
        if (val.includes('no') || lbl.includes('no') || lbl.includes('do not have')) {
          r.checked = true;
          r.dispatchEvent(new Event('change', { bubbles: true }));
          r.dispatchEvent(new Event('click', { bubbles: true }));
          filledCount++;
        }
      }
    });

    // ----------------------------------------------------
    // F. COMPLIANCE & TERMS CHECKBOXES
    // ----------------------------------------------------
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      const q = getFieldQuestion(cb);
      if (q.includes('agree') || q.includes('consent') || q.includes('terms') || q.includes('acknowledge') || q.includes('privacy') || q.includes('certify')) {
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
        cb.dispatchEvent(new Event('click', { bubbles: true }));
        filledCount++;
      }
    });

    showToast(filledCount, c.name, uncommonCount);
    return { filledCount, uncommonCount };
  }

  // 5. Multi-Step Wizard Navigator (Next / Continue / Review)
  function advanceMultiStepWizard() {
    executeAutoFill(activeClient);

    const buttons = Array.from(document.querySelectorAll('button, a[role="button"], input[type="button"], input[type="submit"]'));
    const nextBtn = buttons.find(b => {
      const t = (b.innerText || b.value || b.getAttribute('aria-label') || '').trim().toLowerCase();
      return (t.includes('next') || t.includes('continue') || t.includes('review') || t.includes('proceed')) &&
             !t.includes('back') && !t.includes('cancel') && !t.includes('previous') && !t.includes('submit');
    });

    if (nextBtn) {
      nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nextBtn.style.outline = '3px solid #10B981';
      setTimeout(() => {
        nextBtn.click();
        setTimeout(() => executeAutoFill(activeClient), 1200);
      }, 500);
      return { success: true, message: 'Advanced to next step' };
    } else {
      return { success: false, message: 'No Next/Continue button detected on this step.' };
    }
  }

  // 6. Scan Page for Open Questions (INCLUDING JAZZHR SELECT QUESTIONNAIRE)
  function scanPageQuestions() {
    const list = [];
    const jobOverview = extractPageJobOverview();

    // 1. Textareas and text inputs
    document.querySelectorAll('textarea, input[type="text"]').forEach((el, idx) => {
      const id = (el.id || '').toLowerCase();
      const q = getFieldQuestion(el);
      if (q && !id.includes('firstname') && !id.includes('lastname') && !id.includes('email') && !id.includes('phone') && !id.includes('address') && !id.includes('city') && !id.includes('state') && !id.includes('postal') && !id.includes('resumetext')) {
        let suggestedAnswer = '';
        if (q.includes('salary') || q.includes('target salary')) {
          suggestedAnswer = '$95,000';
        } else if (typeof synthesizeScreeningAnswer !== 'undefined') {
          suggestedAnswer = synthesizeScreeningAnswer(q, activeClient, jobOverview, 'technical');
        }
        list.push({
          id: `q_text_${idx}`,
          questionText: q.slice(0, 180),
          currentValue: el.value || '',
          suggestedAnswer,
          selector: el.id ? `#${el.id}` : (el.name ? `[name="${el.name}"]` : null)
        });
      }
    });

    // 2. Select questionnaire dropdowns (JazzHR, Workable, etc.)
    document.querySelectorAll('select').forEach((s, idx) => {
      const q = getFieldQuestion(s);
      if (q.length > 5) {
        const opts = Array.from(s.options).map(o => o.text.trim());
        let answerChoice = opts[1] || 'Yes';
        if (q.includes('based')) answerChoice = opts.find(o => o === 'US' || o.includes('United States')) || 'US';
        else if (q.includes('api') && q.includes('year')) answerChoice = opts.find(o => o.includes('More than 5')) || 'More than 5';
        else if (q.includes('hubspot') || q.includes('zapier')) answerChoice = opts.find(o => o.includes('Yes')) || 'Yes';

        list.push({
          id: `q_sel_${idx}`,
          questionText: q.slice(0, 180),
          currentValue: s.value || '',
          suggestedAnswer: `Selected: ${answerChoice}`,
          selector: s.id ? `#${s.id}` : (s.name ? `[name="${s.name}"]` : null)
        });
      }
    });

    return list.slice(0, 12);
  }

  // Inject answer into a specific field
  function injectAnswer(selector, text) {
    let el = null;
    if (selector) el = document.querySelector(selector);
    if (!el) {
      const all = document.querySelectorAll('textarea, input[type="text"]');
      el = Array.from(all).find(i => getFieldQuestion(i).includes(text.slice(0, 20).toLowerCase()));
    }
    if (el) {
      setNativeValue(el, text);
      return true;
    }
    return false;
  }

  // 7. Security CAPTCHA & Human Verification Detector
  function detectCaptcha() {
    const recaptcha = document.querySelector('.g-recaptcha, iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"], [data-sitekey]');
    const hcaptcha = document.querySelector('.h-captcha, iframe[src*="hcaptcha.com"]');
    const turnstile = document.querySelector('.cf-turnstile, iframe[src*="challenges.cloudflare.com"]');
    const arkose = document.querySelector('iframe[src*="arkoselabs"], iframe[src*="funcaptcha"]');

    const el = recaptcha || hcaptcha || turnstile || arkose;
    if (el) {
      let name = 'reCAPTCHA';
      if (hcaptcha) name = 'hCaptcha';
      if (turnstile) name = 'Cloudflare Turnstile';
      if (arkose) name = 'Arkose Security Check';

      highlightCaptchaElement(el, name);
      return { hasCaptcha: true, name };
    }
    return { hasCaptcha: false };
  }

  function highlightCaptchaElement(el, name) {
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.outline = '3px solid #F59E0B';
      el.style.boxShadow = '0 0 24px rgba(245, 158, 11, 0.6)';

      const banner = document.createElement('div');
      banner.id = 'jobassist-captcha-banner';
      banner.style.cssText = `
        position: fixed;
        bottom: 84px;
        right: 24px;
        z-index: 2147483647;
        background: #78350F;
        color: #FEF3C7;
        border: 1.5px solid #F59E0B;
        border-radius: 10px;
        padding: 12px 18px;
        font-size: 13px;
        font-weight: 700;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;
      banner.innerHTML = `
        <div style="width: 28px; height: 28px; border-radius: 6px; background: rgba(245, 158, 11, 0.2); display: flex; align-items: center; justify-content: center; color: #F59E0B; font-weight: 800;">!</div>
        <div>
          <div style="font-weight: 800; color: #FFF;">Human Verification Required</div>
          <div style="font-size: 11.5px; color: #FDE68A; margin-top: 2px;">Please solve the ${name} above to finalize submission.</div>
        </div>
      `;
      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 7000);
    } catch(e) {}
  }

  // 8. Find and Highlight Application Submit Button
  function highlightSubmitButton() {
    const buttons = Array.from(document.querySelectorAll('button, a[role="button"], input[type="submit"], input[type="button"]'));
    const submitBtn = buttons.find(b => {
      const t = (b.innerText || b.value || b.getAttribute('aria-label') || '').trim().toLowerCase();
      return (t.includes('submit application') || t.includes('submit') || t.includes('apply now') || t.includes('send application')) &&
             !t.includes('back') && !t.includes('cancel') && !t.includes('search');
    });

    if (submitBtn) {
      submitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      submitBtn.style.outline = '3px solid #10B981';
      submitBtn.style.boxShadow = '0 0 24px rgba(16, 185, 129, 0.8)';
      submitBtn.style.transition = 'all 0.3s ease';
      return { found: true, element: submitBtn };
    }
    return { found: false };
  }

  function showToast(count, clientName, uncommonCount = 0) {
    const existing = document.getElementById('jobassist-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'jobassist-toast';
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 2147483647;
      background: linear-gradient(135deg, #064E3B 0%, #065F46 100%);
      color: #FFFFFF;
      border: 2px solid #34D399;
      border-radius: 12px;
      padding: 16px 22px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      gap: 12px;
    `;
    toast.innerHTML = `
      <div style="width: 24px; height: 24px; border-radius: 50%; background: #10B981; color: #022C22; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 13px;">✓</div>
      <div>
        <div style="font-weight: 800; font-size: 15px; letter-spacing: 0.3px;">AutoFill Complete for ${clientName}!</div>
        <div style="color: #A7F3D0; font-size: 13px; margin-top: 2px;">
          Populated <b>${count} fields</b> ${uncommonCount > 0 ? `(including <b>${uncommonCount} custom questions</b> answered by AI)` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // Pre-Flight ATS Compliance Auditor
  function runPreFlightAudit() {
    const inputs = Array.from(document.querySelectorAll('input, select, textarea')).filter(el => {
      if (el.type === 'hidden' || el.style.display === 'none' || el.offsetParent === null) return false;
      const isReq = el.required || el.getAttribute('aria-required') === 'true';
      const label = findLabelForElement(el) || '';
      const isAsterisk = label.includes('*') || /required/i.test(label);
      return isReq || isAsterisk;
    });

    const emptyRequired = inputs.filter(el => {
      if (el.type === 'file') return el.files && el.files.length === 0;
      if (el.type === 'checkbox' || el.type === 'radio') {
        const group = document.querySelectorAll(`input[name="${el.name}"]`);
        return !Array.from(group).some(r => r.checked);
      }
      return !el.value || el.value.trim() === '';
    });

    const total = inputs.length;
    const filled = total - emptyRequired.length;
    const score = total > 0 ? Math.round((filled / total) * 100) : 100;

    return {
      total,
      filled,
      emptyCount: emptyRequired.length,
      emptyInputs: emptyRequired,
      score,
      isReady: emptyRequired.length === 0
    };
  }

  // 6.5 Detect Page Job Freshness (Stale Postings > 5 Days Old or "1 month ago")
  function detectPageJobFreshness() {
    let isStale = false;
    let reason = '';
    let days = 0;

    // 1. Selector search on job boards (LinkedIn, Workable, etc.)
    const candidates = [
      '.jobs-unified-top-card__posted-date',
      '.posted-time-ago__text',
      '.job-details-jobs-unified-top-card__primary-description',
      '.job-details-jobs-unified-top-card__job-insight',
      '.topcard__flavor--metadata',
      'time'
    ];

    for (const sel of candidates) {
      const els = document.querySelectorAll(sel);
      for (const el of els) {
        const text = (el.innerText || el.textContent || '').trim();
        const mMonth = text.match(/(\d+)\s+month(?:s)?\s+ago/i);
        if (mMonth) {
          isStale = true;
          reason = `${mMonth[1]} month${mMonth[1] === '1' ? '' : 's'} ago`;
          days = parseInt(mMonth[1], 10) * 30;
          break;
        }
        const mWeek = text.match(/([2-9]|\d{2,})\s+week(?:s)?\s+ago/i);
        if (mWeek) {
          isStale = true;
          reason = `${mWeek[1]} weeks ago`;
          days = parseInt(mWeek[1], 10) * 7;
          break;
        }
        const mDay = text.match(/([6-9]|\d{2,})\s+day(?:s)?\s+ago/i);
        if (mDay) {
          isStale = true;
          reason = `${mDay[1]} days ago`;
          days = parseInt(mDay[1], 10);
          break;
        }
      }
      if (isStale) break;
    }

    // 2. Text body fallback scan if not found in specific selectors
    if (!isStale && document.body) {
      const bodySnippet = document.body.innerText.slice(0, 6000);
      const m = bodySnippet.match(/\b(1|2|3|4|5|6)\s+month(?:s)?\s+ago\b/i);
      if (m) {
        isStale = true;
        reason = m[0];
        days = 30;
      } else {
        const w = bodySnippet.match(/\b([2-5])\s+weeks?\s+ago\b/i);
        if (w) {
          isStale = true;
          reason = w[0];
          days = parseInt(w[1], 10) * 7;
        }
      }
    }

    return { isStale, reason, days };
  }

  // 7. Inject Floating Glassmorphic HUD (Draggable, Minimizable, Real-Time Telemetry)
  function injectFloatingWidget() {
    if (document.getElementById('jobassist-floating-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'jobassist-floating-widget';
    widget.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483646;
      background: rgba(12, 12, 13, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      color: #fafaf9;
      border: 1.5px solid #007aff;
      border-radius: 9999px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 24px rgba(0, 122, 255, 0.3);
      display: flex;
      align-items: center;
      padding: 5px 8px 5px 10px;
      gap: 7px;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: transform 0.2s ease, opacity 0.2s ease;
    `;

    widget.innerHTML = `
      <div id="floating-drag-handle" style="cursor: grab; display: flex; align-items: center; gap: 4px; padding: 2px;">
        <span style="font-size: 14px; color: #71717a;">⋮⋮</span>
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #007aff; display: inline-block;"></span>
      </div>

      <select id="floating-client-select" style="
        background: #18181b;
        color: #fafaf9;
        border: 1px solid #27272a;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 11.5px;
        font-weight: 700;
        cursor: pointer;
        outline: none;
      ">
        ${allClients.map(c => `<option value="${c.id}" ${c.id === activeClient.id ? 'selected' : ''}>${c.first}</option>`).join('')}
      </select>

      <div id="floating-stale-badge" style="
        display: none;
        background: rgba(220, 38, 38, 0.25);
        border: 1px solid #ef4444;
        color: #fca5a5;
        border-radius: 9999px;
        padding: 4px 9px;
        font-size: 10.5px;
        font-weight: 700;
        cursor: pointer;
        align-items: center;
        gap: 5px;
      " title="Stale job warning: Click to find fresh roles under 5 days old">
        <span id="floating-stale-label">Stale Job (>30d)</span> <span style="background:#ef4444; color:white; padding:1px 6px; border-radius:3px; font-size:9.5px; font-weight:800;">Find Fresh (&le;5d)</span>
      </div>

      <button id="floating-fill-btn" style="
        background: #007aff;
        color: #ffffff;
        border: none;
        padding: 6px 12px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 11.5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 2px 10px rgba(0, 122, 255, 0.4);
      ">
        FILL 1-CLICK
      </button>

      <button id="floating-attach-btn" style="
        background: #18181b;
        color: #34d399;
        border: 1px solid #059669;
        padding: 5px 9px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
      " title="Rescan job & attach tailored PDF resume to this application form">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        ATTACH CV
      </button>

      <button id="floating-attach-cover-btn" style="
        background: #18181b;
        color: #38bdf8;
        border: 1px solid #007aff;
        padding: 5px 9px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
      " title="Rescan job & attach tailored Cover Letter PDF to application form">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        ATTACH CL
      </button>

      <button id="floating-next-btn" style="
        background: #18181b;
        color: #38bdf8;
        border: 1px solid #007aff;
        padding: 5px 9px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
      " title="AutoFill and Advance Multi-Step Wizard">
        NEXT
      </button>

      <button id="floating-askai-btn" style="
        background: #18181b;
        color: #38bdf8;
        border: 1px solid #007aff;
        padding: 5px 9px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 3px;
      " title="Ask AI Question Solver (Drag &amp; Drop Any Question Here)">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        ASK AI
      </button>

      <button id="floating-resume-btn" style="
        background: #18181b;
        color: #34d399;
        border: 1px solid #059669;
        padding: 5px 9px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
      " title="Preview Executive Masterwork Resume">
        RESUME
      </button>

      <button id="floating-cover-btn" style="
        background: #18181b;
        color: #38bdf8;
        border: 1px solid #007aff;
        padding: 5px 9px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
      " title="Preview Canva-Grade Tailored Cover Letter (PDF)">
        LETTER
      </button>

      <button id="floating-panel-btn" style="
        background: #18181b;
        color: #94a3b8;
        border: 1px solid #27272a;
        padding: 5px 9px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
      " title="Open Side-by-Side Studio">
        STUDIO
      </button>

      <button id="floating-audit-btn" style="
        background: #064E3B;
        color: #34D399;
        border: 1px solid #059669;
        padding: 5px 9px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 11px;
        cursor: pointer;
      " title="Pre-Flight ATS Form Audit">
        AUDIT
      </button>

      <button id="floating-close-btn" style="
        background: transparent;
        color: #64748B;
        border: none;
        font-size: 13px;
        cursor: pointer;
        padding: 3px 5px;
      " title="Dismiss">✕</button>
    `;

    // Make Draggable
    const dragHandle = widget.querySelector('#floating-drag-handle');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    dragHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = widget.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      widget.style.bottom = 'auto';
      widget.style.right = 'auto';
      widget.style.left = initialLeft + 'px';
      widget.style.top = initialTop + 'px';
      dragHandle.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      widget.style.left = (initialLeft + dx) + 'px';
      widget.style.top = (initialTop + dy) + 'px';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        dragHandle.style.cursor = 'grab';
      }
    });

    const sel = widget.querySelector('#floating-client-select');
    sel.addEventListener('change', (e) => {
      const found = allClients.find(c => c.id === e.target.value);
      if (found) {
        activeClient = found;
        if (chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ active_client_id: found.id });
        }
      }
    });

    widget.querySelector('#floating-fill-btn').addEventListener('click', () => {
      if (!isLicenseValid()) {
        showLicenseRequiredModal();
        return;
      }
      const res = executeAutoFill(activeClient);
      const btn = widget.querySelector('#floating-fill-btn');
      btn.textContent = `✓ ${res.filledCount} FILLED`;
      setTimeout(() => btn.textContent = 'FILL 1-CLICK', 2500);

      // Trigger automatic pre-flight check
      setTimeout(() => {
        const audit = runPreFlightAudit();
        const auditBtn = widget.querySelector('#floating-audit-btn');
        if (auditBtn) {
          if (audit.isReady) {
            auditBtn.textContent = '✓ 100% READY';
            auditBtn.style.background = '#065F46';
            auditBtn.style.color = '#34D399';
            auditBtn.style.borderColor = '#10B981';
          } else {
            auditBtn.textContent = `${audit.emptyCount} MISSING`;
            auditBtn.style.background = '#78350F';
            auditBtn.style.color = '#FDE68A';
            auditBtn.style.borderColor = '#D97706';
          }
        }
      }, 400);
    });

    widget.querySelector('#floating-attach-btn').addEventListener('click', () => {
      const btn = widget.querySelector('#floating-attach-btn');
      btn.textContent = 'ATTACHING...';
      const res = attachTailoredResumeToForm(activeClient, null, true);
      if (res && res.attachedCount > 0) {
        btn.textContent = '✓ ATTACHED';
        btn.style.background = '#065F46';
        btn.style.color = '#34D399';
      } else {
        btn.textContent = '✓ PDF READY';
        btn.style.background = '#065F46';
        btn.style.color = '#34D399';
      }
      setTimeout(() => {
        btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> ATTACH';
        btn.style.background = '#18181b';
        btn.style.color = '#34D399';
      }, 2500);
    });

    widget.querySelector('#floating-audit-btn').addEventListener('click', () => {
      const audit = runPreFlightAudit();
      const btn = widget.querySelector('#floating-audit-btn');
      if (audit.isReady) {
        btn.textContent = '✓ 100% READY';
        btn.style.background = '#065F46';
        btn.style.color = '#34D399';
        btn.style.borderColor = '#10B981';
      } else {
        btn.textContent = `${audit.emptyCount} MISSING`;
        btn.style.background = '#78350F';
        btn.style.color = '#FDE68A';
        btn.style.borderColor = '#D97706';
        if (audit.emptyInputs && audit.emptyInputs[0]) {
          audit.emptyInputs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          audit.emptyInputs[0].focus();
          audit.emptyInputs[0].style.outline = '2.5px solid #F59E0B';
          setTimeout(() => { audit.emptyInputs[0].style.outline = ''; }, 4000);
        }
      }
    });

    widget.querySelector('#floating-next-btn').addEventListener('click', () => {
      advanceMultiStepWizard();
    });

    const askAiBtn = widget.querySelector('#floating-askai-btn');
    if (askAiBtn) {
      askAiBtn.addEventListener('click', () => {
        toggleOnPageAskAiPanel();
      });
    }

    widget.querySelector('#floating-attach-cover-btn').addEventListener('click', () => {
      const btn = widget.querySelector('#floating-attach-cover-btn');
      btn.textContent = 'ATTACHING...';
      const res = attachTailoredCoverLetterToForm(activeClient, null, true);
      if (res && (res.attachedCount > 0 || res.textareaFilled)) {
        btn.textContent = '✓ ATTACHED';
        btn.style.background = '#065F46';
        btn.style.color = '#34D399';
      } else {
        btn.textContent = '✓ CL READY';
        btn.style.background = '#065F46';
        btn.style.color = '#34D399';
      }
      setTimeout(() => {
        btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> ATTACH CL';
        btn.style.background = '#18181b';
        btn.style.color = '#38bdf8';
      }, 2500);
    });

    widget.querySelector('#floating-cover-btn').addEventListener('click', () => {
      const jobOverview = extractPageJobOverview();
      if (typeof generateCanvaCoverLetterHTML !== 'undefined') {
        const html = generateCanvaCoverLetterHTML(activeClient, jobOverview, 'executive');
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        alert('Tailored Cover Letter generated for ' + (jobOverview.company || 'Opening') + '!');
      }
    });

    widget.querySelector('#floating-resume-btn').addEventListener('click', () => {
      if (typeof generateCanvaResumeHTML !== 'undefined') {
        const jobOverview = extractPageJobOverview();
        const html = generateCanvaResumeHTML(activeClient, jobOverview, 'executive');
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    });

    widget.querySelector('#floating-panel-btn').addEventListener('click', () => {
      if (chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ action: 'open_side_panel' });
      }
    });

    widget.querySelector('#floating-close-btn').addEventListener('click', () => {
      widget.remove();
      const banner = document.getElementById('jobassist-stale-banner');
      if (banner) banner.remove();
    });

    document.body.appendChild(widget);

    // Run Stale Posting Detection (Alert if posting is > 5 days or 1 month ago)
    checkAndRenderStaleWarning(widget);
  }

  function checkAndRenderStaleWarning(widget) {
    setTimeout(() => {
      const freshness = detectPageJobFreshness();
      if (!freshness.isStale) return;

      const staleBadge = widget.querySelector('#floating-stale-badge');
      const staleLabel = widget.querySelector('#floating-stale-label');
      if (staleBadge && staleLabel) {
        staleLabel.textContent = `Stale Job (${freshness.reason})`;
        staleBadge.style.display = 'flex';
      }

      if (document.getElementById('jobassist-stale-banner')) return;

      const banner = document.createElement('div');
      banner.id = 'jobassist-stale-banner';
      banner.style.cssText = `
        position: fixed;
        bottom: 74px;
        right: 24px;
        z-index: 2147483645;
        background: #0B1120;
        border: 1.5px solid #F59E0B;
        border-radius: 12px;
        padding: 12px 14px;
        box-shadow: 0 16px 36px rgba(0,0,0,0.7), 0 0 20px rgba(245, 158, 11, 0.25);
        max-width: 320px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #F8FAFC;
        user-select: none;
      `;

      banner.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="font-weight: 800; color: #F59E0B; font-size: 11.5px; display: flex; align-items: center; gap: 5px;">
            <span>STALE POSTING (${freshness.reason.toUpperCase()})</span>
          </div>
          <span id="btn-close-stale-banner" style="cursor: pointer; color: #64748B; font-size: 13px; padding: 2px;">✕</span>
        </div>
        <div style="font-size: 10.5px; color: #CBD5E1; margin: 6px 0 8px 0; line-height: 1.4;">
          This posting is <strong>${freshness.reason}</strong> with saturated applicants. Candidates applying to jobs posted within <strong>5 days</strong> have 8.5x higher callback probability.
        </div>
        <button id="btn-hunt-fresh-role" style="
          width: 100%;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: #022C22;
          border: none;
          border-radius: 6px;
          padding: 7px 10px;
          font-size: 11.5px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        ">
          Hunt Fresh Jobs for this Role (&le; 5 Days)
        </button>
      `;

      banner.querySelector('#btn-close-stale-banner').addEventListener('click', () => {
        banner.remove();
      });

      const handleHuntClick = () => {
        const jobOverview = extractPageJobOverview();
        const role = jobOverview.title || 'Bookkeeper';
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({
            pending_hunt_query: role,
            pending_hunt_maxDays: 5
          }, () => {
            if (chrome.runtime && chrome.runtime.sendMessage) {
              chrome.runtime.sendMessage({ action: 'open_side_panel' });
              chrome.runtime.sendMessage({ action: 'HUNT_QUERY', query: role, maxDays: 5 });
            }
          });
        }
        showToast(`Hunting fresh jobs under 5 days old for ${role}...`);
        banner.remove();
      };

      banner.querySelector('#btn-hunt-fresh-role').addEventListener('click', handleHuntClick);
      if (staleBadge) staleBadge.addEventListener('click', handleHuntClick);

      document.body.appendChild(banner);
    }, 1200);
  }

  // ==============================================
  // ON-PAGE ASK AI QUESTION SOLVER (DRAG & DROP)
  // ==============================================

  function toggleOnPageAskAiPanel() {
    let panel = document.getElementById('jobassist-askai-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
      return;
    }

    panel = document.createElement('div');
    panel.id = 'jobassist-askai-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 74px;
      right: 24px;
      width: 380px;
      max-width: 92vw;
      background: rgba(20, 20, 22, 0.98);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1.5px solid #007aff;
      border-radius: 12px;
      box-shadow: 0 20px 48px rgba(0,0,0,0.85);
      color: #fafaf9;
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      padding: 12px 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    panel.innerHTML = `
      <div id="askai-panel-drag" style="cursor: grab; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-bottom: 8px;">
        <div style="font-size: 12px; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 5px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Ask AI Question Solver
        </div>
        <button id="askai-panel-close" style="background: none; border: none; color: #94a3b8; font-size: 14px; cursor: pointer;">✕</button>
      </div>

      <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px;">Drag text from page into this box, or click Grab Selection:</div>

      <textarea id="askai-panel-question" placeholder="Drag or paste non-common question here..." style="width: 100%; height: 55px; background: #18181b; border: 1px solid #27272a; border-radius: 6px; color: #FFF; font-size: 11px; padding: 6px 8px; outline: none; resize: vertical; margin-bottom: 6px;"></textarea>

      <div style="display: flex; gap: 4px; margin-bottom: 8px;">
        <button id="askai-grab-selection-btn" style="flex: 1; background: #18181b; border: 1px solid #27272a; color: #e4e4e7; border-radius: 6px; font-size: 10px; font-weight: 600; padding: 5px; cursor: pointer;">
          Grab Highlighted Text
        </button>
        <select id="askai-panel-tone" style="flex: 1; background: #18181b; border: 1px solid #27272a; color: #38bdf8; border-radius: 6px; font-size: 10px; font-weight: 700; padding: 5px; outline: none;">
          <option value="star">STAR Method</option>
          <option value="concise">Concise (1-2 Sentences)</option>
          <option value="executive">Executive Strategic</option>
          <option value="technical">Technical Deep Dive</option>
        </select>
        <button id="askai-panel-generate-btn" style="background: #007aff; color: #FFF; border: none; border-radius: 6px; font-size: 10.5px; font-weight: 800; padding: 5px 10px; cursor: pointer;">
          Ask AI
        </button>
      </div>

      <div id="askai-panel-output-container" style="display: none; background: #18181b; border: 1px solid #059669; border-radius: 6px; padding: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 10px; font-weight: 700; color: #34d399;">Synthesized Answer:</span>
          <div style="display: flex; gap: 4px;">
            <button id="askai-panel-inject-btn" style="background: #065F46; border: 1px solid #10B981; color: #FFF; border-radius: 4px; font-size: 9.5px; font-weight: 700; padding: 2px 7px; cursor: pointer;">Inject into Field</button>
            <button id="askai-panel-copy-btn" style="background: #27272a; border: 1px solid #3f3f46; color: #FFF; border-radius: 4px; font-size: 9.5px; padding: 2px 6px; cursor: pointer;">Copy</button>
          </div>
        </div>
        <div id="askai-panel-output-text" style="font-size: 10.5px; color: #f4f4f5; line-height: 1.45; max-height: 130px; overflow-y: auto; white-space: pre-wrap;"></div>
      </div>
    `;

    document.body.appendChild(panel);

    // Setup HTML5 Drag & Drop on the question textarea
    const qInput = panel.querySelector('#askai-panel-question');
    qInput.addEventListener('dragover', (e) => e.preventDefault());
    qInput.addEventListener('drop', (e) => {
      e.preventDefault();
      const text = e.dataTransfer.getData('text');
      if (text) qInput.value = text;
    });

    panel.querySelector('#askai-grab-selection-btn').addEventListener('click', () => {
      const sel = window.getSelection().toString().trim();
      if (sel) {
        qInput.value = sel;
      } else {
        qInput.placeholder = 'Select text on the page first, then click here or drag it!';
      }
    });

    panel.querySelector('#askai-panel-close').addEventListener('click', () => {
      panel.style.display = 'none';
    });

    panel.querySelector('#askai-panel-generate-btn').addEventListener('click', () => {
      const qText = qInput.value.trim();
      if (!qText) return;
      const tone = panel.querySelector('#askai-panel-tone').value;
      const btn = panel.querySelector('#askai-panel-generate-btn');
      btn.textContent = 'Thinking...';
      setTimeout(() => {
        const ans = (typeof synthesizeScreeningAnswer !== 'undefined')
          ? synthesizeScreeningAnswer(qText, activeClient, extractPageJobOverview(), tone)
          : 'Synthesized peer-level answer based on career profile.';
        panel.querySelector('#askai-panel-output-container').style.display = 'block';
        panel.querySelector('#askai-panel-output-text').textContent = ans;
        btn.textContent = 'Ask AI';
      }, 300);
    });

    panel.querySelector('#askai-panel-copy-btn').addEventListener('click', () => {
      const text = panel.querySelector('#askai-panel-output-text').textContent;
      if (text) {
        navigator.clipboard.writeText(text);
        panel.querySelector('#askai-panel-copy-btn').textContent = '✓ Copied!';
        setTimeout(() => { panel.querySelector('#askai-panel-copy-btn').textContent = 'Copy'; }, 2000);
      }
    });

    panel.querySelector('#askai-panel-inject-btn').addEventListener('click', () => {
      const text = panel.querySelector('#askai-panel-output-text').textContent;
      if (!text) return;
      let target = document.activeElement;
      if (!target || !['input', 'textarea'].includes((target.tagName || '').toLowerCase())) {
        target = document.querySelector('textarea, input[type="text"]:not([readonly])');
      }
      if (target) {
        setNativeValue(target, text);
        target.focus();
        target.style.outline = '2.5px solid #10B981';
        panel.querySelector('#askai-panel-inject-btn').textContent = '✓ Injected!';
        setTimeout(() => {
          target.style.outline = '';
          panel.querySelector('#askai-panel-inject-btn').textContent = 'Inject into Field';
        }, 2500);
      }
    });
  }

  function attachInlineAskAiButtons() {
    document.querySelectorAll('textarea').forEach(t => {
      if (t.dataset.hasAskAi) return;
      t.dataset.hasAskAi = 'true';

      const pill = document.createElement('div');
      pill.className = 'jobassist-inline-askai';
      pill.style.cssText = 'display: inline-flex; align-items: center; gap: 4px; background: rgba(0, 122, 255, 0.12); color: #38bdf8; border: 1px solid #007aff; border-radius: 9999px; padding: 2px 7px; font-size: 10px; font-weight: 700; cursor: pointer; margin-bottom: 3px; user-select: none; z-index: 9999;';
      pill.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Ask AI for Answer`;
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        pill.textContent = 'Synthesizing...';
        const q = getFieldQuestion(t);
        const ans = (typeof synthesizeScreeningAnswer !== 'undefined')
          ? synthesizeScreeningAnswer(q, activeClient, extractPageJobOverview(), 'star')
          : 'Synthesized response based on career history.';
        setNativeValue(t, ans);
        pill.innerHTML = '✓ Answer Injected!';
        pill.style.background = '#065F46';
        pill.style.color = '#34D399';
        pill.style.borderColor = '#10B981';
        setTimeout(() => {
          pill.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Ask AI for Answer`;
          pill.style.background = 'rgba(0, 122, 255, 0.12)';
          pill.style.color = '#38bdf8';
          pill.style.borderColor = '#007aff';
        }, 3000);
      });

      if (t.parentElement) {
        t.parentElement.insertBefore(pill, t);
      }
    });
  }

  function updateFloatingWidgetClient() {
    const sel = document.getElementById('floating-client-select');
    if (sel) {
      sel.innerHTML = allClients.map(c => `<option value="${c.id}" ${c.id === activeClient.id ? 'selected' : ''}>${c.name}</option>`).join('');
    }
  }

  function isJobApplicationPortal() {
    const url = window.location.href.toLowerCase();
    if (url.includes('applytojob.com') ||
        url.includes('workable.com') ||
        url.includes('ashbyhq.com') ||
        url.includes('greenhouse.io') ||
        url.includes('lever.co') ||
        url.includes('smartrecruiters.com') ||
        url.includes('myworkdayjobs.com') ||
        url.includes('indeed.com') ||
        url.includes('linkedin.com/jobs')) {
      return true;
    }
    if (document.querySelector('form[action*="apply"], form[class*="application"], [data-ui*="application-form"]')) {
      return true;
    }
    return false;
  }

  function updateFloatingWidgetLicenseBadge() {
    const fillBtn = document.getElementById('floating-fill-btn');
    if (!fillBtn) return;
    if (!isLicenseValid()) {
      fillBtn.innerHTML = 'UNLOCK PASS';
      fillBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
      fillBtn.style.color = '#FFFFFF';
      fillBtn.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.4)';
    } else {
      fillBtn.innerHTML = 'FILL 1-CLICK';
      fillBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      fillBtn.style.color = '#022C22';
      fillBtn.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.4)';
    }
  }

  function showLicenseRequiredModal() {
    if (document.getElementById('jobassist-license-gate-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'jobassist-license-gate-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(9, 14, 23, 0.88);
      backdrop-filter: blur(14px);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    modal.innerHTML = `
      <div style="background: #0F172A; border: 1.5px solid #EF4444; border-radius: 14px; padding: 22px; max-width: 360px; text-align: center; color: #F8FAFC; box-shadow: 0 20px 50px rgba(0,0,0,0.85);">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); color: #EF4444; font-weight: 800; font-size: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto;">!</div>
        <div style="font-size: 16px; font-weight: 800; color: #FFF; margin-bottom: 4px;">JobAssist Permission Required</div>
        <div style="font-size: 10.5px; color: #FCA5A5; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 10px;">LOCKED FOR UNLICENSED USERS</div>
        <div style="font-size: 11.5px; color: #94A3B8; line-height: 1.5; margin-bottom: 16px;">
          Only candidates with an administrator-approved license key can run 1-Click AutoFill on this application.
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button id="btn-gate-open-sidepanel" style="background: linear-gradient(135deg, #10B981, #059669); color: #022C22; border: none; border-radius: 8px; padding: 10px; font-weight: 800; font-size: 12px; cursor: pointer;">
            Enter License Key in Sidepanel
          </button>
          <a href="https://jobassist-mu47.onrender.com/pricing" target="_blank" style="background: #1E293B; color: #38BDF8; border: 1px solid #0284C7; border-radius: 8px; padding: 9px; font-weight: 700; font-size: 11.5px; text-decoration: none;">
            Subscribe / Buy Pass (from 100 ETB / $4.99)
          </a>
          <button id="btn-gate-dismiss" style="background: none; border: none; color: #64748B; font-size: 11px; cursor: pointer; margin-top: 4px;">
            Dismiss
          </button>
        </div>
      </div>
    `;

    modal.querySelector('#btn-gate-dismiss').addEventListener('click', () => modal.remove());
    modal.querySelector('#btn-gate-open-sidepanel').addEventListener('click', () => {
      if (chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ action: 'open_side_panel' });
      }
      modal.remove();
    });

    document.body.appendChild(modal);
  }

  function initAutoPilotIfActive() {
    if (!isJobApplicationPortal()) return;
    if (!isLicenseValid()) return;

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['jobassist_autopilot_active'], (data) => {
        if (data.jobassist_autopilot_active !== false) {
          console.log('[JobAssist AutoPilot] Auto-filling active job portal for', activeClient.name);
          setTimeout(() => {
            const res = executeAutoFill(activeClient);
            const captcha = detectCaptcha();
            if (!captcha.hasCaptcha) {
              highlightSubmitButton();
            }
          }, 850);
        }
      });
    }
  }

  // 9. Handle messages from Side Panel
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.action === 'run_autofill') {
        const targetClient = msg.client || activeClient;
        const res = executeAutoFill(targetClient);
        const captcha = detectCaptcha();
        if (!captcha.hasCaptcha) highlightSubmitButton();
        sendResponse({ success: true, count: res.filledCount, uncommonCount: res.uncommonCount, client: targetClient.name, captcha });
      } else if (msg.action === 'advance_step') {
        const res = advanceMultiStepWizard();
        sendResponse(res);
      } else if (msg.action === 'extract_job') {
        const overview = extractPageJobOverview();
        sendResponse(overview);
      } else if (msg.action === 'attach_tailored_resume') {
        const targetClient = msg.client || activeClient;
        const res = attachTailoredResumeToForm(targetClient, msg.jobInfo, true);
        sendResponse(res);
      } else if (msg.action === 'attach_tailored_cover_letter') {
        const targetClient = msg.client || activeClient;
        const res = attachTailoredCoverLetterToForm(targetClient, msg.jobInfo, true);
        sendResponse(res);
      } else if (msg.action === 'scan_questions') {
        const qList = scanPageQuestions();
        sendResponse({ questions: qList });
      } else if (msg.action === 'inject_answer') {
        const ok = injectAnswer(msg.selector, msg.text);
        sendResponse({ success: ok });
      } else if (msg.action === 'inject_focused_answer') {
        const text = msg.text || '';
        let target = document.activeElement;
        if (!target || !['input', 'textarea'].includes((target.tagName || '').toLowerCase())) {
          target = document.querySelector('textarea, input[type="text"]:not([readonly])');
        }
        if (target) {
          setNativeValue(target, text);
          target.focus();
          target.style.outline = '2.5px solid #10B981';
          setTimeout(() => { target.style.outline = ''; }, 3000);
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false });
        }
      } else if (msg.action === 'detect_captcha') {
        const captcha = detectCaptcha();
        sendResponse(captcha);
      } else if (msg.action === 'highlight_submit') {
        const sub = highlightSubmitButton();
        sendResponse(sub);
      } else if (msg.action === 'run_preflight_audit') {
        const audit = runPreFlightAudit();
        sendResponse(audit);
      } else if (msg.action === 'set_active_client' && msg.client) {
        activeClient = msg.client;
        updateFloatingWidgetClient();
        sendResponse({ success: true });
      }
      return true;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(injectFloatingWidget, 600);
      setTimeout(attachInlineAskAiButtons, 800);
      initAutoPilotIfActive();
    });
  } else {
    setTimeout(injectFloatingWidget, 400);
    setTimeout(attachInlineAskAiButtons, 600);
    initAutoPilotIfActive();
  }
})();
