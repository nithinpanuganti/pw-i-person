/**
 * CivicLens AI - Intelligence & Hotspot Analytics Engine
 * Calculates dynamic community pulse, ranked hotspots, metric aggregations, and Action Center recommendations.
 */

const Intelligence = {
  /**
   * Calculate top-level overview KPIs
   */
  getDashboardMetrics(reports = []) {
    const total = reports.length;
    const open = reports.filter(r => r.status !== 'Resolved').length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;
    const highOrCritical = reports.filter(r => 
      (r.priorityLabel === 'Critical' || r.priorityLabel === 'High') && r.status !== 'Resolved'
    ).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      total,
      open,
      resolved,
      highOrCritical,
      resolutionRate
    };
  },

  /**
   * Calculate category breakdown
   */
  getCategoryDistribution(reports = []) {
    const counts = {};
    window.CATEGORIES.forEach(c => { counts[c] = 0; });

    reports.forEach(r => {
      const cat = r.category && counts.hasOwnProperty(r.category) ? r.category : 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return counts;
  },

  /**
   * Calculate priority breakdown
   */
  getPriorityDistribution(reports = []) {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    reports.forEach(r => {
      const p = r.priorityLabel && counts.hasOwnProperty(r.priorityLabel) ? r.priorityLabel : 'Medium';
      counts[p] = (counts[p] || 0) + 1;
    });
    return counts;
  },

  /**
   * Generate rule-based dynamic Community Pulse
   */
  getCommunityPulse(reports = []) {
    if (reports.length === 0) {
      return "No reports currently recorded in local storage. Submit a report to begin generating community intelligence.";
    }

    const openReports = reports.filter(r => r.status !== 'Resolved');
    if (openReports.length === 0) {
      return "All community reports are currently marked as resolved. Great progress across all localities!";
    }

    // Top category in open reports
    const catCounts = {};
    openReports.forEach(r => {
      catCounts[r.category] = (catCounts[r.category] || 0) + 1;
    });
    let topCat = '';
    let topCatCount = 0;
    for (const [cat, cnt] of Object.entries(catCounts)) {
      if (cnt > topCatCount) {
        topCatCount = cnt;
        topCat = cat;
      }
    }
    const catPct = Math.round((topCatCount / openReports.length) * 100);

    // Top locality in open reports
    const locCounts = {};
    openReports.forEach(r => {
      locCounts[r.locality] = (locCounts[r.locality] || 0) + 1;
    });
    let topLoc = '';
    let topLocCount = 0;
    for (const [loc, cnt] of Object.entries(locCounts)) {
      if (cnt > topLocCount) {
        topLocCount = cnt;
        topLoc = loc;
      }
    }

    // Critical issues count
    const criticalCount = openReports.filter(r => r.priorityLabel === 'Critical').length;

    let pulse = `${topCat} issues constitute ${catPct}% of unresolved community observations (${topCatCount} of ${openReports.length}). `;
    if (topLocCount > 1) {
      pulse += `${topLocCount} open reports are clustered in ${topLoc}. `;
    }
    if (criticalCount > 0) {
      pulse += `Notice: ${criticalCount} critical safety issue${criticalCount > 1 ? 's require' : ' requires'} prioritized attention.`;
    } else {
      pulse += "No critical safety hazards are currently open.";
    }

    return pulse;
  },

  /**
   * Calculate ranked hotspots by locality
   * Formula: Score = (OpenReports * 10) + (CriticalReports * 15) + (HighReports * 8) + (TotalReports * 2)
   */
  getRankedHotspots(reports = []) {
    const localityMap = {};

    reports.forEach(r => {
      const loc = (r.locality || 'Unspecified').trim();
      if (!localityMap[loc]) {
        localityMap[loc] = {
          locality: loc,
          total: 0,
          open: 0,
          resolved: 0,
          critical: 0,
          high: 0,
          categories: {},
          reports: []
        };
      }

      const l = localityMap[loc];
      l.total++;
      l.reports.push(r);

      if (r.status === 'Resolved') {
        l.resolved++;
      } else {
        l.open++;
        if (r.priorityLabel === 'Critical') l.critical++;
        if (r.priorityLabel === 'High') l.high++;
      }

      l.categories[r.category] = (l.categories[r.category] || 0) + 1;
    });

    const results = Object.values(localityMap).map(loc => {
      // Find top category
      let dominantCategory = 'General';
      let maxCatCount = 0;
      for (const [c, cnt] of Object.entries(loc.categories)) {
        if (cnt > maxCatCount) {
          maxCatCount = cnt;
          dominantCategory = c;
        }
      }

      // Hotspot index formula
      const hotspotScore = (loc.open * 10) + (loc.critical * 15) + (loc.high * 8) + (loc.total * 2);

      // Recommendation
      let suggestedAction = "Conduct standard locality walkthrough.";
      if (loc.critical > 0) {
        suggestedAction = "Urgent: Dispatch hazard remediation for open critical issues.";
      } else if (dominantCategory === "Waste Management" && loc.open >= 2) {
        suggestedAction = "Organize community cleanup & coordinate waste collection schedule.";
      } else if (dominantCategory === "Water and Drainage" && loc.open >= 2) {
        suggestedAction = "Compile consolidated culvert & drainage audit report.";
      } else if (dominantCategory === "Roads and Transportation") {
        suggestedAction = "Submit multi-pothole repair petition with geo-tagged photos.";
      }

      return {
        ...loc,
        dominantCategory,
        hotspotScore,
        suggestedAction
      };
    });

    // Sort descending by hotspot score
    results.sort((a, b) => b.hotspotScore - a.hotspotScore);
    return results;
  },

  /**
   * Action Center recommendation engine
   * Converts detected clusters and critical reports into concrete community actions
   */
  generateActionRecommendations(reports = [], savedActions = []) {
    const recommendations = [];
    const openReports = reports.filter(r => r.status !== 'Resolved');

    // 1. Check for Waste accumulation clusters (>=2 open waste reports in same locality)
    const wasteByLoc = {};
    openReports.filter(r => r.category === 'Waste Management').forEach(r => {
      wasteByLoc[r.locality] = wasteByLoc[r.locality] || [];
      wasteByLoc[r.locality].push(r);
    });

    for (const [locality, locReports] of Object.entries(wasteByLoc)) {
      if (locReports.length >= 2) {
        recommendations.push({
          id: `act-waste-${locality.toLowerCase().replace(/\s+/g, '-')}`,
          title: `Coordinated Community Sanitation Drive in ${locality}`,
          category: 'Waste Management',
          locality,
          urgency: 'High',
          supportingCount: locReports.length,
          supportingReportIds: locReports.map(r => r.id),
          whyRecommended: `${locReports.length} recurring unresolved waste & garbage accumulation reports in ${locality}.`,
          suggestedAction: 'Mobilize a volunteer cleanup effort and submit a formal route rescheduling request to municipal waste services.',
          responsibleStakeholder: 'Resident Welfare Association & Local Sanitation Dept',
          defaultChecklist: [
            { text: 'Photograph and document garbage dump locations', done: false },
            { text: 'Convene volunteer cleanup team with safety equipment', done: false },
            { text: 'Distribute waste segregation notices to nearby commercial shops', done: false },
            { text: 'Submit request for additional scheduled garbage bins', done: false }
          ]
        });
      }
    }

    // 2. Check for Roads/Potholes near vulnerable spots
    const roadIssues = openReports.filter(r => r.category === 'Roads and Transportation');
    if (roadIssues.length >= 2) {
      const highRoads = roadIssues.filter(r => r.priorityLabel === 'Critical' || r.priorityLabel === 'High');
      const targetLocality = (highRoads[0] || roadIssues[0]).locality;
      recommendations.push({
        id: `act-roads-${targetLocality.toLowerCase().replace(/\s+/g, '-')}`,
        title: `Consolidated Road Safety & Pothole Repair Dossier`,
        category: 'Roads and Transportation',
        locality: targetLocality,
        urgency: highRoads.length > 0 ? 'Critical' : 'High',
        supportingCount: roadIssues.length,
        supportingReportIds: roadIssues.map(r => r.id),
        whyRecommended: `${roadIssues.length} active road damage reports, posing danger to pedestrians and vehicular traffic.`,
        suggestedAction: 'Compile documented measurements and photo evidence to deliver directly to the municipal roads engineer.',
        responsibleStakeholder: 'Public Works Department (PWD) & Traffic Police',
        defaultChecklist: [
          { text: 'Log exact street dimensions and pothole depth', done: false },
          { text: 'Install provisional daytime and nighttime hazard reflectors', done: false },
          { text: 'Draft official petition signed by local commuters', done: false },
          { text: 'Follow up with ward engineer for asphalt patching batch', done: false }
        ]
      });
    }

    // 3. Check for Water / Drainage stagnation
    const waterIssues = openReports.filter(r => r.category === 'Water and Drainage');
    if (waterIssues.length >= 2) {
      recommendations.push({
        id: `act-drainage-audit`,
        title: `Stormwater Drainage & Culvert De-silting Audit`,
        category: 'Water and Drainage',
        locality: waterIssues[0].locality,
        urgency: 'High',
        supportingCount: waterIssues.length,
        supportingReportIds: waterIssues.map(r => r.id),
        whyRecommended: `${waterIssues.length} active drainage or water leak issues creating potential mosquito breeding and road erosion.`,
        suggestedAction: 'Schedule joint neighborhood drainage survey ahead of upcoming rains and unblock main outlets.',
        responsibleStakeholder: 'Water Supply & Sewerage Board',
        defaultChecklist: [
          { text: 'Inspect inlet grates for plastic sack and construction silt blockage', done: false },
          { text: 'Report high-pressure potable water leaks to emergency valve team', done: false },
          { text: 'Submit joint maintenance ticket for mechanized culvert clearing', done: false }
        ]
      });
    }

    // 4. Check for Accessibility Barriers
    const accessIssues = openReports.filter(r => r.category === 'Accessibility');
    if (accessIssues.length >= 1) {
      recommendations.push({
        id: `act-access-walkthrough`,
        title: `Neighborhood Barrier-Free Accessibility Walkthrough`,
        category: 'Accessibility',
        locality: accessIssues[0].locality,
        urgency: 'Medium',
        supportingCount: accessIssues.length,
        supportingReportIds: accessIssues.map(r => r.id),
        whyRecommended: `${accessIssues.length} reported barrier(s) impeding wheelchair transit or visually impaired citizens.`,
        suggestedAction: 'Map broken curb cuts and audio signal failures; request priority repair on healthcare transit corridors.',
        responsibleStakeholder: 'Urban Accessibility Committee & Ward Councillor',
        defaultChecklist: [
          { text: 'Verify ramp incline and clear construction debris obstructions', done: false },
          { text: 'Test acoustic chirpers on arterial pedestrian crossings', done: false },
          { text: 'Demand tactile paving repair on transit clinic route', done: false }
        ]
      });
    }

    // 5. Check for Electrical / Public Safety Hazards
    const safetyIssues = openReports.filter(r => r.priorityLabel === 'Critical' && r.category === 'Public Safety');
    if (safetyIssues.length > 0) {
      recommendations.push({
        id: `act-safety-perimeter`,
        title: `Immediate Hazardous Perimeter Cordoning`,
        category: 'Public Safety',
        locality: safetyIssues[0].locality,
        urgency: 'Critical',
        supportingCount: safetyIssues.length,
        supportingReportIds: safetyIssues.map(r => r.id),
        whyRecommended: `${safetyIssues.length} critical public safety hazard(s) (exposed electrical wires or structural risks).`,
        suggestedAction: 'Erect temporary safety cordon and immediately inform the electricity distribution utility emergency desk.',
        responsibleStakeholder: 'Electricity Distribution Company & Emergency Services',
        defaultChecklist: [
          { text: 'Place physical barrier tape or caution signage around live wire', done: false },
          { text: 'Alert nearby school administration and residential security guards', done: false },
          { text: 'Call electrical maintenance hotline with pole reference number', done: false }
        ]
      });
    }

    // Merge saved checklist and status states
    return recommendations.map(rec => {
      const saved = savedActions.find(a => a.id === rec.id);
      if (saved) {
        return {
          ...rec,
          status: saved.status || 'Not Started',
          checklist: saved.checklist || rec.defaultChecklist
        };
      }
      return {
        ...rec,
        status: 'Not Started',
        checklist: rec.defaultChecklist
      };
    });
  }
};

window.Intelligence = Intelligence;
