---
description: 'CSS patterns, design tokens, and build conventions for observata styles'
applyTo:
  - '**/*.css'
---

# CSS Guidelines

## Syntax

- Use **native CSS nesting** (no SCSS, no PostCSS nesting plugins)
- Scope all styles under the block's root class
- No `@import` in block CSS files (webpack handles bundling)
- **Comments**: Keep AI-generated comments to a minimum. Only comment non-obvious workarounds or hacks; do not restate what the code already says.

## Typography System (3-Tier)

The project uses a 3-tier token architecture. **Prefer typography utility classes over raw tokens** in block CSS.

### Tier 1: Utility Classes (use these first)

Defined in `client/css/global/typography-scale.css`. Apply directly to elements in Twig templates or compose in block CSS.

| Class           | Purpose                | Default size       | Responsive?        |
| --------------- | ---------------------- | ------------------ | ------------------ |
| `.heading-hero` | Hero headings          | 32px → 48px → 56px | Yes (40rem, 64rem) |
| `.heading-lg`   | Large section headings | 32px → 40px        | Yes (40rem)        |
| `.heading-md`   | Medium headings        | 24px → 32px        | Yes (40rem)        |
| `.heading-sm`   | Small headings         | 20px → 24px        | Yes (40rem)        |
| `.heading-xs`   | Extra small headings   | 16px               | Yes (40rem)        |
| `.body-hero`    | Hero subheading        | 16px → 20px        | Yes (40rem)        |
| `.body-lg`      | Large body text        | 16px → 20px        | Yes (40rem)        |
| `.body-md`      | Default body text      | 16px               | No                 |
| `.body-sm`      | Small body text        | 14px               | No                 |
| `.body-xs`      | Extra small text       | 14px               | No                 |

All heading classes use Gantari font family; all body classes use Inter. Colors switch automatically in dark container context via `@container style(--theme: dark)`.

### Tier 2: Theme Tokens (semantic aliases)

Defined in `client/css/tokens/theme-typography.css` and `client/css/tokens/theme.css`. Use when you need a value but the utility class does not fit.

```css
/* Font scale aliases */
--size-hero-default: var(--typography-size-56);
--size-heading-xl: var(--typography-size-56);
--size-heading-lg: var(--spacing-40);
--size-heading-md: var(--typography-size-32);
--size-heading-sm: var(--typography-size-24);
--size-body-lg: var(--typography-size-20);
--size-body-md: var(--typography-size-16);
--size-body-sm: var(--typography-size-14);

/* Line heights */
--line-height-heading-xl: var(--typography-line-height-tightest); /* 1 */
--line-height-body-lg: var(--typography-line-height-default); /* 1.6 */

/* Font stacks */
--font-stack-heading: Gantari, Inter, sans-serif;
--font-stack-body: Inter, sans-serif;

/* Text colors */
--colour-text-heading-default: var(--colour-neutral-800);
--colour-text-heading-light: var(--colour-neutral-white);
--colour-text-body-default: var(--colour-neutral-600);
--colour-text-body-light: var(--colour-neutral-white);
```

### Tier 3: Base Tokens (primitives)

Defined in `client/css/tokens/base-typography.css`. Raw values, avoid using directly in block CSS.

```css
--typography-family-inter: Inter;
--typography-family-gantari: Gantari;
--typography-size-10: 10px; /* through to */
--typography-size-80: 80px;
--typography-line-height-tightest: 1;
--typography-line-height-default: 1.6;
```

### Responsive Size Override Pattern

Utility classes use a local `--size` custom property with fallback: `font-size: var(--size, var(--typography-size-XX))`. Inside media queries, `--size` is set to override the default. This avoids repeating the full `font-size` declaration.

### Overridable Properties

Each utility class exposes hooks for per-block customization without rewriting the class:

```css
/* Override max-width, alignment, or text-wrap on a specific block */
.heading-lg {
	--max-width-heading-lg: 600px;
	--align-heading-lg: center;
	--text-wrap-heading-lg: balance;
}
```

### Container Dark Theme

All utility classes switch colors automatically inside a dark container:

```css
@container style(--theme: dark) {
	color: var(--colour-text-heading-light);
}
```

No media queries or body classes needed. Set `--theme: dark` on any ancestor.

## Design Tokens

Always use custom properties from `:root` instead of hardcoded values:

```css
/* Spacing */
gap: var(--spacing-24);
padding: var(--spacing-16);

/* Colors (prefer semantic aliases over raw swatches) */
color: var(--colour-text-heading-default);
color: var(--colour-text-body-default);
background: var(--colour-brand-light);
```

### Spacing Scale

Defined in `client/css/tokens/base-spacing.css`:

`--spacing-1` (1px) through `--spacing-320` (320px). Common values: 4, 8, 16, 20, 24, 32, 40, 48, 64, 80.

### Color Swatches

Defined in `client/css/tokens/base-swatch.css`:

- `--colour-primary-100` through `--colour-primary-900` (blues)
- `--colour-secondary-100` through `--colour-secondary-900` (cyans)
- `--colour-neutral-100` through `--colour-neutral-900` (grays)
- `--colour-accent-1-*` (pink) and `--colour-accent-2-*` (gold)
- `--colour-brand-dark` / `--colour-brand-light` (legacy aliases)

### Other Aliases

Defined in `client/css/tokens/theme.css`:

```css
/* Surfaces */
--surface-white, --surface-dark, --surface-grey

/* Borders */
--border-primary, --border-secondary, --border-card, --border-grey

/* Radius */
--radius-minimal (4px), --radius-standard (8px), --radius-card (24px), --radius-pill (9999px)

/* Sizing */
--sizing-width-site: 1440px;
--sizing-width-content: 1200px;
```

## Block CSS Pattern

Prefer typography utility classes over manual font-size/weight declarations:

```css
.card-simple {
	display: grid;
	gap: var(--spacing-24);

	.title {
		/* Use utility class in Twig, or extend with tokens */
		color: var(--colour-text-heading-default);
		/* Avoid: font-size: 24px; font-weight: 600; */
		/* Instead, apply .heading-sm in the Twig template */
	}

	.body {
		color: var(--colour-text-body-default);
		text-wrap: pretty;
		/* Apply .body-md in the Twig template */
	}
}
```

## Gotcha: CSS Relative Color Syntax

Production build uses cssnano with `calc: false` to preserve CSS Relative Color Syntax:

```css
/* This works in production */
background: oklch(from var(--bg) calc(l - 0.02) c h);
```

Never enable cssnano's calc optimization — it breaks `oklch(from ... calc(...))`.

## Font URLs

The webpack CSS loader is configured to skip font file URL rewriting. Do not use relative `url()` paths in `@font-face` — use absolute paths or the fonts will break.
