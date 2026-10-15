/**
 * CivicLens AI - Utility Functions
 * Safe text rendering, escaping, ID generation, dates, and helpers.
 */

const Utils = {
  /**
   * Escape HTML to prevent XSS attacks when rendering untrusted user strings
   */
  escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /**
   * Safe DOM text assignment helper
   */
  setText(element, text) {
    if (element) {
      element.textContent = text !== null && text !== undefined ? String(text) : '';
    }
  },

  /**
   * Format ISO date string into readable date (e.g. Oct 14, 2026)
   */
  formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return 'Invalid date';
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  },

  /**
   * Format relative time (e.g. 2 days ago)
   */
  formatRelativeTime(dateString) {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return '';
      const now = new Date();
      const diffMs = now - d;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHour / 24);

      if (diffDays > 30) return this.formatDate(dateString);
      if (diffDays > 1) return `${diffDays} days ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffHour > 1) return `${diffHour} hours ago`;
      if (diffHour === 1) return '1 hour ago';
      if (diffMin > 1) return `${diffMin} mins ago`;
      return 'Just now';
    } catch (e) {
      return '';
    }
  },

  /**
   * Generate a unique local report ID (e.g. CL-84729)
   */
  generateId(prefix = 'CL') {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${random}`;
  },

  /**
   * Debounce function for search and dynamic input
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Download a string as a JSON file
   */
  downloadJSON(data, filename = 'civiclens-data.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Toast notification helper
   */
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3500);
  }
};

// Export to window
window.Utils = Utils;
