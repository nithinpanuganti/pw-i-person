/**
 * CivicLens AI - Automated Test Suite
 * Tests Classifier, Priority Formula, Explainability, Hotspot Ranking, Dashboard Metrics,
 * Storage CRUD, Status Transitions, Sanitization, and Recommendations.
 */

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || 'Failed'}: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// 1. Classifier Tests
test('Classifier: identifies Waste Management from garbage keywords', () => {
  const res = Classifier.classify("Overflowing garbage dump on corner sidewalk");
  assertEquals(res.category, "Waste Management");
  assert(res.matchedKeywords.includes("garbage") || res.matchedKeywords.includes("dump"));
});

test('Classifier: identifies Roads and Transportation from pothole', () => {
  const res = Classifier.classify("Deep pothole damaging vehicle suspension on main road");
  assertEquals(res.category, "Roads and Transportation");
  assert(res.matchedKeywords.includes("pothole"));
});

test('Classifier: identifies Water and Drainage from pipe leak', () => {
  const res = Classifier.classify("Underground pipe ruptured causing massive clean water leak");
  assertEquals(res.category, "Water and Drainage");
  assert(res.matchedKeywords.includes("pipe") || res.matchedKeywords.includes("leak"));
});

test('Classifier: identifies Accessibility from wheelchair barrier', () => {
  const res = Classifier.classify("Broken curb ramp blocks wheelchair access to community clinic");
  assertEquals(res.category, "Accessibility");
  assert(res.matchedKeywords.includes("wheelchair") || res.matchedKeywords.includes("ramp"));
});

test('Classifier: identifies Public Safety from electric hazard', () => {
  const res = Classifier.classify("Exposed electric wire sparks hazard near school gate");
  assertEquals(res.category, "Public Safety");
  assert(res.matchedKeywords.includes("wire") || res.matchedKeywords.includes("hazard"));
});

test('Classifier: falls back to Other gracefully on ambiguous text', () => {
  const res = Classifier.classify("Random non-specific comment with zero keywords xyz123");
  assertEquals(res.category, "Other");
});

// 2. Priority Calculation Tests
test('Priority: high severity and safety hazards calculate Critical score (>=80)', () => {
  const report = {
    title: "Live electrical cable dangling near playground children",
    description: "Severe hazard with electrocution risk",
    severity: "High",
    category: "Public Safety",
    locality: "Maple Heights"
  };
  const res = Classifier.calculatePriority(report, []);
  assert(res.score >= 80, `Expected score >= 80, got ${res.score}`);
  assertEquals(res.priorityLabel, "Critical");
  assert(res.explanation.includes("Critical priority"), "Explanation missing priority level");
});

test('Priority: low severity produces Low or Medium score', () => {
  const report = {
    title: "Slight paint scratch on park sign",
    description: "Minor cosmetic wear",
    severity: "Low",
    category: "Streetlights and Public Infrastructure",
    locality: "Maple Heights"
  };
  const res = Classifier.calculatePriority(report, []);
  assert(res.score < 50, `Expected score < 50, got ${res.score}`);
});

test('Priority: cluster bonus increases score for recurring locality reports', () => {
  const existing = [
    { id: '1', locality: 'Cedar Valley', status: 'Open' },
    { id: '2', locality: 'Cedar Valley', status: 'Open' },
    { id: '3', locality: 'Cedar Valley', status: 'Open' }
  ];
  const report = {
    id: '4',
    title: "Fourth road issue",
    description: "Another pothole",
    severity: "Medium",
    locality: "Cedar Valley"
  };
  const withCluster = Classifier.calculatePriority(report, existing);
  const withoutCluster = Classifier.calculatePriority(report, []);
  assert(withCluster.score > withoutCluster.score, "Cluster bonus was not applied");
});

// 3. Hotspot Ranking Tests
test('Hotspots: ranks localities correctly by open and critical counts', () => {
  const mockReports = [
    { locality: 'Area Alpha', status: 'Open', priorityLabel: 'Critical', category: 'Waste Management' },
    { locality: 'Area Alpha', status: 'Open', priorityLabel: 'High', category: 'Waste Management' },
    { locality: 'Area Beta', status: 'Resolved', priorityLabel: 'Low', category: 'Accessibility' }
  ];
  const hotspots = Intelligence.getRankedHotspots(mockReports);
  assertEquals(hotspots[0].locality, 'Area Alpha');
  assert(hotspots[0].hotspotScore > hotspots[1].hotspotScore, 'Area Alpha should rank higher than Beta');
  assertEquals(hotspots[0].dominantCategory, 'Waste Management');
});

// 4. Intelligence & Dashboard KPIs
test('Intelligence: calculates accurate dashboard KPIs', () => {
  const mock = [
    { status: 'Open', priorityLabel: 'Critical' },
    { status: 'In Progress', priorityLabel: 'High' },
    { status: 'Resolved', priorityLabel: 'Low' }
  ];
  const kpis = Intelligence.getDashboardMetrics(mock);
  assertEquals(kpis.total, 3);
  assertEquals(kpis.open, 2);
  assertEquals(kpis.resolved, 1);
  assertEquals(kpis.highOrCritical, 2);
  assertEquals(kpis.resolutionRate, 33);
});

test('Intelligence: generates Community Pulse without fabrication', () => {
  const mock = [
    { category: 'Waste Management', locality: 'Test Ward', status: 'Open', priorityLabel: 'Medium' },
    { category: 'Waste Management', locality: 'Test Ward', status: 'Open', priorityLabel: 'Critical' }
  ];
  const pulse = Intelligence.getCommunityPulse(mock);
  assert(pulse.includes('Waste Management'), 'Pulse did not mention dominant category');
  assert(pulse.includes('Test Ward'), 'Pulse did not mention concentrated locality');
});

// 5. Action Center Recommendations
test('Action Center: synthesizes sanitation cleanup when 2+ waste reports in locality', () => {
  const mock = [
    { id: '1', category: 'Waste Management', locality: 'TestLoc', status: 'Open' },
    { id: '2', category: 'Waste Management', locality: 'TestLoc', status: 'Open' }
  ];
  const actions = Intelligence.generateActionRecommendations(mock);
  assert(actions.length > 0, "Expected action to be generated");
  assert(actions[0].title.includes("Sanitation Drive"));
  assertEquals(actions[0].supportingCount, 2);
});

// 6. Security: Safe Escaping of Untrusted Input
test('Security: escapeHTML sanitizes malicious script tags and quotes', () => {
  const malicious = '<script>alert("xss")</script>&"\'';
  const clean = Utils.escapeHTML(malicious);
  assert(!clean.includes('<script>'), 'Script tag not stripped');
  assert(clean.includes('&lt;script&gt;'), 'HTML characters not properly escaped');
});

// 7. Storage CRUD & Memory State Isolation
test('Storage: adds, retrieves, updates, and deletes records safely', () => {
  // Use memory mock or isolated key
  const testReport = {
    id: 'TEST-999',
    title: 'Test Pothole',
    locality: 'Testville',
    category: 'Roads and Transportation',
    severity: 'Medium',
    status: 'Open'
  };

  const initialCount = Storage.getReports().length;
  Storage.addReport(testReport);
  
  const fetched = Storage.getReportById('TEST-999');
  assert(fetched !== null, 'Report was not added');
  assertEquals(fetched.title, 'Test Pothole');

  Storage.updateReport('TEST-999', { status: 'Resolved' });
  const updated = Storage.getReportById('TEST-999');
  assertEquals(updated.status, 'Resolved');

  Storage.deleteReport('TEST-999');
  const deleted = Storage.getReportById('TEST-999');
  assertEquals(deleted, null, 'Report was not deleted');
  assertEquals(Storage.getReports().length, initialCount);
});

// 8. JSON Import Validation
test('Storage: importData rejects non-object or malformed records', () => {
  let errorCaught = false;
  try {
    Storage.importData("invalid string data");
  } catch (e) {
    errorCaught = true;
  }
  assert(errorCaught, 'Expected import error on malformed data');
});

// Test Runner Execution
async function runAllTests() {
  const resultsContainer = document.getElementById('test-results');
  const statTotal = document.getElementById('stat-total');
  const statPassed = document.getElementById('stat-passed');
  const statFailed = document.getElementById('stat-failed');
  const statTime = document.getElementById('stat-time');

  if (!resultsContainer) return;
  resultsContainer.innerHTML = '';

  let passed = 0;
  let failed = 0;
  const start = performance.now();

  for (const t of tests) {
    const item = document.createElement('div');
    try {
      t.fn();
      passed++;
      item.className = 'test-item pass';
      item.innerHTML = `
        <div>
          <strong>${Utils.escapeHTML(t.name)}</strong>
        </div>
        <span class="badge badge-pass">PASSED</span>
      `;
    } catch (err) {
      failed++;
      item.className = 'test-item fail';
      item.innerHTML = `
        <div>
          <strong>${Utils.escapeHTML(t.name)}</strong>
          <div style="color: var(--fail); font-size: 0.8rem; margin-top: 0.25rem;">${Utils.escapeHTML(err.message)}</div>
        </div>
        <span class="badge badge-fail">FAILED</span>
      `;
    }
    resultsContainer.appendChild(item);
  }

  const duration = Math.round(performance.now() - start);

  if (statTotal) statTotal.textContent = tests.length;
  if (statPassed) statPassed.textContent = passed;
  if (statFailed) statFailed.textContent = failed;
  if (statTime) statTime.textContent = `${duration} ms`;

  console.log(`[CivicLens Test Suite] ${passed} passed, ${failed} failed out of ${tests.length} tests in ${duration}ms.`);
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('run-tests-btn');
  if (btn) btn.addEventListener('click', runAllTests);
  runAllTests();
});
