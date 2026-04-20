# Display Pro

Display Pro is a static Next.js display comparison site built for GitHub Pages. It compares device display specs side-by-side, uses client-side filtering and sorting, and exports to plain HTML, CSS, and JavaScript in the `out/` folder.

## What changed for GitHub Pages

- Removed the runtime API route
- Switched the app to static JSON-backed data
- Enabled `output: "export"` in Next.js
- Added GitHub Pages base-path handling
- Added a `.nojekyll` file for static hosting
- Added a GitHub Actions workflow for automatic deployment

## Project structure

```text
display_pro/
|-- .github/
|   `-- workflows/
|       `-- deploy-pages.yml
|-- app/
|   |-- globals.css
|   |-- layout.tsx
|   |-- page.tsx
|   |-- robots.ts
|   `-- sitemap.ts
|-- components/
|   |-- AdSlot.tsx
|   |-- ComparisonExperience.tsx
|   |-- ComparisonTable.tsx
|   |-- DeviceCatalog.tsx
|   |-- ThemeScript.tsx
|   `-- ThemeToggle.tsx
|-- data/
|   `-- devices.json
|-- lib/
|   |-- cx.ts
|   |-- device-catalog.ts
|   |-- device-utils.ts
|   `-- site.ts
|-- public/
|   `-- .nojekyll
|-- types/
|   `-- device.ts
|-- .gitignore
|-- next-env.d.ts
|-- next.config.ts
|-- package-lock.json
|-- package.json
|-- postcss.config.js
|-- tailwind.config.ts
`-- tsconfig.json
```

## Install and run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Build the static site

Run:

```bash
npm run build
```

This creates the export folder:

- Exact folder to upload: `out/`

To preview the exported site locally, you can use a simple static server. For example, if Python is installed:

```bash
python -m http.server 8080 --directory out
```

## Recommended deployment: GitHub Actions

This repo already includes [.github/workflows/deploy-pages.yml](</C:/Users/hajun/OneDrive/바탕 화면/display_pro/.github/workflows/deploy-pages.yml>), so GitHub can build and publish the site for you automatically.

### Step 1. Create a GitHub repository

1. Go to [GitHub](https://github.com/).
2. Click `New repository`.
3. Enter a repository name.
4. Keep it public if you want a public GitHub Pages site.
5. Create the repository.

### Step 2. Upload this project

If the project is already a local git repo:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git add .
git commit -m "Prepare GitHub Pages deployment"
git branch -M main
git push -u origin main
```

If you prefer GitHub Desktop or drag-and-drop upload, that also works. The important part is that the full project is pushed to the `main` branch.

### Step 3. Enable GitHub Pages

1. Open your repository on GitHub.
2. Go to `Settings`.
3. Click `Pages` in the left sidebar.
4. Under `Build and deployment`, set `Source` to `GitHub Actions`.

### Step 4. Deploy

1. Push to `main`.
2. Open the `Actions` tab.
3. Wait for the `Deploy GitHub Pages` workflow to finish.
4. After it succeeds, GitHub will publish your site.

Your site URL will usually be:

- `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

If your repository name is exactly `YOUR-USERNAME.github.io`, your site URL becomes:

- `https://YOUR-USERNAME.github.io/`

## Manual alternative: deploy from a branch

If you do not want GitHub Actions, you can upload the built files manually.

### Build locally for GitHub Pages

For a normal project repository, run this in PowerShell before building:

```powershell
$env:GITHUB_PAGES="true"
$env:GITHUB_PAGES_REPO="your-repository-name"
$env:NEXT_PUBLIC_SITE_URL="https://YOUR-USERNAME.github.io/your-repository-name"
npm run build
```

For a user site repository named `YOUR-USERNAME.github.io`, run:

```powershell
$env:GITHUB_PAGES="true"
$env:GITHUB_PAGES_REPO="YOUR-USERNAME.github.io"
$env:NEXT_PUBLIC_SITE_URL="https://YOUR-USERNAME.github.io"
npm run build
```

### Upload the built files

1. Open the generated `out/` folder.
2. Copy the contents of `out/`.
3. Upload those files to the root of a branch such as `gh-pages`.
4. Make sure the generated `.nojekyll` file stays in that branch root.

### Enable Pages for the branch

1. Open your repository on GitHub.
2. Go to `Settings`.
3. Click `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select branch `gh-pages`.
6. Select folder `/(root)`.
7. Click `Save`.

## Important config files

- [next.config.ts](</C:/Users/hajun/OneDrive/바탕 화면/display_pro/next.config.ts>): static export, trailing slashes, unoptimized assets, and GitHub Pages base path support.
- [public/.nojekyll](</C:/Users/hajun/OneDrive/바탕 화면/display_pro/public/.nojekyll>): prevents GitHub Pages from treating the site as a Jekyll project.
- [.github/workflows/deploy-pages.yml](</C:/Users/hajun/OneDrive/바탕 화면/display_pro/.github/workflows/deploy-pages.yml>): builds `out/` and deploys it automatically.

## Build command

- Build command: `npm run build`
- Output folder: `out`

## Adding more devices

Add more entries to [data/devices.json](</C:/Users/hajun/OneDrive/바탕 화면/display_pro/data/devices.json>) using the same object shape. The static site will include them on the next build.
