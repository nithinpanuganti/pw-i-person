# CivicLens AI — System Architecture

## 1. Architectural Philosophy & Principles
CivicLens AI is designed as a **zero-dependency, offline-first client-side web application**. It requires no Node.js runtime, backend services, external databases, cloud machine learning APIs, or hosted GIS servers.

Key architectural tenants:
1. **Zero External Dependency:** Runs entirely within any modern standards-compliant browser via HTML5, CSS3, and ES6+.
2. **Deterministic Heuristic Intelligence:** Replaces cloud-hosted LLMs with a transparent, explainable keyword and rule-based heuristic classifier.
3. **Local-First Privacy:** All community observations, edits, and checklists are stored exclusively in the browser's `localStorage`.
4. **Resilient Data Portability:** Seamless import and export workflows using structured JSON schemas.
5. **Static Hosting Compatibility:** Operates seamlessly from the local filesystem (`file://`) and static web hosts like GitHub Pages.

---

## 2. Component Diagram

```
+--------------------------------------------------------------------------+
|                              index.html                                  |
|  (Responsive Sidebar Navigation, Topbar, Main Content Area & Modals)    |
+------------------------------------+-------------------------------------+
                                     |
                                     v
+--------------------------------------------------------------------------+
|                               app.js                                     |
|  - SPA Route Switching & View State Controller                           |
|  - Event Dispatchers & Modal Coordinators                                |
|  - Live Form Reactive Preview                                            |
+----------+-----------------+-------------------+-------------------+-----+
           |                 |                   |                   |
           v                 v                   v                   v
+------------------+ +-----------------+ +-----------------+ +-------------+
|    storage.js    | |  classifier.js  | | intelligence.js | |  charts.js  |
| - LocalStorage   | | - Keyword Match | | - KPI Engine    | | - Pure SVG  |
| - Validation     | | - Priority Math | | - Hotspot Rank  | | - Responsive|
| - JSON Export    | | - Explainability| | - Action Center | | - Accessible|
| - JSON Import    | +-----------------+ +-----------------+ +-------------+
+------------------+
           |
           v
+--------------------------------------------------------------------------+
|                             seed-data.js                                 |
|  (22 Varied Demonstration Reports Across Fictional Localities)           |
+--------------------------------------------------------------------------+
```

---

## 3. Module Responsibilities

### `utils.js`
- **XSS Prevention:** `Utils.escapeHTML(str)` sanitizes all user-supplied text before rendering.
- **Unique Key Generation:** `Utils.generateId(prefix)` provides collision-free local identifiers (e.g., `CL-84920`).
- **Date Formatting:** Relative and calendar date helpers.
- **Micro-Interaction Feedback:** Lightweight toast notifications.

### `storage.js`
- **Schema Keying:** Operates on versioned keys (`civiclens_data_v1`, `civiclens_actions_v1`, `civiclens_theme_v1`).
- **Graceful Fallback:** Catches storage quota exceptions and supports memory fallbacks.
- **Validation:** Enforces strict validation on imported JSON objects, preventing script injection or malformed data states.
- **Demo Seeding:** Injects `SEED_REPORTS` on first launch without overwriting user data on reloads.

### `classifier.js`
- **Category Classifier:** Matches user observations against comprehensive category dictionaries (`Waste Management`, `Roads and Transportation`, `Water and Drainage`, `Streetlights and Public Infrastructure`, `Accessibility`, `Public Safety`, `Environment and Pollution`).
- **Priority Scoring Formula:**
  $$\text{Score} = \text{Severity} + \text{SafetyKeywords} + \text{AccessibilityBonus} + \text{LocalityClusterBonus}$$
  Bounded between $10$ and $100$.
- **Explainability:** Emits plain-text justifications documenting which keywords, hazards, and locality clusters influenced the assigned score.

### `intelligence.js`
- **Community Pulse:** Aggregates percentage shares of dominant categories and alerts on critical issues.
- **Hotspot Ranking:**
  $$\text{Hotspot Index} = (\text{Open} \times 10) + (\text{Critical} \times 15) + (\text{High} \times 8) + (\text{Total} \times 2)$$
- **Action Center Engine:** Translates recurring issues into actionable community initiatives and checklists.

### `charts.js`
- **Zero-Dependency SVG Graphics:** Emits SVG elements for category bar charts and daily timeline trends without external charting libraries.

---

## 4. Deployment Architecture
- **Host:** GitHub Pages
- **Automation:** GitHub Actions (`.github/workflows/deploy.yml`)
- **Triggers:** Push to `main` / `master` or manual `workflow_dispatch`
- **Static Assets:** Deployed directly from root repository directory with `.nojekyll` enabled to prevent path processing issues.
