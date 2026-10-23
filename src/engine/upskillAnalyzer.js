/**
 * Upskilling & Market Demand Analyzer
 * Ported from MadsLorentzen/ai-job-search/.claude/commands/upskill.md
 * 
 * Aggregates skill demands across all discovered job postings, compares against
 * the candidate's existing competencies, and builds a prioritized learning roadmap.
 */

export function analyzeUpskillGaps(jobsList, candidateProfile) {
  const candidateSkills = new Set([
    ...(candidateProfile.skills?.languages || []).map(s => s.toLowerCase()),
    ...(candidateProfile.skills?.frontend || []).map(s => s.toLowerCase()),
    ...(candidateProfile.skills?.backend || []).map(s => s.toLowerCase()),
    ...(candidateProfile.skills?.cloudDevOps || []).map(s => s.toLowerCase()),
    ...(candidateProfile.skills?.databases || []).map(s => s.toLowerCase()),
    ...(candidateProfile.skills?.aiAndData || []).map(s => s.toLowerCase())
  ]);

  const skillFrequency = {};
  const totalJobs = jobsList.length || 1;

  for (const job of jobsList) {
    const text = (job.title + ' ' + (job.description || '') + ' ' + (job.tags || []).join(' ')).toLowerCase();
    
    // Check against standard market tech vocabulary
    const catalog = [
      { name: 'TypeScript', key: 'typescript' },
      { name: 'Python', key: 'python' },
      { name: 'Go', key: 'go' },
      { name: 'Rust', key: 'rust' },
      { name: 'React', key: 'react' },
      { name: 'Next.js', key: 'next.js' },
      { name: 'Node.js', key: 'node' },
      { name: 'FastAPI', key: 'fastapi' },
      { name: 'Kubernetes', key: 'kubernetes' },
      { name: 'Docker', key: 'docker' },
      { name: 'AWS', key: 'aws' },
      { name: 'GCP', key: 'gcp' },
      { name: 'PostgreSQL', key: 'postgresql' },
      { name: 'Redis', key: 'redis' },
      { name: 'GraphQL', key: 'graphql' },
      { name: 'LLM Agent Systems', key: 'agent' },
      { name: 'Vector DBs (Pinecone/Qdrant)', key: 'vector' },
      { name: 'Kafka', key: 'kafka' },
      { name: 'ClickHouse', key: 'clickhouse' },
      { name: 'Terraform', key: 'terraform' },
      { name: 'Microservices Architecture', key: 'microservice' }
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
      priority: g.percentage >= 50 ? 'HIGH' : 'MEDIUM',
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
    'Rust': {
      course: 'The Rust Programming Book + Rustlings',
      hours: 35,
      project: 'Build a high-performance multithreaded TCP proxy'
    },
    'Kafka': {
      course: 'Confluent Developer Kafka Internals Guide',
      hours: 20,
      project: 'Implement an event-driven transaction ledger with partition ordering'
    },
    'ClickHouse': {
      course: 'ClickHouse Academy Real-Time Analytics',
      hours: 15,
      project: 'Set up columnar telemetry database benchmarking 10M rows'
    },
    'Terraform': {
      course: 'HashiCorp Certified Terraform Associate Path',
      hours: 18,
      project: 'Automate multi-region AWS VPC and ECS Fargate cluster with IaC'
    }
  };
  return map[skill] || {
    course: `Advanced ${skill} Production Workshop`,
    hours: 20,
    project: `Design and ship a production-grade microservice incorporating ${skill}`
  };
}
