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

### How to Sync — Automated Pipeline

Syncing is handled by `tools/sync-sphere-svgs.js`. **Always use the script** — never manually edit `.svg` exports.

**Commands:**

| Command                   | Purpose                                                      |
| ------------------------- | ------------------------------------------------------------ |
| `npm run sync:svgs`       | Regenerate all `.svg` exports from Twig files                |
| `npm run sync:svgs:check` | Verify sync without writing (CI-safe, exits `1` on mismatch) |

**Workflow after editing a Twig file:**

1. Save your changes to the `.twig` file in `views/graphics/spheres/`
2. Run `npm run sync:svgs` to regenerate the matching `.svg` export
3. Commit both files together

**What the script does:**

1. Reads every `*.twig` file in `views/graphics/spheres/`
2. Extracts the inner `<svg>…</svg>` markup (strips the `<graphic-sphere>` wrapper)
3. Dedents by one tab level (removes the wrapper's indentation)
4. Prepends `<?xml ?>` declaration
5. Writes to `assets/svg/spheres/<sphere-name>.svg`
6. Prints element counts (svg/path/circle/g) for visual verification

**Sync rules:**

- The `.svg` files are **standalone references** — they keep inline `fill`, `stroke`, and `stroke-width` attributes because they don't load the theme's CSS token system.
- Do **not** sync changes that only affect CSS animation/transition rules in `.css` files — those are stylesheet concerns, not SVG structure.
- Do **not** manually edit `.svg` exports — the script overwrites them.

## Exception: `sphere-dots-connected.twig`

This sphere has unique elements (gradient-filled circles, connecting lines) and keeps its own inline values. Do not strip inline attributes from this file unless explicitly asked.

## Common Mistakes

- **Adding `fill="none"` to a `.background` circle** — the CSS sets `fill: var(--surface-sphere)` which defaults to `none`. Inline attributes override CSS, so this is redundant but harmless. Still, remove it for cleanliness.
- **Adding `stroke-width="1"` to a `.background` circle** — this overrides the token. Remove it.
- **Forgetting the closing `>`** when stripping attributes from a multi-line tag — always verify the tag is still valid XML after edits.
- **Editing only the Twig file without syncing the `.svg`** — the two must stay in sync (see Twig ↔ SVG Sync above).
