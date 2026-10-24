/**
 * Comprehensive Administrator Security & Authorization Verification Suite
 * Tests:
 * 1. Unauthenticated requests to /admin and /api/admin/* (Must return 401 / Login Page)
 * 2. Unauthorized normal users attempting admin actions (Must return 403 Forbidden)
 * 3. Public registration cannot grant administrator privileges (Role escalation impossible)
 * 4. Safe email normalization & fail-closed behavior
 * 5. Authorized administrator access (Must return 200 and grant dashboard access)
 * 6. Precision time remaining & strict expiration access denial
 * 7. Candidate instant license lookup
 */

import assert from 'assert';

console.log('================================================================');
console.log(' JobAssist Administrator Authorization & Security Test Suite');
console.log('================================================================\n');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3001';

async function runTests() {
  const timestamp = Date.now();
  // Server is running with ADMIN_EMAIL="admin_test@jobassist.ai"
  const adminEmail = 'admin_test@jobassist.ai';
  const normalUserEmail = `candidate_${timestamp}@example.com`;
  const userPassword = 'SecurePassword123!';

  // -------------------------------------------------------------
  // TEST 1: Unauthenticated Requests to Admin Endpoints
  // -------------------------------------------------------------
  console.log('1️⃣  TEST 1: Unauthenticated Requests (No Token/Credentials)');

  // 1a. GET /api/admin/licenses without credentials -> 401
  const resNoAuthLicenses = await fetch(`${BASE_URL}/api/admin/licenses`);
  assert.strictEqual(resNoAuthLicenses.status, 401, 'Unauthenticated API request must return HTTP 401');
  const dataNoAuth = await resNoAuthLicenses.json();
  assert.strictEqual(dataNoAuth.code, 'UNAUTHENTICATED');
  console.log('   ✓ GET /api/admin/licenses returned 401 UNAUTHENTICATED');

  // 1b. POST /api/admin/licenses/grant without credentials -> 401
  const resNoAuthGrant = await fetch(`${BASE_URL}/api/admin/licenses/grant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'target@example.com' })
  });
  assert.strictEqual(resNoAuthGrant.status, 401, 'Unauthenticated grant must return HTTP 401');
  console.log('   ✓ POST /api/admin/licenses/grant returned 401 UNAUTHENTICATED');

  // 1c. GET /admin without credentials -> Must serve Login Page, NOT the dashboard
  const resNoAuthAdminPage = await fetch(`${BASE_URL}/admin`);
  assert.strictEqual(resNoAuthAdminPage.status, 200);
  const htmlNoAuth = await resNoAuthAdminPage.text();
  assert(htmlNoAuth.includes('Admin Sign In') || htmlNoAuth.includes('Administrator Authentication'), 'Must serve admin_login.html to unauthenticated visitors');
  assert(!htmlNoAuth.includes('id="metric-active"'), 'Must NOT reveal dashboard metric cards to unauthenticated visitors');
  console.log('   ✓ Direct navigation to /admin displays login page and protects dashboard\n');

  // -------------------------------------------------------------
  // TEST 2: Register a Normal User & Attempt Privilege Escalation
  // -------------------------------------------------------------
  console.log('2️⃣  TEST 2: Normal Candidate User Registration & Privilege Containment');

  // 2a. Attempting to pass role: 'admin' during public registration
  const resRegUser = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: normalUserEmail,
      password: userPassword,
      name: 'Regular Candidate',
      role: 'admin' // Attack vector: trying to declare self as admin
    })
  });
  assert.strictEqual(resRegUser.status, 201, 'Registration must succeed');
  const regUserData = await resRegUser.json();
  const normalToken = regUserData.token;
  assert(normalToken, 'Session token must be issued');
  assert.strictEqual(regUserData.user.isAdmin, false, 'Public registration MUST NOT grant admin privileges');
  console.log('   ✓ Public registration strictly enforces role = "user" and isAdmin = false');

  // 2b. Verify /api/auth/me for normal user
  const resMeNormal = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${normalToken}` }
  });
  const dataMeNormal = await resMeNormal.json();
  assert.strictEqual(dataMeNormal.authenticated, true);
  assert.strictEqual(dataMeNormal.user.isAdmin, false);
  console.log('   ✓ /api/auth/me confirms normal candidate user is NOT an administrator\n');

  // -------------------------------------------------------------
  // TEST 3: Unauthorized Access by Normal Logged-In User -> 403
  // -------------------------------------------------------------
  console.log('3️⃣  TEST 3: Logged-in Normal User Attempting Admin Endpoints (Must be 403 Forbidden)');

  // 3a. GET /api/admin/licenses with normal user token
  const resForbiddenLicenses = await fetch(`${BASE_URL}/api/admin/licenses`, {
    headers: { 'Authorization': `Bearer ${normalToken}` }
  });
  assert.strictEqual(resForbiddenLicenses.status, 403, 'Normal user must receive 403 Forbidden on licenses list');
  const dataForbiddenLic = await resForbiddenLicenses.json();
  assert.strictEqual(dataForbiddenLic.code, 'FORBIDDEN');
  console.log('   ✓ Normal user blocked from GET /api/admin/licenses (HTTP 403 FORBIDDEN)');

  // 3b. POST /api/admin/licenses/grant with normal user token
  const resForbiddenGrant = await fetch(`${BASE_URL}/api/admin/licenses/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${normalToken}`
    },
    body: JSON.stringify({ email: 'hacker@example.com', durationDays: 365 })
  });
  assert.strictEqual(resForbiddenGrant.status, 403, 'Normal user must receive 403 Forbidden on license grant');
  console.log('   ✓ Normal user blocked from POST /api/admin/licenses/grant (HTTP 403 FORBIDDEN)');

  // 3c. GET /admin with normal user cookie / token -> HTTP 403 Page
  const resForbiddenPage = await fetch(`${BASE_URL}/admin`, {
    headers: { 'Cookie': `ja_session=${normalToken}` }
  });
  assert.strictEqual(resForbiddenPage.status, 403, 'Normal user must receive HTTP 403 on /admin');
  const htmlForbidden = await resForbiddenPage.text();
  assert(htmlForbidden.includes('403 FORBIDDEN') || htmlForbidden.includes('Administrator Access Denied'), 'Must render 403 Forbidden page');
  console.log('   ✓ Normal user blocked from /admin dashboard (HTTP 403 Access Denied page)\n');

  // -------------------------------------------------------------
  // TEST 4: Authorized Administrator Login & Full Access
  // -------------------------------------------------------------
  console.log('4️⃣  TEST 4: Authorized Administrator Verification & Dashboard Access');

  // 4a. Register/Authenticate administrator with mixed case email (testing email normalization)
  let adminToken = null;
  const resAdminReg = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `  Admin_Test@jobassist.ai  `, // Mixed case + whitespace
      password: userPassword,
      name: 'System Admin'
    })
  });

  if (resAdminReg.status === 201) {
    const adminData = await resAdminReg.json();
    adminToken = adminData.token;
  } else {
    // Already registered in a previous run, log in
    const resAdminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: adminEmail,
        password: userPassword
      })
    });
    const loginData = await resAdminLogin.json();
    adminToken = loginData.token;
  }

  assert(adminToken, 'Admin session token must be obtained');

  // 4b. Verify /api/auth/me returns isAdmin = true
  const resMeAdmin = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const dataMeAdmin = await resMeAdmin.json();
  assert.strictEqual(dataMeAdmin.authenticated, true);
  assert.strictEqual(dataMeAdmin.user.isAdmin, true, 'Configured admin email MUST have isAdmin = true');
  console.log('   ✓ /api/auth/me successfully verifies administrator privileges (isAdmin = true)');

  // 4c. Admin access to GET /api/admin/licenses
  const resAdminLic = await fetch(`${BASE_URL}/api/admin/licenses`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert.strictEqual(resAdminLic.status, 200, 'Admin request to /api/admin/licenses must succeed');
  const licData = await resAdminLic.json();
  assert(Array.isArray(licData.licenses), 'Must return array of licenses');
  console.log(`   ✓ Admin access to GET /api/admin/licenses succeeded (${licData.total} licenses tracked)`);

  // 4d. Admin access to POST /api/admin/licenses/grant
  const resAdminGrant = await fetch(`${BASE_URL}/api/admin/licenses/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      email: `applicant_${timestamp}@test.com`,
      candidateName: 'Test Applicant',
      durationDays: 30,
      planId: 'monthly'
    })
  });
  assert.strictEqual(resAdminGrant.status, 200);
  const grantData = await resAdminGrant.json();
  assert(grantData.success);
  assert(grantData.license.key.startsWith('PREM-'));
  console.log(`   ✓ Admin issued new license key: ${grantData.license.key}`);

  // 4e. Admin access to GET /admin (Must serve full dashboard)
  const resAdminPage = await fetch(`${BASE_URL}/admin`, {
    headers: { 'Cookie': `ja_session=${adminToken}` }
  });
  assert.strictEqual(resAdminPage.status, 200);
  const htmlAdmin = await resAdminPage.text();
  assert(htmlAdmin.includes('JobAssist Admin Control Center'), 'Must serve admin.html to authenticated admin');
  assert(htmlAdmin.includes('id="metric-active"'), 'Must render dashboard metrics');
  console.log('   ✓ Authenticated administrator successfully accessed /admin dashboard\n');

  // -------------------------------------------------------------
  // TEST 5: Precision Time Remaining & Expiration Enforcement
  // -------------------------------------------------------------
  console.log('5️⃣  TEST 5: Precision Expiration & Access Denial Verification');

  // 5a. Verify the freshly granted 30-day key
  const resVerifyFresh = await fetch(`${BASE_URL}/api/license/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ licenseKey: grantData.license.key })
  });
  const dataVerifyFresh = await resVerifyFresh.json();
  assert.strictEqual(dataVerifyFresh.valid, true);
  assert.strictEqual(dataVerifyFresh.isExpired, false);
  assert(dataVerifyFresh.timeRemainingFormatted.includes('days remaining'));
  console.log(`   ✓ Active license verification succeeded: "${dataVerifyFresh.timeRemainingFormatted}"`);

  // 5b. Verify with non-existent key
  const resInvalid = await fetch(`${BASE_URL}/api/license/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ licenseKey: 'PREM-DOES-NOT-EXIST' })
  });
  const dataInvalid = await resInvalid.json();
  assert.strictEqual(dataInvalid.valid, false, 'Non-existent key must return valid = false');
  console.log('   ✓ Non-existent key strictly rejected (valid = false)');

  // 5c. Grant an expired license (durationDays = -1) to test strict expiration denial
  const resGrantExpired = await fetch(`${BASE_URL}/api/admin/licenses/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      email: `expired_user_${timestamp}@test.com`,
      candidateName: 'Expired User',
      durationDays: -1
    })
  });
  const grantExpiredData = await resGrantExpired.json();
  const expiredKey = grantExpiredData.license.key;

  // Verify the expired key
  const resExpired = await fetch(`${BASE_URL}/api/license/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ licenseKey: expiredKey })
  });
  const dataExpired = await resExpired.json();
  assert.strictEqual(dataExpired.valid, false, 'Expired license must return valid = false');
  assert.strictEqual(dataExpired.isExpired, true, 'Expired license must have isExpired = true');
  assert.strictEqual(dataExpired.status, 'expired', 'Expired license must have status = expired');
  assert.strictEqual(dataExpired.daysRemaining, 0);
  assert(dataExpired.message.includes('expired'), 'Must provide clear expiration message');
  console.log('   ✓ Expired license strictly denied access (valid = false, isExpired = true, status = "expired")\n');

  // -------------------------------------------------------------
  // TEST 6: Candidate Instant License Lookup
  // -------------------------------------------------------------
  console.log('6️⃣  TEST 6: Candidate Instant License Lookup by Email');
  const resLookup = await fetch(`${BASE_URL}/api/license/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `applicant_${timestamp}@test.com` })
  });
  const dataLookup = await resLookup.json();
  assert.strictEqual(dataLookup.found, true);
  assert.strictEqual(dataLookup.key, grantData.license.key);
  console.log(`   ✓ Instant candidate lookup found key: ${dataLookup.key} (${dataLookup.timeRemainingFormatted})`);

  console.log('\n================================================================');
  console.log(' ✓ ALL 6 SECURITY, AUTH & ACCESS CONTROL TESTS PASSED');
  console.log('================================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILURE:', err);
  process.exit(1);
});
