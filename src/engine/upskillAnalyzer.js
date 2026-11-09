/**
 * Intelligent Skills Gap & Upskilling Engine — Nexa Digital Team
 * Identifies high-demand virtual assistance, spreadsheet, AI workflow,
 * and remote digital agency skills across active job postings.
 */

export function analyzeSkillsGaps(jobsList = [], candidateProfile = {}) {
  const candidateSkills = new Set(
    (candidateProfile.skills || [
      'Virtual Assistant', 'Data Entry', 'Google Sheets', 'Excel',
      'Web Research', 'Customer Support', 'Canva Design', 'Transcription', 'AI Workflows'
    ]).map(s => s.toLowerCase().trim())
  );

  const skillFrequency = {};
  const totalJobs = jobsList.length || 1;

  for (const job of jobsList) {
    const text = (job.title + ' ' + (job.description || '') + ' ' + (job.tags || []).join(' ')).toLowerCase();
    
    const catalog = [
      { name: 'Google Sheets & Excel Formulas', key: 'sheet' },
      { name: 'Excel Data Cleaning & Pivot Tables', key: 'pivot' },
      { name: 'High-Speed Typing (65+ WPM)', key: 'typing' },
      { name: 'Web Research & Lead Generation', key: 'research' },
      { name: 'Customer Email & Chat Support', key: 'customer' },
      { name: 'Canva Pro & Visual Asset Design', key: 'canva' },
      { name: 'YouTube Thumbnail Design', key: 'thumbnail' },
      { name: 'AI Workflow Integration (ChatGPT/Claude)', key: 'ai' },
      { name: 'CRM & Pipeline Management (HubSpot/Zoho)', key: 'crm' },
      { name: 'Project Management (Notion/Trello/Asana)', key: 'trello' },
      { name: 'Transcription & Audio Typing', key: 'transcription' },
      { name: 'E-Commerce Store Support (Shopify/Amazon)', key: 'shopify' },
      { name: 'Email Outreach & Lead Scraping', key: 'lead' },
      { name: 'Zapier & Make Automation', key: 'zapier' },
      { name: 'WordPress & Basic Web Maintenance', key: 'wordpress' }
    ];

    for (const item of catalog) {
      if (text.includes(item.key)) {
        skillFrequency[item.name] = (skillFrequency[item.name] || 0) + 1;
      }
    }
  }

  const inDemandSkills = Object.entries(skillFrequency)
    .map(([skill, count]) => ({
      skill,
      count,
      percentage: Math.round((count / totalJobs) * 100),
      hasSkill: candidateSkills.has(skill.toLowerCase()) || 
                Array.from(candidateSkills).some(cs => cs.includes(skill.toLowerCase().split(' ')[0]))
    }))
    .sort((a, b) => b.count - a.count);

  const missingGaps = inDemandSkills
    .filter(s => !s.hasSkill)
    .slice(0, 5)
    .map(g => ({
      ...g,
      priority: g.percentage >= 40 ? 'HIGH' : 'MEDIUM',
      learningAction: getLearningRecommendation(g.skill)
    }));

  return {
    totalJobsAnalyzed: totalJobs,
    inDemandSkills,
    missingGaps,
    overallProfileCoverage: Math.round(
      (inDemandSkills.filter(s => s.hasSkill).length / Math.max(1, inDemandSkills.length)) * 100
    )
  };
}

function getLearningRecommendation(skill) {
  const map = {
    'Google Sheets & Excel Formulas': {
      course: 'Advanced Google Sheets & Excel (XLOOKUP, QUERY, IMPORTRANGE)',
      hours: 8,
      project: 'Build an automated multi-tab sales reconciliation workbook'
    },
    'Excel Data Cleaning & Pivot Tables': {
      course: 'Power Query & Advanced Pivot Table Reporting Masterclass',
      hours: 6,
      project: 'Clean and format a 10,000-row messy e-commerce inventory dataset'
    },
    'Canva Pro & Visual Asset Design': {
      course: 'Canva Pro for Social Media & High-CTR YouTube Thumbnails',
      hours: 5,
      project: 'Design 10 viral YouTube thumbnails and a corporate brand kit deck'
    },
    'CRM & Pipeline Management (HubSpot/Zoho)': {
      course: 'HubSpot Academy Inbound CRM & Contact Management',
      hours: 6,
      project: 'Set up custom lead properties, pipeline stages, and automated email tasks'
    },
    'AI Workflow Integration (ChatGPT/Claude)': {
      course: 'Prompt Engineering & Autonomous AI Workflows for Virtual Assistants',
      hours: 5,
      project: 'Create custom GPT prompt templates for instant lead research and table formatting'
    }
  };
  return map[skill] || {
    course: `Practical ${skill} Operational Workshop`,
    hours: 6,
    project: `Complete a verified hands-on portfolio case study demonstrating ${skill}`
  };
}
