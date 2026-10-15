# CivicLens AI — Features & Functional Specifications

CivicLens AI transforms disparate citizen observations into structured, explainable, prioritized, and actionable intelligence.

---

## 1. Overview Dashboard
- **Welcome & Community Impact Header:** Summary of active monitoring across local wards with direct CTA to log new issues.
- **KPI Metrics:**
  - Total Community Reports
  - Open / Unresolved Issues
  - High & Critical Priority Situations
  - Community Resolved Issues
- **Dynamic Community Pulse:** Real-time synthesis stating the leading problem domain, percentage of open reports, and cluster alerts.
- **SVG Issue Distribution Chart:** Scalable, responsive bar visualization showing reports across all 7 civic categories.
- **Explainable Priority Bars:** Visual breakdown of Critical, High, Medium, and Low issues.
- **Recent Reports Feed:** Chronological table displaying the latest submissions with immediate detail modal access.

---

## 2. Issue Submission & Live Classifier
- **Validated Submission Fields:** Title, Detailed Description, Category, Locality/Neighborhood, Severity, Date, Reporter Display Name, and Tags.
- **Real-Time Heuristic Feedback:** Dynamic preview box analyzes description keywords on keystroke, displaying estimated priority, suggested category, and contributing factors before submission.
- **Explainable Scoring Engine:** Calculates transparent 0–100 priority score factoring in severity, safety risks, accessibility barriers, and local report density.
- **Local Persistence:** Generates unique ID (`CL-XXXXX`) and logs initial status to browser `localStorage`.

---

## 3. Community Issues Explorer
- **Multi-Vector Search:** Instant client-side search matching against Title, Description, Locality, and Report ID.
- **Granular Filters:** Filter by Category, Priority (Critical/High/Medium/Low), and Status (Open/Acknowledged/In Progress/Resolved).
- **Sorting Options:** Newest, Oldest, or Highest Priority.
- **Interactive Issue Dossier Modal:**
  - Full title, description, locality, date, and reporter details.
  - Explainable priority factors breakdown.
  - Status transition controls (Open -> Acknowledged -> In Progress -> Resolved).
  - Activity audit log tracking status transitions with timestamps.
  - Delete report action with confirmation safeguard.

---

## 4. Community Hotspots & Clustering
- **Ranked Hotspot Localities:** Computes a composite Hotspot Index for every reported neighborhood based on open and critical issues.
- **Locality Relationship Panel:** Displays dominant issue type and suggested community action for each neighborhood.
- **Contextual Inspector:** Selecting any hotspot highlights all corresponding reports from that locality.

---

## 5. Community Intelligence & Analytics
- **Dominant Category Metrics:** Identifies the civic domain experiencing the greatest report volume.
- **Peak Priority Tracker:** Flags the single highest-risk unresolved issue across the entire dataset.
- **Resolution Velocity:** Calculates the overall community resolution percentage.
- **Daily Trend Timeline:** Native SVG area line graph tracking observation submissions across calendar dates.
- **Methodology & Limitations Notice:** Explains heuristic bounds, score formulas, and safety disclaimers.

---

## 6. Action Center
- **Dynamic Recommendation Engine:** Translates recurring patterns into concrete community initiatives:
  - *Sanitation Cleanups:* Triggered by 2+ waste reports in a single locality.
  - *Road Safety Dossiers:* Generated from multiple pothole or asphalt defects.
  - *Drainage Audits:* Synthesized from water leak or drain clogging reports.
  - *Accessibility Walkthroughs:* Formulated when pedestrian ramps or signals fail.
  - *Hazard Cordoning:* Triggered immediately for open electrical or structural risks.
- **Interactive Checklists:** Track progress with checkboxes for each action item.
- **Lifecycle Management:** Move actions between *Not Started*, *In Progress*, and *Completed*.
- **Export Action Plan:** Download structured JSON dossiers for sharing with neighborhood associations or officials.

---

## 7. Settings & Data Portability
- **Storage Metrics:** Displays real-time estimated browser storage utilization.
- **JSON Export:** Download full dataset backup containing reports, action states, and timestamps.
- **Safe JSON Import:** Validates uploaded schemas with options to replace or merge data.
- **Demo Data Reset:** Restores the 22 built-in realistic demonstration reports with a single click.
- **Storage Wipe:** Completely clears all local application records upon confirmation.
- **Theme Preference:** Toggle between Dark Navy and Modern Clean Light themes.
