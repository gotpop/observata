---
description: 'Geo icon standards — structure, styling, and editing rules for views/icons/geo/'
applyTo:
  - 'views/icons/geo/**'
  - 'assets/svg/icons/geo/**'
---

# Geo Icon Standards

29 numbered icons (`01.twig`–`29.twig`) rendered inside `<icon-geo>` wrappers.

## File layout

| Variant  | ViewBox | Class                       | Use                                |
| -------- | ------- | --------------------------- | ---------------------------------- |
| Standard | 34×34   | `icon-geo`                  | `card-geo-list`                    |
| Medium   | 32×32   | `icon-geo icon-geo--medium` | All other cards (canonical export) |
| Large    | 54×54   | `icon-geo icon-geo--large`  | `card-geo`                         |

- `views/icons/geo/circles/` — standard (01, 04, 06, 11, 12, 15, 17, 18, 19, 20, 22, 23, 24, 27)
- `views/icons/geo/circles/medium/` — medium 32×32
- `views/icons/geo/circles/large/` — large 54×54
- `views/icons/geo/squares/` — standard (02, 03, 05, 07, 08, 09, 10, 13, 14, 16, 21, 25, 26, 28, 29)
- `views/icons/geo/squares/medium/` — medium 32×32
- `views/icons/geo/squares/large/` — large 54×54, geometry fits within 40×40 centred
- `assets/svg/icons/geo/` — flat export, exports **medium** variants (sync tool prefers `medium/`)

## Block includes

Block templates use array fallback syntax so both subdirectories are searched:

```twig
{% include ['icons/geo/squares/' ~ icon_geo ~ '.twig', 'icons/geo/circles/' ~ icon_geo ~ '.twig'] %}
```

This keeps the `icon_geo` attribute stable — moving icons between folders does not require re-saving content.

## Wrapper & Root

```xml
<icon-geo class="icon-geo" aria-hidden="true">
	<svg width="100%" height="100%" viewBox="0 0 34 34">
		...
	</svg>
</icon-geo>
```

- **No** `fill="none"` on `<svg>` — removed.
- **No** `stroke-miterlimit` — removed.
- Icons fill the 34×34 viewBox edge-to-edge.
- Large variants (54×54 viewBox): squares fit within 40×40 centred, circles fill edge-to-edge.

### Optical exceptions

**Icon 26** (large): Grid lines extending beyond the main square create extra visual weight.
The square portion is optically reduced to ~36 span (from the standard 40) so it feels balanced
alongside other icons. Adjust with uniform scale around centre (27, 27).

## Group Structure

Every icon has at most two top-level groups directly inside `<svg>`, never nested:

```xml
<g id="lines-XX">        <!-- only if the icon has stroked paths -->
	...
</g>
<g id="circles-XX">      <!-- only if the icon has filled circles -->
	...
</g>
```

- `XX` is the zero-padded icon number (e.g. `lines-02`, `circles-15`).
- Groups use `id`, never `class`.
- No numbered wrapper groups (`<g id="02">`), no `Icon` groups — these have been removed.
- No `clip-path` or `<defs>` blocks — content is sized to fit without clipping.

## Lines

```xml
<path class="line" d="..." stroke="var(--geo-stroke, #0598CE)" stroke-width="var(--geo-stroke-width, 0.9)" stroke-linecap="var(--geo-stroke-linecap, round)"/>
```

- Every line path has exactly `class="line"` — no `id` attributes.
- All styling uses CSS custom properties with fallback defaults matching the original values.
- `stroke-linecap`: always `round` via the variable.
- Lines connect edge-to-edge between circles (or between circle edges and viewBox boundaries).
- Lines must not overshoot past intersections — endpoints stop exactly at circle edges or line junctions.
- Internal lines stay within the outer shape boundaries.

## Circles

```xml
<circle class="circle" cx="..." cy="..." r="2.247" fill="var(--geo-fill, #113768)"/>
```

- Every circle has exactly `class="circle"` — no `id` attributes.
- **Uniform radius**: `r="2.247"` on every circle across all 30 icons.
- Circles are native `<circle>` elements — bezier path approximations have been replaced.
- Circle centers sit exactly on line intersection points.
- Circle edges sit flush with viewBox edges where an icon touches the boundary (never cropped).

## CSS Variables

| Variable               | Fallback  | Applies to            |
| ---------------------- | --------- | --------------------- |
| `--geo-stroke`         | `#0598CE` | Line `stroke`         |
| `--geo-stroke-width`   | `0.9`     | Line `stroke-width`   |
| `--geo-stroke-linecap` | `round`   | Line `stroke-linecap` |
| `--geo-fill`           | `#113768` | Circle `fill`         |

Defined in `client/css/tokens-theme/theme-svg.css`. The fallbacks ensure standalone SVGs render correctly.

## Symmetry & Centering

- All icons are centred at (17, 17) in the 34×34 viewBox.
- Elements mirror perfectly across the X=17 and Y=17 axes where the design is symmetric.
- Line endpoints share exact coordinates at intersections — no floating-point drift (e.g. `7.284` not `7.2839`).
- Spacing is uniform: steps/vertices are evenly distributed along their axis/diagonal.

## Editing Workflow

1. Edit the `.twig` file in `views/icons/geo/`
2. Run `npm run sync:icons` to regenerate `assets/svg/icons/geo/*.svg`
3. Run `npm run sync:icons:check` to verify
4. Commit both `.twig` and `.svg` together

**Never** manually edit the `.svg` exports.

## Tooling

| Tool                      | Purpose                                                                       |
| ------------------------- | ----------------------------------------------------------------------------- |
| `tools/sync-icon-svgs.js` | Twig → SVG sync (adds `xmlns`, strips `<icon-geo>` wrapper)                   |
| `tools/resize-icon.js`    | Scale icon content to fill viewBox, preserving circle radius and stroke-width |
| `tools/circlify-icons.js` | Convert bezier circle paths to `<circle>` elements with uniform radius        |

Run `node tools/<script>.js --help` or read the script header for usage.
