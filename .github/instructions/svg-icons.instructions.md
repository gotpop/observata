---
description: 'SVG icon system — twig-to-svg sync and editing rules'
applyTo:
  - 'views/icons/**'
  - 'assets/svg/icons/**'
---

# SVG Icon System

All icons in `views/icons/` are Twig templates with custom-element wrappers that render as inline SVGs on the frontend. Each category has its own wrapper element:

| Category | Wrapper element   | Subdirectory            | Count | Standards                                              |
| -------- | ----------------- | ----------------------- | ----- | ------------------------------------------------------ |
| Geo      | `<icon-geo>`      | `views/icons/geo/`      | 30    | [geo-icons.instructions.md](geo-icons.instructions.md) |
| Lucide   | `<icon-lucide>`   | `views/icons/lucide/`   | 7     | Below                                                  |
| Platform | `<icon-platform>` | `views/icons/platform/` | 2     | Below                                                  |

## Twig ↔ SVG Sync

`assets/svg/icons/` must **always** stay in sync with `views/icons/`.

### When to Sync

After **any** change to an icon Twig file's SVG structure — including:

- Adding or removing SVG elements (paths, circles, groups, defs)
- Changing the wrapper element, `<svg>` root attributes, `viewBox`, or dimensions
- Adding/removing classes or IDs
- Changing gradient or clip-path definitions

### How to Sync — Automated Pipeline

Syncing is handled by `tools/sync-icon-svgs.js`. **Always use the script** — never manually edit `.svg` exports.

**Commands:**

| Command                    | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `npm run sync:icons`       | Regenerate all `.svg` exports from Twig files                |
| `npm run sync:icons:check` | Verify sync without writing (CI-safe, exits `1` on mismatch) |

**Workflow after editing a Twig file:**

1. Save your changes to the `.twig` file in `views/icons/<category>/`
2. Run `npm run sync:icons` to regenerate the matching `.svg` export
3. Commit both files together

**What the script does:**

1. Reads every `*.twig` file in `views/icons/{geo,lucide,platform}/`
2. Extracts the inner `<svg>…</svg>` markup (strips the `<icon-*>` wrapper)
3. Dedents by one tab level (removes the wrapper's indentation)
4. Prepends `<?xml ?>` declaration and adds `xmlns` for standalone rendering
5. Writes to `assets/svg/icons/<category>/<icon-name>.svg`
6. Prints element counts (svg/path/circle/rect/g/defs) for visual verification

**Sync rules:**

- The `.svg` files are **standalone references** — they keep inline attributes because they don't load the theme's CSS.
- Do **not** manually edit `.svg` exports — the script overwrites them.
- Do **not** sync changes that only affect CSS animation/transition rules — those are stylesheet concerns, not SVG structure.

## Editing Conventions

### Geo icons

See [geo-icons.instructions.md](geo-icons.instructions.md) for the full geo icon standard.

### Lucide icons (`views/icons/lucide/`)

- Named by kebab-case (e.g. `arrow-right.twig`, `chevron-down.twig`)
- Use `<icon-lucide class="icon icon-lucide icon-lucide-NAME">` wrapper
- Use `stroke="currentColor"` so they inherit text colour
- Common attributes: `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`
- Typically 16×16 or 24×24 viewport

### Platform icons (`views/icons/platform/`)

- Named by kebab-case (e.g. `increase.twig`, `stack.twig`)
- Use `<icon-platform class="icon-platform">` wrapper
- 28×28px viewport
