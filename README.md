# JobAssist Rebuilt Platform

A full-stack, pixel-perfect rebuild of the **JobAssist** career acquisition platform and high-converting marketing funnel, reverse engineered from `https://jobassist.com/checkout?...`.

---

## Quick Start

From the workspace root:

```bash
cd jobassist_app
npm start
```

Or on Windows: double-click `start-jobassist.bat`.

Once started, navigate to:
- **Direct Funnel Landing:** [http://localhost:3001/checkout?utm_source=Facebook](http://localhost:3001/checkout?utm_source=Facebook)
- **Marketing Home:** [http://localhost:3001/](http://localhost:3001/)
- **Jobs Directory:** [http://localhost:3001/jobs](http://localhost:3001/jobs)
- **Pricing & Pass Purchase:** [http://localhost:3001/pricing](http://localhost:3001/pricing)
- **Cancellation Portal:** [http://localhost:3001/cancellation](http://localhost:3001/cancellation)
- **Admin Management Portal:** [http://localhost:3001/admin](http://localhost:3001/admin)

---

## Architecture & Features

### 1. Progressive Multi-Step Funnel
1. **Step 1 (`/email`):** Lead capture with dynamic job match counter (2,411 matches), Google SSO simulation, and real-time email regex validation.
2. **Step 2 (`/we-work-for-you`):** 4-card value checklist ("Get to your next interview faster").
3. **Step 3 (`/timeline-after-apply`):** 3-stage vertical progression stepper ("Today", "This Week", "Next 2 Weeks").
4. **Step 4 (`/checkout`):** Two-column desktop and responsive stacked mobile paywall:
   - 3-tier Plan Selector: 7-Day Trial, 1-Month Plan (`MOST POPULAR`), 3-Month Plan (`BEST VALUE`).
   - Order Summary ("Due Today", discount tags, terms disclaimer).
   - Express Checkout: PayPal Smart Button and Google Pay / Apple Pay.
   - Hosted Card Form with automatic 4-4-4-4 spacing and live brand detection (Visa, Mastercard, Amex).
   - Side-by-side comparison: Manual Search vs JobAssist.
   - 4 Feature showcase cards with UI preview mockups.
   - 5 Radix-style collapsible FAQ accordions with exact verified text.
   - Mobile Sticky Bottom Bar.
   - Dark corporate footer.
5. **Post-Checkout Portal (`/welcome`):** Confirmation screen showing unlocked 2,411 matches and one-click auto-apply simulation.

### 2. Attribution & Query Parameter Persistence
All UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `fbclid`, `ttclid`) are captured upon entry and persistently attached across every internal step transition.

### 3. REST API Endpoints
- `GET /api/session`: Returns session state and active matches count.
- `GET /api/plans`: Returns subscription tiers with formatted pricing and savings.
- `GET /api/faqs`: Returns verified FAQ questions and answers.
- `GET /api/jobs`: Returns verified job listings with filtering by category or query.
- `GET /api/companies`: Returns tech and enterprise hiring directory.
- `POST /api/leads`: Records captured lead with attribution and client IP.
- `POST /api/checkout/confirm`: Authorizes card or express payment, creating an active subscription record.
- `POST /api/subscription/cancel`: Self-service cancellation endpoint.
