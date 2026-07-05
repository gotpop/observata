---
description: 'SVG sphere system — token styling, twig-to-svg sync, and editing rules'
applyTo:
  - 'views/graphics/spheres/**'
  - 'assets/svg/spheres/**'
---

# SVG Sphere System

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

## Twig ↔ SVG Sync

`assets/svg/spheres/` must **always** stay in sync with `views/graphics/spheres/`.

### When to Sync

After **any** change to a sphere Twig file's wrapper structure — including:

- Adding or removing SVG elements (paths, circles, groups, gradients)
- Changing the `<graphic-sphere>` wrapper, `<svg>` root, `<defs>`, or `<g>` group structure
- Adding/removing classes or IDs on wrapper elements
- Changing the `viewBox`, gradient IDs, or gradient definitions

### How to Sync

1. Render the Twig file to plain SVG markup (strip the `<graphic-sphere>` wrapper, Timber/Twig tags, and any `{% include %}` directives — keep only the inner `<svg>…</svg>`).
2. Save the result as `assets/svg/spheres/<sphere-name>.svg` (same filename stem as the Twig file).
3. Keep inline `fill`, `stroke`, and `stroke-width` attributes in the `.svg` export — the `.svg` file is a standalone reference, not a token-driven template. It does not load the theme's CSS.
4. Do **not** sync changes that only affect CSS animation/transition rules in `.css` files — those are stylesheet concerns, not SVG structure.

### Sync Checklist

For each Twig file in `views/graphics/spheres/`:

- [ ] A matching `.svg` file exists in `assets/svg/spheres/`
- [ ] The `<svg>` root, `viewBox`, and `xmlns` attributes match
- [ ] All `<path>`, `<circle>`, `<g>` elements match (count and `d`/`cx`/`cy`/`r` values)
- [ ] Gradient `<defs>` match (`id`, `gradientUnits`, `cx`/`cy`/`r`, stop colors/offsets)
- [ ] Class names on wrapper groups match (`graphic-sphere-svg`, `dots`, `line`, etc.)

## Exception: `sphere-dots-connected.twig`

This sphere has unique elements (gradient-filled circles, connecting lines) and keeps its own inline values. Do not strip inline attributes from this file unless explicitly asked.

## Common Mistakes

- **Adding `fill="none"` to a `.background` circle** — the CSS sets `fill: var(--surface-sphere)` which defaults to `none`. Inline attributes override CSS, so this is redundant but harmless. Still, remove it for cleanliness.
- **Adding `stroke-width="1"` to a `.background` circle** — this overrides the token. Remove it.
- **Forgetting the closing `>`** when stripping attributes from a multi-line tag — always verify the tag is still valid XML after edits.
- **Editing only the Twig file without syncing the `.svg`** — the two must stay in sync (see Twig ↔ SVG Sync above).
