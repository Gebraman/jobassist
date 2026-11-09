// Autonomous AI Screening Answer Synthesizer — Nexa Digital Team
// Tailored specifically for Virtual Assistant, Data Entry, Spreadsheet Organization,
// Customer Support, Web Research, Canva Design, and AI Workflow Support roles.

function synthesizeScreeningAnswer(questionText, client = {}, jobInfo = {}, tone = 'star') {
  const q = (questionText || '').toLowerCase().trim();
  const company = jobInfo.company || 'your team';
  const role = jobInfo.title || client.headline || client.targetRole || 'Virtual Assistant';
  const cName = client.name || 'Gebremedhin Endeshawe (Gman)';
  const cCompany = client.currentEmployer || client.company || 'Nexa Digital Team';
  const cYears = client.yearsBE || (client.experience ? String(client.experience).replace(/[^0-9]/g, '') : '3') || '3';
  const cSkills = (client.skills || ['Virtual Assistant', 'Data Entry', 'Google Sheets', 'Excel', 'Web Research', 'Customer Support', 'Canva Design', 'AI Workflow Systems']).slice(0, 8).join(', ');
  const cLangs = client.languages || 'English (Fluent / Professional), Amharic (Native)';
  const cNotice = client.noticePeriod || client.notice || 'Immediate';
  const cSalary = client.desiredComp || client.salary || '$12 - $18 / hr ($1,500 - $2,500 / month)';
  const cWorkAuth = client.workAuth || 'Authorized for Remote Global B2B / Freelance Contract (W-8BEN)';
  const cArrangement = client.workArrangement || 'Remote';
  const cStart = client.startDate || client.earliestStartDate || 'Immediately';

  // 1. BEHAVIORAL QUESTIONS (STAR METHOD: Situation, Task, Action, Result)
  if (q.includes('tell me about a time') || q.includes('describe a situation') || q.includes('give an example') || q.includes('tell us about a time') || q.includes('past project') || q.includes('work sample') || q.includes('tight deadline') || q.includes('high volume')) {
    if (tone === 'concise') {
      return `At ${cCompany}, I cleaned, standardized, and deduplicated 12,000+ messy customer contact records across Google Sheets ahead of an urgent CRM launch. Working with 65+ WPM typing and cross-sheet formulas (XLOOKUP & Pivot Tables), I completed the task 14 hours ahead of schedule with 99.8% verified accuracy.`;
    }
    return `Situation: At ${cCompany}, an e-commerce client required 12,000+ unorganized customer leads cleaned, formatted, and imported into their CRM before an urgent product launch.\n\nTask: As the lead data operations assistant, I was responsible for removing duplicates, verifying email structures, standardizing international phone formats, and completing quality control under a strict 48-hour deadline.\n\nAction: I built automated Google Sheets formula pipelines (TRIM, REGEXEXTRACT, XLOOKUP, and conditional formatting rules), leveraged automated deduplication, and manually spot-checked 15% random samples to guarantee zero data loss.\n\nResult: Delivered the complete verified database 14 hours ahead of deadline with 99.8% verified accuracy, enabling the client's launch campaign to achieve a 98.4% email deliverability rate.`;
  }

  // 2. MOTIVATION & WHY THIS COMPANY / ROLE
  if (q.includes('why') || q.includes('interest') || q.includes('join') || q.includes('excite') || q.includes('attract') || q.includes('about our') || q.includes('about this job') || q.includes('why work here')) {
    if (tone === 'concise') {
      return `I am excited to bring my ${cYears} years of hands-on experience in high-accuracy data entry, spreadsheet management, and proactive virtual assistance from ${cCompany} to ${company} as a ${role}, giving your team reliable daily execution.`;
    }
    return `I am enthusiastic about joining ${company} as a ${role} because I respect your focus on high standards and operational efficiency. Over the past ${cYears} years at ${cCompany}, I have specialized in taking repetitive, administrative, and research tasks off founders' plates—handling high-volume data entry with 99.8% accuracy, organizing Google Sheets/Excel workbooks, and keeping workflows moving smoothly. I would love to bring that same reliable, organized daily support to your team.`;
  }

  // 3. ACCURACY, QUALITY CONTROL & ATTENTION TO DETAIL
  if (q.includes('accuracy') || q.includes('detail') || q.includes('quality') || q.includes('mistake') || q.includes('error') || q.includes('double check') || q.includes('proofread')) {
    return `Accuracy is the cornerstone of my work. I type at 65+ WPM with a verified 99.8% accuracy rate. My standard quality assurance process involves a three-step verification loop: (1) automated formula checks and formatting validations in Excel/Sheets, (2) structured spot-checks across high-value data columns, and (3) final schema audit before submission. If an error is ever detected, I correct it immediately and implement a formatting rule so it never reoccurs.`;
  }

  // 4. SPREADSHEETS / EXCEL / GOOGLE SHEETS PROFICIENCY
  if (q.includes('excel') || q.includes('sheet') || q.includes('spreadsheet') || q.includes('vlookup') || q.includes('formula') || q.includes('pivot table') || q.includes('csv')) {
    return `I have advanced daily proficiency in Google Sheets and Microsoft Excel. My core skillset includes: VLOOKUP, XLOOKUP, INDEX/MATCH, dynamic Pivot Tables, conditional formatting rules, data validation dropdowns, deduplication, text-to-columns splitting, and CSV data migration. I specialize in turning disorganized, raw datasets into clean, structured, and easy-to-read business reports.`;
  }

  // 5. TYPING SPEED & DATA ENTRY
  if (q.includes('typing') || q.includes('wpm') || q.includes('words per minute') || q.includes('speed') || q.includes('data entry')) {
    return `My verified typing speed is 65+ WPM with 99.8% accuracy. I have extensive experience transcribing audio, copy-pasting structured records, entering e-commerce product listings, and organizing lead directories with speed and precision.`;
  }

  // 6. WHY SHOULD WE HIRE YOU / WHAT SETS YOU APART
  if (q.includes('why should we hire you') || q.includes('what sets you apart') || q.includes('what makes you unique') || q.includes('why are you the best')) {
    if (tone === 'concise') {
      return `I combine fast 65+ WPM typing and 99.8% data accuracy with proactive communication, strong spreadsheet skills, and the backup reliability of Nexa Digital Team.`;
    }
    return `What sets me apart is the combination of relentless attention to detail (99.8% verified accuracy), fast execution (65+ WPM), and self-driven problem-solving. At ${cCompany}, I do not just complete tasks; I look for ways to optimize them—creating clean templates, standardizing formatting, and using AI tools to deliver faster results. Additionally, as part of Nexa Digital Team, you get guaranteed continuity and dependable remote collaboration.`;
  }

  // 7. TOOLS & SOFTWARE PROFICIENCY
  if (q.includes('tool') || q.includes('software') || q.includes('app') || q.includes('system') || q.includes('google workspace') || q.includes('notion') || q.includes('slack') || q.includes('trello') || q.includes('asana') || q.includes('canva')) {
    return `My daily software stack includes: Google Workspace (Sheets, Docs, Drive, Gmail, Calendar), Microsoft 365 (Excel, Word, Outlook), Notion, Trello, Asana, Slack, Zoom, Canva Pro (for visual assets and thumbnails), and modern AI productivity tools (ChatGPT, Claude) for research acceleration and drafting.`;
  }

  // 8. DATA CONFIDENTIALITY, SECURITY & NDAS
  if (q.includes('confidential') || q.includes('privacy') || q.includes('security') || q.includes('nda') || q.includes('sensitive') || q.includes('trust')) {
    return `I treat client data confidentiality with absolute seriousness. I strictly adhere to NDAs, access sensitive data exclusively through encrypted 2FA-secured channels, never store client data on unauthorized personal devices, and follow strict data-handling policies with zero history of security leaks.`;
  }

  // 9. TIME ZONE, SCHEDULE & AVAILABILITY
  if (q.includes('timezone') || q.includes('time zone') || q.includes('schedule') || q.includes('hours') || q.includes('overlap') || q.includes('availability') || q.includes('work arrangement') || q.includes('remote')) {
    return `I work full-time remote (${cArrangement}) and offer flexible scheduling to provide direct overlap with US (EST, CST, PST), UK, European, and Australian business hours. I provide prompt daily communication via Slack, Teams, or email and maintain rapid response times during working hours.`;
  }

  // 10. CUSTOMER SUPPORT & COMMUNICATION
  if (q.includes('customer') || q.includes('support') || q.includes('client') || q.includes('email') || q.includes('ticket') || q.includes('chat') || q.includes('inbox')) {
    return `I have strong experience managing customer support inboxes and live chat. My approach centers on empathy, active listening, clear professional phrasing, and fast resolution. I handle inquiries, follow up on open tickets, maintain Inbox Zero, and draft helpful FAQs to improve customer satisfaction scores.`;
  }

  // 11. CANVA & CREATIVE VISUAL ASSETS
  if (q.includes('canva') || q.includes('thumbnail') || q.includes('design') || q.includes('graphic') || q.includes('visual') || q.includes('social media')) {
    return `I design high-converting visual assets using Canva Pro, including YouTube thumbnails with bold typography and high click-through rates (CTR), social media promotional posts, presentation decks, and branded PDF documents following client brand kits.`;
  }

  // 12. AI TOOLS & WORKFLOW AUTOMATION
  if (q.includes('ai') || q.includes('chatgpt') || q.includes('prompt') || q.includes('automation') || q.includes('workflow')) {
    return `I actively utilize modern AI productivity tools (such as ChatGPT, Claude, and Perplexity) to accelerate web research, draft initial correspondence, format unstructured text into clean tables, and automate repetitive administrative workflows while maintaining 100% human review for quality and accuracy.`;
  }

  // 13. LANGUAGES SPOKEN
  if (q.includes('language') && (q.includes('speak') || q.includes('fluent') || q.includes('proficien') || q.includes('english'))) {
    return `I am proficient in: ${cLangs}. I communicate fluently and professionally in both written and spoken English, ideal for client-facing emails and remote documentation.`;
  }

  // 14. HANDLING AMBIGUITY, CHANGING SCOPE & EDGE CASES
  if (q.includes('ambigu') || q.includes('unclear') || q.includes('incomplete') || q.includes('edge case') || q.includes('unsupervised') || q.includes('instructions')) {
    return `When dealing with ambiguous or evolving instructions, I first document what is concrete, isolate specific edge cases, and proactively reach out with a concise summary or annotated screenshot outlining my proposed approach before processing the full batch. This ensures zero wasted hours, guarantees exact alignment with client expectations, and establishes standard operating procedures (SOPs) for future tasks.`;
  }

  // 15. HANDLING PRESSURE, SPRINT DEADLINES & VOLUME SURGES
  if (q.includes('pressure') || q.includes('stress') || q.includes('surge') || q.includes('crunch') || q.includes('urgent') || q.includes('multiple priorities')) {
    return `Under tight deadlines or sudden workload surges, I stay calm and methodical. I break the deliverable into prioritized batches using the Eisenhower Matrix, apply automated formulas (XLOOKUP, deduplication rules, and text parsing) to handle repetitive sorting, and focus intense manual review on critical data fields. Backed by Nexa Digital Team, we also mobilize peer support when needed to guarantee zero delivery delays.`;
  }

  // 16. COMPENSATION & SALARY EXPECTATIONS
  if (q.includes('salary') || q.includes('compensation') || q.includes('expectation') || q.includes('pay') || q.includes('rate') || q.includes('desired pay')) {
    return cSalary;
  }

  // 17. NOTICE PERIOD & START DATE
  if (q.includes('notice') || q.includes('start date') || q.includes('when can you start') || q.includes('how soon') || q.includes('earliest start')) {
    return `My earliest start date is ${cStart} (immediate availability). I can begin onboarding right away.`;
  }

  // 18. WORK AUTHORIZATION & VISA SPONSORSHIP
  if (q.includes('authorized') || q.includes('legally') || q.includes('right to work') || q.includes('citizenship')) {
    return `Yes, I am ${cWorkAuth} ready to work immediately as an independent contractor or B2B provider.`;
  }
  if (q.includes('sponsor') || q.includes('visa') || q.includes('h-1b')) {
    return 'No, I work as a remote independent contractor / freelance specialist and do not require employer visa sponsorship.';
  }

  // 19. YEARS OF EXPERIENCE
  if (q.includes('how many years') || q.includes('years of experience') || q.includes('years of work')) {
    return `${cYears} years`;
  }

  // 20. EEOC & DEMOGRAPHICS
  if (q.includes('gender') || q.includes('sex')) return client.gender || 'Male';
  if (q.includes('race') || q.includes('ethnicity')) return client.race || 'African / Black';
  if (q.includes('veteran')) return client.veteran || 'I am not a protected veteran';
  if (q.includes('disability')) return client.disability || 'No, I do not have a disability';
  if (q.includes('pronoun')) return client.pronouns || 'He/Him';
  if (q.includes('sexual orientation')) return client.sexualOrientation || 'Heterosexual / Straight';

  // 21. PROFESSIONAL GENERAL FALLBACK
  if (tone === 'concise') {
    return `With ${cYears} years of virtual assistance and data operations experience at ${cCompany}, I deliver high-speed, 99.8% accurate execution across spreadsheets, research, and remote administrative workflows.`;
  }
  return `Over the past ${cYears} years at ${cCompany}, I have specialized in virtual assistance, spreadsheet data management (Excel & Google Sheets), web research, and daily administrative support. Regarding this, my approach emphasizes prompt communication, reliable execution, verified 99.8% accuracy, and close alignment with ${company}'s operational goals. I look forward to contributing immediately to your team.`;
}

if (typeof globalThis !== 'undefined') {
  globalThis.synthesizeScreeningAnswer = synthesizeScreeningAnswer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { synthesizeScreeningAnswer };
}
