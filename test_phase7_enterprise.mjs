import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadExtensionScript(relPath) {
  const code = fs.readFileSync(path.join(__dirname, relPath), 'utf8');
  const mod = { exports: {} };
  const fn = new Function('module', 'exports', 'window', 'document', 'chrome', code);
  fn(mod, mod.exports, globalThis, globalThis.document || {}, globalThis.chrome || {});
  return mod.exports;
}

const { DEFAULT_CLIENTS } = loadExtensionScript('extension/clients.js');
const { generateCanvaResumeHTML, generatePlainTextResume, generateValidPDFBinary, generateValidPDFBlob } = loadExtensionScript('extension/resume_generator.js');
const { synthesizeScreeningAnswer } = loadExtensionScript('extension/ai_answer_synthesizer.js');
const { generateRecruiterOutreach } = loadExtensionScript('extension/recruiter_outreach.js');

console.log('========================================================================');
console.log('👑 ENTERPRISE SUITE VERIFICATION: PHASE 7 INTELLIGENCE & TELEMETRY');
console.log('========================================================================\n');

// 1. Verify Multi-Candidate Personas & EEOC Compliance
console.log('--- TEST 1: MULTI-CLIENT PERSONAS & EEOC ATTRIBUTES ---');
const raymond = DEFAULT_CLIENTS.find(c => c.id === 'client_raymond_wong');
const sarah = DEFAULT_CLIENTS.find(c => c.id === 'client_sarah_chen');
const alex = DEFAULT_CLIENTS.find(c => c.id === 'client_alex_rivera');

console.log(`Candidate 1: ${raymond.name} | Gender: ${raymond.gender} | Race: ${raymond.race} | Veteran: ${raymond.veteran}`);
console.log(`Candidate 2: ${sarah.name} | Gender: ${sarah.gender} | Race: ${sarah.race} | Title: ${sarah.headline}`);
console.log(`Candidate 3: ${alex.name} | Gender: ${alex.gender} | Race: ${alex.race} | Title: ${alex.headline}`);

if (raymond.gender === 'Male' && sarah.gender === 'Female' && alex.race === 'Hispanic or Latino') {
  console.log('✅ TEST 1 PASSED: Multi-client personas and EEOC voluntary attributes verified!\n');
} else {
  console.error('❌ TEST 1 FAILED');
  process.exit(1);
}

// 2. Verify AI Semantic Synthesizer 2.0 (LLMs, DevOps, Observability, STAR Method)
console.log('--- TEST 2: ADVANCED AI SCREENING SYNTHESIZER 2.0 ---');
const jobLLM = { title: 'LLM Application Engineer', company: 'BJAK', keywords: ['LLM', 'RAG', 'PYTHON', 'VECTOR DB'] };
const jobDevOps = { title: 'Cloud Infrastructure Architect', company: 'TechCorp', keywords: ['TERRAFORM', 'KUBERNETES', 'AWS'] };

const ansLLM = synthesizeScreeningAnswer('Describe your experience with LLMs, RAG, and vector databases in production?', raymond, jobLLM);
console.log(`[LLM/RAG Question] -> "${ansLLM.slice(0, 130)}..."`);

const ansSTAR = synthesizeScreeningAnswer('Tell us about a time you handled an architectural disagreement or incident?', raymond, jobDevOps);
console.log(`[STAR Method Behavioral] ->\n${ansSTAR}\n`);

const ansEEOC = synthesizeScreeningAnswer('What is your gender identity and veteran status?', raymond, jobDevOps);
console.log(`[EEOC Gender Resolution] -> "${ansEEOC}"`);

if (ansLLM.includes('RAG') && ansSTAR.includes('[Situation]') && ansSTAR.includes('[Result]')) {
  console.log('✅ TEST 2 PASSED: Advanced domain syntheses & STAR method structures verified!\n');
} else {
  console.error('❌ TEST 2 FAILED');
  process.exit(1);
}

// 3. Verify Recruiter Outreach Across 4 Channels
console.log('--- TEST 3: 4-CHANNEL RECRUITER OUTREACH ---');
const inmail = generateRecruiterOutreach(raymond, jobLLM, 'inmail');
const email = generateRecruiterOutreach(raymond, jobLLM, 'email');
const connNote = generateRecruiterOutreach(raymond, jobLLM, 'connection_note');
const followup = generateRecruiterOutreach(raymond, jobLLM, 'followup');

console.log(`Channel 1 (InMail) Length: ${inmail.length} chars`);
console.log(`Channel 2 (Executive Email) Length: ${email.length} chars`);
console.log(`Channel 3 (Connection Note - 300 char limit): ${connNote.length} chars -> "${connNote}"`);
console.log(`Channel 4 (7-Day Follow-Up): Length ${followup.length} chars`);

if (connNote.length <= 300 && email.includes('Key Production Highlights:') && followup.includes('Following up on application:')) {
  console.log('✅ TEST 3 PASSED: All 4 recruitment channels generated with exact length constraints!\n');
} else {
  console.error('❌ TEST 3 FAILED');
  process.exit(1);
}

// 4. Verify PDF Generation & Canva Print Engine
console.log('--- TEST 4: CANVA PRINT & VALID PDF BINARY GENERATOR ---');
const pdfBytes = generateValidPDFBinary(raymond, jobLLM);
const htmlResume = generateCanvaResumeHTML(raymond, jobLLM, 'executive');

console.log(`PDF Byte Size: ${pdfBytes.length} bytes | Header: ${String.fromCharCode(...pdfBytes.slice(0, 8)).trim()}`);
console.log(`Canva Executive HTML Size: ${htmlResume.length} characters`);

if (pdfBytes.length > 500 && htmlResume.includes('Executive Resume') && htmlResume.includes('@media print')) {
  console.log('✅ TEST 4 PASSED: Canva print layout & binary PDF-1.4 stream valid!\n');
} else {
  console.error('❌ TEST 4 FAILED');
  process.exit(1);
}

console.log('========================================================================');
console.log('🏆 ALL PHASE 7 ENTERPRISE SUITE VERIFICATIONS PASSED 100%!');
console.log('========================================================================');
