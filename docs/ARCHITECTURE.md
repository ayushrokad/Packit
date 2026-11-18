# PackIt — Technical Architecture

This document outlines the structure, rendering pipeline, and interactive JavaScript modules powering the **PackIt** static website.

---

## 1. Static Multi-Page Architecture

PackIt is intentionally built with **zero bundler or framework overhead**:

- Each route is a standalone HTML document at the project root (`index.html`, `work.html`, `services.html`, `approach.html`, `industries.html`, `about.html`, `start.html`).
- Clean URLs (e.g., `/work` → `/work.html`) are handled at hosting level via [`vercel.json`](../vercel.json) (`"cleanUrls": true`).
- Shared chrome (navigation bar, mobile drawer, footer, custom cursor, scroll reveals) is standardized across all pages using a shared base stylesheet stack (`reset.css`, `tokens.css`, `global.css`, `nav.css`, `footer.css`) and `js/main.js`.
- Page-specific styles are loaded either via dedicated section stylesheets (on `index.html`) or scoped inline `<style>` blocks (on secondary pages) to avoid shipping unused CSS on every route.

---

## 2. Hero 3D Packaging Engine (`js/hero-3d.js`)

The home page hero renders a live interactive 3D Stand-Up Pouch using **Three.js** (`js/three.min.js`) inside `.hero__canvas-wrap`.

### Scene & Renderer Configuration

- **Camera:** `THREE.PerspectiveCamera(38, aspect, 0.1, 100)` positioned at `(0, 0, 7.8)`.
- **Renderer:** `THREE.WebGLRenderer` with `antialias: true`, `alpha: true`, `powerPreference: 'high-performance'`, `PCFSoftShadowMap`, and `ACESFilmicToneMapping`. Pixel ratio is capped at `Math.min(window.devicePixelRatio, 2)` to maintain 60 FPS on HiDPI displays.
- The script replaces the placeholder `#hero-canvas` element with the WebGL canvas on initialization.

### 5-Light Studio Rig

1. **Ambient Light (`0xfffdf7`, `0.75`)** — Warm base illumination tuned to preserve deep obsidian blacks without washing out dark inks.
2. **Key Directional Light (`0xffffff`, `1.7`)** — Upper-right shadow-casting primary light (`1024×1024` shadow map).
3. **Warm Fill Light (`0xfff5e6`, `0.65`)** — Soft left-side fill to retain surface readability.
4. **Signature PackIt Rim Light (`0xf5c842`, `2.5`)** — Back-left yellow rim light to separate the pouch silhouette from the warm paper background.
5. **Overhead Light (`0xffffff`, `0.9`)** — Highlights top heat-seal crimping and foil edges.

### Procedural Canvas Textures

Rather than loading large external 3D `.glb` or texture bitmaps, `js/hero-3d.js` procedurally draws high-resolution HTML5 Canvas textures at runtime (including natural kraft substrate shading, radial warmth, rounded panels, typographic artwork, and metallic/gloss specular details) and maps them onto the front, back, gussets, and heat seals of the 3D mesh.

### Interaction & Animation Loop

- **360° Drag Rotation:** Pointer (`mousedown` / `mousemove` / `mouseup`) and single-finger touch (`touchstart` / `touchmove` / `touchend`) controls adjust `targetRotY` freely and clamp vertical pitch `targetRotX` to `[-0.45, 0.45]` radians.
- **Preset Camera Controls:** Floating buttons (`#piBtnFront`, `#piBtnAngle`, `#piBtnBack`) smoothly interpolate to:
  - **Front:** `rotY = 0`, `rotX = 0`
  - **Angle (3/4 perspective):** `rotY = 0.55`, `rotX = 0.08`
  - **Back:** `rotY = Math.PI`, `rotX = 0`
- **Continuous Motion:** Subtle vertical breathing (`Math.sin(elapsedTime * 1.5) * 0.055`), gentle Z-axis sway, and subtle mouse-parallax offset interpolated every frame via linear damping (`0.09`).
- **Responsive Layout:** `updateLayout()` repositions and scales `packageGroup` across desktop (`> 900px`), tablet, and mobile (`< 600px` / `< 500px`) viewports on load and window resize.

---

## 3. Shared Interaction Layer (`js/main.js`)

| Module | Behavior |
| :--- | :--- |
| **Custom Cursor** | Initializes only on fine-pointer devices (`(pointer: fine)`). Renders a primary dot (`.cursor-dot`) and a smoothly lerped outer ring (`.cursor-ring`, factor `0.14`). Expands on interactive elements and automatically switches dot contrast (`#FAF8F4` vs `#F5C842`) over dark sections (`.transformation`, `.final-cta`) via `IntersectionObserver`. |
| **Sticky Navigation** | Toggles `.scrolled` on `#main-nav` once `window.scrollY > 40` using a passive scroll listener. |
| **Mobile Drawer** | Dynamically injects `.nav__mobile` with all primary routes + CTA when `#nav-burger` is present, locking `document.body.style.overflow` while open. |
| **Transformation Timeline** | Drives the 5-step evolution (`plain`, `positioned`, `identity`, `packaged`, `experience`), synchronizing SVG layers (`#tp-*`), step buttons (`#ts-*`), progress bar (`#transform-progress`), phase badge (`#tsStepIndicator`), and the 4-column technical spec sheet (`#specSubstrate`, `#specColor`, `#specType`, `#specImpact`). Auto-advances every `3400ms` with Pause/Play, Prev, and Next controls. |
| **Scroll Reveals** | Uses `IntersectionObserver` (`threshold: 0.15`) to reveal `.showcase-card` and `.discipline-card` elements once they enter the viewport. |
| **Smooth Anchors** | Intercepts `a[href^="#"]` links for smooth scrolling to in-page targets. |

---

## 4. Page-Specific Scripts

- **`work.html` (Portfolio Filter & Case-Study Modal):**
  - Filters portfolio cards by category via `.filter-btn` buttons.
  - Opens `#projectModal` on card click, populating modal fields (`category`, `title`, `desc`, `substrate`, `finishing`, `print`, `outcome`) from an inline `modalData` map keyed by `card.dataset.project`.
- **`start.html` (Project Scope & Timeline Estimator):**
  - Listens to `change` events on product (`input[name="product"]`) and service (`input[name="need"]`) checkboxes.
  - Dynamically updates `#scopeSummaryText` and `#timelineEstimate` (`3–5 Weeks`, `5–7 Weeks`, or `6–8 Weeks` for Full Brand System).
  - Currently handles form submission client-side (displays `#successMsg` and resets the form); ready to be wired to a backend endpoint or form service (e.g., Formspree, Resend, or a Vercel Serverless Function).

---

## 5. Maintenance Notes

- **Optional / Legacy Assets:** The repository currently contains empty placeholder scripts (`js/gsap.min.js`, `js/ScrollTrigger.min.js`) and supplementary stylesheets (`css/open-box.css`, `css/problem.css`, `css/why-packaging.css`, `css/workflow.css`) from earlier layout explorations. None of them are loaded by `index.html` at runtime, keeping page load fast while preserving reference styles.
- **Root Asset:** `Packit Logo with Dynamic Arrow.png` in the project root is a high-resolution source graphic; web pages reference the optimized `assets/images/logo.png` and `assets/images/favicon.png`.
