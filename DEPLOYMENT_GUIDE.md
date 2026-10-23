# JobAssist Platform — Production Cloud Deployment & Operations Guide

This guide provides step-by-step instructions for deploying the JobAssist platform to production, connecting the Chrome Extension, and operating Ethiopian (Telebirr / CBE) and Global (Binance UID) monetization.

---

## Architecture Overview

- **Backend Platform:** Node.js (v18+ or v20) Express REST API with static file hosting and CORS.
- **Admin Control Center:** Hosted directly at `/admin` (hidden from public navigation, directly accessible to administrator).
- **Chrome Extension (v6.0.0):** Autonomous 9-portal Job Radar, 1-Click ATS AutoFill, Drag-and-Drop Ask AI, and Resume Generator.
- **Active Payment Gateways:**
  - **Telebirr (Ethiopia):** `0948232717` (JobAssist Ethiopia)
  - **Commercial Bank of Ethiopia (CBE):** `1000542193275` (JobAssist Software Tech)
  - **Binance UID (Global / USDT):** `1032674236`
- **Subscription Tiers:**
  - **Daily Pass:** 24 Hours (100 ETB / $1.99)
  - **Flex Pass:** 3 Days / Week (250 ETB / $4.99)
  - **Monthly Pro:** 30 Days (1,200 ETB / $24.99)
  - **Yearly VIP:** 365 Days (9,500 ETB / $149.99)

---

## Option 1: Free Cloud Deployment on Render.com (Recommended)

Render provides free hosting with automatic HTTPS SSL certificates and zero server maintenance.

### Step 1: Push Code to GitHub

From your local machine or terminal:
1. Navigate to the `jobassist_app` folder (or push your repository):
   ```bash
   cd "c:\Users\PC\Desktop\yesgeruta lij\jobassist_app"
   git init
   git add .
   git commit -m "feat: complete JobAssist production build"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/jobassist.git
   git push -u origin main
   ```

### Step 2: Create Web Service on Render

1. Log in to [https://dashboard.render.com](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `jobassist`.
4. Configure the service settings:
   - **Name:** `jobassist-app`
   - **Region:** Frankfurt (EU) or Oregon (US)
   - **Branch:** `main`
   - **Root Directory:** (leave blank if repository root is `jobassist_app`, or set to `jobassist_app` if the whole folder was pushed)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** `Free`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `TELEBIRR_RECEIVER_PHONE` = `0948232717`
   - `CBE_ACCOUNT_NUMBER` = `1000542193275`
   - `BINANCE_UID` = `1032674236`
   - `BINANCE_PAY_ID` = `1032674236`
6. Click **Create Web Service**.
7. Render will build and deploy your app. Once finished, you will receive a free live HTTPS URL (e.g. `https://jobassist-app.onrender.com`).

---

## Option 2: Deploy on Railway.app

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. Railway will automatically detect `package.json` and deploy.
5. In **Settings** -> **Domains**, click **Generate Domain** to get your public `.up.railway.app` URL.
6. In **Variables**, add:
   - `TELEBIRR_RECEIVER_PHONE` = `0948232717`
   - `CBE_ACCOUNT_NUMBER` = `1000542193275`
   - `BINANCE_UID` = `1032674236`

---

## Option 3: Deploy on Linux VPS (Ubuntu / Debian)

If you host on your own server (DigitalOcean, AWS EC2, Hetzner, Linode):

### Using Docker Compose:
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/jobassist.git
cd jobassist/jobassist_app
docker compose up -d --build
```
Your container will run with automatic restart and persistent volume storage for licenses and payments.

### Using Node.js + PM2 (Without Docker):
```bash
cd jobassist_app
npm install --production
npm install -g pm2
pm2 start server.js --name "jobassist"
pm2 save
pm2 startup
```

### Nginx Reverse Proxy with Free Let's Encrypt SSL:
```nginx
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Install SSL:
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Connecting the Chrome Extension to Your Live Cloud Server

### Method A: Built-In UI in Extension (Zero Code Changes)
1. Open the JobAssist Chrome Extension.
2. In the **Gatekeeper Screen** or the **Settings Tab** (gear icon), click **Cloud API Server Settings**.
3. Enter your deployed server URL (e.g. `https://jobassist-app.onrender.com` or `https://yourdomain.com`).
4. Click **Save Server URL**.
5. The extension will immediately connect to your live cloud server and verify licenses!

### Method B: Pre-Configure Default URL Before Distribution
If you want every user downloading the extension zip from your website to automatically connect to your production URL without typing anything:
1. Open `extension/sidepanel.js`.
2. Update line 18:
   ```javascript
   let API_BASE_URL = 'https://jobassist-app.onrender.com'; // Your production domain
   ```
3. Run the sync script to repackage the distribution zip:
   ```bash
   node sync_files.mjs
   ```
4. The newly generated `public/JobAssist-AI-Studio-Extension.zip` will now come pre-configured with your live domain!

---

## Admin Operations & Verification Center

Access the Admin Center at:
`https://<YOUR-LIVE-DOMAIN>/admin`

### 1. Reviewing & Approving User Payment Receipts
1. When a candidate transfers payment via Telebirr (`0948232717`), CBE (`1000542193275`), or Binance UID (`1032674236`), they enter their transaction reference in the checkout form or extension modal.
2. The transaction appears in the Admin Center under **Pending Payment Submissions**.
3. Verify the transaction in your Telebirr app, CBE app, or Binance app.
4. Click **[Approve & Issue Key]**:
   - The license key (`PREM-XXXXXXXX`) is generated and activated.
   - The user's access duration is updated.
5. If the transaction is invalid, click **[Reject]**.

### 2. Issuing Manual License Keys
To create a custom key for direct clients, cash payments, or VIPs:
1. Open the Admin Center at `/admin`.
2. In the **Manual License Granter** panel:
   - Candidate Email: `candidate@example.com`
   - Candidate Name: `Full Name`
   - Duration: Daily, Flex (2-3 Days), Monthly, Yearly, or Lifetime.
   - Select features: AutoFill Specialist, Job Hunter Pro, or Full Combo.
3. Click **Grant License Key**.
4. Deliver the generated key directly to the user.

---

## Persistence & Data Safety

All transactions and licenses are stored in JSON records under `src/data/`:
- `src/data/licenses.json` — All active license keys, expiry dates, and plan tiers.
- `src/data/payments.json` — All submitted transaction IDs, timestamps, and approval statuses.
- `src/data/plans_config.json` — Plan pricing and gateway configuration.

Keep regular backups of these files or mount persistent storage when running in Docker or cloud containers.
