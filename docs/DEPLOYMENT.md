# CivicLens AI — GitHub Pages Deployment Guide

CivicLens AI is engineered to be deployed automatically to **GitHub Pages** via **GitHub Actions**.

---

## 1. Prerequisites
- A GitHub account.
- A GitHub repository (public or private).
- No API keys, credentials, or environment secrets are required.

---

## 2. Automated Deployment with GitHub Actions

The repository includes a ready-to-run GitHub Actions workflow located at:
`.github/workflows/deploy.yml`

### Step-by-Step GitHub Setup:
1. Push this project code to your GitHub repository on branch `main` (or `master`):
   ```bash
   git add .
   git commit -m "Deploy CivicLens AI"
   git push origin main
   ```
2. Navigate to your repository on GitHub.com.
3. Click on **Settings** → **Pages** (under the "Code and automation" sidebar section).
4. Under **Build and deployment** → **Source**, select **GitHub Actions**.
5. Once selected, GitHub Actions will detect `.github/workflows/deploy.yml` and trigger a deployment workflow run under the **Actions** tab.
6. Once the workflow run completes (typically under 45 seconds), your application will be live at:
   ```
   https://<USERNAME>.github.io/<REPOSITORY>/
   ```

---

## 3. Local Testing Before Deployment
To preview CivicLens AI locally:
- Simply double-click `index.html` in your file explorer.
- Or start a local static HTTP server (e.g., with Python):
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000/` in your browser.

---

## 4. Troubleshooting
- **Assets return 404:** CivicLens AI uses strictly relative paths (e.g. `assets/css/styles.css`), ensuring compatibility with root domains (`username.github.io`) and repository subpaths (`username.github.io/repo/`).
- **Jekyll processing issues:** The repository includes a `.nojekyll` file at the root to prevent GitHub Pages from ignoring asset folders or files.
- **Workflow Permissions:** The workflow declares the necessary permissions:
  ```yaml
  permissions:
    contents: read
    pages: write
    id-token: write
  ```
