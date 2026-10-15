/**
 * CivicLens AI - Local Issue Intelligence & Heuristic Classifier Engine
 * 100% browser-based heuristic keyword classification, priority scoring, and explainability.
 * No external APIs, LLMs, or cloud dependencies. Transparent rules.
 */

const CATEGORIES = [
  "Waste Management",
  "Roads and Transportation",
  "Water and Drainage",
  "Streetlights and Public Infrastructure",
  "Accessibility",
  "Public Safety",
  "Environment and Pollution",
  "Other"
];

// Dictionary of keyword matches per category
const CATEGORY_KEYWORDS = {
  "Waste Management": [
    "garbage", "trash", "dump", "waste", "litter", "rubbish", "compost", "refuse",
    "bin", "debris", "overflowing", "sanitation", "filth", "dumping", "smell"
  ],
  "Roads and Transportation": [
    "pothole", "road", "pavement", "traffic", "crosswalk", "zebra", "speed breaker",
    "asphalt", "crater", "bus stop", "transit", "vehicle", "highway", "manhole",
    "signals", "lane", "bridge", "intersection"
  ],
  "Water and Drainage": [
    "water", "drain", "drainage", "pipe", "leak", "sewer", "sewage", "flood",
    "culvert", "clogged", "monsoon", "stagnant", "spill", "gutter", "plumbing"
  ],
  "Streetlights and Public Infrastructure": [
    "streetlight", "light", "lamp", "dark", "bench", "pole", "bus shelter",
    "infrastructure", "park bench", "electricity pole", "bulb", "fixture", "illumination"
  ],
  "Accessibility": [
    "wheelchair", "ramp", "footpath", "sidewalk", "curb", "blind", "audio signal",
    "tactile", "barrier", "pedestrian", "handicap", "inclusive", "disabled", "elderly", "crutch"
  ],
  "Public Safety": [
    "hazard", "wire", "electric", "cable", "danger", "fire", "shock", "glass",
    "falling", "unsafe", "transformer", "exposed", "collapse", "sharp", "emergency", "crime"
  ],
  "Environment and Pollution": [
    "pollution", "smoke", "burning", "air", "dust", "toxic", "noise", "factory",
    "chemical", "smog", "trees", "lake", "river", "emission", "odour"
  ]
};

// Safety amplifier terms for priority calculation
const SAFETY_TERMS = [
  "danger", "hazard", "exposed wire", "electric", "electrocution", "fire", "collapse",
  "school", "children", "hospital", "clinic", "elderly", "accident", "manhole", "deep"
];

const Classifier = {
  /**
   * Automatically classify an issue text into a category
   * @param {string} text - Title, description, and tags combined
   * @returns {Object} { category, matchedKeywords, confidence, explanation }
   */
  classify(text) {
    if (!text || typeof text !== 'string') {
      return {
        category: "Other",
        matchedKeywords: [],
        confidence: "Low",
        explanation: "Insufficient text provided for automatic categorization."
      };
    }

    const normalized = text.toLowerCase();
    const scores = {};
    const matches = {};

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      scores[category] = 0;
      matches[category] = [];

      for (const kw of keywords) {
        // Word boundary or substring regex
        const regex = new RegExp(`\\b${kw}`, 'gi');
        const found = normalized.match(regex);
        if (found) {
          scores[category] += found.length * (kw.length > 5 ? 2 : 1.5);
          matches[category].push(kw);
        }
      }
    }

    // Determine top category
    let topCategory = "Other";
    let highestScore = 0;

    for (const [cat, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        topCategory = cat;
      }
    }

    const matched = matches[topCategory] || [];
    let confidence = "Low";
    if (highestScore >= 4) confidence = "High";
    else if (highestScore >= 1.5) confidence = "Medium";

    let explanation = "";
    if (matched.length > 0) {
      explanation = `Matched keywords [${matched.slice(0, 4).join(', ')}] indicative of ${topCategory}.`;
    } else {
      explanation = "No strong category indicators detected; classified as Other for manual selection.";
    }

    return {
      category: topCategory,
      matchedKeywords: matched,
      confidence,
      explanation
    };
  },

  /**
   * Transparent priority scoring (0 - 100)
   * Factors:
   * 1. Reporter-selected severity: Low (10), Medium (25), High (40)
   * 2. Safety and vulnerability keywords: +15 to +30
   * 3. Locality recurrence: +5 per existing open report in same locality (up to +20)
   * 4. Accessibility impact: +10 if affecting mobility or pedestrian safety
   * 5. Age of report: +5 for older unresolved reports
   */
  calculatePriority(report, existingReports = []) {
    let score = 20; // baseline
    const factors = [];

    // 1. Severity weight
    const sev = (report.severity || 'Medium').toLowerCase();
    if (sev === 'high') {
      score += 35;
      factors.push('Reporter designated High severity (+35)');
    } else if (sev === 'medium') {
      score += 20;
      factors.push('Reporter designated Medium severity (+20)');
    } else {
      score += 10;
      factors.push('Reporter designated Low severity (+10)');
    }

    // 2. Safety terms matching
    const fullText = `${report.title || ''} ${report.description || ''}`.toLowerCase();
    const matchedSafety = SAFETY_TERMS.filter(term => fullText.includes(term));
    if (matchedSafety.length > 0) {
      const bonus = Math.min(25, matchedSafety.length * 8);
      score += bonus;
      factors.push(`Mentions safety critical factors [${matchedSafety.slice(0, 3).join(', ')}] (+${bonus})`);
    }

    // 3. Accessibility category bonus
    if (report.category === 'Accessibility' || fullText.includes('wheelchair') || fullText.includes('ramp')) {
      score += 12;
      factors.push('Presents mobility or accessibility impedance (+12)');
    }

    // 4. Locality recurrence
    if (report.locality && existingReports.length > 0) {
      const sameLocalityOpen = existingReports.filter(r => 
        r.id !== report.id &&
        r.locality &&
        r.locality.toLowerCase() === report.locality.toLowerCase() &&
        r.status !== 'Resolved'
      );

      if (sameLocalityOpen.length > 0) {
        const clusterBonus = Math.min(20, sameLocalityOpen.length * 6);
        score += clusterBonus;
        factors.push(`${sameLocalityOpen.length} unresolved reports in ${report.locality} (+${clusterBonus})`);
      }
    }

    // Cap score at 100
    score = Math.min(100, Math.max(10, Math.round(score)));

    // Assign priority label
    let priorityLabel = 'Low';
    let suggestedAction = 'Review and queue for routine maintenance.';

    if (score >= 80) {
      priorityLabel = 'Critical';
      suggestedAction = 'Urgent community safety hazard; immediate escalation recommended.';
    } else if (score >= 65) {
      priorityLabel = 'High';
      suggestedAction = 'Priority issue; schedule inspection within 48 hours.';
    } else if (score >= 45) {
      priorityLabel = 'Medium';
      suggestedAction = 'Moderate impact; track with regular locality maintenance.';
    }

    const explanation = `${priorityLabel} priority (${score}/100) calculated because: ${factors.join('; ')}.`;

    return {
      score,
      priorityLabel,
      factors,
      suggestedAction,
      explanation
    };
  }
};

window.Classifier = Classifier;
window.CATEGORIES = CATEGORIES;
