/**
 * CivicLens AI - Main Application Controller
 * Handles SPA navigation, forms, issue explorer filters, modals, action toggling, and data synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Storage
  Storage.init();

  // 2. Initialize Theme
  initTheme();

  // 3. Initialize Navigation & Routing
  initNavigation();

  // 4. Initialize Report Submission Form & Live Heuristic Preview
  initReportForm();

  // 5. Initialize Issue Explorer Filters & Event Handlers
  initIssueExplorer();

  // 6. Initialize Settings & Data Management
  initSettings();

  // 7. Render Initial View
  renderCurrentView();
});

let currentView = 'overview';
let activeFilterCategory = 'all';
let activeFilterPriority = 'all';
let activeFilterStatus = 'all';
let activeSearchQuery = '';
let activeSort = 'newest';
let selectedHotspotLocality = null;

/**
 * Theme initialization
 */
function initTheme() {
  const savedTheme = Storage.getTheme();
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      Storage.setTheme(next);
      Utils.showToast(`Switched to ${next} theme`, 'info');
    });
  }
}

/**
 * SPA View Navigation
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      navigateTo(targetView);
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (mobileToggle && sidebar && backdrop) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('active');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    });
  }

  // Sidebar direct CTA button
  const ctaBtn = document.getElementById('sidebar-cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      navigateTo('report');
    });
  }
}

function navigateTo(viewId) {
  currentView = viewId;

  // Update nav link active states
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.getAttribute('data-view') === viewId) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Toggle view sections
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const activeSection = document.getElementById(`view-${viewId}`);
  if (activeSection) {
    activeSection.classList.add('active');
  }

  // Close mobile sidebar if open
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');

  // Render view data
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentView() {
  const reports = Storage.getReports();

  switch (currentView) {
    case 'overview':
      renderOverview(reports);
      break;
    case 'report':
      resetReportForm();
      break;
    case 'issues':
      renderIssuesList(reports);
      break;
    case 'hotspots':
      renderHotspots(reports);
      break;
    case 'insights':
      renderInsights(reports);
      break;
    case 'actions':
      renderActions(reports);
      break;
    case 'settings':
      renderSettings();
      break;
  }
}

/**
 * 1. Overview Dashboard Rendering
 */
function renderOverview(reports) {
  const metrics = Intelligence.getDashboardMetrics(reports);

  // Update KPI counters
  Utils.setText(document.getElementById('kpi-total-reports'), metrics.total);
  Utils.setText(document.getElementById('kpi-open-issues'), metrics.open);
  Utils.setText(document.getElementById('kpi-critical-issues'), metrics.highOrCritical);
  Utils.setText(document.getElementById('kpi-resolved-issues'), metrics.resolved);

  // Last updated timestamp
  const lastUpdatedEl = document.getElementById('dashboard-last-updated');
  if (lastUpdatedEl) {
    lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Dynamic Community Pulse
  const pulseEl = document.getElementById('community-pulse-text');
  if (pulseEl) {
    pulseEl.textContent = Intelligence.getCommunityPulse(reports);
  }

  // Render Category distribution bar chart
  const catDistribution = Intelligence.getCategoryDistribution(reports);
  Charts.renderCategoryBarChart('overview-category-chart', catDistribution);

  // Priority Bars Breakdown
  const prioDistribution = Intelligence.getPriorityDistribution(reports);
  const prioContainer = document.getElementById('priority-distribution-list');
  if (prioContainer) {
    const totalReports = metrics.total || 1;
    const prioConfig = [
      { key: 'Critical', label: 'Critical Priority', color: 'var(--priority-critical)' },
      { key: 'High', label: 'High Priority', color: 'var(--priority-high)' },
      { key: 'Medium', label: 'Medium Priority', color: 'var(--priority-med)' },
      { key: 'Low', label: 'Low Priority', color: 'var(--priority-low)' }
    ];

    prioContainer.innerHTML = prioConfig.map(cfg => {
      const count = prioDistribution[cfg.key] || 0;
      const pct = Math.round((count / totalReports) * 100);
      return `
        <div class="priority-row">
          <div class="priority-row-info">
            <span class="priority-label" style="color: ${cfg.color}">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${cfg.color}; margin-right:4px;"></span>
              ${cfg.label}
            </span>
            <span style="color: var(--text-muted); font-size: 0.85rem; font-weight:600;">${count} (${pct}%)</span>
          </div>
          <div class="priority-progress-bar">
            <div class="priority-progress-fill" style="width: ${pct}%; background: ${cfg.color};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Recent Reports Table (last 5)
  const recentTableBody = document.getElementById('recent-reports-table-body');
  if (recentTableBody) {
    const recent = [...reports].sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)).slice(0, 5);
    if (recent.length === 0) {
      recentTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">No reports logged yet.</td></tr>`;
    } else {
      recentTableBody.innerHTML = recent.map(r => `
        <tr>
          <td><strong style="color: var(--teal-400);">${Utils.escapeHTML(r.id)}</strong></td>
          <td>
            <a href="#" class="report-title-link" data-id="${Utils.escapeHTML(r.id)}" style="color: var(--text-main); text-decoration: none; font-weight:600;">
              ${Utils.escapeHTML(r.title)}
            </a>
          </td>
          <td><span style="color: var(--text-muted); font-size: 0.85rem;">${Utils.escapeHTML(r.locality)}</span></td>
          <td><span class="badge badge-${r.priorityLabel ? r.priorityLabel.toLowerCase() : 'med'}">${Utils.escapeHTML(r.priorityLabel || 'Medium')}</span></td>
          <td><span class="badge badge-${r.status ? r.status.toLowerCase().replace(/\s+/g, '-') : 'open'}">${Utils.escapeHTML(r.status || 'Open')}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="openIssueModal('${Utils.escapeHTML(r.id)}')">View</button>
          </td>
        </tr>
      `).join('');

      // Add click listeners to title links
      recentTableBody.querySelectorAll('.report-title-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          openIssueModal(link.getAttribute('data-id'));
        });
      });
    }
  }
}

/**
 * 2. Report Form & Live Classifier Preview
 */
function initReportForm() {
  const form = document.getElementById('report-issue-form');
  const titleInput = document.getElementById('report-title');
  const descInput = document.getElementById('report-description');
  const categorySelect = document.getElementById('report-category');
  const severitySelect = document.getElementById('report-severity');
  const localityInput = document.getElementById('report-locality');
  const previewBox = document.getElementById('classifier-live-preview');

  // Populate category options
  if (categorySelect) {
    categorySelect.innerHTML = `
      <option value="">-- Choose Category (or let AI suggest) --</option>
      ${window.CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
    `;
  }

  const updateLivePreview = () => {
    const text = `${titleInput ? titleInput.value : ''} ${descInput ? descInput.value : ''}`;
    if (!text.trim()) {
      if (previewBox) previewBox.style.display = 'none';
      return;
    }

    const classification = Classifier.classify(text);
    const existing = Storage.getReports();
    const tempReport = {
      title: titleInput.value,
      description: descInput.value,
      category: categorySelect.value || classification.category,
      severity: severitySelect.value || 'Medium',
      locality: localityInput.value || ''
    };
    const prio = Classifier.calculatePriority(tempReport, existing);

    if (previewBox) {
      previewBox.style.display = 'block';
      previewBox.innerHTML = `
        <div class="ai-preview-header">
          <span class="ai-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Live Heuristic Analysis
          </span>
          <span class="badge badge-${prio.priorityLabel.toLowerCase()}">Estimated Priority: ${prio.priorityLabel} (${prio.score}/100)</span>
        </div>
        <p class="ai-reasoning">
          <strong>Suggested Category:</strong> ${Utils.escapeHTML(classification.category)} (${classification.confidence} confidence)<br/>
          <strong>Reasoning:</strong> ${Utils.escapeHTML(classification.explanation)}<br/>
          <strong>Priority Factors:</strong> ${Utils.escapeHTML(prio.factors.join(', '))}
        </p>
      `;
    }

    // Auto-select category if user hasn't explicitly chosen one yet
    if (categorySelect && !categorySelect.value && classification.category !== 'Other') {
      categorySelect.value = classification.category;
    }
  };

  const debouncedPreview = Utils.debounce(updateLivePreview, 250);

  if (titleInput) titleInput.addEventListener('input', debouncedPreview);
  if (descInput) descInput.addEventListener('input', debouncedPreview);
  if (severitySelect) severitySelect.addEventListener('change', debouncedPreview);
  if (localityInput) localityInput.addEventListener('input', debouncedPreview);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = titleInput.value.trim();
      const description = descInput.value.trim();
      let category = categorySelect.value;
      const severity = severitySelect.value || 'Medium';
      const locality = localityInput.value.trim();
      const observedDate = document.getElementById('report-observed-date')?.value || '';
      const reporterName = document.getElementById('report-reporter-name')?.value.trim() || 'Anonymous';
      const tagsRaw = document.getElementById('report-tags')?.value || '';

      if (!title || !description || !locality) {
        Utils.showToast('Please fill in all required fields (Title, Description, Locality).', 'error');
        return;
      }

      // If category empty, classify
      if (!category) {
        const cls = Classifier.classify(`${title} ${description}`);
        category = cls.category;
      }

      const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
      const existingReports = Storage.getReports();

      const tempReport = { title, description, category, severity, locality, tags };
      const priorityResult = Classifier.calculatePriority(tempReport, existingReports);

      const newReport = {
        id: Utils.generateId('CL'),
        title,
        description,
        category,
        locality,
        severity,
        priorityScore: priorityResult.score,
        priorityLabel: priorityResult.priorityLabel,
        status: 'Open',
        reportedAt: new Date().toISOString(),
        observedDate,
        reporterName,
        tags,
        history: [
          { status: 'Open', timestamp: new Date().toISOString(), note: 'Submitted via browser report form' }
        ],
        explanation: priorityResult.explanation
      };

      Storage.addReport(newReport);
      Utils.showToast(`Report ${newReport.id} successfully created!`, 'success');
      form.reset();
      if (previewBox) previewBox.style.display = 'none';

      // Open detail modal immediately or navigate
      navigateTo('issues');
      openIssueModal(newReport.id);
    });
  }
}

function resetReportForm() {
  const form = document.getElementById('report-issue-form');
  if (form) form.reset();
  const preview = document.getElementById('classifier-live-preview');
  if (preview) preview.style.display = 'none';
}

/**
 * 3. Community Issues Explorer
 */
function initIssueExplorer() {
  const searchInput = document.getElementById('issues-search-input');
  const catFilter = document.getElementById('issues-filter-category');
  const prioFilter = document.getElementById('issues-filter-priority');
  const statusFilter = document.getElementById('issues-filter-status');
  const sortSelect = document.getElementById('issues-sort-select');
  const clearBtn = document.getElementById('issues-clear-filters-btn');

  // Populate category filter options
  if (catFilter) {
    catFilter.innerHTML = `
      <option value="all">All Categories</option>
      ${window.CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
    `;
  }

  const applyFilters = () => {
    activeSearchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    activeFilterCategory = catFilter ? catFilter.value : 'all';
    activeFilterPriority = prioFilter ? prioFilter.value : 'all';
    activeFilterStatus = statusFilter ? statusFilter.value : 'all';
    activeSort = sortSelect ? sortSelect.value : 'newest';
    renderIssuesList(Storage.getReports());
  };

  if (searchInput) searchInput.addEventListener('input', Utils.debounce(applyFilters, 200));
  if (catFilter) catFilter.addEventListener('change', applyFilters);
  if (prioFilter) prioFilter.addEventListener('change', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (catFilter) catFilter.value = 'all';
      if (prioFilter) prioFilter.value = 'all';
      if (statusFilter) statusFilter.value = 'all';
      if (sortSelect) sortSelect.value = 'newest';
      applyFilters();
    });
  }
}

function renderIssuesList(reports) {
  const container = document.getElementById('issues-cards-container');
  const countEl = document.getElementById('issues-filtered-count');
  if (!container) return;

  // Filter logic
  let filtered = reports.filter(r => {
    // Search query match
    if (activeSearchQuery) {
      const matchTitle = (r.title || '').toLowerCase().includes(activeSearchQuery);
      const matchDesc = (r.description || '').toLowerCase().includes(activeSearchQuery);
      const matchLoc = (r.locality || '').toLowerCase().includes(activeSearchQuery);
      const matchId = (r.id || '').toLowerCase().includes(activeSearchQuery);
      if (!matchTitle && !matchDesc && !matchLoc && !matchId) return false;
    }

    // Category
    if (activeFilterCategory !== 'all' && r.category !== activeFilterCategory) return false;

    // Priority
    if (activeFilterPriority !== 'all' && r.priorityLabel !== activeFilterPriority) return false;

    // Status
    if (activeFilterStatus !== 'all' && r.status !== activeFilterStatus) return false;

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (activeSort === 'newest') return new Date(b.reportedAt) - new Date(a.reportedAt);
    if (activeSort === 'oldest') return new Date(a.reportedAt) - new Date(b.reportedAt);
    if (activeSort === 'priority') return (b.priorityScore || 0) - (a.priorityScore || 0);
    return 0;
  });

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${reports.length} reports`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h4>No matching reports found</h4>
        <p>Try adjusting your search criteria or clear active filters to view all community reports.</p>
        <button class="btn btn-secondary" onclick="document.getElementById('issues-clear-filters-btn').click()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(r => {
    // Count similar reports in same locality
    const similarCount = reports.filter(item => 
      item.id !== r.id && 
      item.locality && 
      item.locality.toLowerCase() === (r.locality || '').toLowerCase()
    ).length;

    return `
      <div class="issue-card" onclick="openIssueModal('${Utils.escapeHTML(r.id)}')">
        <div>
          <div class="issue-card-top">
            <span class="issue-locality">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${Utils.escapeHTML(r.locality)}
            </span>
            <span class="badge badge-${r.priorityLabel ? r.priorityLabel.toLowerCase() : 'med'}">${Utils.escapeHTML(r.priorityLabel || 'Medium')} (${r.priorityScore || 0})</span>
          </div>
          <h4 class="issue-card-title">${Utils.escapeHTML(r.title)}</h4>
          <p class="issue-card-desc">${Utils.escapeHTML(r.description)}</p>
        </div>
        <div>
          <div style="display:flex; gap:0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
            <span class="badge badge-subtle">${Utils.escapeHTML(r.category)}</span>
            <span class="badge badge-${r.status ? r.status.toLowerCase().replace(/\s+/g, '-') : 'open'}">${Utils.escapeHTML(r.status || 'Open')}</span>
            ${similarCount > 0 ? `<span class="similar-badge">${similarCount} related in area</span>` : ''}
          </div>
          <div class="issue-card-footer">
            <span>${Utils.formatRelativeTime(r.reportedAt)}</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem;">${Utils.escapeHTML(r.id)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Issue Detail Modal Controller
 */
window.openIssueModal = function(reportId) {
  const report = Storage.getReportById(reportId);
  if (!report) return;

  const modalOverlay = document.getElementById('issue-detail-modal');
  const modalContent = document.getElementById('modal-content-area');
  if (!modalOverlay || !modalContent) return;

  const historyHTML = (report.history || []).map(h => `
    <div style="padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color); font-size: 0.85rem;">
      <strong style="color: var(--teal-400);">${Utils.escapeHTML(h.status)}</strong> — ${Utils.formatDate(h.timestamp)}
      <div style="color: var(--text-muted); font-size: 0.8rem;">${Utils.escapeHTML(h.note || '')}</div>
    </div>
  `).join('');

  modalContent.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
      <div>
        <span style="font-family: var(--font-mono); font-size:0.8rem; color:var(--teal-400); font-weight:700;">${Utils.escapeHTML(report.id)}</span>
        <h3 style="font-size: 1.35rem; font-weight: 700; margin-top:0.25rem;">${Utils.escapeHTML(report.title)}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">${Utils.escapeHTML(report.locality)} • Observed: ${Utils.formatDate(report.observedDate || report.reportedAt)}</p>
      </div>
      <div style="display:flex; gap:0.5rem;">
        <span class="badge badge-${report.priorityLabel ? report.priorityLabel.toLowerCase() : 'med'}">${Utils.escapeHTML(report.priorityLabel || 'Medium')} (${report.priorityScore || 0})</span>
        <span class="badge badge-${report.status ? report.status.toLowerCase().replace(/\s+/g, '-') : 'open'}">${Utils.escapeHTML(report.status || 'Open')}</span>
      </div>
    </div>

    <div style="margin-bottom: 1.25rem;">
      <h4 style="font-size: 0.9rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.35rem;">Description</h4>
      <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-main);">${Utils.escapeHTML(report.description)}</p>
    </div>

    <div class="ai-preview-box" style="margin-bottom: 1.25rem;">
      <h4 style="font-size: 0.85rem; color: var(--teal-400); font-weight: 700; margin-bottom: 0.35rem;">Explainable Intelligence Assessment</h4>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${Utils.escapeHTML(report.explanation || 'Calculated via local heuristic engine.')}</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
      <div>
        <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.35rem;">Category</h4>
        <span class="badge badge-subtle">${Utils.escapeHTML(report.category)}</span>
      </div>
      <div>
        <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.35rem;">Reporter</h4>
        <span style="font-size: 0.9rem; color: var(--text-main);">${Utils.escapeHTML(report.reporterName || 'Anonymous')}</span>
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.5rem;">Update Demonstration Status</h4>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn btn-secondary btn-sm" onclick="changeStatus('${report.id}', 'Open')">Set Open</button>
        <button class="btn btn-secondary btn-sm" onclick="changeStatus('${report.id}', 'Acknowledged')">Set Acknowledged</button>
        <button class="btn btn-secondary btn-sm" onclick="changeStatus('${report.id}', 'In Progress')">Set In Progress</button>
        <button class="btn btn-primary btn-sm" onclick="changeStatus('${report.id}', 'Resolved')">Mark Resolved</button>
      </div>
      <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.35rem;">*Status updates are recorded in local browser storage for demonstration.</p>
    </div>

    <div style="margin-bottom: 1rem;">
      <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.5rem;">Activity History</h4>
      <div style="max-height: 120px; overflow-y: auto; background: var(--bg-secondary); border-radius: var(--radius-sm); padding: 0.75rem;">
        ${historyHTML}
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border-color); padding-top: 1rem;">
      <button class="btn btn-danger btn-sm" onclick="deleteReportPrompt('${report.id}')">Delete Report</button>
      <button class="btn btn-secondary" onclick="closeIssueModal()">Close</button>
    </div>
  `;

  modalOverlay.classList.add('active');
};

window.closeIssueModal = function() {
  const modalOverlay = document.getElementById('issue-detail-modal');
  if (modalOverlay) modalOverlay.classList.remove('active');
};

window.changeStatus = function(reportId, newStatus) {
  Storage.updateReport(reportId, { status: newStatus });
  Utils.showToast(`Status updated to "${newStatus}"`, 'success');
  renderCurrentView();
  openIssueModal(reportId); // refresh modal view
};

window.deleteReportPrompt = function(reportId) {
  if (confirm(`Are you sure you want to delete report ${reportId}? This cannot be undone.`)) {
    Storage.deleteReport(reportId);
    Utils.showToast(`Report ${reportId} deleted`, 'info');
    closeIssueModal();
    renderCurrentView();
  }
};

/**
 * 4. Hotspots View Rendering
 */
function renderHotspots(reports) {
  const container = document.getElementById('hotspots-ranking-container');
  const detailsContainer = document.getElementById('hotspot-details-container');
  if (!container) return;

  const hotspots = Intelligence.getRankedHotspots(reports);

  if (hotspots.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>No locality data recorded yet.</p></div>`;
    if (detailsContainer) detailsContainer.innerHTML = '';
    return;
  }

  // Auto-select top hotspot if none selected
  if (!selectedHotspotLocality || !hotspots.find(h => h.locality === selectedHotspotLocality)) {
    selectedHotspotLocality = hotspots[0].locality;
  }

  container.innerHTML = hotspots.map((h, idx) => `
    <div class="hotspot-rank-card ${selectedHotspotLocality === h.locality ? 'active-hotspot' : ''}" 
         onclick="selectHotspot('${Utils.escapeHTML(h.locality)}')" 
         style="${selectedHotspotLocality === h.locality ? 'border-color: var(--teal-400); background: var(--bg-card-hover);' : ''}">
      <div class="hotspot-rank-num">#${idx + 1}</div>
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4 style="font-size:1.05rem; font-weight:700;">${Utils.escapeHTML(h.locality)}</h4>
          <span class="badge ${h.critical > 0 ? 'badge-critical' : 'badge-high'}">Index: ${h.hotspotScore}</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin: 0.25rem 0;">
          ${h.open} open (${h.critical} critical, ${h.high} high) • Top Category: <strong>${Utils.escapeHTML(h.dominantCategory)}</strong>
        </p>
        <p style="font-size:0.8rem; color:var(--teal-400); font-weight:600;">
          → ${Utils.escapeHTML(h.suggestedAction)}
        </p>
      </div>
    </div>
  `).join('');

  renderHotspotDetails(selectedHotspotLocality, reports);
}

window.selectHotspot = function(locality) {
  selectedHotspotLocality = locality;
  renderHotspots(Storage.getReports());
};

function renderHotspotDetails(locality, reports) {
  const detailsContainer = document.getElementById('hotspot-details-container');
  if (!detailsContainer) return;

  const locReports = reports.filter(r => r.locality && r.locality.toLowerCase() === locality.toLowerCase());

  detailsContainer.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Reports in ${Utils.escapeHTML(locality)}
        </h3>
        <span class="badge-subtle">${locReports.length} Total Reports</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:0.75rem; max-height: 480px; overflow-y:auto;">
        ${locReports.map(r => `
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; cursor:pointer;" onclick="openIssueModal('${Utils.escapeHTML(r.id)}')">
            <div style="display:flex; justify-content:space-between; margin-bottom: 0.35rem;">
              <span class="badge badge-${r.priorityLabel ? r.priorityLabel.toLowerCase() : 'med'}">${Utils.escapeHTML(r.priorityLabel || 'Medium')}</span>
              <span class="badge badge-${r.status ? r.status.toLowerCase().replace(/\s+/g, '-') : 'open'}">${Utils.escapeHTML(r.status || 'Open')}</span>
            </div>
            <h5 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">${Utils.escapeHTML(r.title)}</h5>
            <p style="font-size: 0.8rem; color: var(--text-muted);">${Utils.escapeHTML(r.description.slice(0, 100))}...</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * 5. Insights & Methodology Rendering
 */
function renderInsights(reports) {
  const container = document.getElementById('insights-grid-container');
  if (!container) return;

  const metrics = Intelligence.getDashboardMetrics(reports);
  const hotspots = Intelligence.getRankedHotspots(reports);
  const openReports = reports.filter(r => r.status !== 'Resolved');

  // Most frequent category
  const catDistribution = Intelligence.getCategoryDistribution(reports);
  let topCat = 'N/A';
  let topCatCount = 0;
  for (const [c, cnt] of Object.entries(catDistribution)) {
    if (cnt > topCatCount) {
      topCatCount = cnt;
      topCat = c;
    }
  }

  // Highest priority unresolved
  const highestPrio = [...openReports].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))[0];

  container.innerHTML = `
    <div class="kpi-card">
      <div class="kpi-icon teal"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></div>
      <div class="kpi-data">
        <h3>${topCatCount > 0 ? topCatCount : 0} Reports</h3>
        <p>Dominant Category: <strong>${Utils.escapeHTML(topCat)}</strong></p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-icon amber"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
      <div class="kpi-data">
        <h3>${hotspots.length > 0 ? Utils.escapeHTML(hotspots[0].locality) : 'None'}</h3>
        <p>Top Concentrated Locality (${hotspots.length > 0 ? hotspots[0].open : 0} open issues)</p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-icon red"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <div class="kpi-data">
        <h3>${highestPrio ? highestPrio.priorityScore : '0'} / 100</h3>
        <p>Peak Priority Severity (${highestPrio ? Utils.escapeHTML(highestPrio.id) : 'None'})</p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-icon emerald"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="kpi-data">
        <h3>${metrics.resolutionRate}%</h3>
        <p>Community Resolution Rate (${metrics.resolved} of ${metrics.total})</p>
      </div>
    </div>
  `;

  // Render Activity Timeline
  Charts.renderTimelineChart('insights-timeline-chart', reports);
}

/**
 * 6. Action Center Rendering
 */
function renderActions(reports) {
  const container = document.getElementById('action-recommendations-container');
  if (!container) return;

  const savedActions = Storage.getActions();
  const recommendations = Intelligence.generateActionRecommendations(reports, savedActions);

  if (recommendations.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <h4>No community actions triggered yet</h4>
        <p>Actions are automatically synthesized once recurring reports or critical hazards emerge.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recommendations.map(rec => {
    const checklistHTML = rec.checklist.map((item, idx) => `
      <li>
        <input type="checkbox" id="chk-${rec.id}-${idx}" ${item.done ? 'checked' : ''} onchange="toggleChecklistItem('${rec.id}', ${idx}, this.checked)">
        <label for="chk-${rec.id}-${idx}" style="${item.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${Utils.escapeHTML(item.text)}</label>
      </li>
    `).join('');

    return `
      <div class="action-card ${rec.urgency === 'Critical' ? 'high-urgency' : ''}">
        <div class="action-header">
          <div>
            <span class="badge ${rec.urgency === 'Critical' ? 'badge-critical' : 'badge-high'}">${rec.urgency} Urgency</span>
            <span class="badge badge-subtle" style="margin-left:0.5rem;">${Utils.escapeHTML(rec.locality)}</span>
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-top: 0.35rem;">${Utils.escapeHTML(rec.title)}</h3>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <select class="form-select" style="padding:0.3rem 0.6rem; font-size:0.8rem; width:auto;" onchange="updateActionStatus('${rec.id}', this.value)">
              <option value="Not Started" ${rec.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
              <option value="In Progress" ${rec.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${rec.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
            <button class="btn btn-secondary btn-sm" onclick="exportActionSummary('${rec.id}')">Export Plan</button>
          </div>
        </div>

        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
          <strong>Why recommended:</strong> ${Utils.escapeHTML(rec.whyRecommended)}<br/>
          <strong>Responsible Stakeholder:</strong> <span style="color: var(--teal-400);">${Utils.escapeHTML(rec.responsibleStakeholder)}</span><br/>
          <strong>Action:</strong> ${Utils.escapeHTML(rec.suggestedAction)}
        </p>

        <div>
          <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.35rem;">Action Checklist</h4>
          <ul class="action-checklist">
            ${checklistHTML}
          </ul>
        </div>
      </div>
    `;
  }).join('');
}

window.toggleChecklistItem = function(actionId, index, isDone) {
  const reports = Storage.getReports();
  const savedActions = Storage.getActions();
  const recs = Intelligence.generateActionRecommendations(reports, savedActions);
  const target = recs.find(r => r.id === actionId);

  if (target) {
    target.checklist[index].done = isDone;
    Storage.updateActionState(actionId, target.status, target.checklist);
    renderActions(reports);
  }
};

window.updateActionStatus = function(actionId, newStatus) {
  const reports = Storage.getReports();
  const savedActions = Storage.getActions();
  const recs = Intelligence.generateActionRecommendations(reports, savedActions);
  const target = recs.find(r => r.id === actionId);

  if (target) {
    Storage.updateActionState(actionId, newStatus, target.checklist);
    Utils.showToast(`Action status changed to ${newStatus}`, 'success');
    renderActions(reports);
  }
};

window.exportActionSummary = function(actionId) {
  const reports = Storage.getReports();
  const savedActions = Storage.getActions();
  const recs = Intelligence.generateActionRecommendations(reports, savedActions);
  const target = recs.find(r => r.id === actionId);

  if (target) {
    Utils.downloadJSON(target, `${actionId}-action-plan.json`);
    Utils.showToast('Action plan exported as JSON', 'success');
  }
};

/**
 * 7. Settings Controller
 */
function initSettings() {
  const exportBtn = document.getElementById('settings-export-btn');
  const importInput = document.getElementById('settings-import-file');
  const resetDemoBtn = document.getElementById('settings-reset-demo-btn');
  const clearAllBtn = document.getElementById('settings-clear-all-btn');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = Storage.exportData();
      Utils.downloadJSON(data, `civiclens-backup-${new Date().toISOString().split('T')[0]}.json`);
      Utils.showToast('Data exported successfully!', 'success');
    });
  }

  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          const replace = confirm("Do you want to REPLACE existing reports? (Click 'Cancel' to MERGE with current reports)");
          const count = Storage.importData(parsed, replace);
          Utils.showToast(`Successfully imported ${count} reports!`, 'success');
          renderCurrentView();
        } catch (err) {
          alert(`Import failed: ${err.message}`);
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
  }

  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      if (confirm('Reset application data to the 22 built-in demo reports? Any custom reports will be overwritten.')) {
        Storage.resetToDemo();
        Utils.showToast('Reset to demo dataset completed!', 'info');
        renderCurrentView();
      }
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('WARNING: Are you sure you want to completely clear ALL local reports? This cannot be undone.')) {
        Storage.clearAll();
        Utils.showToast('All local reports cleared.', 'info');
        renderCurrentView();
      }
    });
  }
}

function renderSettings() {
  const usageEl = document.getElementById('storage-usage-value');
  if (usageEl) {
    usageEl.textContent = Storage.getStorageUsageEstimate();
  }
}
