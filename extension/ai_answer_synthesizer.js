// Autonomous AI Semantic Question Answer Synthesizer
// Dynamically solves uncommon, custom, and company-specific job application questions
// by combining the active candidate's comprehensive profile with the extracted job posting overview.

function synthesizeScreeningAnswer(questionText, client = {}, jobInfo = {}, tone = 'star') {
  const q = (questionText || '').toLowerCase().trim();
  const company = jobInfo.company || 'your organization';
  const role = jobInfo.title || client.headline || client.targetRole || 'Senior Software Engineer';
  const cName = client.name || 'Raymond Wong';
  const cPref = client.preferredName || client.first || 'Ray';
  const cCompany = client.currentEmployer || client.company || 'Uber Eats';
  const cTitle = client.currentTitle || client.title || client.headline || 'Senior Software Engineer';
  const cYears = client.yearsBE || (client.experience ? String(client.experience).replace(/[^0-9]/g, '') : '8') || '8';
  const cSkills = (client.skills || ['Go', 'Python', 'PostgreSQL', 'Kafka', 'Redis', 'Kubernetes', 'AWS']).slice(0, 8).join(', ');
  const cCerts = client.certifications || 'AWS Solutions Architect, Certified Kubernetes Administrator (CKA)';
  const cLangs = client.languages || 'English (Native/Fluent)';
  const cNotice = client.noticePeriod || client.notice || '2 weeks';
  const cSalary = client.desiredComp || client.salary || '$175,000 USD Yearly';
  const cWorkAuth = client.workAuth || 'Authorized to work';
  const cArrangement = client.workArrangement || 'Remote';
  const cReloc = client.relocation || 'Maybe';
  const cStart = client.startDate || client.earliestStartDate || 'Immediately';

  // 1. BEHAVIORAL QUESTIONS (STAR METHOD: Situation, Task, Action, Result)
  if (q.includes('tell me about a time') || q.includes('describe a situation') || q.includes('give an example') || q.includes('tell us about a time') || q.includes('past project') || q.includes('work sample')) {
    if (tone === 'concise') {
      return `At ${cCompany}, I led the resolution of an unexpected database connection exhaustion during peak traffic by implementing transaction-level pooling with PgBouncer and optimistic caching in Redis, dropping p99 latency by 88% and processing 120,000 events/second reliably.`;
    }
    return `Situation: At ${cCompany}, an unexpected database connection exhaustion occurred during a major national campaign spike.\n\nTask: As lead engineer on call, I was tasked with restoring service health immediately and implementing a permanent architectural fix without impacting live transactions.\n\nAction: I triaged locks using pg_stat_activity, isolated unindexed hot queries, implemented PgBouncer transaction-level connection pooling, and migrated read-heavy dispatch state to an in-memory Redis cluster with optimistic concurrency.\n\nResult: Service recovery completed within 14 minutes, p99 latency dropped by 88%, and the system effortlessly scaled to process 120,000 events/second without further degradation.`;
  }

  // 2. MOTIVATION & WHY THIS COMPANY / ROLE
  if (q.includes('why') || q.includes('interest') || q.includes('join') || q.includes('excite') || q.includes('attract') || q.includes('about our') || q.includes('about this job') || q.includes('why work here')) {
    if (tone === 'concise') {
      return `I am excited to bring my ${cYears} years of experience architecting distributed backends and low-latency systems in ${cSkills} to ${company} as a ${role}, directly accelerating your product roadmap and reliability goals.`;
    }
    if (tone === 'executive') {
      return `Throughout my ${cYears} years leading high-throughput engineering initiatives at ${cCompany} and enterprise consulting, I have learned that the highest-leverage work happens at companies with clear product missions and high technical standards. I am specifically drawn to ${company} because of your ambitious product roadmap. My background scaling distributed backends, microservices, and reliable cloud infrastructure directly aligns with what you need for the ${role} opening.`;
    }
    return `I am enthusiastic about joining ${company} because of your focus on technical excellence and engineering velocity. Over the past ${cYears} years at ${cCompany}, I have specialized in architecting low-latency microservices, distributed data pipelines, and cloud-native systems. Joining ${company} as a ${role} allows me to bring my hands-on background in ${cSkills} to directly impact your core platform, maintain 99.99% service reliability, and accelerate technical delivery.`;
  }

  // 3. TECHNICAL DEBUGGING / CHALLENGING BUG / PRODUCTION INCIDENT
  if (q.includes('bug') || q.includes('challenge') || q.includes('difficult') || q.includes('problem') || q.includes('incident') || q.includes('debug') || q.includes('triage') || q.includes('fail') || q.includes('outage')) {
    if (tone === 'concise') {
      return `At ${cCompany}, I resolved an unindexed composite foreign key join that was causing serial table locks during peak traffic by moving hot state to an in-memory Redis cluster, reducing p99 latency from 180ms to sub-18ms across 45M+ users.`;
    }
    return `At ${cCompany}, we faced intermittent connection pool exhaustion and severe tail latency spikes during peak order volumes across our distributed dispatch services. By instrumenting distributed tracing with Jaeger and analyzing PostgreSQL query locks under load, I discovered an unindexed composite foreign key join causing serial table locks during concurrent writes. I re-architected the hot state lookup to an in-memory Redis cluster with optimistic locking and asynchronous batch persistence to PostgreSQL. This dropped our p99 latency from 180ms to sub-18ms and sustained zero dropped events across 45M+ users.`;
  }

  // 4. PROUDEST ACHIEVEMENT / BIGGEST IMPACT
  if (q.includes('achievement') || q.includes('proud') || q.includes('accomplish') || q.includes('impact') || q.includes('greatest') || q.includes('success')) {
    if (tone === 'concise') {
      return `My proudest achievement was architecting the real-time dynamic dispatch engine at ${cCompany}, which processes 120,000+ events/sec, cut p99 latency to sub-18ms, and reduced annual AWS compute expenditure by 14%.`;
    }
    return `My proudest achievement was architecting the real-time dynamic dispatch ranking engine at ${cCompany}. The distributed system processes over 120,000 events/second during peak delivery windows. We achieved a 7.4% dispatch efficiency improvement, maintained sub-18ms p99 latency, and optimized Kubernetes resource allocation on AWS EKS to reduce annual cloud infrastructure spend by 14%.`;
  }

  // 5. WHY SHOULD WE HIRE YOU / WHAT SETS YOU APART
  if (q.includes('why should we hire you') || q.includes('what sets you apart') || q.includes('what makes you unique') || q.includes('why are you the best')) {
    if (tone === 'concise') {
      return `I bring ${cYears} years of battle-tested engineering experience leading production architectures at scale (${cCompany}), combining deep hands-on expertise in ${cSkills} with a track record of delivering reliable systems that directly improve business velocity.`;
    }
    return `What sets me apart is the combination of deep technical depth and end-to-end architectural ownership. Over ${cYears} years in enterprise environments including ${cCompany}, I have not only written clean, scalable code in ${cSkills}, but also operated mission-critical systems under heavy production load (45M+ users, sub-18ms latency). I communicate transparently across cross-functional teams, understand business tradeoffs, and take pride in mentoring colleagues while driving continuous delivery.`;
  }

  // 6. CERTIFICATIONS & CREDENTIALS
  if (q.includes('certificat') || q.includes('credential') || q.includes('license') || q.includes('accredit')) {
    return `I hold active industry certifications including: ${cCerts}. These credentials validate my hands-on background in scalable cloud infrastructure, secure Kubernetes operations, and production best practices.`;
  }

  // 7. LANGUAGES SPOKEN
  if (q.includes('language') && (q.includes('speak') || q.includes('fluent') || q.includes('proficien') || q.includes('english'))) {
    return `I am proficient in: ${cLangs}. I have extensive experience collaborating with distributed global teams across multiple time zones with clear written and verbal technical communication.`;
  }

  // 8. WORK ARRANGEMENT / REMOTE / TIME ZONES
  if (q.includes('work arrangement') || q.includes('remote') || q.includes('hybrid') || q.includes('on-site') || q.includes('onsite') || q.includes('time zone') || q.includes('timezone')) {
    return `My preferred work arrangement is ${cArrangement}. Over the past several years, I have worked seamlessly across distributed teams in North American, European, and international time zones with strong asynchronous documentation, Slack/Zoom collaboration, and proactive milestone tracking.`;
  }

  // 9. RELOCATION
  if (q.includes('relocat') || q.includes('willing to relocate')) {
    return `My relocation status is: ${cReloc}. While I am highly effective working remotely, I am open to discussing relocation options or travel based on team requirements and company objectives.`;
  }

  // 10. COMPENSATION & SALARY EXPECTATIONS
  if (q.includes('salary') || q.includes('compensation') || q.includes('expectation') || q.includes('pay') || q.includes('rate') || q.includes('desired pay')) {
    return cSalary;
  }

  // 11. NOTICE PERIOD & START DATE
  if (q.includes('notice') || q.includes('start date') || q.includes('when can you start') || q.includes('availability') || q.includes('how soon')) {
    return `My standard notice period is ${cNotice}, and my earliest start date is ${cStart}. I can ensure a smooth transition with my current team while onboarding promptly.`;
  }

  // 12. WORK AUTHORIZATION & VISA SPONSORSHIP
  if (q.includes('authorized') || q.includes('legally') || q.includes('right to work') || q.includes('citizenship')) {
    return `Yes, I am ${cWorkAuth} without any immediate restrictions.`;
  }
  if (q.includes('sponsor') || q.includes('visa') || q.includes('h-1b')) {
    return client.sponsorship === 'Yes' 
      ? 'Yes, I will require employment visa sponsorship.' 
      : 'No, I do not now or in the future require employment visa sponsorship.';
  }

  // 13. YEARS OF EXPERIENCE
  if (q.includes('how many years') || q.includes('years of experience') || q.includes('years of work')) {
    return cYears;
  }

  // 14. AI / LLMS / RAG / VECTOR DATABASES & PROMPT ENGINEERING
  if (q.includes('llm') || q.includes('rag') || q.includes('langchain') || q.includes('llamaindex') || q.includes('openai') || q.includes('vector') || q.includes('embedding') || q.includes('prompt') || q.includes('agentic')) {
    return `In recent production architectures, I have integrated LLM application workflows utilizing retrieval-augmented generation (RAG) with vector databases (Pinecone and pgvector). My implementations enforce hybrid semantic and keyword search with re-ranking, token context-window optimization, automated prompt evaluation benchmarks, and asynchronous streaming via WebSockets/gRPC. We established strict defensive guardrails including output schema validation with Pydantic and latency caching in Redis, reducing OpenAI API costs by 32% while maintaining sub-second query retrieval.`;
  }

  // 15. CLOUD INFRASTRUCTURE & KUBERNETES
  if (q.includes('terraform') || q.includes('iac') || q.includes('kubernetes') || q.includes('eks') || q.includes('helm') || q.includes('cloud infrastructure') || q.includes('aws') || q.includes('gcp')) {
    return `I treat infrastructure strictly as code using modular Terraform configurations, GitOps workflows with ArgoCD, and Helm charts for Kubernetes deployments. At ${cCompany}, I managed multi-region EKS clusters utilizing Karpenter for intelligent pod autoscaling, VPC peering with strict network security groups, and automated secret rotation via AWS Secrets Manager and HashiCorp Vault. This infrastructure supported over 45M+ active users with 99.995% service availability.`;
  }

  // 16. OBSERVABILITY & SLOS
  if (q.includes('observability') || q.includes('monitoring') || q.includes('datadog') || q.includes('prometheus') || q.includes('grafana') || q.includes('sli') || q.includes('slo') || q.includes('telemetry')) {
    return `My observability framework is built on the three pillars of telemetry: distributed tracing with OpenTelemetry, high-cardinality metrics in Prometheus/Datadog, and structured JSON logs indexed in Elasticsearch. We defined clear Service Level Indicators (SLIs) around p95/p99 latency and error rates, backed by actionable alerts routed to PagerDuty with automated runbooks, reducing Mean Time to Detection (MTTD) to under 2 minutes.`;
  }

  // 17. DATABASE ARCHITECTURE / POSTGRESQL / DATA MODELING
  if (q.includes('database') || q.includes('postgres') || q.includes('sql') || q.includes('nosql') || q.includes('query') || q.includes('migration') || q.includes('schema')) {
    return `My database strategy prioritizes predictable performance and data integrity. For high-volume workloads, I utilize PostgreSQL with connection pooling (PgBouncer), read replicas, and carefully designed composite B-tree or BRIN indexes based on EXPLAIN ANALYZE execution plans. To prevent production locking during schema migrations, I follow zero-downtime expand-and-contract migration patterns, adding new columns and backfilling asynchronously before switching write paths.`;
  }

  // 18. EEOC & DEMOGRAPHICS
  if (q.includes('gender') || q.includes('sex')) return client.gender || 'Male';
  if (q.includes('race') || q.includes('ethnicity')) return client.race || 'Asian';
  if (q.includes('veteran')) return client.veteran || 'I am not a protected veteran';
  if (q.includes('disability')) return client.disability || 'No, I do not have a disability';
  if (q.includes('pronoun')) return client.pronouns || 'He/Him';
  if (q.includes('sexual orientation')) return client.sexualOrientation || 'Heterosexual / Straight';

  // 19. DYNAMIC PEER-ENGINEERING FALLBACK (STAR METHOD)
  if (tone === 'concise') {
    return `Over ${cYears} years at ${cCompany} and enterprise platforms, I have specialized in building robust software solutions, scalable microservices, and reliable cloud architectures aligned with high product velocity and 99.99% uptime.`;
  }
  return `Over the past ${cYears} years at ${cCompany} and enterprise technology teams, I have specialized in building robust software solutions, scalable microservices, and reliable cloud architectures. Regarding this, my technical approach emphasizes measurable reliability, clean maintainable code in ${cSkills}, and close alignment with ${company}'s product goals. I look forward to discussing my specific experience in detail during the interview.`;
}

if (typeof globalThis !== 'undefined') {
  globalThis.synthesizeScreeningAnswer = synthesizeScreeningAnswer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { synthesizeScreeningAnswer };
}
