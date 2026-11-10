// ========================================================================
// JobAssist Executive Masterwork Resume Generator (The "One Forever" Standard)
// 100% Free • Zero Canva Dependencies • High-Resolution Print-to-PDF Ready
// Deep Active-Page Job Extraction & Dynamic Tailoring Engine
// ========================================================================

function getTailoredSkills(clientSkills = [], jobKeywords = []) {
  const skills = [...(clientSkills || [])];
  if (!jobKeywords || jobKeywords.length === 0) return skills;

  const matched = [];
  const others = [];

  // Keywords explicitly extracted from job posting
  jobKeywords.forEach(k => {
    const kClean = String(k).trim();
    if (kClean.length > 1) {
      const existing = skills.find(s => s.toLowerCase() === kClean.toLowerCase());
      if (existing) matched.push(existing);
      else matched.push(kClean);
    }
  });

  skills.forEach(s => {
    const sLower = s.toLowerCase();
    const isMatched = jobKeywords.some(k => sLower.includes(String(k).toLowerCase()) || String(k).toLowerCase().includes(sLower));
    if (isMatched && !matched.includes(s)) matched.push(s);
    else if (!isMatched) others.push(s);
  });

  return [...new Set([...matched, ...others])].slice(0, 18);
}

function getTailoredSummary(client, company = '', role = '', jobOverview = '') {
  const headline = role || client.headline || 'Virtual Assistant & Data Entry Specialist';
  const years = client.yearsBE || client.yearsOfExperience || '3+';
  const desc = (jobOverview || '').toLowerCase();
  const cleanComp = (!company || ['Target Company', 'Enterprise Company', 'Hiring Company'].includes(company)) ? '' : company;

  // Detect domain context organically from the job overview or client title
  let domainFocus = 'virtual assistance, high-accuracy data entry, spreadsheet organization, and remote administrative support';
  if (desc.includes('data entry') || desc.includes('typing') || desc.includes('transcription') || desc.includes('record')) {
    domainFocus = 'high-accuracy data entry, document transcription (65+ WPM), record deduplication, and database verification';
  } else if (desc.includes('excel') || desc.includes('sheet') || desc.includes('spreadsheet') || desc.includes('vlookup') || desc.includes('pivot')) {
    domainFocus = 'advanced Google Sheets and MS Excel organization, formula auditing (XLOOKUP / Pivot Tables), and clean financial and reporting workflows';
  } else if (desc.includes('assist') || desc.includes('admin') || desc.includes('executive') || desc.includes('calendar') || desc.includes('inbox')) {
    domainFocus = 'proactive executive virtual assistance, inbox zero management, calendar scheduling, and cross-timezone business operations';
  } else if (desc.includes('research') || desc.includes('lead') || desc.includes('prospect')) {
    domainFocus = 'structured web research, lead generation, B2B contact verification, and prospect directory creation';
  } else if (desc.includes('canva') || desc.includes('design') || desc.includes('thumbnail') || desc.includes('social media')) {
    domainFocus = 'Canva visual asset design, high-CTR YouTube thumbnails, presentation formatting, and social media media organization';
  } else if (desc.includes('customer') || desc.includes('support') || desc.includes('chat') || desc.includes('ticket')) {
    domainFocus = 'courteous customer support, live chat resolution, email ticketing, and client inquiry management';
  }

  let baseSummary = (client.summary || '').trim();
  if (!baseSummary || baseSummary.includes('engineering') || baseSummary.includes('technical integration') || baseSummary.includes('software developer') || baseSummary.includes('HubSpot Integrations')) {
    baseSummary = 'Reliable, detail-oriented Virtual Assistant and Data Entry Specialist with 3+ years experience supporting founders, remote businesses, and digital agencies. Proficient in Google Sheets, Microsoft Excel, online research, data extraction, CRM updates, and AI-assisted workflows. Proven 99.8% accuracy and 100% on-time delivery.';
  }

  if (baseSummary.length > 50 && !cleanComp) {
    return baseSummary;
  }

  const topSkillsStr = (client.skills && client.skills.length > 0)
    ? client.skills.slice(0, 6).join(', ')
    : 'Virtual Assistant, Data Entry, Google Sheets, Excel Formulas, Web Research, Canva Design';

  if (baseSummary.length > 50 && cleanComp) {
    return `${baseSummary} Prepared to deliver immediate, reliable administrative support and high-accuracy execution for ${cleanComp}'s daily operations.`;
  }

  return `Detail-oriented Virtual Assistant and Data Entry Specialist with ${years} years of dedicated experience supporting remote operations through ${domainFocus}. Proven record delivering 65+ WPM typing speed with 99.8% verified accuracy and dependable daily execution. Hands-on background spanning ${topSkillsStr}, backed by proactive communication, strict confidentiality adherence, and collaborative workflow systems at Nexa Digital Team.`;
}

// ------------------------------------------------------------------------
// THE "ONE FOREVER" EXECUTIVE MASTERWORK TEMPLATE
// (Ivy League / Stanford / Silicon Valley Staff Architect Standard)
// ------------------------------------------------------------------------
function generateExecutiveMasterworkResume(client, jobInfo = {}) {
  const company = jobInfo.company || 'Enterprise Company';
  const role = jobInfo.title || client.headline || 'Virtual Assistant & Data Entry Specialist';
  const allSkills = getTailoredSkills(client.skills, jobInfo.keywords);
  const tailoredSummary = getTailoredSummary(client, company, role, jobInfo.description || '');
  const exps = client.experience || [
    {
      role: client.headline || 'Virtual Assistant & Data Operations Specialist',
      company: client.company || 'Nexa Digital Team',
      period: '2024 - Present',
      location: 'Remote Worldwide',
      bullets: [
        'Transcribe, format, and enter 1,000+ data records weekly across Google Sheets and Excel with verified 99.8% accuracy.',
        'Manage executive inbox, organize cloud drives, and coordinate calendar appointments across US, UK, and European time zones.',
        'Conduct deep web research to generate clean, verified B2B prospect directories and lead lists for e-commerce and agency clients.',
        'Design high-converting visual assets and YouTube thumbnails in Canva Pro following brand kit guidelines.'
      ]
    },
    {
      role: 'Data Entry & Administrative Assistant',
      company: 'Nexa Workflow Solutions',
      period: '2022 - 2024',
      location: 'Remote',
      bullets: [
        'Cleaned, structured, and deduplicated multi-tab spreadsheets utilizing VLOOKUP, XLOOKUP, Pivot Tables, and automated conditional formatting.',
        'Maintained rapid 65+ WPM typing speed across high-volume data collection, product listing, and database migration tasks.',
        'Provided friendly, courteous customer email and live chat support, sustaining a 98% first-response resolution rate.'
      ]
    }
  ];

  // Group skills into modern VA & Operations categories
  const targetMatches = (jobInfo.keywords && jobInfo.keywords.length > 0) ? jobInfo.keywords.slice(0, 8) : allSkills.slice(0, 6);
  const coreTools = allSkills.filter(s => ['sheet', 'excel', 'workspace', 'word', 'office', 'drive', 'notion', 'slack', 'trello', 'asana', 'airtable', 'csv'].some(k => s.toLowerCase().includes(k))).slice(0, 8);
  const coreCompetencies = allSkills.filter(s => ['data entry', 'virtual assistant', 'research', 'lead', 'support', 'customer', 'transcription', 'admin', 'organization', 'typing', 'cleaning', 'operations'].some(k => s.toLowerCase().includes(k))).slice(0, 8);
  const creativeAI = allSkills.filter(s => ['canva', 'design', 'thumbnail', 'ai', 'chatgpt', 'prompt', 'workflow', 'automation', 'media', 'social'].some(k => s.toLowerCase().includes(k))).slice(0, 8);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${client.name} — ${role} (Executive Resume)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    @page {
      size: letter;
      margin: 10mm 12mm;
    }

    body {
      background: #f4f4f5;
      color: #09090b;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 24px 16px;
      line-height: 1.45;
      font-size: 10pt;
      -webkit-font-smoothing: antialiased;
    }

    /* Screen-Only Control Toolbar */
    .screen-toolbar {
      max-width: 8.5in;
      margin: 0 auto 16px;
      background: #141416;
      border: 1px solid #27272a;
      border-radius: 10px;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
      color: #fafaf9;
    }
    .toolbar-tag {
      font-size: 10px;
      font-weight: 700;
      background: rgba(0, 122, 255, 0.15);
      border: 1px solid #007aff;
      color: #60a5fa;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-tool {
      background: #007aff;
      color: #FFFFFF;
      border: none;
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: background 0.2s;
    }
    .btn-tool:hover { background: #0066d6; }
    .btn-tool-secondary {
      background: #27272a;
      color: #e4e4e7;
      border: 1px solid #3f3f46;
      padding: 7px 12px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-tool-secondary:hover { background: #3f3f46; color: #FFF; }

    /* The Resume Sheet */
    .resume-sheet {
      width: 8.5in;
      min-height: 11in;
      margin: 0 auto;
      background: #FFFFFF;
      padding: 34px 44px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      border: 1px solid #e4e4e7;
      position: relative;
    }

    /* Header */
    .resume-header {
      text-align: center;
      border-bottom: 1.5px solid #18181b;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .candidate-name {
      font-family: 'Newsreader', Georgia, serif;
      font-size: 26pt;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #09090b;
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .candidate-target-title {
      font-size: 11.5pt;
      font-weight: 700;
      color: #27272a;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .contact-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px 10px;
      font-size: 9pt;
      color: #4b5563;
    }
    .contact-bar a {
      color: #09090b;
      text-decoration: none;
      font-weight: 600;
    }
    .contact-bar a:hover { text-decoration: underline; }
    .contact-sep { color: #9ca3af; }

    /* Section Typography */
    .section-header {
      font-family: 'Newsreader', Georgia, serif;
      font-size: 12pt;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #09090b;
      border-bottom: 0.75pt solid #27272a;
      padding-bottom: 2px;
      margin: 13px 0 6px 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .section-badge {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 7.5pt;
      font-weight: 700;
      color: #059669;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    /* Paragraph Content */
    .summary-paragraph {
      font-size: 9.5pt;
      color: #1f2937;
      text-align: justify;
      line-height: 1.5;
    }

    /* Competencies Grid */
    .competencies-box {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 9pt;
      color: #1f2937;
      background: #fafafa;
      border: 1px solid #f4f4f5;
      border-radius: 4px;
      padding: 6px 10px;
    }
    .comp-line {
      display: flex;
      gap: 6px;
    }
    .comp-label {
      font-weight: 700;
      color: #09090b;
      min-width: 155px;
      flex-shrink: 0;
    }
    .comp-values {
      color: #374151;
    }
    .comp-highlight {
      color: #047857;
      font-weight: 600;
    }

    /* Experience */
    .exp-item {
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .exp-header-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10pt;
    }
    .exp-role {
      font-weight: 700;
      color: #09090b;
    }
    .exp-date {
      font-size: 8.5pt;
      font-weight: 600;
      color: #4b5563;
    }
    .exp-sub-row {
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      font-style: italic;
      color: #374151;
      margin-bottom: 3px;
    }
    .bullets-list {
      list-style-type: disc;
      padding-left: 17px;
      font-size: 9pt;
      color: #1f2937;
      line-height: 1.45;
    }
    .bullets-list li {
      margin-bottom: 2.5px;
    }

    /* Education */
    .edu-item {
      display: flex;
      justify-content: space-between;
      font-size: 9.5pt;
      margin-bottom: 2px;
    }
    .edu-title { font-weight: 700; color: #09090b; }
    .edu-school { font-style: italic; color: #374151; }
    .edu-date { font-size: 8.5pt; font-weight: 600; color: #4b5563; }

    /* Print Stylesheet */
    @media print {
      body {
        background: #FFFFFF !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .screen-toolbar {
        display: none !important;
      }
      .resume-sheet {
        width: 100% !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen-Only Control Toolbar -->
  <div class="screen-toolbar">
    <div class="toolbar-brand">
      <span class="toolbar-tag">EXECUTIVE MASTERWORK</span>
      <span>${client.name} — ${company}</span>
    </div>
    <div class="toolbar-actions">
      <button class="btn-tool" onclick="window.print()" title="Print to PDF or Save as Vector PDF with 100% exact fonts and layout">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Print / Save Vector PDF (Exact Template)
      </button>
      <button class="btn-tool-secondary" onclick="copyPlainTextATS()" title="Copy clean ATS plain text">
        Copy Plain Text
      </button>
    </div>
  </div>

  <!-- Main Executive Resume Document -->
  <div class="resume-sheet">
    <header class="resume-header">
      <h1 class="candidate-name">${client.name}</h1>
      <div class="candidate-target-title">${role}</div>
      <div class="contact-bar">
        <span>${client.loc || 'Addis Ababa, Ethiopia (Remote Worldwide)'}</span>
        <span class="contact-sep">•</span>
        <span>${client.phone || '0948232719'}</span>
        <span class="contact-sep">•</span>
        <span><a href="mailto:${client.email}">${client.email}</a></span>
        ${client.linkedin ? `<span class="contact-sep">•</span><span><a href="${client.linkedin}" target="_blank">LinkedIn</a></span>` : ''}
        ${client.github ? `<span class="contact-sep">•</span><span><a href="${client.github}" target="_blank">GitHub</a></span>` : ''}
        ${client.portfolio ? `<span class="contact-sep">•</span><span><a href="${client.portfolio}" target="_blank">Portfolio</a></span>` : ''}
        <span class="contact-sep">•</span>
        <span style="font-weight:600; color:#059669;">Remote B2B (W-8BEN)</span>
      </div>
    </header>

    <!-- 1. Executive Summary -->
    <section>
      <div class="section-header">
        <span>Executive Summary</span>
      </div>
      <p class="summary-paragraph">
        ${tailoredSummary}
      </p>
    </section>

    <!-- 2. Core Operational Competencies -->
    <section>
      <div class="section-header">
        <span>Core Operational Competencies</span>
      </div>
      <div class="competencies-box">
        ${targetMatches.length > 0 ? `
          <div class="comp-line">
            <span class="comp-label">Target Role Match:</span>
            <span class="comp-values comp-highlight">${targetMatches.join(' • ')}</span>
          </div>
        ` : ''}
        <div class="comp-line">
          <span class="comp-label">Software &amp; Tools:</span>
          <span class="comp-values">${coreTools.length > 0 ? coreTools.join(', ') : 'Google Sheets, Microsoft Excel (VLOOKUP, Pivot Tables), Google Workspace, Notion, Slack, Trello, Asana'}</span>
        </div>
        <div class="comp-line">
          <span class="comp-label">Operational Competencies:</span>
          <span class="comp-values">${coreCompetencies.length > 0 ? coreCompetencies.join(', ') : 'High-Speed Data Entry (65+ WPM, 99.8% Accuracy), Web Research, Lead Generation, Inbox Zero, Customer Support'}</span>
        </div>
        <div class="comp-line">
          <span class="comp-label">Creative &amp; AI Systems:</span>
          <span class="comp-values">${creativeAI.length > 0 ? creativeAI.join(', ') : 'Canva Pro Design, High-CTR YouTube Thumbnails, ChatGPT &amp; AI Workflow Systems, Social Media Support'}</span>
        </div>
      </div>
    </section>

    <!-- 3. Professional Experience -->
    <section>
      <div class="section-header">
        <span>Professional Experience</span>
      </div>
      ${exps.map(e => `
        <article class="exp-item">
          <div class="exp-header-row">
            <span class="exp-role">${e.role}</span>
            <span class="exp-date">${e.period}</span>
          </div>
          <div class="exp-sub-row">
            <span>${e.company}</span>
            <span>${e.location || 'United States'}</span>
          </div>
          <ul class="bullets-list">
            ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
          </ul>
        </article>
      `).join('')}
    </section>

    <!-- 4. Education & Credentials -->
    <section>
      <div class="section-header">
        <span>Education &amp; Academic Credentials</span>
      </div>
      <div class="edu-item">
        <div>
          <span class="edu-title">${client.degree || "Accounting & Finance / Business Information"}</span> — <span class="edu-school">${client.school || 'Addis Ababa University'}</span>
        </div>
        <div class="edu-date">${client.educationYear || '2026'}</div>
      </div>
      <div style="font-size: 8.5pt; color: #4b5563; margin-top: 1px;">
        Academic Standing: GPA ${client.gpa || '3.8'} • Dean's Honors List • Focus in Information Systems &amp; Financial Record Management
      </div>
    </section>
  </div>

  <script>
    function copyPlainTextATS() {
      const text = document.querySelector('.resume-sheet').innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert('Plain text resume copied to clipboard for ATS direct paste!');
      });
    }
  </script>
</body>
</html>`;
}

// ------------------------------------------------------------------------
// Classical ATS Gold Standard & Silicon Valley Fallbacks
// ------------------------------------------------------------------------
function generateATSTemplate(client, jobInfo = {}) {
  return generateExecutiveMasterworkResume(client, jobInfo);
}

function generateTechMinimalistTemplate(client, jobInfo = {}) {
  return generateExecutiveMasterworkResume(client, jobInfo);
}

function generateExecutiveTemplate(client, jobInfo = {}) {
  return generateExecutiveMasterworkResume(client, jobInfo);
}

function generateCanvaResumeHTML(client, jobInfo = {}, templateType = 'masterwork') {
  return generateExecutiveMasterworkResume(client, jobInfo);
}

function generatePlainTextResume(client, jobInfo = {}) {
  const company = jobInfo.company || 'Direct Client';
  const role = jobInfo.title || client.headline || 'Virtual Assistant & Data Entry Specialist';
  const skills = getTailoredSkills(client.skills, jobInfo.keywords);

  let txt = `========================================================================\n`;
  txt += `${client.name.toUpperCase()} — ${role.toUpperCase()}\n`;
  txt += `Location: ${client.loc || 'Addis Ababa, Ethiopia (Remote Worldwide)'} | Phone: ${client.phone || '0948232719'} | Email: ${client.email}\n`;
  txt += `LinkedIn: ${client.linkedin || ''} | GitHub: ${client.github || ''} | Portfolio: ${client.portfolio || ''}\n`;
  txt += `Work Authorization: Remote Global B2B / Freelance Contractor (W-8BEN)\n`;
  txt += `========================================================================\n\n`;

  txt += `PROFESSIONAL SUMMARY\n`;
  txt += `${getTailoredSummary(client, company, role, jobInfo.description || '')}\n\n`;

  txt += `CORE OPERATIONAL COMPETENCIES\n`;
  txt += `${skills.join(' • ')}\n\n`;

  txt += `PROFESSIONAL EXPERIENCE\n`;
  (client.experience || []).forEach(e => {
    txt += `• ${e.role.toUpperCase()} — ${e.company} (${e.period})\n`;
    (e.bullets || []).forEach(b => {
      txt += `   - ${b}\n`;
    });
    txt += `\n`;
  });

  txt += `EDUCATION & CREDENTIALS\n`;
  txt += `• ${client.degree || 'Accounting & Finance / Business Information'} | ${client.school || 'Addis Ababa University'} (${client.educationYear || '2026'})\n`;
  txt += `  GPA: ${client.gpa || '3.8'} • Dean's Honors List\n`;

  return txt;
}

function generateValidPDFBinary(client, jobInfo = {}) {
  const company = jobInfo.company || 'Direct Client';
  const role = jobInfo.title || client.headline || 'Virtual Assistant & Data Operations Specialist';
  const allSkills = getTailoredSkills(client.skills, jobInfo.keywords);
  const tailoredSummary = getTailoredSummary(client, company, role, jobInfo.description || '');
  const exps = client.experience || [
    {
      role: client.headline || 'Virtual Assistant & Data Operations Specialist',
      company: client.company || 'Nexa Digital Team',
      period: '2024 - Present',
      location: 'Remote Worldwide',
      bullets: [
        'Transcribe, format, and enter 1,000+ data records weekly across Google Sheets and Excel with verified 99.8% accuracy.',
        'Manage executive inbox, organize cloud drives, and coordinate calendar appointments across US, UK, and European time zones.',
        'Conduct deep web research to generate clean, verified B2B prospect directories and lead lists for e-commerce and agency clients.',
        'Design high-converting visual assets and YouTube thumbnails in Canva Pro following brand kit guidelines.'
      ]
    },
    {
      role: 'Data Entry & Administrative Assistant',
      company: 'Nexa Workflow Solutions',
      period: '2022 - 2024',
      location: 'Remote',
      bullets: [
        'Cleaned, structured, and deduplicated multi-tab spreadsheets utilizing VLOOKUP, XLOOKUP, Pivot Tables, and automated conditional formatting.',
        'Maintained rapid 65+ WPM typing speed across high-volume data collection, product listing, and database migration tasks.',
        'Provided friendly, courteous customer email and live chat support, sustaining a 98% first-response resolution rate.'
      ]
    }
  ];

  const PAGE_WIDTH = 612;
  const PAGE_HEIGHT = 792;
  const MARGIN_LEFT = 38;
  const USABLE_WIDTH = 536;
  const MARGIN_BOTTOM = 42;
  const TOP_MARGIN = 752;

  const pages = [];
  let curStream = [];
  let curY = TOP_MARGIN;

  function newPage() {
    if (curStream.length > 0) pages.push(curStream.join('\n'));
    curStream = [];
    curY = TOP_MARGIN;
  }

  function ensureSpace(needed) {
    if (curY - needed < MARGIN_BOTTOM) {
      newPage();
    }
  }

  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/[^\x20-\x7E]/g, (ch) => {
        if (ch === '•') return ' - ';
        if (ch === '—' || ch === '–') return ' - ';
        if (ch === '’' || ch === '‘') return "'";
        if (ch === '“' || ch === '”') return '"';
        return ' ';
      });
  }

  function wrapText(text, maxChars = 86) {
    if (!text) return [];
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = '';
    for (const w of words) {
      if (!cur) cur = w;
      else if ((cur + ' ' + w).length <= maxChars) cur += ' ' + w;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function text(str, x, y, font = '/F2', size = 9, color = [0.1, 0.1, 0.12]) {
    curStream.push(`${color[0]} ${color[1]} ${color[2]} rg`);
    curStream.push(`BT ${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${esc(str)}) Tj ET`);
  }

  function line(x1, y1, x2, y2, width = 0.75, color = [0.2, 0.2, 0.25]) {
    curStream.push(`${color[0]} ${color[1]} ${color[2]} RG`);
    curStream.push(`${width} w`);
    curStream.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  function rect(x, y, w, h, fillColor = null, strokeColor = null, lineWidth = 0.5) {
    if (fillColor) curStream.push(`${fillColor[0]} ${fillColor[1]} ${fillColor[2]} rg`);
    if (strokeColor) {
      curStream.push(`${strokeColor[0]} ${strokeColor[1]} ${strokeColor[2]} RG`);
      curStream.push(`${lineWidth} w`);
    }
    if (fillColor && strokeColor) curStream.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re B`);
    else if (fillColor) curStream.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
    else if (strokeColor) curStream.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`);
  }

  function sectionTitle(title, tag = '') {
    ensureSpace(30);
    text(title.toUpperCase(), MARGIN_LEFT, curY, '/F1', 10, [0.08, 0.08, 0.12]);
    if (tag) {
      text(tag, MARGIN_LEFT + USABLE_WIDTH - (tag.length * 5), curY, '/F1', 8, [0.02, 0.58, 0.41]);
    }
    curY -= 3.5;
    line(MARGIN_LEFT, curY, MARGIN_LEFT + USABLE_WIDTH, curY, 0.75, [0.2, 0.2, 0.25]);
    curY -= 11;
  }

  // --- 1. HEADER ---
  text(client.name || 'Candidate Name', MARGIN_LEFT, curY, '/F4', 21, [0.05, 0.05, 0.08]);
  curY -= 17;

  text(role.toUpperCase(), MARGIN_LEFT, curY, '/F1', 10, [0.12, 0.25, 0.50]);
  curY -= 13;

  const contactLine = `${client.loc || 'Addis Ababa, Ethiopia (Remote Worldwide)'}  |  ${client.phone || '0948232719'}  |  ${client.email || ''}  |  Remote B2B (W-8BEN)`;
  text(contactLine, MARGIN_LEFT, curY, '/F2', 8.5, [0.28, 0.32, 0.38]);
  curY -= 11;

  const linksLine = `LinkedIn: ${client.linkedin || 'linkedin.com'}  |  GitHub: ${client.github || 'github.com'}  |  Portfolio: ${client.portfolio || 'nexa-portfolio-theta.vercel.app'}`;
  text(linksLine, MARGIN_LEFT, curY, '/F2', 8.2, [0.15, 0.35, 0.65]);
  curY -= 8;

  // Header bottom border
  line(MARGIN_LEFT, curY, MARGIN_LEFT + USABLE_WIDTH, curY, 1.25, [0.1, 0.1, 0.15]);
  curY -= 15;

  // --- 2. EXECUTIVE SUMMARY ---
  sectionTitle('Executive Summary', 'TAILORED FOR ' + (company.toUpperCase().slice(0, 24)));
  const summaryLines = wrapText(tailoredSummary, 90);
  summaryLines.forEach(l => {
    ensureSpace(13);
    text(l, MARGIN_LEFT, curY, '/F2', 8.8, [0.12, 0.12, 0.15]);
    curY -= 12.2;
  });
  curY -= 5;

  // --- 3. CORE OPERATIONAL COMPETENCIES ---
  sectionTitle('Core Operational Competencies', '99.8% VERIFIED ACCURACY');
  const targetMatches = (jobInfo.keywords && jobInfo.keywords.length > 0) ? jobInfo.keywords.slice(0, 8).join('  -  ') : 'Virtual Assistant, High-Speed Data Entry, Spreadsheets, Customer Support';
  const compLines = [
    { label: 'Target Role Match:', val: targetMatches },
    { label: 'Software & Tools:', val: 'Google Sheets, Microsoft Excel (VLOOKUP, Pivot Tables), Google Workspace, Notion, Slack, Trello, Asana' },
    { label: 'Operational Competencies:', val: 'High-Speed Typing (65+ WPM, 99.8% Accuracy), Web Research, Lead Generation, Inbox Zero, Customer Support' },
    { label: 'Creative & AI Systems:', val: 'Canva Pro Design, High-CTR YouTube Thumbnails, ChatGPT & AI Workflow Systems, Social Media Support' }
  ];

  const boxHeight = (compLines.length * 13.5) + 6;
  ensureSpace(boxHeight + 10);
  rect(MARGIN_LEFT, curY - boxHeight + 4, USABLE_WIDTH, boxHeight, [0.97, 0.97, 0.98], [0.85, 0.86, 0.88], 0.5);

  let compY = curY - 7;
  compLines.forEach(cl => {
    text(cl.label, MARGIN_LEFT + 7, compY, '/F1', 8.5, [0.1, 0.1, 0.15]);
    text(cl.val, MARGIN_LEFT + 155, compY, '/F2', 8.2, [0.18, 0.22, 0.28]);
    compY -= 13.5;
  });
  curY -= (boxHeight + 8);

  // --- 4. PROFESSIONAL EXPERIENCE ---
  sectionTitle('Professional Experience', '3+ YEARS REMOTE B2B EXPERIENCE');

  exps.forEach(e => {
    ensureSpace(35);
    text(e.role || 'Virtual Assistant', MARGIN_LEFT, curY, '/F1', 9.5, [0.08, 0.08, 0.12]);
    const periodStr = e.period || '2024 - Present';
    text(periodStr, MARGIN_LEFT + USABLE_WIDTH - (periodStr.length * 5.2), curY, '/F1', 8.5, [0.25, 0.28, 0.35]);
    curY -= 11.5;

    text(e.company || 'Nexa Digital Team', MARGIN_LEFT, curY, '/F3', 8.8, [0.25, 0.28, 0.35]);
    const locStr = e.location || 'Remote Worldwide';
    text(locStr, MARGIN_LEFT + USABLE_WIDTH - (locStr.length * 4.8), curY, '/F2', 8.2, [0.35, 0.38, 0.45]);
    curY -= 11;

    (e.bullets || []).forEach(b => {
      const bLines = wrapText(b, 86);
      bLines.forEach((bl, idx) => {
        ensureSpace(12);
        if (idx === 0) {
          text('-', MARGIN_LEFT + 4, curY, '/F1', 9, [0.02, 0.58, 0.41]);
          text(bl, MARGIN_LEFT + 14, curY, '/F2', 8.5, [0.14, 0.15, 0.18]);
        } else {
          text(bl, MARGIN_LEFT + 14, curY, '/F2', 8.5, [0.14, 0.15, 0.18]);
        }
        curY -= 11.5;
      });
      curY -= 1.5;
    });
    curY -= 6;
  });

  // --- 5. EDUCATION ---
  sectionTitle('Education & Academic Credentials', 'ADDIS ABABA UNIVERSITY');
  ensureSpace(28);

  text(client.degree || 'Accounting & Finance / Business Information', MARGIN_LEFT, curY, '/F1', 9.2, [0.08, 0.08, 0.12]);
  const schoolText = ' — ' + (client.school || 'Addis Ababa University');
  text(schoolText, MARGIN_LEFT + 225, curY, '/F3', 8.8, [0.25, 0.28, 0.35]);
  const eduYear = client.educationYear || '2026';
  text(eduYear, MARGIN_LEFT + USABLE_WIDTH - 25, curY, '/F1', 8.5, [0.25, 0.28, 0.35]);
  curY -= 11.5;

  const honors = `Academic Standing: GPA ${client.gpa || '3.8'}  -  Dean's Honors List  -  Focus in Information Systems & Financial Record Management`;
  text(honors, MARGIN_LEFT, curY, '/F2', 8.2, [0.35, 0.38, 0.45]);
  curY -= 12;

  // Add final page
  if (curStream.length > 0) pages.push(curStream.join('\n'));

  // Assemble PDF Objects
  let body = '%PDF-1.4\n';
  const offsets = [];
  function addObj(str) {
    offsets.push(body.length);
    body += str;
  }

  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  const numPages = pages.length;
  const pageObjIndices = [];
  let nextObj = 3;
  for (let i = 0; i < numPages; i++) {
    pageObjIndices.push({ page: nextObj, content: nextObj + 1 });
    nextObj += 2;
  }

  const fontF1 = nextObj++;
  const fontF2 = nextObj++;
  const fontF3 = nextObj++;
  const fontF4 = nextObj++;

  const kidsStr = pageObjIndices.map(p => `${p.page} 0 R`).join(' ');
  addObj(`2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${numPages} >>\nendobj\n`);

  for (let i = 0; i < numPages; i++) {
    const p = pageObjIndices[i];
    const streamData = pages[i];
    const streamLen = streamData.length;
    
    addObj(`${p.page} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontF1} 0 R /F2 ${fontF2} 0 R /F3 ${fontF3} 0 R /F4 ${fontF4} 0 R >> >> /Contents ${p.content} 0 R >>\nendobj\n`);
    addObj(`${p.content} 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamData}\nendstream\nendobj\n`);
  }

  addObj(`${fontF1} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);
  addObj(`${fontF2} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);
  addObj(`${fontF3} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj\n`);
  addObj(`${fontF4} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>\nendobj\n`);

  const startXref = body.length;
  let xref = `xref\n0 ${nextObj}\n0000000000 65535 f \n`;
  offsets.forEach(off => {
    xref += off.toString().padStart(10, '0') + ' 00000 n \n';
  });
  body += xref;
  body += `trailer\n<< /Size ${nextObj} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  const buf = new Uint8Array(body.length);
  for (let i = 0; i < body.length; i++) {
    buf[i] = body.charCodeAt(i) & 0xFF;
  }
  return buf;
}

function generateValidPDFBlob(client, jobInfo = {}) {
  const binary = generateValidPDFBinary(client, jobInfo);
  return new Blob([binary], { type: 'application/pdf' });
}

// ========================================================================
// BESPOKE CANVA-GRADE TAILORED COVER LETTER GENERATOR
// Perfectly styled to match the Executive Masterwork Resume
// 100% Free • Print-to-PDF Ready • 1-Click Form Attachment Engine
// ========================================================================

function generateTailoredCoverLetterText(client, jobInfo = {}) {
  const company = (jobInfo.company && !['Target Company', 'Enterprise Company', 'Hiring Company'].includes(jobInfo.company))
    ? jobInfo.company
    : 'your organization';
  const role = jobInfo.title || client.headline || 'Virtual Assistant & Data Entry Specialist';
  const skills = getTailoredSkills(client.skills, jobInfo.keywords);
  const topSkillsStr = (skills && skills.length > 0) ? skills.slice(0, 5).join(', ') : 'Virtual Assistant, Data Entry, Google Sheets, Excel Formulas, Web Research';
  const years = client.yearsOfExperience || client.yearsBE || (client.experience && client.experience.length > 2 ? '3+' : '3+');
  const exps = client.experience || [];
  const primaryExp = exps[0] || {};
  const secondaryExp = exps[1] || {};

  const bullet1 = (primaryExp.bullets && primaryExp.bullets[0]) ||
    'Entered, organized, and cleaned 1,000+ data records weekly across Google Sheets and Excel with 99.8% verified accuracy.';
  const bullet2 = (primaryExp.bullets && primaryExp.bullets[1]) || (secondaryExp.bullets && secondaryExp.bullets[0]) ||
    'Managed executive inbox communications, calendar scheduling, and cloud files across US/EU time zones with zero missed appointments.';
  const bullet3 = (secondaryExp.bullets && secondaryExp.bullets[1]) ||
    'Conducted targeted online research to build verified lead directories and customer contact lists for fast business outreach.';

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  let letter = `${client.name}\n${client.headline || role}\n`;
  letter += `${client.loc || 'Addis Ababa, Ethiopia (Remote Worldwide)'} • ${client.phone} • ${client.email}\n`;
  if (client.linkedin) letter += `LinkedIn: ${client.linkedin}\n`;
  if (client.portfolio) letter += `Portfolio: ${client.portfolio}\n`;
  letter += `\n${today}\n\n`;
  letter += `Hiring & Operations Team\n`;
  letter += `${company}\n\n`;
  letter += `RE: Application for ${role} — ${client.name}\n\n`;
  letter += `Dear Hiring Team at ${company},\n\n`;
  letter += `I am writing to express my strong enthusiasm for the ${role} position at ${company}. Having followed your business and operational focus, I am deeply impressed by your commitment to efficiency, high quality, and team excellence. With over ${years} years of dedicated experience supporting remote teams with high-speed data entry (65+ WPM), spreadsheet organization, and proactive virtual assistance, I am confident in my ability to immediately accelerate your team's daily productivity.\n\n`;
  letter += `Throughout my work at ${primaryExp.company || 'Nexa Digital Team'} and ${secondaryExp.company || 'remote digital clients'}, I have specialized in solving administrative bottlenecks and ensuring flawless data accuracy:\n\n`;
  letter += `• ${bullet1}\n`;
  letter += `• ${bullet2}\n`;
  letter += `• ${bullet3}\n\n`;
  letter += `Your focus on ${topSkillsStr} directly matches my day-to-day expertise. I combine 65+ WPM typing speed with a verified 99.8% accuracy rate, strong Google Sheets/Excel formula skills, and dependable timezone overlap. Backed by Nexa Digital Team (${client.portfolio || 'https://nexa-portfolio-theta.vercel.app/'}), I bring reliable collaboration and an owner's mindset to every assignment.\n\n`;
  letter += `I would welcome the opportunity to discuss how my virtual assistance and data operations background can deliver immediate leverage for ${company}. Thank you for your time, consideration, and review of my application.\n\n`;
  letter += `Warm regards,\n\n`;
  letter += `${client.name}\n`;
  letter += `${client.headline || role}\n`;
  letter += `${client.email} | ${client.phone}\n`;

  return letter;
}

function generateCanvaCoverLetterHTML(client, jobInfo = {}, templateType = 'executive') {
  const company = (jobInfo.company && !['Target Company', 'Enterprise Company', 'Hiring Company'].includes(jobInfo.company))
    ? jobInfo.company
    : 'Hiring Team';
  const role = jobInfo.title || client.headline || 'Virtual Assistant & Data Entry Specialist';
  const skills = getTailoredSkills(client.skills, jobInfo.keywords);
  const topSkillsStr = (skills && skills.length > 0) ? skills.slice(0, 5).join(', ') : 'Virtual Assistant, Data Entry, Google Sheets, Excel Formulas, Web Research';
  const years = client.yearsOfExperience || client.yearsBE || (client.experience && client.experience.length > 2 ? '3+' : '3+');
  const exps = client.experience || [];
  const primaryExp = exps[0] || {};
  const secondaryExp = exps[1] || {};

  const bullet1 = (primaryExp.bullets && primaryExp.bullets[0]) ||
    'Entered, organized, and cleaned 1,000+ data records weekly across Google Sheets and Excel with 99.8% verified accuracy.';
  const bullet2 = (primaryExp.bullets && primaryExp.bullets[1]) || (secondaryExp.bullets && secondaryExp.bullets[0]) ||
    'Managed executive inbox communications, calendar scheduling, and cloud files across US/EU time zones with zero missed appointments.';
  const bullet3 = (secondaryExp.bullets && secondaryExp.bullets[1]) ||
    'Conducted targeted online research to build verified lead directories and customer contact lists for fast business outreach.';

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const rawText = generateTailoredCoverLetterText(client, jobInfo);
  const safeTextForJs = rawText.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${client.name} — ${role} Cover Letter (${company})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: letter; margin: 12mm 14mm; }
    body {
      background: #f4f4f5;
      color: #09090b;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 24px 16px;
      line-height: 1.5;
      font-size: 10pt;
      -webkit-font-smoothing: antialiased;
    }
    .screen-toolbar {
      max-width: 8.5in;
      margin: 0 auto 16px;
      background: #141416;
      border: 1px solid #27272a;
      border-radius: 10px;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
      color: #fafaf9;
    }
    .toolbar-tag {
      font-size: 10px;
      font-weight: 700;
      background: rgba(0, 122, 255, 0.15);
      border: 1px solid #007aff;
      color: #60a5fa;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .toolbar-actions { display: flex; align-items: center; gap: 8px; }
    .btn-tool {
      background: #007aff;
      color: #FFFFFF;
      border: none;
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-tool:hover { background: #0062cc; }
    .btn-tool-outline {
      background: transparent;
      border: 1px solid #3f3f46;
      color: #e4e4e7;
    }
    .btn-tool-outline:hover { background: #27272a; border-color: #52525b; }
    .btn-tool-attach {
      background: #10b981;
      color: #022c22;
    }
    .btn-tool-attach:hover { background: #059669; }
    .letter-page {
      width: 8.5in;
      min-height: 11in;
      margin: 0 auto;
      background: #ffffff;
      padding: 0.65in 0.75in;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      border-radius: 4px;
      color: #18181b;
    }
    .letter-header { margin-bottom: 20px; }
    .candidate-name {
      font-size: 24pt;
      font-weight: 800;
      color: #09090b;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }
    .candidate-headline {
      font-size: 11pt;
      font-weight: 700;
      color: #007aff;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-top: 4px;
    }
    .contact-row {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 9.5pt;
      color: #52525b;
      align-items: center;
    }
    .contact-item { display: inline-flex; align-items: center; gap: 4px; }
    .contact-sep { color: #d4d4d8; }
    .accent-bar {
      height: 3px;
      background: linear-gradient(90deg, #007aff 0%, #38bdf8 100%);
      margin: 14px 0 22px;
      border-radius: 2px;
    }
    .date-block {
      font-size: 10pt;
      color: #71717a;
      font-weight: 600;
      margin-bottom: 14px;
    }
    .recipient-block {
      font-size: 10pt;
      line-height: 1.5;
      margin-bottom: 16px;
      color: #27272a;
    }
    .subject-pill {
      background: #f4f4f5;
      border-left: 3.5px solid #007aff;
      padding: 9px 14px;
      font-size: 10.5pt;
      font-weight: 700;
      color: #09090b;
      margin: 18px 0;
      border-radius: 0 6px 6px 0;
    }
    .salutation {
      font-size: 11pt;
      font-weight: 700;
      color: #09090b;
      margin-bottom: 14px;
    }
    .letter-body p {
      font-size: 10.5pt;
      line-height: 1.65;
      color: #18181b;
      margin-bottom: 14px;
      text-align: justify;
    }
    .bullet-list {
      margin: 14px 0 18px 24px;
    }
    .bullet-list li {
      font-size: 10pt;
      line-height: 1.55;
      color: #27272a;
      margin-bottom: 8px;
    }
    .signoff-block {
      margin-top: 24px;
      font-size: 10.5pt;
      line-height: 1.5;
    }
    .signoff-name {
      font-weight: 800;
      font-size: 12pt;
      color: #09090b;
      margin-top: 18px;
    }
    .signoff-title {
      font-size: 10pt;
      font-weight: 700;
      color: #007aff;
    }
    .signoff-meta {
      font-size: 9pt;
      color: #71717a;
      margin-top: 3px;
    }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; }
      .screen-toolbar { display: none !important; }
      .letter-page {
        width: 100% !important;
        min-height: auto !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
    }
  </style>
</head>
<body>
  <!-- Screen Control Toolbar -->
  <div class="screen-toolbar">
    <div class="toolbar-brand">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <span>JobAssist Canva Studio</span>
      <span class="toolbar-tag">Executive Cover Letter</span>
      <span style="color:#71717a; font-size:11px;">Tailored for ${company}</span>
    </div>
    <div class="toolbar-actions">
      <button onclick="window.print()" class="btn-tool" title="Print to PDF or Save Paperless">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Print / Save PDF
      </button>
      <button id="btn-copy-cover" class="btn-tool btn-tool-outline" title="Copy full cover letter to clipboard">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copy Text
      </button>
      <button id="btn-dl-cover-pdf" class="btn-tool btn-tool-outline" title="Download standalone PDF document">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download .PDF
      </button>
      <button id="btn-attach-cover-action" class="btn-tool btn-tool-attach" title="Attach to open application form">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        Attach Cover Letter
      </button>
    </div>
  </div>

  <!-- Document Page Container -->
  <div class="letter-page">
    <!-- Header Letterhead (Canva Standard) -->
    <header class="letter-header">
      <h1 class="candidate-name">${client.name}</h1>
      <div class="candidate-headline">${client.headline || role}</div>
      <div class="contact-row">
        <span class="contact-item">${client.loc || 'Austin, TX'}</span>
        <span class="contact-sep">•</span>
        <span class="contact-item">${client.phone}</span>
        <span class="contact-sep">•</span>
        <span class="contact-item">${client.email}</span>
        ${client.linkedin ? `<span class="contact-sep">•</span><span class="contact-item">${client.linkedin.replace('https://www.', '')}</span>` : ''}
        ${client.portfolio ? `<span class="contact-sep">•</span><span class="contact-item">${client.portfolio.replace('https://', '')}</span>` : ''}
      </div>
      <div class="accent-bar"></div>
    </header>

    <!-- Date & Addressee Block -->
    <div class="date-block">${today}</div>
    <div class="recipient-block">
      <div>Technical Talent Acquisition Team</div>
      <div style="font-weight: 700; color: #09090b; font-size: 11pt;">${company}</div>
    </div>

    <!-- Subject Pill -->
    <div class="subject-pill">
      RE: Application for ${role} — ${client.name}
    </div>

    <!-- Letter Body -->
    <div class="letter-body">
      <div class="salutation">Dear Hiring Team at ${company},</div>

      <p>
        I am writing to express my strong enthusiasm for the <strong>${role}</strong> opening at <strong>${company}</strong>. Having followed ${company}'s ongoing innovation and technical impact, I am deeply inspired by your team's commitment to operational reliability, scalable architecture, and engineering velocity. With over <strong>${years} years</strong> of specialized engineering experience architecting resilient data pipelines, distributed systems, and cloud-native integrations, I am eager to leverage this background to immediately accelerate ${company}'s technical roadmap.
      </p>

      <p>
        Throughout my career across enterprise platforms including <strong>${primaryExp.company || 'Givebutter'}</strong> and <strong>${secondaryExp.company || 'Workrise'}</strong>, I have focused on solving mission-critical data scalability, integration, and operational reliability challenges under rigorous enterprise SLAs:
      </p>

      <ul class="bullet-list">
        <li>${bullet1}</li>
        <li>${bullet2}</li>
        <li>${bullet3}</li>
      </ul>

      <p>
        ${company}'s focus on <strong>${topSkillsStr}</strong> directly represents the exact technical challenges where I deliver the highest leverage. I combine deep hands-on mastery in modern data and cloud tooling with a disciplined, metric-driven approach to automated schema validation, performance optimization, and zero-downtime maintenance. Furthermore, I bring an async-first, collaborative mindset and an owner's discipline focused on long-term system maintainability and developer velocity.
      </p>

      <p>
        I would welcome the opportunity to speak with you regarding how my hands-on background and execution discipline can support ${company}'s upcoming milestones. Thank you for your time, consideration, and review of my application materials.
      </p>

      <div class="signoff-block">
        <div>Sincerely,</div>
        <div class="signoff-name">${client.name}</div>
        <div class="signoff-title">${client.headline || role}</div>
        <div class="signoff-meta">${client.email} | ${client.phone} | ${client.loc || 'Austin, TX'}</div>
      </div>
    </div>
  </div>

  <script>
    const coverText = \`${safeTextForJs}\`;
    
    document.getElementById('btn-copy-cover').addEventListener('click', () => {
      navigator.clipboard.writeText(coverText);
      const btn = document.getElementById('btn-copy-cover');
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Copied!';
      setTimeout(() => btn.innerHTML = orig, 2000);
    });

    document.getElementById('btn-dl-cover-pdf').addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-attach-cover-action').addEventListener('click', () => {
      // Trigger extension or parent window message
      if (window.opener) {
        window.opener.postMessage({ action: 'jobassist_attach_cover_letter', jobCompany: '${company}', jobTitle: '${role}' }, '*');
      }
      alert('Cover Letter synthesized and ready! Use "Attach Cover Letter" in JobAssist to inject directly into your ATS upload box.');
    });
  </script>
</body>
</html>`;
}

function generateValidCoverLetterPDFBinary(client, jobInfo = {}) {
  const company = (jobInfo.company && !['Target Company', 'Enterprise Company'].includes(jobInfo.company))
    ? jobInfo.company
    : 'Hiring Organization';
  const role = jobInfo.title || client.headline || 'Virtual Assistant & Data Operations Specialist';
  const letterText = generateTailoredCoverLetterText(client, jobInfo);

  const PAGE_WIDTH = 612;
  const PAGE_HEIGHT = 792;
  const MARGIN_LEFT = 40;
  const USABLE_WIDTH = 532;
  const MARGIN_BOTTOM = 45;
  const TOP_MARGIN = 748;

  const pages = [];
  let curStream = [];
  let curY = TOP_MARGIN;

  function newPage() {
    if (curStream.length > 0) pages.push(curStream.join('\n'));
    curStream = [];
    curY = TOP_MARGIN;
  }

  function ensureSpace(needed) {
    if (curY - needed < MARGIN_BOTTOM) newPage();
  }

  function esc(s) {
    if (!s) return '';
    return String(s)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/[^\x20-\x7E]/g, (ch) => {
        if (ch === '•') return ' - ';
        if (ch === '—' || ch === '–') return ' - ';
        if (ch === '’' || ch === '‘') return "'";
        if (ch === '“' || ch === '”') return '"';
        return ' ';
      });
  }

  function wrapText(text, maxChars = 84) {
    if (!text) return [];
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = '';
    for (const w of words) {
      if (!cur) cur = w;
      else if ((cur + ' ' + w).length <= maxChars) cur += ' ' + w;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function text(str, x, y, font = '/F2', size = 9, color = [0.1, 0.1, 0.12]) {
    curStream.push(`${color[0]} ${color[1]} ${color[2]} rg`);
    curStream.push(`BT ${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${esc(str)}) Tj ET`);
  }

  function line(x1, y1, x2, y2, width = 0.75, color = [0.2, 0.2, 0.25]) {
    curStream.push(`${color[0]} ${color[1]} ${color[2]} RG`);
    curStream.push(`${width} w`);
    curStream.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  // Header
  text(client.name || 'Candidate Name', MARGIN_LEFT, curY, '/F4', 20, [0.05, 0.05, 0.08]);
  curY -= 16;

  text(role.toUpperCase(), MARGIN_LEFT, curY, '/F1', 9.5, [0.12, 0.25, 0.50]);
  curY -= 12;

  const contactLine = `${client.loc || 'Addis Ababa, Ethiopia (Remote Worldwide)'}  |  ${client.phone || '0948232719'}  |  ${client.email || ''}  |  Remote B2B (W-8BEN)`;
  text(contactLine, MARGIN_LEFT, curY, '/F2', 8.2, [0.28, 0.32, 0.38]);
  curY -= 8;

  line(MARGIN_LEFT, curY, MARGIN_LEFT + USABLE_WIDTH, curY, 1.25, [0.1, 0.1, 0.15]);
  curY -= 16;

  // Date & Recipient
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  text(dateStr, MARGIN_LEFT, curY, '/F1', 8.5, [0.25, 0.28, 0.35]);
  curY -= 14;

  text(`Hiring Team  -  ${company}`, MARGIN_LEFT, curY, '/F1', 9, [0.1, 0.1, 0.15]);
  curY -= 11;
  text('Application for: ' + role, MARGIN_LEFT, curY, '/F3', 8.5, [0.25, 0.28, 0.35]);
  curY -= 15;

  // Split letter into paragraphs
  const rawParas = letterText.split(/\n\s*\n/);
  rawParas.forEach(p => {
    const trimmed = p.trim();
    if (!trimmed) return;
    ensureSpace(24);
    const wrapped = wrapText(trimmed, 84);
    wrapped.forEach(wl => {
      ensureSpace(12);
      text(wl, MARGIN_LEFT, curY, '/F2', 8.8, [0.12, 0.12, 0.15]);
      curY -= 12.2;
    });
    curY -= 8;
  });

  if (curStream.length > 0) pages.push(curStream.join('\n'));

  let body = '%PDF-1.4\n';
  const offsets = [];
  function addObj(str) {
    offsets.push(body.length);
    body += str;
  }

  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  const numPages = pages.length;
  const pageObjIndices = [];
  let nextObj = 3;
  for (let i = 0; i < numPages; i++) {
    pageObjIndices.push({ page: nextObj, content: nextObj + 1 });
    nextObj += 2;
  }

  const fontF1 = nextObj++;
  const fontF2 = nextObj++;
  const fontF3 = nextObj++;
  const fontF4 = nextObj++;

  const kidsStr = pageObjIndices.map(p => `${p.page} 0 R`).join(' ');
  addObj(`2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${numPages} >>\nendobj\n`);

  for (let i = 0; i < numPages; i++) {
    const p = pageObjIndices[i];
    const streamData = pages[i];
    const streamLen = streamData.length;
    
    addObj(`${p.page} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontF1} 0 R /F2 ${fontF2} 0 R /F3 ${fontF3} 0 R /F4 ${fontF4} 0 R >> >> /Contents ${p.content} 0 R >>\nendobj\n`);
    addObj(`${p.content} 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamData}\nendstream\nendobj\n`);
  }

  addObj(`${fontF1} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);
  addObj(`${fontF2} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);
  addObj(`${fontF3} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj\n`);
  addObj(`${fontF4} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>\nendobj\n`);

  const startXref = body.length;
  let xref = `xref\n0 ${nextObj}\n0000000000 65535 f \n`;
  offsets.forEach(off => {
    xref += off.toString().padStart(10, '0') + ' 00000 n \n';
  });
  body += xref;
  body += `trailer\n<< /Size ${nextObj} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  const buf = new Uint8Array(body.length);
  for (let i = 0; i < body.length; i++) {
    buf[i] = body.charCodeAt(i) & 0xFF;
  }
  return buf;
}

function generateValidCoverLetterPDFBlob(client, jobInfo = {}) {
  const binary = generateValidCoverLetterPDFBinary(client, jobInfo);
  return new Blob([binary], { type: 'application/pdf' });
}

if (typeof globalThis !== 'undefined') {
  globalThis.generateExecutiveMasterworkResume = generateExecutiveMasterworkResume;
  globalThis.generateCanvaResumeHTML = generateCanvaResumeHTML;
  globalThis.generatePlainTextResume = generatePlainTextResume;
  globalThis.generateValidPDFBinary = generateValidPDFBinary;
  globalThis.generateValidPDFBlob = generateValidPDFBlob;
  globalThis.generateTailoredCoverLetterText = generateTailoredCoverLetterText;
  globalThis.generateCanvaCoverLetterHTML = generateCanvaCoverLetterHTML;
  globalThis.generateValidCoverLetterPDFBinary = generateValidCoverLetterPDFBinary;
  globalThis.generateValidCoverLetterPDFBlob = generateValidCoverLetterPDFBlob;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateExecutiveMasterworkResume,
    generateCanvaResumeHTML,
    generatePlainTextResume,
    generateValidPDFBinary,
    generateValidPDFBlob,
    generateTailoredCoverLetterText,
    generateCanvaCoverLetterHTML,
    generateValidCoverLetterPDFBinary,
    generateValidCoverLetterPDFBlob
  };
}
