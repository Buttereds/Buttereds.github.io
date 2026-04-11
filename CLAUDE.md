# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills
**Always use the `frontend-design` skill** when working on any frontend task — components, pages, layouts, styles, or UI improvements. Invoke it before writing any frontend code.

## Project Overview

Personal portfolio website for Alex Burnie, an XR/Game Developer. Hosted on GitHub Pages at `Buttereds.github.io`.

## Development Server

```bash
node serve.mjs
```

Runs on `http://localhost:3000`. Root `/` redirects to `/portfolio/index.html`. Supports range requests for video streaming. No build step — plain HTML/CSS/JS served directly.

Alternatively, double-click `START SERVER.bat` (opens browser automatically).

## Architecture

There are **two copies** of the site at the repo root:

- **`portfolio/`** — the working/development copy (edit here)
- **Root-level** (`index.html`, `style.css`, `script.js`, `projects/`) — deployed copy for GitHub Pages

After making changes in `portfolio/`, copy files to root for deployment. GitHub Pages serves from repo root.

### Key files (within `portfolio/` or root):
- `index.html` — single-page portfolio (nav, hero, project carousel, about, skills, contact)
- `style.css` — custom CSS, HUD-minimal aesthetic with black + electric cyan (`--accent: #00e5ff`)
- `script.js` — project carousel, scroll reveal animations, reaction-time game, smooth scrolling
- `projects/*.html` — individual project detail pages (each self-contained with own styles)
- `projects/project.css` / `project.js` — shared styles/scripts for project detail pages

### Assets
- `assets/` — project screenshots/images organized by project name (e.g., `assets/BagSearchAndWanding/`)
- Project pages reference assets via relative paths (`../assets/` from `projects/` dir)

## Design System

- **Fonts:** Share Tech Mono (headings/mono) + Barlow (body) via Google Fonts
- **Colors:** Black background (`#080808`), electric cyan accent (`#00e5ff`), defined as CSS custom properties in `:root`
- **Aesthetic:** HUD-minimal, game-developer themed

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
