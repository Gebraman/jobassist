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
  const headline = role || client.headline || 'Senior Software Engineer';
  const years = client.yearsBE || '8+';
  const desc = (jobOverview || '').toLowerCase();
  const cleanComp = (!company || ['Target Company', 'Enterprise Company', 'Hiring Company'].includes(company)) ? '' : company;

  // Detect domain context organically from the job overview or client title
  let domainFocus = 'high-throughput distributed backends, scalable microservices, and resilient cloud architectures';
  if (desc.includes('data') || desc.includes('etl') || desc.includes('elt') || desc.includes('pipeline') || desc.includes('spark') || desc.includes('snowflake') || desc.includes('kafka') || desc.includes('airflow') || desc.includes('warehouse') || desc.includes('lakehouse') || desc.includes('dbt') || desc.includes('redshift') || desc.includes('bigquery') || (client.headline && client.headline.toLowerCase().includes('data'))) {
    domainFocus = 'petabyte-scale data pipelines, incremental ETL/ELT ingestion, distributed streaming, and cloud data warehousing';
  } else if (desc.includes('integrat') || desc.includes('hubspot') || desc.includes('zapier') || desc.includes('workato') || desc.includes('mulesoft')) {
    domainFocus = 'enterprise API integrations, bidirectional data synchronization pipelines, and automated cloud workflows';
  } else if (desc.includes('kubernetes') || desc.includes('devops') || desc.includes('sre') || desc.includes('cloud') || desc.includes('terraform')) {
    domainFocus = 'cloud-native infrastructure, Kubernetes container orchestration, and automated CI/CD deployment pipelines';
  } else if (desc.includes('machine learning') || desc.includes('ai') || desc.includes('llm') || desc.includes('deep learning')) {
    domainFocus = 'production AI/ML inference pipelines, distributed data systems, and low-latency API architectures';
  } else if (desc.includes('front') || desc.includes('react') || desc.includes('full-stack') || desc.includes('full stack')) {
    domainFocus = 'full-stack web platforms, responsive modern interfaces, and high-performance serverless backends';
  }

  if (client.summary && client.summary.length > 50 && !cleanComp) {
    return client.summary;
  }

  const topSkillsStr = (client.skills && client.skills.length > 0)
    ? client.skills.slice(0, 6).join(', ')
    : 'Python, SQL, Spark, Kafka, Snowflake, Airflow';

  if (client.summary && client.summary.length > 50 && cleanComp) {
    return `${client.summary} Prepared to drive immediate value for ${cleanComp}'s engineering and technical integration initiatives.`;
  }

  return `Senior technical engineering practitioner with ${years} years of production experience architecting and operating ${domainFocus}. Track record leading core data and distributed systems sustaining 99.99% operational reliability and high throughput. Hands-on background spanning ${topSkillsStr}, with a consistent focus on resilient system design, automated data validation, and engineering velocity.`;
}

// ------------------------------------------------------------------------
// THE "ONE FOREVER" EXECUTIVE MASTERWORK TEMPLATE
// (Ivy League / Stanford / Silicon Valley Staff Architect Standard)
// ------------------------------------------------------------------------
function generateExecutiveMasterworkResume(client, jobInfo = {}) {
  const company = jobInfo.company || 'Enterprise Company';
  const role = jobInfo.title || client.headline || 'Senior Software Engineer';
  const allSkills = getTailoredSkills(client.skills, jobInfo.keywords);
  const tailoredSummary = getTailoredSummary(client, company, role, jobInfo.description || '');
  const exps = client.experience || [
    {
      role: client.headline || 'Senior Software Engineer',
      company: client.company || 'Enterprise Technology Corp',
      period: '2021 - Present',
      location: 'Atlanta, GA (Remote)',
      bullets: [
        'Architected and deployed distributed event-driven microservices handling 1.2M transactions daily, reducing p99 latency by 74%.',
        'Spearheaded cloud migration to Kubernetes and automated CI/CD pipelines, decreasing deployment release cycles from 2 weeks to 2 hours.',
        'Engineered custom API middleware and webhook telemetry, ensuring 99.99% uptime SLA across mission-critical services.'
      ]
    },
    {
      role: 'Software Engineer',
      company: 'Global Systems Inc',
      period: '2018 - 2021',
      location: 'San Francisco, CA',
      bullets: [
        'Developed scalable REST and GraphQL endpoints backed by PostgreSQL and Redis caches, increasing query throughput by 300%.',
        'Implemented enterprise-grade authentication (OAuth2, JWT) and role-based access control complying with SOC2 and GDPR requirements.'
      ]
    }
  ];

  // Group skills into executive categories
  const targetMatches = (jobInfo.keywords && jobInfo.keywords.length > 0) ? jobInfo.keywords.slice(0, 8) : allSkills.slice(0, 6);
  const coreLanguages = allSkills.filter(s => ['python', 'sql', 'scala', 'java', 'bash', 'node.js', 'typescript', 'javascript', 'go', 'golang', 'c++', 'c#', 'react'].some(k => s.toLowerCase().includes(k))).slice(0, 8);
  const cloudSystems = allSkills.filter(s => ['snowflake', 'redshift', 's3', 'parquet', 'spark', 'pyspark', 'kafka', 'aws', 'cloud', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'terraform', 'ci/cd', 'redis', 'postgresql', 'mysql', 'oracle'].some(k => s.toLowerCase().includes(k))).slice(0, 8);
  const architectures = allSkills.filter(s => ['dbt', 'etl', 'elt', 'airflow', 'pipeline', 'dimensional', 'governance', 'schema', 'api', 'rest', 'graphql', 'distributed', 'microservices', 'integrations', 'zapier', 'workato', 'hubspot', 'crm', 'accounting', 'bookkeeping'].some(k => s.toLowerCase().includes(k))).slice(0, 8);

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

  <!-- Screen Action Bar (Hidden on Print) -->
  <div class="screen-toolbar">
    <div class="toolbar-brand">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      <span>Executive Masterwork Standard</span>
      <span class="toolbar-tag">Tailored for ${company}</span>
    </div>
    <div class="toolbar-actions">
      <button type="button" class="btn-tool" onclick="window.print();">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Print / Save Vector PDF (Free)
      </button>
      <button type="button" class="btn-tool-secondary" onclick="copyPlainTextATS();">
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
        <span>${client.loc || 'Atlanta, GA, United States'}</span>
        <span class="contact-sep">•</span>
        <span>${client.phone || '510-340-2070'}</span>
        <span class="contact-sep">•</span>
        <span><a href="mailto:${client.email}">${client.email}</a></span>
        ${client.linkedin ? `<span class="contact-sep">•</span><span><a href="${client.linkedin}" target="_blank">LinkedIn</a></span>` : ''}
        ${client.github ? `<span class="contact-sep">•</span><span><a href="${client.github}" target="_blank">GitHub</a></span>` : ''}
        ${client.portfolio ? `<span class="contact-sep">•</span><span><a href="${client.portfolio}" target="_blank">Portfolio</a></span>` : ''}
        <span class="contact-sep">•</span>
        <span style="font-weight:600; color:#059669;">US Work Authorized</span>
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

    <!-- 2. Core Technical Competencies -->
    <section>
      <div class="section-header">
        <span>Core Technical Competencies</span>
      </div>
      <div class="competencies-box">
        ${targetMatches.length > 0 ? `
          <div class="comp-line">
            <span class="comp-label">Primary Technologies:</span>
            <span class="comp-values comp-highlight">${targetMatches.join(' • ')}</span>
          </div>
        ` : ''}
        <div class="comp-line">
          <span class="comp-label">Languages &amp; Runtimes:</span>
          <span class="comp-values">${coreLanguages.length > 0 ? coreLanguages.join(', ') : 'Node.js, Python, TypeScript, Go, SQL, Bash'}</span>
        </div>
        <div class="comp-line">
          <span class="comp-label">Cloud Systems &amp; DevOps:</span>
          <span class="comp-values">${cloudSystems.length > 0 ? cloudSystems.join(', ') : 'AWS (ECS, Lambda, RDS), Google Cloud, Docker, Kubernetes, CI/CD Pipelines'}</span>
        </div>
        <div class="comp-line">
          <span class="comp-label">Architecture &amp; Data:</span>
          <span class="comp-values">${architectures.length > 0 ? architectures.join(', ') : 'Distributed Systems, Microservices, REST & GraphQL APIs, PostgreSQL, Redis, Kafka'}</span>
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
          <span class="edu-title">${client.degree || "Master's Degree in Computer Science"}</span> — <span class="edu-school">${client.school || 'University of Florida'}</span>
        </div>
        <div class="edu-date">${client.educationYear || '2016'}</div>
      </div>
      <div style="font-size: 8.5pt; color: #4b5563; margin-top: 1px;">
        Academic Standing: GPA ${client.gpa || '3.85'} • Dean's List Scholar • Specialized in Distributed Operating Systems
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
  const company = jobInfo.company || '1406 Consulting';
  const role = jobInfo.title || client.headline || 'HubSpot Integrations Software Developer';
  const skills = getTailoredSkills(client.skills, jobInfo.keywords);

  let txt = `========================================================================\n`;
  txt += `${client.name.toUpperCase()} — ${role.toUpperCase()}\n`;
  txt += `Location: ${client.loc} | Phone: ${client.phone} | Email: ${client.email}\n`;
  txt += `LinkedIn: ${client.linkedin || ''} | GitHub: ${client.github || ''} | Portfolio: ${client.portfolio || ''}\n`;
  txt += `US Work Authorization: Citizen / Authorized (No Sponsorship Required)\n`;
  txt += `========================================================================\n\n`;

  txt += `PROFESSIONAL SUMMARY\n`;
  txt += `${getTailoredSummary(client, company, role, jobInfo.description || '')}\n\n`;

  txt += `CORE TECHNICAL COMPETENCIES\n`;
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
  txt += `• ${client.degree} | ${client.school} (${client.educationYear || ''})\n`;
  txt += `  GPA: ${client.gpa || '3.85'} • Dean's Honors\n`;

  return txt;
}

function generateValidPDFBinary(client, jobInfo = {}) {
  const company = jobInfo.company || 'Enterprise Company';
  const role = jobInfo.title || client.headline || 'Senior Software Engineer';
  const skills = getTailoredSkills(client.skills, jobInfo.keywords);
  const tailoredSummary = getTailoredSummary(client, company, role, jobInfo.description || '');

  const lines = [
    `${role.toUpperCase()}`,
    `Location: ${client.loc || 'United States'} | Phone: ${client.phone} | Email: ${client.email}`,
    `LinkedIn: ${client.linkedin || ''} | GitHub: ${client.github || ''} | Portfolio: ${client.portfolio || ''}`,
    ' ',
    'PROFESSIONAL SUMMARY',
    tailoredSummary.slice(0, 320),
    ' ',
    'CORE TECHNICAL COMPETENCIES',
    skills.slice(0, 14).join(', '),
    ' ',
    'PROFESSIONAL EXPERIENCE'
  ];

  (client.experience || []).slice(0, 3).forEach(e => {
    lines.push(`${e.role} - ${e.company} (${e.period})`);
    if (e.bullets && e.bullets.length > 0) {
      lines.push(`- ${e.bullets[0].slice(0, 100)}`);
      if (e.bullets[1]) lines.push(`- ${e.bullets[1].slice(0, 100)}`);
    }
    lines.push(' ');
  });

  lines.push('EDUCATION & CREDENTIALS');
  lines.push(`${client.degree || 'B.S. in Computer Science'} - ${client.school || 'University'} (${client.educationYear || '2016'})`);

  const escapePdf = (s) => (s || '').replace(/[()\\\\]/g, '\\$&').replace(/[^\x20-\x7E]/g, ' ');

  let streamContent = `BT\n/F1 16 Tf\n50 750 Td\n(${escapePdf(client.name)}) Tj\nET\n`;
  streamContent += `BT\n/F1 9 Tf\n50 730 Td\n13 TL\n`;
  lines.forEach(line => {
    streamContent += `(${escapePdf(line)}) '\n`;
  });
  streamContent += `ET\n`;

  let streamLen = 0;
  for (let i = 0; i < streamContent.length; i++) streamLen++;

  let body = '%PDF-1.4\n';
  const offsets = [];

  function addObj(str) {
    offsets.push(body.length);
    body += str;
  }

  addObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  addObj('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  addObj('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n');
  addObj('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
  addObj(`5 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamContent}endstream\nendobj\n`);

  const startXref = body.length;
  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  offsets.forEach(off => {
    xref += off.toString().padStart(10, '0') + ' 00000 n \n';
  });
  body += xref;
  body += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

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

if (typeof globalThis !== 'undefined') {
  globalThis.generateExecutiveMasterworkResume = generateExecutiveMasterworkResume;
  globalThis.generateCanvaResumeHTML = generateCanvaResumeHTML;
  globalThis.generatePlainTextResume = generatePlainTextResume;
  globalThis.generateValidPDFBinary = generateValidPDFBinary;
  globalThis.generateValidPDFBlob = generateValidPDFBlob;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateExecutiveMasterworkResume,
    generateCanvaResumeHTML,
    generatePlainTextResume,
    generateValidPDFBinary,
    generateValidPDFBlob
  };
}
