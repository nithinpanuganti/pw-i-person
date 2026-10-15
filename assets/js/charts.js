/**
 * CivicLens AI - Pure Native SVG Charts
 * 100% dependency-free, responsive, accessible, interactive SVG charts.
 */

const Charts = {
  /**
   * Render Category Distribution Bar Chart
   * @param {string} containerId - Target element ID
   * @param {Object} categoryCounts - { "Waste Management": 5, ... }
   */
  renderCategoryBarChart(containerId, categoryCounts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const entries = Object.entries(categoryCounts);
    const maxVal = Math.max(...entries.map(([_, v]) => v), 1);

    if (entries.length === 0 || entries.every(([_, v]) => v === 0)) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 1.5rem;">
          <p style="color: var(--text-muted); font-size: 0.85rem;">No category data available yet.</p>
        </div>`;
      return;
    }

    const width = 500;
    const height = 240;
    const barWidth = 36;
    const gap = 24;
    const totalBarsWidth = entries.length * (barWidth + gap);
    const svgWidth = Math.max(width, totalBarsWidth + 40);

    const colors = [
      '#14b8a6', '#0284c7', '#3b82f6', '#8b5cf6',
      '#ec4899', '#f97316', '#10b981', '#64748b'
    ];

    let barsHTML = '';
    entries.forEach(([cat, count], idx) => {
      const x = 30 + idx * (barWidth + gap);
      const barHeight = Math.max(6, (count / maxVal) * 150);
      const y = height - 45 - barHeight;
      const color = colors[idx % colors.length];
      const shortName = cat.length > 9 ? cat.slice(0, 8) + '…' : cat;

      barsHTML += `
        <g class="chart-bar-group" tabindex="0" role="graphics-symbol" aria-label="${cat}: ${count} reports">
          <title>${cat}: ${count} reports</title>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="${color}" fill-opacity="0.85">
            <animate attributeName="height" from="0" to="${barHeight}" dur="0.4s" fill="freeze" />
            <animate attributeName="y" from="${height - 45}" to="${y}" dur="0.4s" fill="freeze" />
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" font-weight="700" fill="#f8fafc" text-anchor="middle">${count}</text>
          <text x="${x + barWidth / 2}" y="${height - 25}" font-size="10" font-weight="500" fill="#94a3b8" text-anchor="middle" transform="rotate(-25, ${x + barWidth / 2}, ${height - 25})">${shortName}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${svgWidth} ${height}" class="chart-svg" role="img" aria-label="Issue category distribution chart">
        <line x1="20" y1="${height - 45}" x2="${svgWidth - 20}" y2="${height - 45}" stroke="rgba(148, 163, 184, 0.2)" stroke-width="1"/>
        ${barsHTML}
      </svg>
    `;
  },

  /**
   * Render Activity Trend Over Days (Reports by Day)
   */
  renderTimelineChart(containerId, reports = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (reports.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 1.5rem;">
          <p style="color: var(--text-muted); font-size: 0.85rem;">No timeline activity recorded yet.</p>
        </div>`;
      return;
    }

    // Group reports by date (YYYY-MM-DD)
    const dateCounts = {};
    const sorted = [...reports].sort((a, b) => new Date(a.reportedAt) - new Date(b.reportedAt));

    sorted.forEach(r => {
      try {
        const d = r.reportedAt ? r.reportedAt.split('T')[0] : '2026-10-10';
        dateCounts[d] = (dateCounts[d] || 0) + 1;
      } catch (e) {}
    });

    const entries = Object.entries(dateCounts).slice(-8); // last 8 active days
    if (entries.length === 0) return;

    const width = 500;
    const height = 220;
    const padding = 35;
    const maxVal = Math.max(...entries.map(([_, v]) => v), 1);

    const stepX = entries.length > 1 ? (width - padding * 2) / (entries.length - 1) : 0;
    const points = entries.map(([date, count], idx) => {
      const x = padding + idx * stepX;
      const y = height - padding - (count / maxVal) * (height - padding * 2);
      return { x, y, date, count };
    });

    const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');
    const areaPoints = `${points[0].x},${height - padding} ${polyPoints} ${points[points.length - 1].x},${height - padding}`;

    let dotsAndLabels = '';
    points.forEach(p => {
      const displayDate = p.date.split('-').slice(1).join('/');
      dotsAndLabels += `
        <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#14b8a6" stroke="#0f172a" stroke-width="2">
          <title>${p.date}: ${p.count} report(s)</title>
        </circle>
        <text x="${p.x}" y="${p.y - 9}" font-size="11" font-weight="700" fill="#2dd4bf" text-anchor="middle">${p.count}</text>
        <text x="${p.x}" y="${height - 12}" font-size="10" font-weight="500" fill="#94a3b8" text-anchor="middle">${displayDate}</text>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="Community reports trend over time">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(148, 163, 184, 0.2)" stroke-width="1"/>
        <polygon points="${areaPoints}" fill="url(#areaGrad)"/>
        <polyline points="${polyPoints}" fill="none" stroke="#14b8a6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        ${dotsAndLabels}
      </svg>
    `;
  }
};

window.Charts = Charts;
