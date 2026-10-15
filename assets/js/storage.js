/**
 * CivicLens AI - Local Storage Manager
 * Handles versioned storage, validation, safe persistence, demo reset, JSON import/export.
 */

const STORAGE_KEY = 'civiclens_data_v1';
const ACTION_STORAGE_KEY = 'civiclens_actions_v1';
const THEME_STORAGE_KEY = 'civiclens_theme_v1';

const Storage = {
  /**
   * Check if localStorage is supported and accessible
   */
  isAvailable() {
    try {
      const test = '__cl_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Initialize data: load existing or seed if empty
   */
  init() {
    if (!this.isAvailable()) {
      console.warn('CivicLens AI: LocalStorage is not available. Using memory storage fallback.');
      return;
    }

    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      this.resetToDemo();
    }
  },

  /**
   * Retrieve all reports
   */
  getReports() {
    if (!this.isAvailable()) return window.SEED_REPORTS || [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('CivicLens AI: Failed to parse reports from localStorage', e);
      return [];
    }
  },

  /**
   * Save entire reports array
   */
  saveReports(reports) {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      return true;
    } catch (e) {
      console.error('CivicLens AI: Error writing to localStorage', e);
      Utils.showToast('Storage quota exceeded or storage failure.', 'error');
      return false;
    }
  },

  /**
   * Add a new report to storage
   */
  addReport(report) {
    const reports = this.getReports();
    // Validate required fields
    if (!report.title || !report.locality || !report.category) {
      throw new Error('Report missing required fields');
    }
    
    // Ensure unique ID
    if (!report.id) {
      report.id = Utils.generateId();
    }

    // Safety: ensure default fields
    report.reportedAt = report.reportedAt || new Date().toISOString();
    report.status = report.status || 'Open';
    report.history = report.history || [
      { status: report.status, timestamp: report.reportedAt, note: 'Report created locally' }
    ];

    reports.unshift(report);
    this.saveReports(reports);
    return report;
  },

  /**
   * Get single report by ID
   */
  getReportById(id) {
    const reports = this.getReports();
    return reports.find(r => r.id === id) || null;
  },

  /**
   * Update an existing report
   */
  updateReport(id, updates) {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    const existing = reports[index];
    const oldStatus = existing.status;
    const updated = { ...existing, ...updates, id: existing.id };

    // Record history if status changed
    if (updates.status && updates.status !== oldStatus) {
      updated.history = updated.history || [];
      updated.history.push({
        status: updates.status,
        timestamp: new Date().toISOString(),
        note: updates.statusNote || `Status updated from ${oldStatus} to ${updates.status}`
      });
    }

    reports[index] = updated;
    this.saveReports(reports);
    return updated;
  },

  /**
   * Delete report by ID
   */
  deleteReport(id) {
    const reports = this.getReports();
    const filtered = reports.filter(r => r.id !== id);
    this.saveReports(filtered);
    return filtered.length < reports.length;
  },

  /**
   * Action plans storage
   */
  getActions() {
    if (!this.isAvailable()) return [];
    try {
      const raw = window.localStorage.getItem(ACTION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveActions(actions) {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.setItem(ACTION_STORAGE_KEY, JSON.stringify(actions));
    } catch (e) {
      console.error(e);
    }
  },

  updateActionState(actionId, status, checklist) {
    const actions = this.getActions();
    const idx = actions.findIndex(a => a.id === actionId);
    if (idx !== -1) {
      actions[idx].status = status;
      if (checklist) actions[idx].checklist = checklist;
    } else {
      actions.push({ id: actionId, status, checklist: checklist || [] });
    }
    this.saveActions(actions);
  },

  /**
   * Reset data to the built-in 22 demo reports
   */
  resetToDemo() {
    if (!this.isAvailable()) return;
    const demo = window.SEED_REPORTS || [];
    this.saveReports(JSON.parse(JSON.stringify(demo)));
    this.saveActions([]);
  },

  /**
   * Completely clear all user and demo data
   */
  clearAll() {
    if (!this.isAvailable()) return;
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(ACTION_STORAGE_KEY);
  },

  /**
   * Export all data to JSON
   */
  exportData() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'CivicLens AI',
      reports: this.getReports(),
      actions: this.getActions(),
      theme: this.getTheme()
    };
  },

  /**
   * Import data from JSON object with validation
   */
  importData(data, replace = true) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON structure');
    }

    if (!Array.isArray(data.reports)) {
      throw new Error('Import data missing reports array');
    }

    // Validate and sanitize each report
    const validReports = [];
    const seenIds = new Set();

    data.reports.forEach((r, idx) => {
      if (!r.title || !r.locality) return; // skip corrupted record
      
      let safeId = r.id;
      if (!safeId || seenIds.has(safeId)) {
        safeId = Utils.generateId('IMP');
      }
      seenIds.add(safeId);

      validReports.push({
        id: String(safeId),
        title: String(r.title).slice(0, 150),
        description: String(r.description || '').slice(0, 1000),
        category: String(r.category || 'Other'),
        locality: String(r.locality).slice(0, 80),
        severity: ['Critical', 'High', 'Medium', 'Low'].includes(r.severity) ? r.severity : 'Medium',
        priorityScore: typeof r.priorityScore === 'number' ? Math.max(0, Math.min(100, r.priorityScore)) : 50,
        priorityLabel: r.priorityLabel || 'Medium',
        status: ['Open', 'Acknowledged', 'In Progress', 'Resolved'].includes(r.status) ? r.status : 'Open',
        reportedAt: r.reportedAt || new Date().toISOString(),
        observedDate: r.observedDate || '',
        reporterName: String(r.reporterName || 'Anonymous').slice(0, 50),
        tags: Array.isArray(r.tags) ? r.tags.map(t => String(t).slice(0, 30)) : [],
        history: Array.isArray(r.history) ? r.history : [{ status: 'Open', timestamp: new Date().toISOString(), note: 'Imported' }],
        explanation: String(r.explanation || 'Imported report')
      });
    });

    if (replace) {
      this.saveReports(validReports);
      if (Array.isArray(data.actions)) {
        this.saveActions(data.actions);
      }
    } else {
      // Merge records
      const existing = this.getReports();
      const mergedMap = new Map();
      existing.forEach(item => mergedMap.set(item.id, item));
      validReports.forEach(item => mergedMap.set(item.id, item));
      this.saveReports(Array.from(mergedMap.values()));
    }

    return validReports.length;
  },

  /**
   * Theme storage helpers
   */
  getTheme() {
    if (!this.isAvailable()) return 'dark';
    return window.localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  },

  setTheme(theme) {
    if (!this.isAvailable()) return;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  },

  /**
   * Get approximate storage usage
   */
  getStorageUsageEstimate() {
    if (!this.isAvailable()) return '0 KB';
    try {
      let total = 0;
      for (let x in window.localStorage) {
        if (window.localStorage.hasOwnProperty(x)) {
          total += (window.localStorage[x].length * 2);
        }
      }
      return `${(total / 1024).toFixed(1)} KB`;
    } catch (e) {
      return 'N/A';
    }
  }
};

window.Storage = Storage;
