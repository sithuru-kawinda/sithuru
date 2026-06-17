# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static personal portfolio website for Sithuru Kawinda. There is no build step — open `index.html` directly in a browser or serve it with any static/PHP-capable web server.

**Brand & design intent:** See `PRODUCT.md`. The core principle is precision over decoration — restraint signals seniority. Avoid gratuitous glow effects, over-animation, or anything that looks like a generic dark Bootstrap template.

## Serving the site

- Open `index.html` directly in a browser (particles and AOS will work; contact form will not)
- PHP built-in server (required for the contact form): `php -S localhost:8080`
- VS Code Live Server extension

## Architecture

All content lives in a single file: `index.html` contains the full HTML structure, all CSS (in an embedded `<style>` block), and all JavaScript (in an embedded `<script>` block at the bottom). There is no external `style.css` used by the page — that file exists but is unused.

**Sections (in order):** Home → About → Skills → Education → Projects → Contact → Footer

**External CDN dependencies loaded in `<head>`:**
- Bootstrap 5.3 (layout/components)
- Font Awesome 6.4 (icons)
- Google Fonts — Inter
- AOS 2.3.1 (scroll animations)
- Particles.js 2.0.0 (animated background)

**Skill icons** come from `https://cdn.jsdelivr.net/gh/devicons/devicon/` — no local icon files.

**Local assets:**
- `images/image.png` — profile photo (also used as the favicon)
- `images/sithuru_cv.pdf` — downloadable resume
- `projects/*.png` — project screenshots
- `projects/videos/*.mp4` — project demo videos (used as `<video autoplay muted loop>` in project cards)

## JavaScript (embedded `<script>` block)

The script at the bottom of `index.html` initializes in this order:
1. `AOS.init(...)` — scroll animations
2. `particlesJS('particles-js', ...)` — animated background
3. Navbar `scroll` listener — adds/removes `.scrolled` class to change navbar background on scroll
4. Contact form `submit` handler — async fetch to `send_mail.php`, shows a custom alert overlay on success/error

## Contact form

The form POSTs to `send_mail.php` via `fetch()` (line 2040) and `<form action="send_mail.php">` (line 1773). The actual backend file on disk is `send_email.php` — **outstanding fix: rename `send_email.php` → `send_mail.php`**. The PHP handler validates fields, then uses `mail()` to send to `sithuru15@gmail.com`.

## Dead files — do not use

- `style.css` — unused; all styles are inlined in `index.html`'s `<style>` block
- `script.js` — Node.js/Express + nodemailer backend, never wired up; also references the wrong recipient email
- `server.js` — Node.js/Express + MongoDB backend, never wired up; references `./models/Project`, `./models/Education`, `./models/Skill`, `./models/Contact` model files that do not exist in the repo

## Adding a project

Project cards are hand-coded HTML blocks inside `#projects > .projects-grid` in `index.html`. Each card follows this structure:

```html
<div class="project-card-modern" data-aos="flip-up" data-aos-delay="..." data-lang="react java">
    <img src="projects/your-image.png" alt="..." class="project-image">
    <div class="project-content">
        <h3 class="project-title">Title</h3>
        <p class="text-dim">Description</p>
        <div class="project-tags">
            <span class="project-tag">Tag</span>
        </div>
        <div class="project-links">
            <a href="..." class="project-link" target="_blank"><i class="fas fa-eye"></i> View</a>
            <a href="..." class="project-link" target="_blank"><i class="fab fa-github"></i> Code</a>
        </div>
    </div>
</div>
```

**`data-lang` is required for the language filter to work.** The value is a space-separated list of filter keys. Valid values (must match the filter buttons exactly): `java`, `react`, `javascript`, `php`, `nodejs`. A card without `data-lang` will be hidden by all filters except "All". Currently no existing cards have `data-lang` set — they need to be added.

Use `<video autoplay muted loop playsinline class="project-image">` instead of `<img>` for video previews.

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
