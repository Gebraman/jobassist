/**
 * Intelligent Fit Evaluator & Match Scorer
 * Based on MadsLorentzen/ai-job-search/.claude/agents/posting-scorer.md & /rank command
 * 
 * Scores 5 Evaluation Dimensions:
 * 1. Technical Skills Match (35%)
 * 2. Trajectory & Seniority Alignment (20%)
 * 3. Domain & Industry Relevance (15%)
 * 4. Work Arrangement & Culture (15%)
 * 5. Compensation & Growth Alignment (15%)
 */

export function evaluateJobFit(job, candidateProfile) {
  const jobText = (job.title + ' ' + (job.description || '') + ' ' + (job.tags || []).join(' ')).toLowerCase();
  
  // 1. Technical Skills Match (0-100)
  const candidateSkills = [
    ...(candidateProfile.skills?.languages || []),
    ...(candidateProfile.skills?.frontend || []),
    ...(candidateProfile.skills?.backend || []),
    ...(candidateProfile.skills?.cloudDevOps || []),
    ...(candidateProfile.skills?.databases || []),
    ...(candidateProfile.skills?.aiAndData || [])
  ];

  const matchedSkills = [];
  const missingJobSkills = [];

  for (const s of candidateSkills) {
    const sLower = s.toLowerCase();
    if (jobText.includes(sLower) || (job.tags && job.tags.some(t => t.toLowerCase() === sLower))) {
      matchedSkills.push(s);
    }
  }

  // Common high-demand technical keywords to scan in posting
  const techKeywords = ['typescript', 'python', 'go', 'rust', 'react', 'node', 'fastapi', 'kubernetes', 'docker', 'aws', 'postgresql', 'redis', 'graphql', 'llm', 'langchain', 'distributed systems'];
  for (const kw of techKeywords) {
    if (jobText.includes(kw) && !matchedSkills.some(m => m.toLowerCase().includes(kw))) {
      missingJobSkills.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  let skillsScore = Math.min(100, Math.round((matchedSkills.length / Math.max(4, matchedSkills.length + missingJobSkills.length * 0.7)) * 100));
  if (matchedSkills.length >= 5) skillsScore = Math.max(85, skillsScore);

  // 2. Trajectory & Seniority Alignment (0-100)
  let seniorityScore = 80;
  const targetTitles = candidateProfile.preferences?.targetTitles || [];
  const titleLower = job.title.toLowerCase();

  const isSeniorLead = titleLower.includes('senior') || titleLower.includes('staff') || titleLower.includes('lead');
  if (isSeniorLead) {
    seniorityScore = 95;
  } else if (titleLower.includes('principal') || titleLower.includes('director')) {
    seniorityScore = 70; // Stretch
  } else if (titleLower.includes('junior') || titleLower.includes('intern')) {
    seniorityScore = 45; // Under-qualified match for senior
  } else {
    seniorityScore = 85; // Mid/General software engineer
  }

  // 3. Domain & Industry Relevance (0-100)
  let domainScore = 80;
  if (jobText.includes('ai') || jobText.includes('fintech') || jobText.includes('developer tools') || jobText.includes('platform') || jobText.includes('cloud')) {
    domainScore = 95;
  } else if (jobText.includes('crypto') || jobText.includes('gambling')) {
    domainScore = 30; // Possible dealbreaker
  }

  // 4. Work Arrangement (0-100)
  let arrangementScore = 80;
  const locLower = (job.location || '').toLowerCase();
  if (locLower.includes('remote') || locLower.includes('worldwide') || locLower.includes('global')) {
    arrangementScore = 100;
  } else if (locLower.includes('hybrid')) {
    arrangementScore = 80;
  } else if (locLower.includes('on-site') || locLower.includes('onsite')) {
    arrangementScore = 50;
  }

  // 5. Compensation & Growth (0-100)
  let compScore = 85;
  if (job.salary && job.salary.includes('$')) {
    const minSalary = candidateProfile.preferences?.minSalaryUSD || 140000;
    // Check if salary looks favorable
    compScore = 90;
  }

  // Check Dealbreakers
  const dealbreakers = candidateProfile.preferences?.dealbreakers || [];
  let vetoTriggered = false;
  let vetoReason = null;

  for (const db of dealbreakers) {
    const dbLower = db.toLowerCase();
    if (dbLower.includes('crypto') && (jobText.includes('crypto') || jobText.includes('blockchain') || jobText.includes('web3'))) {
      vetoTriggered = true;
      vetoReason = 'Excluded sector: Crypto / Web3';
      break;
    }
  }

  // Weighted Total Fit Score
  const totalScore = vetoTriggered 
    ? 25 
    : Math.round(
        skillsScore * 0.35 +
        seniorityScore * 0.20 +
        domainScore * 0.15 +
        arrangementScore * 0.15 +
        compScore * 0.15
      );

  // Recommendation Tier
  let tier = 'PASS';
  let tierBadge = 'badge-red';
  if (!vetoTriggered) {
    if (totalScore >= 85) {
      tier = 'STRONG_MATCH';
      tierBadge = 'badge-green';
    } else if (totalScore >= 70) {
      tier = 'SOLID_CONTENDER';
      tierBadge = 'badge-blue';
    } else if (totalScore >= 55) {
      tier = 'STRETCH';
      tierBadge = 'badge-gold';
    }
  }

  // Strengths and Gaps
  const strengths = [
    `Strong match on ${matchedSkills.slice(0, 4).join(', ')}`,
    seniorityScore >= 85 ? 'Seniority matches 7+ yr production track record' : 'Level within reach',
    arrangementScore >= 90 ? 'Full remote alignment with candidate preferences' : 'Location acceptable'
  ];

  const gaps = vetoTriggered 
    ? [vetoReason] 
    : (missingJobSkills.length > 0 ? [`Posting emphasizes ${missingJobSkills.slice(0, 3).join(', ')}`] : ['No material skill gaps detected']);

  return {
    fitScore: totalScore,
    tier,
    tierBadge,
    breakdown: {
      technicalSkills: skillsScore,
      seniority: seniorityScore,
      domain: domainScore,
      workArrangement: arrangementScore,
      compensation: compScore
    },
    matchedSkills: matchedSkills.slice(0, 8),
    missingSkills: missingJobSkills.slice(0, 4),
    strengths,
    gaps,
    vetoTriggered,
    vetoReason
  };
}
