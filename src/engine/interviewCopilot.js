// JobAssist AI Studio - Autonomous Interview Copilot & Question Predictor Engine
// Generates tailored technical STAR answers, behavioral questions, salary negotiation scripts, and reverse questions

export function generateInterviewPrep({ jobTitle, company, keywords = [], salaryRange = '', candidate }) {
  const role = jobTitle || 'Senior Software Engineer';
  const org = company || 'Target Company';
  const skills = (keywords && keywords.length > 0) ? keywords : ['NODE.JS', 'PYTHON', 'DISTRIBUTED SYSTEMS', 'APIS', 'POSTGRESQL', 'CLOUD'];
  const name = candidate?.name || 'Raymond Wong';
  const years = candidate?.yearsBE || '8+';
  const headline = candidate?.headline || 'Staff Backend Engineer';

  // 1. 30-Second Elevator Pitch
  const elevatorPitch = `I am a ${headline} with ${years} years of enterprise experience building high-throughput distributed systems, scalable APIs, and resilient cloud architectures. Throughout my career, I've specialized in ${skills.slice(0, 4).join(', ')}, optimizing backend latency by up to 45% and leading cross-functional teams. I'm excited about ${org}'s work in ${role}, and I'm looking forward to applying my architectural experience to help your team scale reliably.`;

  // 2. Predicted Technical & System Design Questions
  const technicalQuestions = [
    {
      question: `How would you architect a resilient, high-volume API integration service for ${org}?`,
      category: 'System Design & Architecture',
      starAnswer: {
        situation: `At my previous role, our distributed microservices handled millions of external partner requests daily, but third-party API rate limits and network latency were causing intermittent bottlenecking.`,
        task: `I was tasked with redesigning the ingestion pipeline to guarantee 99.99% uptime, zero dropped events, and strict rate-limit adherence.`,
        action: `I architected an asynchronous event-driven pipeline using ${skills.includes('KAFKA') ? 'Apache Kafka' : 'Redis BullMQ'} with exponential backoff retries, distributed token-bucket rate limiters, and PostgreSQL database indexing. I decoupled the ingestion webhook receiver from the worker processors to ensure sub-50ms acknowledgement times.`,
        result: `The system scaled to handle 12,000 requests/sec with zero dropped events, reduced p99 latency from 1.4s to 120ms, and saved over $18,000/month in cloud infrastructure costs.`
      }
    },
    {
      question: `Walk us through how you diagnose and resolve a severe database performance degradation in production.`,
      category: 'Database & Performance Optimization',
      starAnswer: {
        situation: `During a peak marketing campaign, database CPU spiked to 98%, causing query connection pooling starvation and request timeouts.`,
        task: `I had to immediately diagnose root-cause query bottlenecks and restore normal database operations without taking the platform offline.`,
        action: `I analyzed pg_stat_activity and slow query logs, identifying an unindexed join on a high-cardinality table. I temporarily adjusted connection pool limits, used EXPLAIN ANALYZE to optimize the query plan, created a composite B-tree index concurrently, and implemented a multi-tier Redis caching layer with a 5-minute TTL.`,
        result: `Database CPU dropped immediately from 98% to 22%, query execution time improved from 3,200ms to 8ms, and zero customer transactions were lost.`
      }
    },
    {
      question: `How do you ensure data consistency and idempotency across distributed microservices?`,
      category: 'Distributed Systems & Microservices',
      starAnswer: {
        situation: `External webhooks from third-party systems frequently delivered duplicate transaction payloads due to network retries, causing occasional double-processing risks.`,
        task: `I needed to enforce absolute idempotency across our distributed order and account services.`,
        action: `I implemented an idempotent consumer pattern using unique idempotency keys stored in Redis with atomic SETNX locking and a 24-hour expiration window. If a duplicate key arrived, the service returned the cached original response without re-executing business logic.`,
        result: `Achieved 100% deduplication reliability, eliminated redundant database writes, and maintained zero financial reconciliation discrepancies.`
      }
    },
    {
      question: `How do you handle technical debt while balancing rapid feature delivery requested by Product managers?`,
      category: 'Engineering Leadership & Tradeoffs',
      starAnswer: {
        situation: `Our core legacy codebase had accumulated significant tech debt, slowing down sprint velocity and increasing regression bug frequency by 30%.`,
        task: `As a senior technical leader, I needed to address the debt systematically while keeping feature delivery on track for executive stakeholders.`,
        action: `I introduced a '20% Innovation & Tech Health' allocation per sprint, quantified the cost of delayed refactoring using crash telemetry, and guided the team to break monolithic endpoints into test-driven modular services alongside standard feature work.`,
        result: `Refactored critical core modules over two quarters, increasing sprint delivery velocity by 35% and reducing customer-reported bug tickets by 50%.`
      }
    }
  ];

  // 3. Salary Negotiation Playbook & Counter-Offer Strategy
  const expectedSalary = salaryRange || '$175,000 - $190,000';
  const salaryPlaybook = {
    targetRange: expectedSalary,
    initialScreeningResponse: `Based on my ${years} years of senior engineering leadership, distributed systems expertise, and current market benchmarks for ${role}, I am targeting a base range of ${expectedSalary}, plus equity and performance bonuses. However, my primary focus is finding the right long-term technical home and team fit where I can deliver massive business impact.`,
    counterOfferScript: `Thank you so much for extending this offer to join ${org}! I am genuinely excited about the team and the technical roadmap we discussed. Given my proven track record building scalable architectures that handle enterprise throughput, and another active conversation near the top of the band, if we can adjust the base compensation to the higher end of the range ($185,000 - $190,000) or enhance the equity package, I would be thrilled to sign immediately.`,
    goldenRules: [
      'Never give an exact single number first; always provide a bounded bracket range.',
      'Anchor high within the advertised salary range.',
      'Tie compensation requests directly to proven ROI (e.g. latency reduction, revenue enablement).',
      'Always express genuine enthusiasm for the company and mission before asking for adjustments.'
    ]
  };

  // 4. Strategic Reverse Interview Questions (Questions to Ask the Interviewer)
  const reverseQuestions = [
    {
      target: 'Hiring Manager / Director of Engineering',
      question: `What are the biggest technical or architectural bottlenecks your engineering team is actively trying to solve in the next 6 to 12 months?`
    },
    {
      target: 'Staff / Principal Engineer',
      question: `How does the engineering team balance greenfield feature velocity with technical debt management and test coverage standards?`
    },
    {
      target: 'Peer Software Engineer',
      question: `What does a typical release cycle look like, and how automated is your CI/CD and canary deployment pipeline?`
    },
    {
      target: 'Product / Cross-Functional Partner',
      question: `What does success look like for someone in this ${role} position after their first 90 days?`
    }
  ];

  return {
    role,
    company: org,
    candidateName: name,
    elevatorPitch,
    technicalQuestions,
    salaryPlaybook,
    reverseQuestions,
    generatedAt: new Date().toISOString()
  };
}
