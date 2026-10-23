/**
 * Autonomous Application Auto-Fill Payload Generator
 * Implements "Fill Full by Itself" capability for ATS forms
 * (Greenhouse, Lever, Workday, BambooHR, Ashby, LinkedIn Easy Apply)
 */

export function generateAutofillPayload({ job, candidate, fitData }) {
  const comp = job.company || 'the company';
  const role = job.title || 'Software Engineer';
  const matched = fitData?.matchedSkills || ['TypeScript', 'Node.js', 'Distributed Systems'];
  const matchedTech = matched.slice(0, 3).join(', ');

  const [firstName, ...lastNameParts] = candidate.fullName.split(' ');
  const lastName = lastNameParts.join(' ');

  // 1. Core Profile & Contact Fields
  const personalFields = {
    firstName,
    lastName,
    fullName: candidate.fullName,
    email: candidate.email,
    phone: candidate.phone,
    location: candidate.location,
    currentCompany: candidate.currentCompany || 'Stripe',
    currentTitle: candidate.currentTitle || 'Senior Software Engineer',
    yearsOfExperience: candidate.yearsOfExperience || 7,
    linkedin: candidate.linkedin,
    github: candidate.github,
    portfolio: candidate.portfolio
  };

  // 2. Legal, Eligibility & Availability Questions
  const legalAndLogistics = {
    authorizedToWork: "Yes",
    requiresSponsorship: "No",
    noticePeriod: `${candidate.preferences?.noticePeriodWeeks || 2} Weeks from offer acceptance`,
    earliestStartDate: "Immediate upon 2-week notice completion",
    desiredSalary: `$${(candidate.preferences?.targetSalaryUSD || 175000).toLocaleString()} USD / Year (Flexible based on equity and benefits package)`,
    workArrangementPreference: candidate.preferences?.workArrangement || "Remote (Worldwide / US)",
    nonCompeteStatus: "None / Free of any restrictive covenants",
    willingToRelocate: "Remote preferred; available for quarterly on-site syncs"
  };

  // 3. Custom ATS Screening Question Answers (Auto-Generated & Tailored)
  const screeningQuestions = [
    {
      question: `Why do you want to work at ${comp} as a ${role}?`,
      category: "Motivation & Company Fit",
      answer: `I have been following ${comp}'s technological trajectory and admire your commitment to high-reliability engineering. My background designing fault-tolerant microservices and autonomous agent pipelines at Stripe directly matches ${comp}'s scaling challenges in ${matchedTech}. I am seeking a high-leverage team where I can take end-to-end ownership and deliver immediate architectural value.`
    },
    {
      question: `Describe your relevant experience with ${matchedTech} and scalable systems.`,
      category: "Technical Depth",
      answer: `Over the past 7 years, I have architected and maintained production services handling tens of thousands of requests per second. At Stripe, I built Go/TypeScript microservices with p99 latency under 22ms and integrated LLM agent workflows that eliminated 68% of manual review delays. At Datadog, I optimized frontend and backend data pipelines serving 450,000+ engineers.`
    },
    {
      question: "What is your greatest professional achievement to date?",
      category: "Impact & Ownership",
      answer: `Leading the design and deployment of an autonomous onboarding verification platform at Stripe. By combining deterministic rule engines with modern LLM reasoning, we reduced merchant verification cycle times from 48 hours to under 4 minutes while sustaining 99.99% system availability.`
    },
    {
      question: "How do you approach code quality, testing, and system observability?",
      category: "Engineering Culture",
      answer: `I believe velocity and reliability reinforce each other. I practice trunk-based development with rigorous automated unit, integration, and contract tests in CI/CD. In production, I configure comprehensive telemetry (distributed tracing, structured JSON logs, custom Prometheus/Datadog metrics, and proactive alerting) to diagnose anomalies before they impact end users.`
    },
    {
      question: "What are your salary and total compensation expectations?",
      category: "Compensation",
      answer: `My target base salary is $${(candidate.preferences?.targetSalaryUSD || 175000).toLocaleString()} USD, with flexibility depending on health coverage, 401(k) matching, and equity upside. My primary priority is joining an exceptional engineering team with a high-growth mission.`
    }
  ];

  return {
    jobId: job.id,
    company: comp,
    role: role,
    generatedAt: new Date().toISOString(),
    personalFields,
    legalAndLogistics,
    screeningQuestions,
    exportJsonString: JSON.stringify({
      targetJob: { company: comp, role: role, url: job.url },
      applicant: personalFields,
      legal: legalAndLogistics,
      customQuestions: screeningQuestions
    }, null, 2)
  };
}
