/**
 * CivicLens AI - Demonstration Seed Data
 * Contains realistic, varied community observation records across fictional localities.
 * Clearly marked as sample demonstration data for hackathon evaluation.
 */

const SEED_REPORTS = [
  {
    id: "CL-10101",
    title: "Overflowing commercial garbage dump near public transit stop",
    description: "Solid waste bins have not been emptied for five days. Stray animals are scattering plastic waste onto the active walkway and road.",
    category: "Waste Management",
    locality: "Maple Heights",
    severity: "High",
    priorityScore: 78,
    priorityLabel: "High",
    status: "Open",
    reportedAt: "2026-10-10T09:30:00.000Z",
    observedDate: "2026-10-10",
    reporterName: "Resident M.",
    tags: ["garbage", "sanitation", "walkway", "plastic"],
    history: [
      { status: "Open", timestamp: "2026-10-10T09:30:00.000Z", note: "Report logged locally" }
    ],
    explanation: "High priority: Mentions public transit stop walkway, waste accumulation, and health hazard."
  },
  {
    id: "CL-10102",
    title: "Deep pothole causing vehicle damage near school crossing",
    description: "Substantial pothole roughly 2 feet wide right before the crosswalk on Oak Avenue. Cyclists and two-wheelers frequently swerve into opposing traffic to avoid it.",
    category: "Roads and Transportation",
    locality: "Cedar Valley",
    severity: "High",
    priorityScore: 84,
    priorityLabel: "Critical",
    status: "In Progress",
    reportedAt: "2026-10-11T14:15:00.000Z",
    observedDate: "2026-10-11",
    reporterName: "P. Sharma",
    tags: ["pothole", "safety", "school-zone", "traffic"],
    history: [
      { status: "Open", timestamp: "2026-10-11T14:15:00.000Z", note: "Report logged locally" },
      { status: "In Progress", timestamp: "2026-10-12T10:00:00.000Z", note: "Local volunteer documented road dimensions" }
    ],
    explanation: "Critical priority: Risk to schoolchildren and commuters near pedestrian crossing."
  },
  {
    id: "CL-10103",
    title: "Streetlight cluster dark for three consecutive blocks",
    description: "Four overhead streetlamps are completely dead between 4th and 7th Cross. Road is pitch dark at night, raising safety concerns for pedestrians returning from work.",
    category: "Streetlights and Public Infrastructure",
    locality: "Riverside Ward",
    severity: "Medium",
    priorityScore: 68,
    priorityLabel: "High",
    status: "Acknowledged",
    reportedAt: "2026-10-08T20:45:00.000Z",
    observedDate: "2026-10-08",
    reporterName: "Anonymous",
    tags: ["streetlight", "lighting", "night-safety"],
    history: [
      { status: "Open", timestamp: "2026-10-08T20:45:00.000Z", note: "Report logged locally" },
      { status: "Acknowledged", timestamp: "2026-10-09T11:20:00.000Z", note: "Included in community checklist" }
    ],
    explanation: "High priority: Extended dark street corridor creates acute pedestrian vulnerability."
  },
  {
    id: "CL-10104",
    title: "Pressurized clean water pipe burst flooding road shoulder",
    description: "Treated municipal water pipe ruptured underground. Potable water has been gushing onto the sidewalk and asphalt continuously for 12 hours.",
    category: "Water and Drainage",
    locality: "Maple Heights",
    severity: "High",
    priorityScore: 82,
    priorityLabel: "Critical",
    status: "Open",
    reportedAt: "2026-10-12T07:20:00.000Z",
    observedDate: "2026-10-12",
    reporterName: "Civic Watch",
    tags: ["water-leak", "pipe", "wastage", "flood"],
    history: [
      { status: "Open", timestamp: "2026-10-12T07:20:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Critical priority: Resource wastage and progressive erosion of roadway pavement."
  },
  {
    id: "CL-10105",
    title: "Wheelchair ramp broken and blocked by construction debris",
    description: "The curb cut ramp providing access to the community health clinic is blocked by discarded cinder blocks and broken concrete edges, preventing wheelchair transit.",
    category: "Accessibility",
    locality: "Cedar Valley",
    severity: "High",
    priorityScore: 80,
    priorityLabel: "High",
    status: "Open",
    reportedAt: "2026-10-09T11:00:00.000Z",
    observedDate: "2026-10-09",
    reporterName: "A. Vance",
    tags: ["wheelchair", "accessibility", "ramp", "clinic"],
    history: [
      { status: "Open", timestamp: "2026-10-09T11:00:00.000Z", note: "Report logged locally" }
    ],
    explanation: "High priority: Direct barrier preventing mobility-impaired residents from accessing clinic."
  },
  {
    id: "CL-10106",
    title: "Stormwater drain blocked with plastic sacks causing backflow",
    description: "Monsoon drain mouth clogged with silt and discarded commercial sacks. Even minor rain creates 6-inch water stagnation across the main junction.",
    category: "Water and Drainage",
    locality: "Maple Heights",
    severity: "Medium",
    priorityScore: 65,
    priorityLabel: "Medium",
    status: "Open",
    reportedAt: "2026-10-07T16:10:00.000Z",
    observedDate: "2026-10-07",
    reporterName: "K. Reddy",
    tags: ["drainage", "clogged", "rain", "backflow"],
    history: [
      { status: "Open", timestamp: "2026-10-07T16:10:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Medium priority: Flooding risk; repeats historical water stagnation in Maple Heights."
  },
  {
    id: "CL-10107",
    title: "Illegal burning of dry leaves and plastic wrappers in park",
    description: "Dense toxic smoke drifting into adjacent residential apartments every evening between 6 PM and 8 PM.",
    category: "Environment and Pollution",
    locality: "Greenfield Park",
    severity: "Medium",
    priorityScore: 62,
    priorityLabel: "Medium",
    status: "Open",
    reportedAt: "2026-10-10T19:00:00.000Z",
    observedDate: "2026-10-10",
    reporterName: "Resident Group",
    tags: ["smoke", "air-quality", "park", "burning"],
    history: [
      { status: "Open", timestamp: "2026-10-10T19:00:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Medium priority: Negative impact on neighborhood air quality and respiratory health."
  },
  {
    id: "CL-10108",
    title: "Pedestrian footpath pavers completely displaced and loose",
    description: "Pedestrian tiles have collapsed into a ditch over a 30-meter stretch. Elderly pedestrians forced to step into vehicular traffic lane.",
    category: "Accessibility",
    locality: "Riverside Ward",
    severity: "Medium",
    priorityScore: 60,
    priorityLabel: "Medium",
    status: "Acknowledged",
    reportedAt: "2026-10-06T13:40:00.000Z",
    observedDate: "2026-10-06",
    reporterName: "D. Lee",
    tags: ["footpath", "sidewalk", "pedestrian", "elderly"],
    history: [
      { status: "Open", timestamp: "2026-10-06T13:40:00.000Z", note: "Report logged locally" },
      { status: "Acknowledged", timestamp: "2026-10-07T09:00:00.000Z", note: "Ward inspection scheduled" }
    ],
    explanation: "Medium priority: Pedestrian detour hazard along high-traffic corridor."
  },
  {
    id: "CL-10109",
    title: "Exposed high-voltage electrical cable dangling from junction box",
    description: "Utility box door is broken open with severed wires exposed at children's waist height near the playground perimeter.",
    category: "Public Safety",
    locality: "Greenfield Park",
    severity: "High",
    priorityScore: 92,
    priorityLabel: "Critical",
    status: "Open",
    reportedAt: "2026-10-13T15:30:00.000Z",
    observedDate: "2026-10-13",
    reporterName: "Parent Committee",
    tags: ["electrical", "danger", "hazard", "playground", "children"],
    history: [
      { status: "Open", timestamp: "2026-10-13T15:30:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Critical priority: Direct electrocution hazard adjacent to a playground."
  },
  {
    id: "CL-10110",
    title: "Broken glass and construction scrap on public jogging path",
    description: "Shard glass and sharp metal bands left behind after renovation work on the lakeside jogging trail.",
    category: "Public Safety",
    locality: "Lakeside Enclave",
    severity: "Medium",
    priorityScore: 54,
    priorityLabel: "Medium",
    status: "Resolved",
    reportedAt: "2026-10-04T08:10:00.000Z",
    observedDate: "2026-10-04",
    reporterName: "J. Miller",
    tags: ["glass", "hazard", "jogging-path"],
    history: [
      { status: "Open", timestamp: "2026-10-04T08:10:00.000Z", note: "Report logged locally" },
      { status: "Resolved", timestamp: "2026-10-06T17:00:00.000Z", note: "Community volunteer sweep completed" }
    ],
    explanation: "Resolved: Cleaned by community initiative on Oct 6."
  },
  {
    id: "CL-10111",
    title: "Second uncollected garbage pile on 3rd cross corner",
    description: "Debris and household compost waste accumulating rapidly. Attracting flies and dogs.",
    category: "Waste Management",
    locality: "Maple Heights",
    severity: "Medium",
    priorityScore: 66,
    priorityLabel: "High",
    status: "Open",
    reportedAt: "2026-10-11T18:20:00.000Z",
    observedDate: "2026-10-11",
    reporterName: "B. Taylor",
    tags: ["garbage", "waste", "stagnant"],
    history: [
      { status: "Open", timestamp: "2026-10-11T18:20:00.000Z", note: "Report logged locally" }
    ],
    explanation: "High priority: Second waste report within 300m in Maple Heights indicating recurring sanitation failure."
  },
  {
    id: "CL-10112",
    title: "Missing manhole cover on unlit residential lane",
    description: "Cast iron manhole lid missing. Replaced temporarily by residents with a dried tree branch as an improvised warning.",
    category: "Roads and Transportation",
    locality: "Riverside Ward",
    severity: "High",
    priorityScore: 90,
    priorityLabel: "Critical",
    status: "Open",
    reportedAt: "2026-10-13T19:40:00.000Z",
    observedDate: "2026-10-13",
    reporterName: "Night Watchman",
    tags: ["manhole", "hole", "danger", "road"],
    history: [
      { status: "Open", timestamp: "2026-10-13T19:40:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Critical priority: Open sewer shaft poses severe fall injury danger at night."
  },
  {
    id: "CL-10113",
    title: "Public park bench rusted through with sharp exposed screws",
    description: "Old iron seating bench broken in half; metal edge could cut resting visitors or children.",
    category: "Streetlights and Public Infrastructure",
    locality: "Greenfield Park",
    severity: "Low",
    priorityScore: 40,
    priorityLabel: "Low",
    status: "Resolved",
    reportedAt: "2026-10-02T10:00:00.000Z",
    observedDate: "2026-10-02",
    reporterName: "S. Rao",
    tags: ["bench", "park", "rust"],
    history: [
      { status: "Open", timestamp: "2026-10-02T10:00:00.000Z", note: "Report logged locally" },
      { status: "Resolved", timestamp: "2026-10-05T14:00:00.000Z", note: "Removed damaged bench structure" }
    ],
    explanation: "Low priority: Low traffic corner, repaired by maintenance crew."
  },
  {
    id: "CL-10114",
    title: "Sewage overflow from storm drain onto market entrance",
    description: "Foul-smelling grey water spilling across the commercial market entrance due to heavy silt blockage in main culvert.",
    category: "Water and Drainage",
    locality: "Cedar Valley",
    severity: "High",
    priorityScore: 81,
    priorityLabel: "Critical",
    status: "Open",
    reportedAt: "2026-10-12T11:30:00.000Z",
    observedDate: "2026-10-12",
    reporterName: "Shopkeepers Assoc",
    tags: ["sewage", "drainage", "overflow", "market"],
    history: [
      { status: "Open", timestamp: "2026-10-12T11:30:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Critical priority: Public health biohazard affecting commercial center food stalls."
  },
  {
    id: "CL-10115",
    title: "Audible traffic signal beeper broken at pedestrian crossing",
    description: "The acoustic chirp for visually impaired pedestrians is silent at the busiest multi-lane intersection on Central Ring.",
    category: "Accessibility",
    locality: "Cedar Valley",
    severity: "Medium",
    priorityScore: 64,
    priorityLabel: "Medium",
    status: "In Progress",
    reportedAt: "2026-10-09T08:50:00.000Z",
    observedDate: "2026-10-09",
    reporterName: "Inclusive City Rep",
    tags: ["sound", "traffic-signal", "visually-impaired", "accessibility"],
    history: [
      { status: "Open", timestamp: "2026-10-09T08:50:00.000Z", note: "Report logged locally" },
      { status: "In Progress", timestamp: "2026-10-11T16:00:00.000Z", note: "Sound transducer replacement ordered" }
    ],
    explanation: "Medium priority: Impairs safe blind pedestrian crossing at high-speed arterial road."
  },
  {
    id: "CL-10116",
    title: "Dangerous overhanging dry tree bough over power lines",
    description: "Dead oak limb cracked halfway through during recent gusts, suspended directly above primary transformer wires.",
    category: "Public Safety",
    locality: "Lakeside Enclave",
    severity: "High",
    priorityScore: 85,
    priorityLabel: "Critical",
    status: "Open",
    reportedAt: "2026-10-13T17:15:00.000Z",
    observedDate: "2026-10-13",
    reporterName: "W. Chen",
    tags: ["tree", "powerline", "hazard", "storm"],
    history: [
      { status: "Open", timestamp: "2026-10-13T17:15:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Critical priority: Risk of imminent power outage and line collapse on roadway."
  },
  {
    id: "CL-10117",
    title: "Broken bus shelter glass panel leaving shards on seats",
    description: "Vandals broke shelter side glass panel. Tempered glass granules and sharp corner fragments remain on passenger bench.",
    category: "Streetlights and Public Infrastructure",
    locality: "Riverside Ward",
    severity: "Medium",
    priorityScore: 58,
    priorityLabel: "Medium",
    status: "Open",
    reportedAt: "2026-10-11T09:10:00.000Z",
    observedDate: "2026-10-11",
    reporterName: "Transit Rider",
    tags: ["bus-stop", "glass", "shelter", "transit"],
    history: [
      { status: "Open", timestamp: "2026-10-11T09:10:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Medium priority: Passenger shelter degradation and minor cut risk."
  },
  {
    id: "CL-10118",
    title: "Construction dust suppression neglected by builder",
    description: "Large open excavation site without perimeter mesh or water sprayers, creating dense airborne dust clouds across school boundary.",
    category: "Environment and Pollution",
    locality: "Maple Heights",
    severity: "Medium",
    priorityScore: 61,
    priorityLabel: "Medium",
    status: "Open",
    reportedAt: "2026-10-09T14:45:00.000Z",
    observedDate: "2026-10-09",
    reporterName: "Maple Parents Guild",
    tags: ["dust", "pollution", "construction", "school"],
    history: [
      { status: "Open", timestamp: "2026-10-09T14:45:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Medium priority: Environmental particulate levels elevated near educational facility."
  },
  {
    id: "CL-10119",
    title: "Speed breaker markings completely worn off near curve",
    description: "Asphalt speed bump has no reflective paint or warning sign; vehicles brake abruptly causing rear-end collisions.",
    category: "Roads and Transportation",
    locality: "Lakeside Enclave",
    severity: "Medium",
    priorityScore: 59,
    priorityLabel: "Medium",
    status: "Resolved",
    reportedAt: "2026-10-01T12:00:00.000Z",
    observedDate: "2026-10-01",
    reporterName: "T. Harris",
    tags: ["speed-breaker", "paint", "road-safety"],
    history: [
      { status: "Open", timestamp: "2026-10-01T12:00:00.000Z", note: "Report logged locally" },
      { status: "Resolved", timestamp: "2026-10-04T16:00:00.000Z", note: "Yellow reflective stripes repainted" }
    ],
    explanation: "Resolved: Marking repainted on Oct 4."
  },
  {
    id: "CL-10120",
    title: "Third uncollected trash heap near community sports court",
    description: "Plastic bottles, fast food packaging, and yard waste piled against the chain-link fence of the basketball court.",
    category: "Waste Management",
    locality: "Maple Heights",
    severity: "Medium",
    priorityScore: 69,
    priorityLabel: "High",
    status: "Open",
    reportedAt: "2026-10-12T16:50:00.000Z",
    observedDate: "2026-10-12",
    reporterName: "Youth Coach",
    tags: ["waste", "trash", "sports", "cleanup"],
    history: [
      { status: "Open", timestamp: "2026-10-12T16:50:00.000Z", note: "Report logged locally" }
    ],
    explanation: "High priority: Third waste cluster in Maple Heights confirms localized systemic collection lapse."
  },
  {
    id: "CL-10121",
    title: "Faded pedestrian crosswalk lines in front of library",
    description: "Zebra crossing lines almost invisible after road resurfacing. Motorists fail to yield to pedestrians crossing to library.",
    category: "Roads and Transportation",
    locality: "Greenfield Park",
    severity: "Low",
    priorityScore: 45,
    priorityLabel: "Low",
    status: "Open",
    reportedAt: "2026-10-07T10:15:00.000Z",
    observedDate: "2026-10-07",
    reporterName: "Library Patron",
    tags: ["crosswalk", "pedestrian", "striping"],
    history: [
      { status: "Open", timestamp: "2026-10-07T10:15:00.000Z", note: "Report logged locally" }
    ],
    explanation: "Low priority: Minor visibility reduction on low-speed local street."
  },
  {
    id: "CL-10122",
    title: "Public drinking water fountain tap severed and leaking",
    description: "Fountain push valve was broken off. Continuous water stream creates puddle in park plaza.",
    category: "Water and Drainage",
    locality: "Greenfield Park",
    severity: "Low",
    priorityScore: 48,
    priorityLabel: "Low",
    status: "Resolved",
    reportedAt: "2026-10-03T15:20:00.000Z",
    observedDate: "2026-10-03",
    reporterName: "Park Walker",
    tags: ["water", "tap", "leak", "fountain"],
    history: [
      { status: "Open", timestamp: "2026-10-03T15:20:00.000Z", note: "Report logged locally" },
      { status: "Resolved", timestamp: "2026-10-05T11:00:00.000Z", note: "New brass shutoff valve installed" }
    ],
    explanation: "Resolved: Replaced by park staff."
  }
];

window.SEED_REPORTS = SEED_REPORTS;
