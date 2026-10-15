# CivicLens AI — Privacy, Security & Limitations

## 1. Offline-First Privacy Architecture
CivicLens AI is designed with an uncompromising local-first privacy model.

- **Zero Remote Telemetry:** No user activity, keystrokes, form submissions, or diagnostic telemetry are transmitted over the network.
- **Zero Third-Party Trackers:** No Google Analytics, advertising beacons, CDN trackers, or external pixel trackers are loaded.
- **Client-Side Persistence Only:** All created community reports, notes, status changes, and checklist items remain exclusively inside your browser's `localStorage`.
- **Zero Mandatory Identity Data:** Submitting reports does not require email addresses, telephone numbers, home addresses, or social accounts. Display names are strictly optional.

---

## 2. Location & Coordinate Privacy
CivicLens AI does **not** invoke browser geolocation APIs (`navigator.geolocation`) and does not record or transmit precise GPS coordinates.
- Community observations are grouped using coarse, user-entered locality names (e.g. *Maple Heights*, *Cedar Valley*).
- This prevents unintentional exposure of private residential addresses while providing meaningful neighborhood-level intelligence.

---

## 3. Data Ownership & User Rights
- **Complete Portability:** Users can export their full dataset at any time as a portable, standardized JSON document from the **Settings** view.
- **Immediate Data Destruction:** Users have direct control to permanently clear all stored data with a single button click in **Settings**.
- **Browser Clearing Notice:** Because data is held in browser storage, clearing browser cache or running in Incognito/Private mode may purge unsaved reports unless backed up via JSON export.

---

## 4. Operational Limitations & Disclaimers
1. **Decision-Support Only:** Heuristic classifications and priority scores are algorithmic suggestions designed for community coordination and citizen advocacy. They are **not** official government, municipal, or emergency assessments.
2. **Not an Emergency Dispatcher:** CivicLens AI does **not** dispatch police, firefighters, or ambulances. In life-threatening emergencies, citizens must immediately dial local public emergency numbers.
3. **No Direct Municipality Link:** Submitting a report does not automatically transmit tickets to municipal maintenance crews unless citizens compile and present an exported dossier directly to authorities.
