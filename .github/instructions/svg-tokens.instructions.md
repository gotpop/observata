---
description: 'SVG sphere token system — no inline fill/stroke-width, use CSS classes driven by design tokens'
applyTo:
  - 'views/graphics/spheres/**'
---

# SVG Sphere Token System

All decorative sphere SVGs in `views/graphics/spheres/` are styled via **CSS design tokens + class names**, never inline presentation attributes.

## Why Not Inline Attributes?

SVG presentation attributes (`fill="…"`, `stroke-width="…"`) **cannot use `var()`**. To make spheres themeable via design tokens, values must be applied through CSS rules targeting class names.

## The Three Tokens

Defined in `client/css/tokens-theme/theme-svg.css`:

| Token                        | Default | Controls                              |
| ---------------------------- | ------- | ------------------------------------- |
| `--surface-sphere`           | `none`  | Fill on `.background` and `.triangle` |
| `--stroke-sphere-background` | `1px`   | Stroke width on `.background` circle  |
| `--stroke-sphere-line`       | `0.6px` | Stroke width on `.line`, `.line-back` |

## Class → Token Mapping

All rules live under `.graphic-sphere-svg` in `client/css/global/graphic.css` — **one shared rule set, no per-sphere overrides**:

```css
.graphic-sphere-svg {
	.background {
		fill: var(--surface-sphere);
		stroke-width: var(--stroke-sphere-background);
	}
	.line,
	.line-back {
		stroke-width: var(--stroke-sphere-line);
	}
	.triangle {
		fill: var(--surface-sphere);
		stroke-width: var(--stroke-sphere-line);
	}
}
```

## Rules When Editing Sphere Twig Files

1. **NEVER add inline `fill` or `stroke-width`** to elements with classes `.background`, `.line`, `.line-back`, or `.triangle`. The CSS handles it.
2. Elements **must** have the correct class name for token styling to apply.
3. The `<svg>` root (or a parent wrapper) must have the class `graphic-sphere-svg`.
4. `stroke="url(#gradient-id)"` is fine to keep inline — gradients are sphere-specific.
5. `fill="none"` on `<g>` groups is fine — it's a structural default, not a token-driven value.

## Exception: `sphere-dots-connected.twig`

This sphere has unique elements (gradient-filled circles, connecting lines) and keeps its own inline values. Do not strip inline attributes from this file unless explicitly asked.

## Common Mistakes

- **Adding `fill="none"` to a `.background` circle** — the CSS sets `fill: var(--surface-sphere)` which defaults to `none`. Inline attributes override CSS, so this is redundant but harmless. Still, remove it for cleanliness.
- **Adding `stroke-width="1"` to a `.background` circle** — this overrides the token. Remove it.
- **Forgetting the closing `>`** when stripping attributes from a multi-line tag — always verify the tag is still valid XML after edits.
