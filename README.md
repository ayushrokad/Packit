# PackIt — Branding & Packaging Design Studio

**PackIt** is an independent brand identity and packaging design studio website based in **Surat, Gujarat, India**. Built as a fast, zero-build static web experience with an interactive **Three.js WebGL 3D packaging showcase**, custom micro-interactions, and a modular CSS design system.

---

## Highlights & Features

- **Interactive 3D Packaging Hero (`js/hero-3d.js`)** — Real-time Three.js WebGL stand-up pouch rendered with a 5-light studio rig, procedural canvas artwork textures, 360° mouse/touch drag rotation, gentle floating motion, and one-click camera angle presets (`Front`, `Angle`, `Back`).
- **Selected Packaging Formats Showcase** — Illustrated breakdown of physical packaging architectures (Stand-Up Pouch, Apothecary Glass, Rigid Slide Box, Brushed Metal Tin) with substrate and finish metadata.
- **5-Phase Brand Transformation Timeline (`js/main.js`)** — Interactive auto-advancing showcase (*The Foundation → The Hook → The Personality → The Premium Touch → The Final Test*) with play/pause/prev/next controls and a live technical specification strip.
- **Filterable Portfolio & Case-Study Modal (`work.html`)** — Category filtering with rich project detail modals covering substrate, finishing, print specifications, and business outcomes.
- **Project Scope & Timeline Estimator (`start.html`)** — Multi-select product category and service briefing form with real-time scope summary and estimated project timeline calculation.
- **Refined Editorial UI** — Warm paper canvas (`#FAF8F4`), near-black editorial ink (`#1A1A1A`), signature yellow accents (`#F5C842`), custom pointer-fine cursor that adapts to dark sections, scroll-reveal animations, and a responsive mobile drawer.

---

## Pages Overview

| Page | File | Description |
| :--- | :--- | :--- |
| **Home** | [`index.html`](index.html) | 3D WebGL pouch hero, studio marquee, packaging formats showcase, 5-phase transformation timeline, studio disciplines, and mission CTA |
| **Work** | [`work.html`](work.html) | Filterable packaging & branding portfolio with interactive case-study specification modals |
| **Services** | [`services.html`](services.html) | Sticky-header breakdown of Brand Strategy, Brand Identity, Packaging Design, and Brand Experience |
| **Approach** | [`approach.html`](approach.html) | Step-by-step visual process of how PackIt builds brand identity and physical packaging |
| **Industries** | [`industries.html`](industries.html) | Sector-specific solutions across Food & Beverage, Fashion & Apparel, Beauty & Care, Lifestyle, and D2C |
| **About** | [`about.html`](about.html) | Studio manifesto, story, and principles rooted in Surat, Gujarat |
| **Start a Project** | [`start.html`](start.html) | Interactive project inquiry form with live configured scope and timeline estimator |

---

## Tech Stack

- **Markup & Styling:** Semantic HTML5, modular vanilla CSS3 with CSS Custom Properties ([`css/tokens.css`](css/tokens.css))
- **Interactivity & 3D:** Vanilla ES6+ JavaScript, [Three.js](https://threejs.org/) (`js/three.min.js`)
- **Typography:** Google Fonts — *Instrument Serif*, *Space Grotesk*, and *Inter*
- **Local Dev Server:** [`serve`](https://www.npmjs.com/package/serve) (`^14.2.4`)
- **Hosting Config:** [Vercel](https://vercel.com/) with clean URLs enabled via [`vercel.json`](vercel.json)

---

## Project Structure

```text
Packit/
├── index.html                  # Home page (3D hero, showcase, transformation, disciplines)
├── work.html                   # Portfolio gallery with filter bar & case-study modal
├── services.html               # Studio capabilities & deliverables
├── approach.html               # Brand & packaging methodology
├── industries.html             # Target sectors & industry focus
├── about.html                  # Studio story & manifesto
├── start.html                  # Interactive project brief & scope estimator
├── assets/
│   └── images/
│       ├── favicon.png         # Site favicon
│       ├── logo.png            # Optimized navigation/footer logo
│       └── logo-original.png   # High-resolution original logo asset
├── css/
│   ├── reset.css               # Base CSS reset
│   ├── tokens.css              # Core design tokens (colors, fonts, spacing, motion, shadows)
│   ├── global.css              # Shared typography, buttons, layout containers, reveal utilities
│   ├── nav.css                 # Sticky navigation bar & mobile drawer
│   ├── hero.css                # Hero grid, 3D canvas wrap, camera switcher controls
│   ├── showcase.css            # Packaging formats showcase cards
│   ├── transformation.css      # 5-phase dark transformation stage & live spec strip
│   ├── cta.css                 # Final CTA banner
│   ├── footer.css              # Multi-column footer
│   └── ...                     # Additional modular section stylesheets
├── js/
│   ├── three.min.js            # Bundled Three.js library
│   ├── hero-3d.js              # Interactive 3D Stand-Up Pouch WebGL engine
│   └── main.js                 # Cursor, nav, transformation timeline, scroll reveals
├── docs/
│   ├── ARCHITECTURE.md         # Technical architecture & 3D engine deep-dive
│   └── DESIGN_SYSTEM.md        # Complete design token & visual system reference
├── CONTRIBUTING.md             # Contribution workflow & conventions
├── LICENSE                     # MIT License
├── package.json                # npm scripts & dev dependencies
└── vercel.json                 # Vercel static hosting config (cleanUrls: true)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended) and `npm`

### Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ayushrokad/Packit.git
   cd Packit
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the local development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Serves the project locally on port `3000` via `serve` |
| `start` | `npm start` | Alias for serving the static site on port `3000` |
| `serve` | `npm run serve` | Serves the static site on port `3000` |

> **Note:** Because there is no build step, edits to HTML, CSS, or JS files take effect immediately on browser refresh.

---

## Deployment

The repository includes a [`vercel.json`](vercel.json) file configured with `"cleanUrls": true` so pages like `/work.html` can be served cleanly at `/work`.

### Deploy to Vercel

1. Push the repository to GitHub (or connect `ayushrokad/Packit` directly in the Vercel dashboard).
2. Import the project in Vercel — no build command or output directory override is required (static root deployment).
3. Deploy.

You can also deploy the root directory directly to **Netlify**, **GitHub Pages**, or **Cloudflare Pages** without any build configuration.

---

## Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)** — Multi-page layout, Three.js 3D pouch engine internals, and JavaScript interaction modules.
- **[Design System](docs/DESIGN_SYSTEM.md)** — Color tokens, typography scale, spacing system, motion curves, and shadow elevations.
- **[Contributing Guide](CONTRIBUTING.md)** — Development conventions and how to add new pages or portfolio case studies.

---

## Author

**Ayush Rokad** — [github.com/ayushrokad](https://github.com/ayushrokad)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
