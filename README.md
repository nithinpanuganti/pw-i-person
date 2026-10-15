# CivicLens AI — Community Issue Intelligence Platform

[![Deploy CivicLens AI to GitHub Pages](https://github.com/actions/workflows/deploy.yml/badge.svg)](.github/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Dependencies: Zero](https://img.shields.io/badge/Dependencies-Zero-emerald.svg)](index.html)
[![Storage: Local--Only](https://img.shields.io/badge/Storage-Local--Only-blue.svg)](docs/PRIVACY.md)

> **See the Issues. Understand the Impact. Drive Community Action.**

---

## 1. Overview & Problem Statement
Citizens frequently encounter localized community challenges such as overflowing garbage dumps, deep potholes, malfunctioning streetlights, ruptured water pipes, clogged storm drains, and broken wheelchair curb ramps.

Unfortunately, these observations are often scattered across disconnected social media channels or lost in bureaucratic backlogs. Citizens struggle to answer five fundamental questions:
1. **What problems exist in our community right now?**
2. **Which problems require immediate attention first?**
3. **Where are problems recurring repeatedly?**
4. **What concrete collective actions can citizens take?**
5. **Is the community making measurable progress over time?**

**CivicLens AI** is an offline-first, browser-based community intelligence platform that answers all five questions. It uses deterministic keyword heuristics, explainable priority scoring, and algorithmic hotspot clustering to transform everyday citizen observations into structured, prioritized, and actionable intelligence.

---

## 2. Key Differentiators
- **100% Dependency-Free:** Zero npm packages, frameworks, build steps, or CDN requirements. Built strictly with standard HTML5, CSS3, and Vanilla JavaScript (ES6+).
- **Offline-First & Local-Only:** All data stays safely in browser `localStorage`. No accounts, no backend servers, and zero telemetry.
- **Explainable Intelligence Engine:** Instead of an opaque cloud LLM, it uses a transparent, explainable heuristic classifier that highlights exact keyword matches and contributing risk factors.
- **Action Center:** Translates recurring issue clusters into practical community initiatives, evidence dossiers, and step-by-step checklists.
- **Native SVG Visualizations:** Custom, responsive SVG bar and area timeline charts built entirely without charting libraries.
- **Instant GitHub Pages Deployment:** Pre-configured with automated GitHub Actions workflow (`deploy.yml`).

---

## 3. Technology Stack
- **Structure:** Semantic HTML5
- **Styling:** Custom CSS3 Design System with CSS variables, light/dark themes, and responsive media queries
- **Logic:** Vanilla JavaScript (ES6+ Modules & Single Page Architecture)
- **Persistence:** Browser `localStorage` with versioned schema validation
- **Data Visualizations:** Pure native SVG (no Chart.js, D3, or Canvas dependencies)
- **Deployment:** GitHub Actions (`actions/deploy-pages@v4`) & GitHub Pages static hosting

---

## 4. Application Architecture & Views

```
CivicLens-AI/
├── index.html                  # Main SPA interface and semantic view containers
├── 404.html                    # Static fallback for GitHub Pages
├── README.md                   # Complete project documentation
├── LICENSE                     # Open source MIT license
├── .nojekyll                   # Disables Jekyll processing on GitHub Pages
├── assets/
│   ├── css/
│   │   ├── styles.css          # Design system, tokens, colors, layouts, and cards
│   │   └── responsive.css      # Breakpoints for tablet, mobile, and reduced-motion
│   ├── js/
│   │   ├── utils.js            # XSS sanitization, unique IDs, toasts, dates
│   │   ├── seed-data.js        # 22 realistic demo reports across fictional wards
│   │   ├── storage.js          # LocalStorage CRUD, export/import validation
│   │   ├── classifier.js       # Heuristic keyword classifier & priority formula
│   │   ├── intelligence.js     # Hotspot ranking, Community Pulse, Action rules
│   │   ├── charts.js           # Native SVG category bar and timeline charts
│   │   └── app.js              # SPA navigation, form reactivity, modals, filters
│   └── images/
│       ├── logo.svg            # Custom vector brand mark
│       └── empty-state.svg     # Clean vector empty state graphic
├── docs/
│   ├── ARCHITECTURE.md         # Detailed architectural diagrams & module boundaries
│   ├── FEATURES.md             # Complete functional specification of all screens
│   ├── TESTING.md              # Automated test suite coverage and execution
│   ├── DEPLOYMENT.md           # Step-by-step GitHub Actions setup guide
│   └── PRIVACY.md              # Privacy guarantees and safety limitations
├── tests/
│   ├── index.html              # Browser-native automated test runner UI
│   └── tests.js                # 16 unit and integration test assertions
└── .github/
    └── workflows/
        └── deploy.yml          # Automated CI/CD GitHub Pages deployment
```

---

## 5. Local Setup Instructions
Because CivicLens AI requires no build process or package installation:

1. **Clone or Download** this repository:
   ```bash
   git clone <repo-url>
   cd "project pw i person"
   ```
2. **Open the Application:**
   - Double-click `index.html` to open it directly in your browser (`file:///.../index.html`).
   - Or run a lightweight local static server:
     ```bash
     python -m http.server 8000
     ```
     and navigate to `http://localhost:8000/`.

---

## 6. How to Run the Automated Test Suite
CivicLens AI includes a self-contained unit and integration test suite with 16 test cases.
1. Open `tests/index.html` in your browser.
2. The tests execute immediately upon load.
3. You can click **"Run All Tests"** to re-execute the suite on demand.
4. Covered areas:
   - Heuristic category classification across 7 civic domains
   - Explainable priority formula and scoring thresholds
   - Hotspot index calculation and locality ranking
   - Dynamic Community Pulse generation
   - Action Center recommendation synthesis
   - XSS sanitization (`escapeHTML`)
   - Storage CRUD and JSON import validation

---

## 7. Demonstration Dataset
On initial launch, CivicLens AI automatically seeds 22 varied, realistic demonstration reports across fictional localities (e.g., *Maple Heights*, *Cedar Valley*, *Riverside Ward*, *Greenfield Park*, *Lakeside Enclave*).
- Demonstrates recurring waste accumulation in Maple Heights.
- Demonstrates road damage and open manholes in high-traffic corridors.
- Demonstrates accessibility barriers affecting wheelchair users.
- Demonstrates urgent public safety hazards (exposed electrical wiring).
- You can reset or clear data at any time from the **Settings** view.

---

## 8. Automated GitHub Pages Deployment
A GitHub Actions workflow is provided at `.github/workflows/deploy.yml`.

### Deployment Steps:
1. Push the code to the `main` branch of your GitHub repository.
2. In your repository on GitHub, go to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, choose **GitHub Actions**.
4. GitHub Actions will automatically deploy the static files to `https://<USERNAME>.github.io/<REPOSITORY>/`.

---

## 9. Limitations & Ethical Civic Tech Notice
- **Decision Support:** CivicLens AI is a community decision-support platform, not an official municipal dispatch system.
- **Emergency Situations:** For active fires, gas leaks, crimes in progress, or severe medical emergencies, citizens must immediately call designated emergency numbers (e.g., 911, 112).
- **Local Storage Scope:** Data exists only on the user's specific browser until exported to JSON and shared.

---

## 10. License
Distributed under the [MIT License](LICENSE).
