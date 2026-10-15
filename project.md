# MASTER PROMPT: BUILD, DOCUMENT, TEST, AND DEPLOY CIVICLENS AI

## 1. YOUR ROLE

Act as a senior frontend engineer, UI/UX designer, JavaScript developer, civic-tech product designer, software tester, and GitHub Actions deployment engineer.

Independently design, implement, test, document, and deploy a complete hackathon-ready project named **CivicLens AI — Community Issue Intelligence Platform**.

Do not stop after creating a design, wireframe, prototype, or implementation plan. Build the actual working application, test its functionality, create all required project documentation, and configure automated GitHub Pages deployment.

Make reasonable technical and design decisions independently. I am busy and do not want to provide APIs, API keys, environment variables, credentials, external service accounts, or repeated confirmations.

## 2. HACKATHON CONTEXT

The hackathon asks participants to develop innovative technology-based solutions that improve everyday life and address real-world community challenges.

Selected exploration areas:
- Smart Cities and Transportation
- Environmental Sustainability
- Public Safety
- Waste Management
- Citizen Engagement and Public Services
- Accessibility and Inclusive Communities

### Problem statement

Citizens frequently encounter problems such as garbage accumulation, potholes, damaged streetlights, water leakage, blocked drains, inaccessible footpaths, and other local infrastructure issues.

These problems are often reported through disconnected channels. Citizens may not know which issues deserve immediate attention, which locations experience recurring problems, or what collective actions could help.

CivicLens AI will demonstrate how a lightweight, accessible, data-driven application can turn community observations into structured, explainable, prioritized, and actionable information.

### Product vision

Create a digital community intelligence platform that helps people answer five questions:

1. What problems exist in our community?
2. Which problems require attention first?
3. Where are problems recurring?
4. What actions can citizens take?
5. Is the community making measurable progress?

The product must work entirely in the browser without requiring a backend or external API.

## 3. NON-NEGOTIABLE TECHNICAL CONSTRAINTS

Use only:
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Browser localStorage
- Browser-native APIs where appropriate
- Static JSON or JavaScript files for seed data
- GitHub Actions for deployment
- GitHub Pages for hosting

Do not use:
- React, Next.js, Vue, Angular, or other frontend frameworks
- Node.js runtime requirements for the deployed application
- Express, Django, Flask, or any backend server
- Databases requiring servers or external accounts
- External AI APIs, Gemini API, OpenAI API, or other model APIs
- API keys, secrets, tokens, or environment variables
- .env files or .env.example files
- Firebase, Supabase, or other backend-as-a-service products
- External authentication providers
- Paid services
- Build steps requiring npm install
- CDN dependencies, remotely hosted JavaScript libraries, or mandatory third-party services
- Maps, geocoding, or live data feeds that require external APIs
- Placeholder buttons, fake integrations, or nonfunctional features

Use local SVG icons, inline SVG, CSS shapes, and system fonts instead of external dependencies.

The project must work after opening index.html directly in a browser and must also work when served through GitHub Pages.

Prefer local relative paths and ensure compatibility with GitHub Pages project-site URLs.

## 4. PRODUCT NAME AND BRAND IDENTITY

Product name: CivicLens AI

Tagline: See the Issues. Understand the Impact. Drive Community Action.

Product description: An offline-first community issue intelligence platform that transforms citizen observations into explainable priorities, recurring-problem insights, and practical community actions.

Brand personality:
- Trustworthy
- Modern
- Civic-minded
- Intelligent
- Accessible
- Transparent
- Action-oriented

Create a distinctive visual identity with:
- Deep navy or charcoal surfaces
- Teal or emerald as the primary accent
- Warm amber for warnings and medium-priority issues
- Red used sparingly for high-priority situations
- Clean typography
- Subtle borders and shadows
- Rounded cards
- Strong spacing and visual hierarchy
- Elegant data visualizations
- Refined hover and focus states

Avoid generic template aesthetics, excessive gradients, excessive animations, oversized empty hero sections, and emoji-heavy interfaces.

Create a professional interface suitable for a hackathon jury demonstration.

## 5. REQUIRED APPLICATION STRUCTURE

Build a single-page application with multiple views or a compact multi-page application using static HTML, CSS, and JavaScript.

Preferred project structure:

CivicLens-AI/
- index.html
- 404.html
- README.md
- LICENSE
- .nojekyll
- assets/
  - css/
    - styles.css
    - responsive.css
  - js/
    - app.js
    - storage.js
    - classifier.js
    - intelligence.js
    - charts.js
    - seed-data.js
    - utils.js
  - images/
    - logo.svg
    - empty-state.svg
- docs/
  - ARCHITECTURE.md
  - FEATURES.md
  - TESTING.md
  - DEPLOYMENT.md
  - PRIVACY.md
- tests/
  - index.html
  - tests.js
- .github/
  - workflows/
    - deploy.yml

You may improve this structure when necessary, but keep it simple, fully static, understandable, and free of build requirements.

Do not create empty files merely to match the structure. Every included file must serve a real purpose.

## 6. APPLICATION NAVIGATION

Create a responsive sidebar on desktop and an appropriate mobile navigation menu.

Navigation sections:

1. Overview
2. Report an Issue
3. Community Issues
4. Hotspots
5. Insights
6. Action Center
7. Settings

Include:
- CivicLens AI logo and name
- A clear primary action to report an issue
- Current local data status
- A visible offline/local-only indicator
- A theme toggle if implemented fully
- A responsive mobile layout
- Accessible navigation and active states

All navigation elements must work.

## 7. OVERVIEW DASHBOARD

Create a polished overview dashboard with the following components.

### A. Welcome header

Display:
- Welcome message
- Short community-impact summary
- Report Issue button
- Last updated timestamp based on local data

### B. KPI cards

Show:
- Total Reports
- Open Issues
- High-Priority Issues
- Resolved Issues

Calculate every metric from the actual application dataset.

Do not hardcode dashboard counts independently of the underlying data.

### C. Community activity chart

Create a chart showing reports by category or by day.

Use native SVG or Canvas with vanilla JavaScript. No charting libraries.

The chart must:
- Use real application data
- Include labels and accessible descriptions
- Update after adding, editing, resolving, or deleting reports
- Provide a useful empty state
- Resize responsively

### D. Issue category distribution

Show the number of reports in each category.

Categories:
- Waste Management
- Roads and Transportation
- Water and Drainage
- Streetlights and Public Infrastructure
- Accessibility
- Public Safety
- Environment and Pollution
- Other

### E. Priority overview

Show:
- Critical
- High
- Medium
- Low

Explain that these are heuristic classifications, not official emergency assessments.

### F. Recent reports

Display the latest reports with:
- Issue title
- Category
- Location
- Priority
- Status
- Reported date
- Link to view details

### G. Community pulse

Generate a concise, rule-based summary from actual local data.

Example:
"Drainage-related issues account for 32% of open reports. Three unresolved reports are concentrated in the same locality. Consider a coordinated inspection."

The figures must be dynamically calculated. Never invent insights unsupported by the dataset.

## 8. REPORT AN ISSUE

Create a complete, validated report submission workflow.

Fields:
- Issue title
- Issue description
- Category
- Location or locality
- Severity selected by the reporter
- Optional date observed
- Optional anonymous display name
- Optional tags

Use sensible character limits and form validation.

Submission behavior:
1. Validate all required fields.
2. Generate a unique local report ID.
3. Generate a timestamp.
4. Run the local issue-classification engine.
5. Calculate an explainable priority score.
6. Save the report in localStorage.
7. Refresh all dependent dashboard metrics, charts, lists, hotspots, and insights.
8. Display a success message with the generated report ID.
9. Offer a link to view the submitted report.

Provide a few realistic sample reports to demonstrate the product immediately.

Allow users to clear or restore demo data from Settings.

Do not request geolocation permissions. Do not collect precise location coordinates. Use user-entered locality names.

Do not claim that submitting a report sends it to a municipality or notifies officials. Reports are stored only in the current browser unless exported manually.

## 9. LOCAL ISSUE INTELLIGENCE ENGINE

Implement a genuinely working, explainable, browser-based classification engine in classifier.js.

This is a lightweight local heuristic classifier, not a hosted large language model.

### A. Automatic category classification

Analyze the title, description, and tags using keyword matching, category dictionaries, weighted rules, and simple text normalization.

Examples:
- "garbage overflowing near bus stop" → Waste Management
- "large pothole on main road" → Roads and Transportation
- "water leaking from a broken pipe" → Water and Drainage
- "streetlight not working at night" → Streetlights and Public Infrastructure
- "footpath blocked for wheelchair users" → Accessibility
- "smoke and burning plastic near houses" → Environment and Pollution

Support multiple keywords and reasonable variations.

Allow the user to override the suggested category.

Show why the category was suggested, including the matched keywords or rules.

### B. Priority scoring

Implement a transparent scoring system using:
- Reporter-selected severity
- Safety-related keywords
- Potential public impact
- Number of similar unresolved reports in the same locality
- Age of the report
- Accessibility-related risks

Define score weights and thresholds in code and document them.

Return:
- Score from 0 to 100
- Priority label
- Main contributing factors
- Suggested next action

Do not allow report frequency alone to override serious safety concerns.

A keyword-based system must not claim to understand every situation accurately.

### C. Explainability

Every classification and priority result must include a short explanation.

Example:
"High priority because the report mentions a damaged road, a school route, and three similar unresolved reports in this locality."

Use only facts actually available in the report dataset.

### D. Limitations

Clearly state that:
- The engine uses local rules and keyword analysis.
- It does not use a cloud-hosted AI model.
- Its classifications can be incorrect.
- Scores are decision-support suggestions rather than official assessments.
- Emergency situations should be reported directly to the appropriate emergency service.

## 10. COMMUNITY ISSUES EXPLORER

Build a fully functional issue management interface.

Include:
- Search by title, description, and locality
- Filter by category
- Filter by priority
- Filter by status
- Sort by newest, oldest, highest priority, and most similar reports
- Grid and list views where practical
- Pagination or a usable result limit
- Clear-filters action
- Empty search results state

Each issue card must display:
- Title
- Short description
- Locality
- Category
- Priority score and label
- Status
- Date
- Number of similar local reports

Clicking an issue must open a detailed view or modal with the complete description, priority explanation, history, and available actions.

Allow the user to:
- Edit a report
- Change status
- Resolve a report
- Reopen a resolved report
- Delete a report after confirmation

Statuses:
- Open
- Acknowledged
- In Progress
- Resolved

Track status changes locally with timestamps.

Make it clear that these are local demonstration statuses, not verified government action.

## 11. COMMUNITY HOTSPOTS

Create a visual hotspot explorer that identifies locations with repeated unresolved issues.

No maps API, external map tiles, geocoding, or real geographic claims.

Use locality names entered by users.

Display:
- Ranked locality list
- Total reports per locality
- Open reports per locality
- High-priority reports
- Most common category
- Average unresolved-report age
- Suggested community action

Create a custom SVG-based locality relationship visualization or a well-designed ranked hotspot chart.

Do not place fictional locations on a real map.

A hotspot should be calculated from report counts, open issues, and priority. Document the formula and display the reasons behind each ranking.

Allow the user to select a locality and view its related reports.

## 12. INSIGHTS AND COMMUNITY INTELLIGENCE

Create an insights page with dynamically generated observations.

Required insights:
- Most frequently reported category
- Locality with the most open reports
- Highest-priority unresolved issue
- Category with the oldest unresolved reports
- Percentage of reports resolved
- Number of repeated issues
- Emerging categories compared with an earlier period, when enough dated data exists
- Potential relationships between category and locality
- Recommended actions based on the dataset

Every insight must be generated from actual data.

Handle insufficient data honestly. Display "Not enough data yet" rather than fabricating trends.

Add a methodology panel explaining:
- How issues are categorized
- How priorities are calculated
- How hotspots are ranked
- How repeated issues are identified
- What the system cannot determine

Do not call simple rule-based summaries generative AI.

## 13. ACTION CENTER

This is the main differentiating feature.

Transform identified problems into actionable community recommendations.

Examples:
- Repeated garbage complaints → coordinate a cleanup and document the affected area.
- Several pothole reports near a school → compile a consolidated evidence report for the responsible public works department.
- Repeated water leakage → group related observations into one maintenance request.
- Inaccessible footpaths → document barriers and propose an accessibility inspection.
- Multiple broken streetlights → prepare a locality-wise infrastructure checklist.

Recommendations must be generated through transparent category and priority rules.

Each recommendation should show:
- Identified problem
- Supporting local reports
- Why action is recommended
- Suggested action
- Suggested responsible stakeholder category
- Relative urgency
- Completion checklist

Provide locally stored action tracking with:
- Not Started
- In Progress
- Completed

Allow the user to export a selected action summary for sharing.

Do not falsely imply that recommendations have been submitted to public authorities.

## 14. LOCAL DATA MANAGEMENT

Implement storage.js using localStorage.

Requirements:
- Use a versioned storage key.
- Validate parsed data.
- Handle malformed or unavailable localStorage gracefully.
- Avoid overwriting valid user data with demo data on every refresh.
- Seed demonstration data only when the application has no existing dataset.
- Provide safe create, read, update, and delete operations.
- Preserve user-created reports across reloads.
- Provide a reset-to-demo-data option with confirmation.
- Provide a full local-data reset option with confirmation.
- Show a clear message if browser storage is unavailable or full.
- Update the interface after every successful data mutation.

Add export and import functionality using downloadable and uploadable JSON files.

Export:
- All reports
- Action plans
- Relevant application settings
- Schema version
- Export timestamp

Import:
- Validate the JSON structure and version
- Reject malformed data
- Prevent unsafe or invalid field values
- Explain whether the operation will merge or replace records
- Require confirmation before replacing existing data
- Handle duplicate IDs safely

All imported text must be rendered safely. Never insert untrusted report text using unsafe innerHTML.

## 15. SETTINGS

Create a working settings page containing:

- Application information
- Storage usage estimate where practical
- Local-only data notice
- Export data button
- Import data button
- Restore demo data button
- Clear all data button
- Theme preference if dark/light mode is implemented
- About the classification methodology
- Privacy and limitations links

Explain that browser-local data may not be available on another device or browser and may be deleted if browser data is cleared.

No account creation or login should be required.

## 16. PRIVACY, SAFETY, AND ACCESSIBILITY

Privacy:
- No server-side data collection.
- No analytics trackers.
- No third-party requests.
- No external APIs.
- No hidden collection of personal information.
- No automatic geolocation.
- No authentication requirement.

Safety:
- Do not collect or display personal phone numbers, precise home addresses, or sensitive identity details as required fields.
- Avoid exposing personal information in demo content.
- Never label an issue as an officially verified emergency.
- Do not claim that the application contacts police, hospitals, municipal officers, or emergency services.
- Clearly distinguish community observations from verified facts.

Accessibility:
- Semantic HTML.
- Keyboard-accessible controls.
- Visible focus indicators.
- Proper form labels.
- Accessible dialogs and modals.
- Sufficient color contrast.
- Responsive text sizing.
- ARIA attributes where appropriate.
- Respect prefers-reduced-motion.
- Do not communicate priority by color alone.

## 17. DEMONSTRATION DATA

Include at least 20 realistic, varied demonstration reports across multiple fictional localities.

Cover:
- Waste accumulation
- Potholes
- Broken streetlights
- Water leakage
- Blocked drains
- Air pollution
- Accessibility barriers
- Damaged public infrastructure
- Community safety observations

Ensure variation in dates, status, severity, priority, and category.

Use fictional locality names and explicitly identify them as sample data.

Include recurring reports in selected localities so the hotspot engine and duplicate-issue insights can be demonstrated.

Create demo data that demonstrates meaningful functionality without suggesting that fabricated reports describe actual public emergencies.

The dashboard, insights, hotspots, and Action Center must all work with this dataset.

## 18. USER INTERFACE QUALITY

Create a polished, coherent, responsive interface.

Desktop:
- Sidebar navigation
- Main content area
- KPI cards
- Charts and insight panels
- Consistent content widths

Tablet:
- Adapted grid
- Compact navigation
- Readable charts

Mobile:
- Single-column layouts where appropriate
- Touch-friendly controls
- Responsive navigation
- No horizontal overflow
- Accessible forms and dialogs
- Readable data cards instead of cramped tables

Add restrained micro-interactions, transitions, loading feedback where meaningful, success notifications, error notifications, and helpful empty states.

Do not create animations that delay access to the main functionality.

Every visible interactive control must work. Remove any decorative button that has no meaningful action.

## 19. TESTING

Create a lightweight test suite using only HTML and vanilla JavaScript.

The tests must cover:
- Category classification
- Priority score calculation
- Explainability output
- Locality grouping
- Hotspot ranking
- Dashboard metric calculation
- Report creation
- Report editing
- Status changes
- Resolution and reopening
- Deletion
- Search and filters
- JSON export
- JSON import validation
- Duplicate ID handling
- Empty dataset handling
- Invalid dates and malformed records
- Storage failure handling where testable
- Safe rendering of untrusted text
- Recommendation generation

Include instructions for running the test page in a browser.

Add a test mode that uses isolated test data and does not accidentally erase the user's normal application data.

Run the tests yourself if the available environment supports it. Fix discovered failures.

Do not claim that tests pass unless they have actually been executed.

Manually inspect navigation, report submission, filtering, charts, dialogs, mobile layout, and browser refresh persistence.

## 20. README AND DOCUMENTATION

Write a comprehensive README.md with:

1. Project name and tagline
2. Overview
3. Problem statement
4. Proposed solution
5. Key differentiators
6. Features
7. Screens and workflows
8. Technology stack
9. System architecture
10. Local intelligence engine
11. Classification methodology
12. Priority-scoring formula
13. Hotspot-ranking methodology
14. Data storage and privacy
15. Limitations
16. Accessibility considerations
17. Project structure
18. Local setup instructions
19. How to run tests
20. How to use demo data
21. GitHub Pages deployment instructions
22. GitHub Actions explanation
23. Troubleshooting
24. Future scope
25. License

Create ARCHITECTURE.md describing the application modules, data flow, state management, local storage, and deployment architecture.

Create FEATURES.md listing implemented features and their behavior.

Create TESTING.md describing test coverage and execution instructions.

Create DEPLOYMENT.md with step-by-step GitHub Pages setup and troubleshooting.

Create PRIVACY.md documenting the local-only storage model, limitations, and user control over exported or deleted data.

Use accurate documentation. Do not describe unimplemented features as completed.

## 21. AUTOMATIC GITHUB PAGES DEPLOYMENT

Configure .github/workflows/deploy.yml to deploy the static website automatically using GitHub Actions and GitHub Pages.

Use a maintained official GitHub Pages deployment workflow and appropriate permissions.

The workflow should:
1. Trigger on pushes to the main branch.
2. Support manual workflow dispatch.
3. Check out the repository.
4. Configure GitHub Pages.
5. Upload the static site as a Pages artifact.
6. Deploy the artifact to GitHub Pages.

Use appropriate GitHub-provided deployment actions and a compatible, maintained action version.

Do not require npm, a package.json file, secrets created manually, environment variables, or a custom backend.

The workflow must deploy the static files from the repository root.

Include concurrency controls and the necessary deployment permissions.

Create .nojekyll if appropriate.

Ensure every asset uses a relative path so the website works at:
https://USERNAME.github.io/REPOSITORY/

Do not hardcode a personal username or repository name into application functionality.

### Deployment execution

Inspect the current workspace first.

If an existing Git repository is available:
- Preserve existing user work.
- Inspect the current branch and remote.
- Reuse the existing repository where appropriate.
- Do not delete or overwrite unrelated files.
- Implement the application in the existing repository if it is clearly the target project.

If a Git remote is configured and the necessary authentication is already available:
- Verify the target repository and branch.
- Commit and push the completed implementation to the appropriate branch.
- Do not rewrite Git history or force-push.
- Allow the GitHub Actions deployment to run.
- Verify the deployment result when the environment permits.

If no repository or remote is configured:
- Complete the project locally.
- Initialize Git only if appropriate.
- Provide exact, minimal instructions for creating or selecting a GitHub repository, pushing the main branch, and enabling GitHub Pages through Settings → Pages → Build and deployment → GitHub Actions.

Never ask me to create API keys, configure .env files, register for external services, or set up a backend.

Do not invent a successful deployment URL. Report the real deployment status and URL only after they have been verified.

## 22. SECURITY AND CODE QUALITY

- Use clear, modular JavaScript.
- Avoid unnecessary abstractions.
- Use descriptive function and variable names.
- Validate all user input.
- Escape or safely render untrusted text.
- Avoid eval and dynamic code execution.
- Avoid insecure DOM injection.
- Do not commit credentials or secrets.
- Handle browser storage exceptions.
- Ensure buttons, links, forms, filters, and navigation have working event handlers.
- Avoid duplicate event listeners after view changes.
- Prevent stale metrics and charts.
- Keep the application functional without external network connectivity after the files are available locally.
- Use no external dependencies.

## 23. REQUIRED FINAL VERIFICATION

Before declaring completion, verify:

1. index.html exists and opens successfully.
2. Every required JavaScript and CSS file exists.
3. The main dashboard renders.
4. The demo data is loaded only when needed.
5. Creating a report updates the dashboard.
6. Editing and resolving reports works.
7. Search, filters, and sorting work.
8. Category classification and priority scoring return explainable results.
9. Hotspots and insights are calculated from actual data.
10. Action Center recommendations are functional.
11. Export and import work safely.
12. Data persists after refresh.
13. The layout works on mobile and desktop.
14. There are no missing asset paths.
15. There are no unintended external API requests.
16. The test suite runs successfully, or any limitations are explicitly documented.
17. README and all required documentation exist.
18. The GitHub Actions deployment workflow is configured.
19. GitHub Pages deployment is verified if repository access permits.
20. All known failures are fixed or clearly reported.

## 24. FINAL RESPONSE FORMAT

When the implementation is complete, give me a concise project handoff containing:

- Project name and short description
- Main features implemented
- Exact local run instructions
- Test results and the number of tests actually executed
- Repository URL, if available
- GitHub Pages deployment URL, only if verified
- Deployment status: deployed, awaiting GitHub configuration, or blocked
- Any action I must personally perform, limited to what is genuinely necessary

Do not return only a plan, code snippets, or a mockup.

Build the complete working project first. Document it, test it, configure deployment, and execute whatever steps are possible without additional credentials.

**Final objective: A polished, working, self-contained CivicLens AI website that demonstrates meaningful community intelligence using only HTML, CSS, vanilla JavaScript, and browser-local storage, with complete documentation and automatic GitHub Pages deployment.**