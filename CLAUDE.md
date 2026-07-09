# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static personal portfolio website for Sithuru Kawinda. There is no build step — open `index.html` directly in a browser or serve it with any static file server.

**Brand & design intent:** The core principle is precision over decoration — restraint signals seniority. The target audience (hiring managers, senior developers) can immediately distinguish a thoughtful site from a template. Three explicit anti-patterns to avoid:
- Generic Bootstrap dark portfolio look — cyan/purple gradients on black with particles everywhere
- Over-animated CSS showcases where motion distracts from the work
- Corporate-flat pages with no personal voice

Full brand details are in `PRODUCT.md`. WCAG AA accessibility is required (sufficient contrast, keyboard-navigable).

## Serving the site

Everything, including the contact form, runs client-side now — no PHP or backend is required:
- Open `index.html` directly in a browser, or
- Any static server / VS Code Live Server extension

## Architecture

All content lives in a single file: `index.html` contains the full HTML structure, all CSS (in an embedded `<style>` block), and all JavaScript (in an embedded `<script>` block at the bottom). There is no external `style.css` used by the page — that file exists but is unused.

**Sections (in order):** Home → About → Skills → Education → Projects → Certifications → GitHub Activity → Contact → Footer

**External CDN dependencies loaded in `<head>`:**
- Bootstrap 5.3 (layout/components)
- Font Awesome 6.4 (icons)
- Google Fonts — Inter
- AOS 2.3.1 (scroll animations)
- Particles.js 2.0.0 (animated background, script tag near the bottom of the file)

**Skill icons** come from `https://cdn.jsdelivr.net/gh/devicons/devicon/` — no local icon files. The GitHub Activity section embeds `github-readme-stats.vercel.app` images for stats/top-languages — no local data.

**Local assets:**
- `images/image.png` — favicon only (`<link rel="icon">`)
- `images/kawinda.jpg` — profile photo, used in the Home/About section
- `images/sithuru_kawinda_cv.pdf` — downloadable resume
- `images/certificates/*.png` — certificate images shown via the certification lightbox
- `projects/*.png` — project screenshots
- `projects/videos/v1.mp4`, `projects/videos/v4.mp4`, `projects/videos/voice assistent.mp4` — project demo videos (used as `<video autoplay muted loop playsinline>` in project cards instead of `<img>`)

## JavaScript (embedded `<script>` block)

The script at the bottom of `index.html` initializes in this order:
1. `AOS.init(...)` — scroll animations
2. `particlesJS('particles-js', ...)` — animated background
3. Navbar `scroll` listener — adds/removes `.scrolled` class to change navbar background on scroll
4. Project filter buttons — toggles `.hidden` on `.project-card-modern` cards based on `data-filter`/`data-lang`
5. Contact form `submit` handler — async fetch to Web3Forms, shows a custom alert overlay on success/error
6. Project detail modal — injects a "Details" button into every project card and opens `#projModal` populated from the `projectData` array
7. Certificate lightbox — `openCertLightbox()`/`closeCertLightbox()`, wired to `onclick` handlers on `.cert-view-btn` buttons in the Certifications section

## Contact form

The form (`#contactForm`) is submitted via JS `fetch()` directly to Web3Forms (`https://api.web3forms.com/submit`) as a JSON POST, with a hardcoded `access_key` in the script. There is no server involved — `send_mail.php` is dead code left over from a previous PHP-based implementation and is no longer referenced anywhere in `index.html`.

## Dead files — do not use

- `style.css` — unused; all styles are inlined in `index.html`'s `<style>` block
- `send_mail.php` — unused; the contact form now posts directly to Web3Forms from client-side JS (see above)
- `script.js` — Node.js/Express + nodemailer backend, never wired up; also references the wrong recipient email
- `server.js` — Node.js/Express + MongoDB backend, never wired up; references `./models/Project`, `./models/Education`, `./models/Skill`, `./models/Contact` model files that do not exist in the repo

## Adding a project

A project has two parts that must both be updated, linked by a shared `data-project` / array index:

1. **Grid card** — hand-coded HTML block inside `#projects > .projects-grid` in `index.html`:

```html
<div class="project-card-modern" data-aos="flip-up" data-aos-delay="..." data-lang="react java" data-project="N">
    <img src="projects/your-image.png" alt="..." loading="lazy" class="project-image">
    <div class="project-content">
        <h3 class="project-title">Title</h3>
        <p class="text-dim">Description</p>
        <div class="project-tags">
            <span class="project-tag">Tag</span>
        </div>
        <div class="project-links">
            <a href="..." class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
            <a href="..." class="project-link" target="_blank"><i class="fab fa-github"></i> GitHub</a>
        </div>
    </div>
</div>
```

   `data-project="N"` must match the index of the corresponding entry in the `projectData` array (step 2) — a script near the bottom of the page auto-injects a "Details" button into every card with `data-project` that opens the modal for `projectData[N]`.

   Use `<video autoplay muted loop playsinline loading="lazy" class="project-image"><source src="projects/videos/your-video.mp4" type="video/mp4"></video>` instead of `<img>` for video previews.

2. **`projectData` array entry** (in the `<script>` block, feeds the detail modal): `{ title, image, description, features: [...], tech: [...], demo, github }`.

**`data-lang` is required for the language filter to work.** The value is a space-separated list of filter keys. Valid values (must match the filter buttons exactly): `java`, `react`, `javascript`, `php`, `nodejs`. A card without `data-lang` will be hidden by all filters except "All".

## Design system

CSS custom properties are defined in `:root` at the top of the `<style>` block. Full token set:

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#00ffff` | Cyan accent, links, active states |
| `--primary-dark` | `#00cccc` | Cyan hover/pressed |
| `--primary-glow` | `rgba(0,255,255,0.3)` | Glow box-shadows |
| `--primary-light` | `rgba(0,255,255,0.1)` | Subtle fills |
| `--secondary` | `#ff3366` | Error state, accent contrast |
| `--bg-dark` | `#0a0c0f` | Page background |
| `--bg-darker` | `#050708` | Particles layer background |
| `--bg-card` | `#111417` | Card backgrounds |
| `--bg-card-hover` | `#1a1e24` | Card hover state |
| `--text-dim` | `#9aa4b8` | Secondary text |
| `--text-muted` | `#6c7a96` | Placeholder / meta text |
| `--border-color` | `#1e2630` | Dividers, card borders |
| `--border-glow` | `rgba(0,255,255,0.15)` | Glowing borders on focus/hover |
| `--success` | `#00ff88` | Form success state |
| `--error` | `#ff3366` | Form error state |

All hover effects use `box-shadow: 0 0 Xpx var(--primary-glow)` for the cyan glow pattern. Sections have `padding: 100px 0`.
