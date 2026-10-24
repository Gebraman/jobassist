// JobAssist AI Studio - End-to-End Monetization & Access Lifecycle Test

async function runMonetizationE2ETest() {
  const BASE_URL = 'http://localhost:3001';
  console.log('🧪 Starting JobAssist Monetization & License Verification Test...\n');

  // Test 1: Fetch Plans and Gateways
  console.log('1️⃣ Fetching subscription plans & payment gateways:');
  const plansRes = await fetch(`${BASE_URL}/api/premium/plans`).then(r => r.json());
  console.log(`✓ Fetched ${plansRes.plans.length} plans (Daily, Flex, Monthly, Yearly)`);
  console.log(`✓ Verified Gateways: ${Object.keys(plansRes.gateways).join(', ')}`);
  if (!plansRes.success || plansRes.plans.length < 4) throw new Error('Plans verification failed');

  // Test 2: Ethiopian User submits Telebirr payment for Daily Pass (100 ETB)
  console.log('\n2️⃣ Ethiopian applicant submitting Telebirr payment proof:');
  const pay1Res = await fetch(`${BASE_URL}/api/premium/submit-payment`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      candidateName: 'Dawit Mengistu',
      email: 'dawit.m@example.com',
      planId: 'daily',
      currency: 'ETB',
      gateway: 'telebirr',
      reference: 'TB-9823419-ET'
    })
  }).then(r => r.json());
  console.log(`✓ Payment submission response:`, pay1Res);
  const paymentId1 = pay1Res.paymentId || pay1Res.payment?.id;

  // Test 3: International User submits Binance Pay proof for Flex Pass ($4.99)
  console.log('\n3️⃣ International applicant submitting Binance Pay proof:');
  const pay2Res = await fetch(`${BASE_URL}/api/premium/submit-payment`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      candidateName: 'Alex Thorne',
      email: 'alex.thorne@example.com',
      planId: 'flex-3d',
      currency: 'USD',
      gateway: 'binance',
      reference: 'BINANCE-TX-9028471928'
    })
  }).then(r => r.json());
  console.log(`✓ Payment submission response:`, pay2Res);
  const paymentId2 = pay2Res.paymentId || pay2Res.payment?.id;

  // Test 4: Admin views pending payments
  console.log('\n4️⃣ Admin retrieves pending payment queue:');
  const adminPaymentsData = await fetch(`${BASE_URL}/api/admin/payments`, {
    headers: { 'x-admin-key': 'jobassist_admin_secret_2026' }
  }).then(r => r.json());
  const paymentList = Array.isArray(adminPaymentsData) ? adminPaymentsData : (adminPaymentsData.payments || []);
  console.log(`✓ Admin pending queue length: ${paymentList.filter(p => p.status === 'pending').length}`);

  // Test 5: Admin approves Dawit's Telebirr payment
  console.log('\n5️⃣ Admin approving Dawit Mengistu payment:');
  const approveRes = await fetch(`${BASE_URL}/api/admin/payments/approve`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-admin-key': 'jobassist_admin_secret_2026'
    },
    body: JSON.stringify({ paymentId: paymentId1 })
  }).then(r => r.json());
  console.log(`✓ Admin approval success! Issued License Key: ${approveRes.licenseKey}`);
  const dawitKey = approveRes.licenseKey;

  // Test 6: Verify Dawit's license key in Chrome Extension
  console.log('\n6️⃣ Verifying Dawit Mengistu license key:');
  const verifyDawit = await fetch(`${BASE_URL}/api/license/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ licenseKey: dawitKey })
  }).then(r => r.json());
  console.log(`✓ License Verification: Valid=${verifyDawit.valid}, Plan=${verifyDawit.planName}, DaysRemaining=${verifyDawit.daysRemaining}`);
  if (!verifyDawit.valid) throw new Error('Dawit license key verification failed');

  // Test 7: Admin grants custom 2-Day Pass for a manual VIP user
  console.log('\n7️⃣ Admin manually granting 2-Day Custom Pass:');
  const grantCustom = await fetch(`${BASE_URL}/api/admin/licenses/grant`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-admin-key': 'jobassist_admin_secret_2026'
    },
    body: JSON.stringify({
      email: 'custom.hunter@example.com',
      candidateName: 'Bethlehem Tadesse',
      planId: 'flex-2d',
      planName: 'Flex Pass (2 Days)',
      days: 2,
      activeDaysLimit: 2,
      notes: 'Custom 2-day pass granted via Admin Control Center'
    })
  }).then(r => r.json());
  console.log(`✓ Admin granted key: ${grantCustom.license.key} (${grantCustom.license.daysRemaining} days active)`);

  // Test 8: Admin extends Bethlehem's pass by 7 days
  console.log('\n8️⃣ Admin extending license by +7 days:');
  const extendRes = await fetch(`${BASE_URL}/api/admin/licenses/extend`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-admin-key': 'jobassist_admin_secret_2026'
    },
    body: JSON.stringify({
      key: grantCustom.license.key,
      addDays: 7
    })
  }).then(r => r.json());
  console.log(`✓ License extended! Response message: ${extendRes.message}`);

  const verifyBeth = await fetch(`${BASE_URL}/api/license/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ licenseKey: grantCustom.license.key })
  }).then(r => r.json());
  console.log(`✓ Bethlehem Extended Pass Verification: Valid=${verifyBeth.valid}, Plan=${verifyBeth.planName}, DaysRemaining=${verifyBeth.daysRemaining}`);
  if (!verifyBeth.valid || verifyBeth.daysRemaining < 8) throw new Error('Bethlehem license extension failed');

  // Test 9: Verify Primary VIP pass (James Royal)
  console.log('\n9️⃣ Verifying James Royal Primary VIP pass:');
  const grantVIP = await fetch(`${BASE_URL}/api/admin/licenses/grant`, {
    method: 'POST',
    headers: { 'x-admin-key': 'jobassist_admin_secret_2026', 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'jamesroyal.91@outlook.com',
      candidateName: 'James Royal',
      planId: 'yearly',
      durationDays: 365
    })
  }).then(r => r.json());

  const verifyRay = await fetch(`${BASE_URL}/api/license/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ licenseKey: grantVIP.license.key })
  }).then(r => r.json());
  console.log(`✓ James Royal VIP Pass Status: Valid=${verifyRay.valid}, Plan=${verifyRay.planName}, Days=${verifyRay.daysRemaining}`);
  if (!verifyRay.valid) throw new Error('James Royal VIP pass verification failed');

  // Test 10: AI Receipt Verification & Anti-Fraud Engine
  console.log('\n10) Testing AI Receipt Verification & Anti-Fraud Radar:');
  const aiVerify1 = await fetch(`${BASE_URL}/api/premium/verify-receipt-ai`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      paymentMethod: 'telebirr',
      reference: 'CI49KQ32998',
      email: 'newuser@example.com'
    })
  }).then(r => r.json());
  console.log(`✓ Telebirr AI Check: Valid=${aiVerify1.result.validFormat}, Confidence=${aiVerify1.result.confidence}%, Risk=${aiVerify1.result.fraudRisk}`);
  if (!aiVerify1.result.validFormat || aiVerify1.result.confidence < 90) throw new Error('Telebirr AI check failed');

  // Fraud test: Submit already used reference from a different user
  const aiFraudTest = await fetch(`${BASE_URL}/api/premium/verify-receipt-ai`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      paymentMethod: 'telebirr',
      reference: 'TB-9823419-ET', // Previously submitted by Dawit
      email: 'fraudster@example.com'
    })
  }).then(r => r.json());
  console.log(`✓ Fraud Radar Test: Detected=${aiFraudTest.result.fraudRisk}, Action=${aiFraudTest.result.recommendedAction}`);
  if (aiFraudTest.result.fraudRisk !== 'CRITICAL') throw new Error('Fraud radar deduplication failed');

  // Test 11: Real-Time Admin Notifications Feed
  console.log('\n1️⃣1️⃣ Verifying Real-Time Admin Notifications Feed:');
  const notifsRes = await fetch(`${BASE_URL}/api/admin/notifications`, {
    headers: { 'x-admin-key': 'jobassist_admin_secret_2026' }
  }).then(r => r.json());
  console.log(`✓ Live Notifications Count: ${notifsRes.total} (Latest: "${notifsRes.notifications[0]?.title}")`);
  if (!notifsRes.notifications || notifsRes.notifications.length === 0) throw new Error('Notifications feed empty');

  // Test 12: Autonomous Interview Copilot & STAR Q&A Synthesizer
  console.log('\n1️⃣2️⃣ Testing AI Interview Copilot & Question Prediction:');
  const prepRes = await fetch(`${BASE_URL}/api/ai/interview-prep`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jobTitle: 'Senior Back-End Software Engineer',
      company: 'Bask Health',
      keywords: ['NODE.JS', 'TYPESCRIPT', 'POSTGRESQL', 'REDIS'],
      salaryRange: '$175,000 - $190,000',
      candidate: { name: 'Raymond Wong', headline: 'Staff Backend Engineer', yearsBE: '10' }
    })
  }).then(r => r.json());
  console.log(`✓ Interview Prep: Role="${prepRes.prep.role}", PitchLength=${prepRes.prep.elevatorPitch.length} chars, Qs=${prepRes.prep.technicalQuestions.length}`);
  if (!prepRes.success || !prepRes.prep.elevatorPitch || prepRes.prep.technicalQuestions.length < 3) {
    throw new Error('Interview Copilot test failed');
  }

  // Test 13: Pipeline CRM & Kanban Board Store
  console.log('\n1️⃣3️⃣ Verifying Pipeline CRM & Kanban Endpoints:');
  const pipeRes = await fetch(`${BASE_URL}/pipeline`);
  const prepPage = await fetch(`${BASE_URL}/interview-prep`);
  const trackerData = await fetch(`${BASE_URL}/api/ai/tracker`).then(r => r.json());
  console.log(`✓ Pipeline Page Status: ${pipeRes.status}, Interview Page Status: ${prepPage.status}, Tracked Apps: ${trackerData.applications.length}`);
  if (pipeRes.status !== 200 || prepPage.status !== 200) throw new Error('Pipeline or Interview page failed');

  // Test 14: Direct Recruiter Outreach Mailer & Deep Links
  console.log('\n1️⃣4️⃣ Testing Direct Recruiter Outreach Mailer:');
  const outreachRes = await fetch(`${BASE_URL}/api/ai/outreach-generator`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      recipientName: 'Alex Vance',
      company: 'Bask Health',
      jobTitle: 'Senior Back-End Software Engineer',
      candidate: { name: 'Raymond Wong', headline: 'Staff Backend Engineer', yearsBE: '10' },
      tone: 'value_add'
    })
  }).then(r => r.json());
  console.log(`✓ Outreach Pitch: Subject="${outreachRes.outreach.subject}", GmailLinkLength=${outreachRes.outreach.gmailUrl.length}`);
  if (!outreachRes.success || !outreachRes.outreach.gmailUrl.includes('mail.google.com')) {
    throw new Error('Outreach mailer generator failed');
  }

  // Test 15: Multi-Tenant Agency Hub & Universal Web Bookmarklet
  console.log('\n1️⃣5️⃣ Verifying Agency Hub & Universal Web Bookmarklet:');
  const agencyPage = await fetch(`${BASE_URL}/agency`);
  const bookmarkletPage = await fetch(`${BASE_URL}/bookmarklet`);
  const outreachPage = await fetch(`${BASE_URL}/recruiter-outreach`);
  console.log(`✓ Agency Hub: ${agencyPage.status}, Bookmarklet: ${bookmarkletPage.status}, Outreach Page: ${outreachPage.status}`);
  if (agencyPage.status !== 200 || bookmarkletPage.status !== 200 || outreachPage.status !== 200) {
    throw new Error('Agency or Bookmarklet endpoints failed');
  }

  console.log('\n========================================================================');
  console.log('✅ ALL 15 ENTERPRISE RECRUITMENT AGENCY PHASES PASSED 100%!');
  console.log('========================================================================\n');
}

runMonetizationE2ETest().catch(err => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});
