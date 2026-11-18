# Contributing to PackIt

Thank you for your interest in contributing to **PackIt**. This repository is a lightweight, zero-build static website, making local setup and iteration straightforward.

---

## Local Setup

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/ayushrokad/Packit.git
   cd Packit
   ```

2. Install dependencies and start the local server:

   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to preview changes live.

---

## Coding & Design Conventions

- **Use Design Tokens:** Prefer CSS custom properties from [`css/tokens.css`](css/tokens.css) (e.g., `var(--canvas)`, `var(--ink)`, `var(--yellow)`, `var(--space-8)`) rather than hardcoding hex colors or arbitrary pixel spacing.
- **No Build Step Required:** Keep HTML, CSS, and JavaScript browser-native (ES6+ vanilla JS and standard CSS3) so the project remains deployable as static files without compilation.
- **Responsive by Default:** Verify changes across desktop (`>= 1280px`), tablet (`~768px`), and mobile (`<= 480px`) viewports, including touch interactions on the 3D hero canvas.
- **Accessibility:** Include meaningful `alt` text on images, `aria-label` attributes on icon-only buttons, and sufficient text contrast against both `--canvas` and `--ink` backgrounds.

---

## Common Tasks

### Adding a New Page

1. Duplicate an existing secondary page (such as [`about.html`](about.html)) to retain the standard `<head>`, Google Fonts, shared CSS stack (`reset.css`, `tokens.css`, `global.css`, `nav.css`, `footer.css`), navigation bar, footer, and `js/main.js`.
2. Add the page link to `#nav-links` in the HTML headers and to the `links` / `hrefs` arrays in [`js/main.js`](js/main.js) so the mobile navigation drawer stays in sync.

### Adding a Portfolio Case Study (`work.html`)

1. Add a new project card in [`work.html`](work.html) with a unique `data-project="<key>"` attribute and appropriate category attribute for the filter bar.
2. Add a matching `<key>` entry to the `modalData` object in [`work.html`](work.html) with `category`, `title`, `desc`, `substrate`, `finishing`, `print`, and `outcome`.

---

## Pull Request Checklist

- [ ] Tested locally with `npm run dev` on both desktop and mobile viewports
- [ ] No console errors in browser DevTools
- [ ] Styles follow tokens in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- [ ] Navigation and footer links work across all pages
- [ ] Documentation updated if you added pages, scripts, or configuration
