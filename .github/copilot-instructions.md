# Observata Theme — Copilot Instructions

## Project Overview

WordPress theme using Gutenberg blocks with **Timber/Twig server-side rendering**.
All frontend HTML is rendered through Twig templates — not PHP render callbacks.

## Architecture

- **Blocks are server-rendered**: Each block has a `.twig` template that receives `attributes` and `content` from `observata_render_block_twig()` in `inc/block-renderer.php`.
- **Editor components**: JSX `edit.jsx` files in `src/` provide the block editor UI. `save.jsx` always returns `null` (Twig handles output).
- **No `theme.json`**: All styles are hand-written CSS with custom properties. WP global styles are stripped.
- **Timber loader paths**: Theme root, `blocks/`, and `views/` — templates can be included by relative path.

## Block Conventions

- **Prefixes**: `section-`, `card-`, `grid-`, `element-` — name directories accordingly
- **Attribute naming**: camelCase in `block.json`, snake_case in Twig (convert manually)
- **Text escaping**: Always use `|strip_html` on user-entered text fields
- **URLs**: Always use `|esc_url` on URL attributes
- **CSS**: Use CSS nesting (native), scope under the block's class, use design tokens (`var(--spacing-24)`, `var(--colour-text-heading-default)`)
- **Registration**: Auto-discovered via `inc/blocks.php` — never manually register

## Twig Gotchas

- **Never use `=>` in Twig files** — it gets corrupted by the toolchain. Rephrase comments or use alternative syntax.
- Use `{% set var = attributes.fieldName|default('') %}` to extract attributes
- Use `{% include %}` for partials — paths resolve from theme root, `blocks/`, or `views/`
- Inner blocks rendered via `{{ renderedInnerBlocks.slotName|raw }}` (pre-rendered in PHP)

## Build Pipeline

- **Webpack** (`webpack.config.js`): Multiple entry points — `client` (frontend JS), `home`, `style-global` (CSS), `unsplash-sidebar`, plus default WP block entries
- **Runtime chunk**: `build/runtime.js` is the webpack bootstrap — must be enqueued for blocks to load in the editor
- **Vendor chunk**: Three.js + shaders extracted to `build/vendors.js` (lazy-loaded)
- **CSS**: cssnano `calc` disabled in production to preserve CSS Relative Color Syntax (`oklch(from ...)`)
- **Font URLs**: CSS loader configured to skip font file URL rewriting

## Asset Strategy

- **Production**: Global CSS inlined into `<head>` via `wp_head` hook (no render-blocking request)
- **Dev** (`SCRIPT_DEBUG = true`): Standard `<link>` tags for hot reload
- **Scripts**: All deferred via `wp_script_add_data($handle, 'strategy', 'defer')` — must be applied consistently across dependency chains or WP strips defer
- **Removed**: wp-block-library, classic-theme-styles, global-styles (no theme.json)

## Commands

```bash
npm run start        # webpack watch
npm run build        # production build
npm run build:zip    # build + dist zip
npm run lint         # eslint + stylelint
npm run format       # prettier
composer fix         # phpcbf auto-fix
```

## File Locations

| What                 | Where                                        |
| -------------------- | -------------------------------------------- |
| Block Twig templates | `blocks/<name>/<name>.twig`                  |
| Block styles         | `blocks/<name>/<name>.css`                   |
| Editor components    | `src/<name>/edit.jsx`, `src/<name>/save.jsx` |
| Page templates       | `views/templates/*.twig`                     |
| Base layout          | `views/base.twig`                            |
| Partials             | `views/partials/`                            |
| Icons                | `views/icons/` (geo/, lucide/, logos/)       |
| PHP modules          | `inc/*.php`                                  |
| Frontend JS          | `client/ts/`                                 |
| Global CSS           | `client/css/`                                |
| Build output         | `build/`                                     |

## Key Patterns

### Attribute extraction in Twig

```twig
{% set title = attributes.title|default('') %}
{% set read_more_url = attributes.readMoreUrl|default('#') %}
```

### Icon includes

```twig
{% include 'icons/geo/' ~ icon_geo ~ '.twig' %}
{% include 'icons/lucide/arrow-right.twig' %}
```

### Block context (available in all templates)

- `attributes` — block attributes from block.json
- `content` — pre-rendered inner blocks
- `block` — WP block object
- `theme_url` — template directory URI
- `site` — Timber site object
- `renderedInnerBlocks` — named inner block slots (use `|raw`)
