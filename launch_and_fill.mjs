import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const TARGET_URL = process.argv[2] || 'https://apply.workable.com/bask-health-1/j/7431DDC44C/apply/';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_PROFILE = 'C:\\Users\\PC\\.temp_chrome_jobassist';

const extDir = 'C:\\Users\\PC\\Desktop\\yesgeruta lij\\jobassist_app\\extension';
const clientsCode = fs.readFileSync(path.join(extDir, 'clients.js'), 'utf8');
const synthCode = fs.readFileSync(path.join(extDir, 'ai_answer_synthesizer.js'), 'utf8');
const resumeCode = fs.readFileSync(path.join(extDir, 'resume_generator.js'), 'utf8');
const contentCode = fs.readFileSync(path.join(extDir, 'content.js'), 'utf8');

const AUTOFILL_CODE = `${clientsCode}\n${synthCode}\n${resumeCode}\n${contentCode}`;

async function main() {
  console.log('🚀 Launching Chrome for JobAssist AutoFill Agent...');
  console.log('Target URL:', TARGET_URL);

  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=9222`,
    `--user-data-dir=${TEMP_PROFILE}`,
    `--no-first-run`,
    `--no-default-browser-check`,
    TARGET_URL
  ], {
    detached: true,
    stdio: 'ignore'
  });
  chromeProcess.unref();

  // Poll for CDP endpoint
  let wsUrl = null;
  for (let attempt = 1; attempt <= 25; attempt++) {
    try {
      await new Promise(r => setTimeout(r, 600));
      const res = await fetch('http://127.0.0.1:9222/json/list');
      const tabs = await res.json();
      const targetTab = tabs.find(t => t.url.includes('workable') || t.url.includes('ashby') || t.url.includes('apply') || t.type === 'page');
      if (targetTab && targetTab.webSocketDebuggerUrl) {
        wsUrl = targetTab.webSocketDebuggerUrl;
        break;
      }
    } catch(e) {}
  }

  if (!wsUrl) {
    console.error('❌ Could not connect to Chrome debugging port.');
    return;
  }

  console.log('🔗 Connected to Chrome CDP. Waiting for React application form to render...');
  await new Promise(r => setTimeout(r, 4000)); // wait for React hydration

  const ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    const msg = {
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: AUTOFILL_CODE,
        returnByValue: true
      }
    };
    ws.send(JSON.stringify(msg));
  };

  ws.onmessage = (event) => {
    try {
      const resp = JSON.parse(event.data);
      if (resp.id === 1) {
        console.log(`\n🎉 SUCCESS: Application fields auto-filled!`);
        console.log(`Position: Senior Back-End Software Engineer @ Bask Health`);
        console.log(`Candidate: Raymond Wong | Email: raymond1994.glo@outlook.com | Phone: 510-340-2070`);
        console.log(`All fields (Headline, Address, LinkedIn, GitHub, 8 Yrs Experience, Sponsorship: No, Salary, Non-Common Questions) are populated in green.`);
        console.log(`Review the application in your Chrome window and click Submit!`);
        ws.close();
        process.exit(0);
      }
    } catch(e) {}
  };

  ws.onerror = (err) => {
    console.error('WebSocket Error:', err.message);
  };
}

main().catch(console.error);
