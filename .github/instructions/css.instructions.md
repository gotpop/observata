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

## Design Tokens

Always use custom properties from `:root` instead of hardcoded values:

```css
/* Spacing */
gap: var(--spacing-24);
padding: var(--spacing-16);

/* Colors */
color: var(--colour-text-heading-default);
color: var(--colour-text-body-default);
background: var(--colour-brand-light);

/* Typography */
font-size: var(--size-body-md);
font-weight: var(--typography-weight-semi);
```

## Block CSS Pattern

```css
.card-simple {
	display: grid;
	gap: var(--spacing-24);

	.title {
		color: var(--colour-text-heading-default);
		font-size: 24px;
		font-weight: 600;
		line-height: 120%;
	}

	.body {
		color: var(--colour-text-body-default);
		text-wrap: pretty;
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
