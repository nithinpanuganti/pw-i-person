# CivicLens AI — Testing Documentation & Test Suite

## 1. Test Suite Architecture
CivicLens AI includes a lightweight, self-contained automated test suite located at `tests/index.html` and `tests/tests.js`.
It runs directly in any modern browser without npm dependencies, Node.js runtimes, or test runner packages.

---

## 2. Test Execution Instructions

### In the Browser:
1. Double-click or open `tests/index.html` in Chrome, Firefox, Safari, or Edge.
2. The test runner will automatically execute all unit and integration assertions upon loading.
3. You can click **"Run All Tests"** to re-run the suite at any time.
4. Pass/Fail statuses, error traces, and millisecond execution times are displayed on screen.

---

## 3. Test Coverage Matrix

| Area | Test Description | Status |
| :--- | :--- | :--- |
| **Classifier** | Identifies `Waste Management` from garbage keywords | Pass |
| **Classifier** | Identifies `Roads and Transportation` from pothole keywords | Pass |
| **Classifier** | Identifies `Water and Drainage` from pipe leak keywords | Pass |
| **Classifier** | Identifies `Accessibility` from wheelchair barrier keywords | Pass |
| **Classifier** | Identifies `Public Safety` from electric hazard keywords | Pass |
| **Classifier** | Falls back to `Other` gracefully on ambiguous text | Pass |
| **Priority Engine** | High severity + safety hazard scores $\ge 80$ (Critical) | Pass |
| **Priority Engine** | Low severity produces score $< 50$ (Low/Medium) | Pass |
| **Priority Engine** | Cluster bonus increases score for recurring locality reports | Pass |
| **Hotspot Engine** | Ranks localities correctly by open and critical counts | Pass |
| **Intelligence** | Calculates accurate dashboard KPIs (total, open, resolved) | Pass |
| **Intelligence** | Generates dynamic Community Pulse without fabrication | Pass |
| **Action Center** | Synthesizes sanitation cleanup when $\ge 2$ waste reports in area | Pass |
| **Security** | `escapeHTML` sanitizes malicious script tags and HTML quotes | Pass |
| **Storage CRUD** | Adds, retrieves, updates status, and deletes records safely | Pass |
| **Data Import** | Rejects malformed JSON or non-object import data | Pass |

Total tests implemented: **16 test cases**.
Expected execution time: **< 15 ms**.
All tests are isolated from the user's primary application state.
