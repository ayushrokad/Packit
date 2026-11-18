# PackIt — Design System Reference

PackIt's visual language combines a **warm paper canvas**, **crisp near-black editorial typography**, and **signature solar-yellow accents** for interaction and craft highlights.

All design tokens are defined centrally in [`css/tokens.css`](../css/tokens.css) as CSS Custom Properties on `:root`.

---

## 1. Color Palette

### Surfaces & Canvas

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--canvas` | `#FAF8F4` | Primary warm paper page background |
| `--canvas-off` | `#F2EFE8` | Alternating section backgrounds & subtle boxes |
| `--canvas-card` | `#FFFFFF` | Elevated cards, forms, and filter pills |
| `--border` | `#E4E0D8` | Hairline dividers and card outlines |

### Ink & Typography

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--ink` | `#1A1A1A` | Primary headlines, high-contrast surfaces, dark sections |
| `--ink-mid` | `#3A3A3A` | Standard body copy |
| `--ink-muted` | `#787878` | Section labels, metadata, captions |
| `--ink-faint` | `#BCBCBC` | Secondary dividers and ghost indicators |

### Brand Accent (PackIt Yellow)

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--yellow` | `#F5C842` | Signature accent — primary CTAs, active highlights, 3D rim light |
| `--yellow-light` | `#FDF3C0` | Soft yellow tint backgrounds and badges |
| `--yellow-dark` | `#D4A812` | Pressed/active states and high-contrast yellow text on light canvas |

---

## 2. Typography

Loaded from Google Fonts across all pages:

| Token | Font Stack | Role |
| :--- | :--- | :--- |
| `--font-serif` | `'Instrument Serif', Georgia, serif` | Expressive italic editorial accents & wordmarks |
| `--font-sans` | `'Space Grotesk', system-ui, sans-serif` | Display headlines, UI buttons, labels, technical specs |
| `--font-body` | `'Inter', system-ui, sans-serif` | Readable long-form body copy and descriptions |

### Type Scale

| Token | Size (`rem`) | Equivalent (`px`) |
| :--- | :--- | :--- |
| `--text-xs` | `0.75rem` | `12px` |
| `--text-sm` | `0.875rem` | `14px` |
| `--text-base` | `1rem` | `16px` |
| `--text-md` | `1.125rem` | `18px` |
| `--text-lg` | `1.25rem` | `20px` |
| `--text-xl` | `1.5rem` | `24px` |
| `--text-2xl` | `1.875rem` | `30px` |
| `--text-3xl` | `2.25rem` | `36px` |
| `--text-4xl` | `3rem` | `48px` |
| `--text-5xl` | `4rem` | `64px` |
| `--text-6xl` | `5.5rem` | `88px` |
| `--text-7xl` | `7rem` | `112px` |

---

## 3. Spacing Scale

Based on a `4px` (`0.25rem`) grid:

| Token | Value | Pixels |
| :--- | :--- | :--- |
| `--space-1` | `0.25rem` | `4px` |
| `--space-2` | `0.5rem` | `8px` |
| `--space-3` | `0.75rem` | `12px` |
| `--space-4` | `1rem` | `16px` |
| `--space-5` | `1.25rem` | `20px` |
| `--space-6` | `1.5rem` | `24px` |
| `--space-8` | `2rem` | `32px` |
| `--space-10` | `2.5rem` | `40px` |
| `--space-12` | `3rem` | `48px` |
| `--space-16` | `4rem` | `64px` |
| `--space-20` | `5rem` | `80px` |
| `--space-24` | `6rem` | `96px` |
| `--space-32` | `8rem` | `128px` |
| `--space-40` | `10rem` | `160px` |
| `--space-48` | `12rem` | `192px` |

---

## 4. Layout & Border Radii

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--max-width` | `1280px` | Primary `.container` max width |
| `--nav-height` | `72px` | Fixed navigation header height |
| `--radius-sm` | `6px` | Subtle tags & small controls |
| `--radius-md` | `12px` | Inputs, estimate boxes, compact cards |
| `--radius-lg` | `20px` | Feature & industry cards |
| `--radius-xl` | `32px` | Large elevated panels & project brief form |
| `--radius-pill` | `999px` | Filter buttons, status pills, pill badges |

---

## 5. Motion & Elevation

### Easing & Durations

| Token | Value |
| :--- | :--- |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--duration-fast` | `200ms` |
| `--duration-med` | `400ms` |
| `--duration-slow` | `700ms` |

### Shadows

| Token | Definition |
| :--- | :--- |
| `--shadow-sm` | `0 1px 3px rgba(26,26,26,0.06), 0 1px 2px rgba(26,26,26,0.04)` |
| `--shadow-md` | `0 4px 16px rgba(26,26,26,0.08), 0 2px 4px rgba(26,26,26,0.04)` |
| `--shadow-lg` | `0 12px 40px rgba(26,26,26,0.10), 0 4px 12px rgba(26,26,26,0.06)` |
| `--shadow-xl` | `0 24px 64px rgba(26,26,26,0.12), 0 8px 24px rgba(26,26,26,0.08)` |
