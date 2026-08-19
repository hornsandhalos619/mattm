# Oakwood Residences San Diego

A premium, responsive property website for Oakwood Residences San Diego — fine rentals city wide, homes and apartments for rent. Built as a static site deployable to Netlify or GitHub Pages with zero build step.

## Quick Start

```bash
cd oakwood-residences
python -m http.server 3000   # or npx serve . 3000
open http://localhost:3000
```

## File Structure

```
oakwood-residences/
├── index.html     # Main site structure
├── style.css      # Complete design system + responsive styles
├── script.js      # Filters, modals, chatbot, scroll animations
├── netlify.toml   # Netlify deploy config
├── .nojekyll      # Skip Jekyll for GitHub Pages
└── CNAME          # Add your custom domain here (uncomment & edit)
```

## Deploy to Netlify

1. Push this folder to a Git repo (GitHub, GitLab, or Bitbucket).
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Connect your repo and click **Deploy**.
4. Netlify auto-detects `netlify.toml` — no config changes needed.

Or drag-and-drop the folder at [app.netlify.com/drop](https://app.netlify.com/drop) for instant deploy.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings** → **Pages**.
3. Source: **Deploy from a branch**, select `main` / root folder.
4. The `.nojekyll` file disables Jekyll so CSS works as-is.

## Custom Domain

Uncomment the `CNAME` file and add your domain (e.g., `oakwoodresidences.com`). Netlify provisions SSL automatically.

## Features

- Fully responsive (mobile-first) with hamburger menu
- Filter floor plans by bedroom count or neighborhood
- Property detail modal with full specs
- Contact / inquiry form (client-side, integrate a backend later)
- Floating chatbot widget with canned replies for common questions
- Smooth scroll animations via Intersection Observer
- Warm gold/terracotta design system with CSS custom properties

## Tech Stack

Static HTML/CSS/JS — no frameworks, no build tools. Ready to deploy anywhere.

## License

Private / Proprietary — Oakwood Residences San Diego.
