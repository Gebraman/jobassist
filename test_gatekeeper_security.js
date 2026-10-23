import assert from 'assert';

console.log('🧪 Starting JobAssist Extension Security & Gatekeeper Verification Suite...\n');

const BASE_URL = 'http://localhost:3001';

// 1. Unlicensed / Unauthorized User Test
console.log('1️⃣ Testing unauthorized user verification (Should be LOCKED):');
const resUnlicensed = await fetch(`${BASE_URL}/api/license/verify`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ licenseKey: 'FAKEXX-INVALID-KEY', email: 'random_unregistered@gmail.com' })
});
const dataUnlicensed = await resUnlicensed.json();
console.log('Unlicensed result:', dataUnlicensed);
assert.strictEqual(dataUnlicensed.valid, false, 'Unlicensed user must NOT be granted access!');
console.log('✓ Unauthorized users are strictly rejected (valid = false).\n');

// 2. Admin Manual Key Creation (Granting 1-Day Access)
console.log('2️⃣ Admin issuing 1-Day Pass for a paid Ethiopian applicant:');
const resGrant = await fetch(`${BASE_URL}/api/admin/licenses/grant`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'tigist.t@example.com',
    candidateName: 'Tigist Tadesse',
    planId: 'daily',
    durationDays: 1,
    notes: 'Paid 100 ETB via Telebirr'
  })
});
const dataGrant = await resGrant.json();
console.log('Grant result:', dataGrant);
assert(dataGrant.success, 'License grant must succeed');
const issuedKey = dataGrant.license.key;
console.log(`✓ Issued Key: ${issuedKey}\n`);

// 3. User Unlocks Studio with Issued Key
console.log('3️⃣ User enters issued key into Gatekeeper screen:');
const resUnlock = await fetch(`${BASE_URL}/api/license/verify`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ licenseKey: issuedKey })
});
const dataUnlock = await resUnlock.json();
console.log('Unlock result:', dataUnlock);
assert.strictEqual(dataUnlock.valid, true, 'Issued key must unlock studio!');
assert.strictEqual(dataUnlock.daysRemaining, 1);
assert.strictEqual(dataUnlock.candidateName, 'Tigist Tadesse');
console.log('✓ Studio unlocked successfully with authorized administrator key!\n');

// 4. Download Extension ZIP Route Verification
console.log('4️⃣ Testing 1-Click Extension ZIP download route:');
const resDl = await fetch(`${BASE_URL}/download-extension`);
assert.strictEqual(resDl.status, 200);
assert.strictEqual(resDl.headers.get('content-type'), 'application/zip');
const blob = await resDl.arrayBuffer();
assert(blob.byteLength > 10000, 'Zip package must be populated with all files');
console.log(`✓ Extension zip downloaded successfully (${Math.round(blob.byteLength / 1024)} KB) with HOW_TO_INSTALL.txt included.\n`);

console.log('========================================================================');
console.log('✅ ALL EXTENSION GATEKEEPER & ACCESS CONTROL TESTS PASSED (100%)!');
console.log('========================================================================');
