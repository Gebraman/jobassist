import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = 'jobassist_app/public/screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runTests() {
  console.log('🚀 Starting Automated Verification for Rebuilt JobAssist Platform...');
  
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Test 1: Landing Page (/)
  console.log('1. Testing Root Marketing Landing Page (http://localhost:3001/)...');
  await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('text=Find your best job.');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_landing_desktop.png') });
  console.log('   ✓ Landing page loaded successfully.');

  // Test 2: Funnel Start with UTMs
  console.log('2. Testing Ad Land at /email with UTMs...');
  const testUtmUrl = 'http://localhost:3001/email?utm_source=Facebook&utm_medium=cpc&utm_campaign=Summer_2026_Scale&fbclid=fb_click_test_9988';
  await page.goto(testUtmUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#email-input');
  
  const emailInput = await page.$('#email-input');
  await emailInput.fill('lead.qa.rebuild@jobassist.com');
  await page.waitForTimeout(400);

  const continueBtn = await page.waitForSelector('#continue-btn');
  const isDisabled = await continueBtn.evaluate(el => el.disabled);
  if (isDisabled) throw new Error('Continue button should be enabled after valid email');
  
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_step1_email_gate.png') });
  console.log('   ✓ Step 1 Email Gate validated.');

  // Advance to Step 2
  await continueBtn.click();
  await page.waitForTimeout(600);

  // Test 3: Step 2 Value Checklist
  console.log('3. Testing Step 2 (/we-work-for-you)...');
  await page.waitForSelector('text=Get to your next interview faster');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_step2_checklist.png') });
  await (await page.waitForSelector('button:has-text("Continue")')).click();
  await page.waitForTimeout(600);
  console.log('   ✓ Step 2 Checklist validated.');

  // Test 4: Step 3 Timeline
  console.log('4. Testing Step 3 (/timeline-after-apply)...');
  await page.waitForSelector('text=What happens after you start applying');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_step3_timeline.png') });
  await (await page.waitForSelector('button:has-text("Get my job matches")')).click();
  await page.waitForTimeout(800);
  console.log('   ✓ Step 3 Timeline validated.');

  // Test 5: Step 4 Paywall & Checkout (/checkout)
  console.log('5. Testing Step 4 Paywall & Checkout (/checkout)...');
  await page.waitForSelector('text=Turn your matches into interviews today');
  
  // Test Plan Switcher
  console.log('   Testing Plan selection switching...');
  await page.click('text=3-Month Plan');
  await page.waitForTimeout(300);
  const duePrice3m = await page.evaluate(() => document.querySelector('.ja-sticky-column').innerText);
  if (!duePrice3m.includes('$75.00')) throw new Error('Expected $75.00 for 3-Month Plan');

  await page.click('text=1-Month Plan');
  await page.waitForTimeout(300);

  // Test Currency Switcher
  console.log('   Testing ETB (Br) currency switcher...');
  await page.click('button:has-text("ETB (Br)")');
  await page.waitForTimeout(300);
  const etbPrice = await page.evaluate(() => document.querySelector('.ja-sticky-column').innerText);
  if (!etbPrice.includes('Br4,332.99')) throw new Error('Expected Br4,332.99 for ETB pricing');

  // Switch back to USD
  await page.click('button:has-text("USD ($)")');
  await page.waitForTimeout(300);

  // Test FAQs Accordion
  console.log('   Testing FAQ Accordion toggle...');
  await page.click('text=How does the matching work?');
  await page.waitForTimeout(300);
  const faqOpen = await page.evaluate(() => document.querySelector('#faq-item-0').classList.contains('open'));
  if (!faqOpen) throw new Error('FAQ item should be open after click');

  // Desktop Paywall Screenshot
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_checkout_desktop.png'), fullPage: true });

  // Test Mobile Responsive Viewport
  console.log('   Testing Mobile Responsive View (390px)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_checkout_mobile.png'), fullPage: true });

  // Reset to Desktop & Perform Card Payment
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);

  console.log('   Testing Card Payment form submission...');
  await page.fill('#card-number', '4242424242424242');
  await page.fill('#card-expiry', '1228');
  await page.fill('#card-cvc', '123');
  await page.fill('#card-zip', '94105');
  await page.click('#checkout-cta-btn');

  // Test 6: Welcome Portal (/welcome)
  console.log('6. Testing Post-Checkout Welcome Portal (/welcome)...');
  await page.waitForSelector('text=Your 2,411 Job Matches Are Unlocked!');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_welcome_portal.png') });
  console.log('   ✓ Post-Checkout Portal validated.');

  // Test 7: Self-Service Cancellation (/cancellation)
  console.log('7. Testing Self-Service Cancellation (/cancellation)...');
  await page.goto('http://localhost:3001/cancellation', { waitUntil: 'domcontentloaded' });
  await page.fill('#cancel-email-input', 'lead.qa.rebuild@jobassist.com');
  await page.click('#cancel-btn');
  await page.waitForSelector('text=Cancellation Confirmed!');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_cancellation_confirmed.png') });
  console.log('   ✓ Self-Service Cancellation validated.');

  // Test 8: Jobs Directory (/jobs)
  console.log('8. Testing Jobs Directory (/jobs)...');
  await page.goto('http://localhost:3001/jobs', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('text=Explore Verified Job Openings');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_jobs_directory.png') });
  console.log('   ✓ Jobs Directory validated.');

  await browser.close();
  console.log('\n🎉 ALL 8 END-TO-END AUTOMATED VERIFICATION CHECKS PASSED PERFECTLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
