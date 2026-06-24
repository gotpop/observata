# Observata Theme

Custom WordPress theme using Gutenberg blocks with Timber/Twig server-side rendering.

## Stack

- **Timber 2.x** — Twig templating for PHP
- **Twig 3.x** — template engine for all block + page rendering
- **@wordpress/scripts** — block build tooling (webpack)
- **Three.js + Shaders** — WebGPU/WebGL hero shader effects
- No `theme.json` — all styling is hand-written CSS with custom properties

## Architecture

All blocks are **server-rendered via Twig** (not PHP `render.php`). The render pipeline:

```
WP block editor (React/JSX edit components)
        ↓ saved as block markup in post_content
WordPress do_blocks() → observata_render_block_twig()
        ↓ merges Timber::context() + block attributes
Twig template (.twig) → server-rendered HTML
```

### Block Types

| Prefix     | Purpose                            | Example                            |
| ---------- | ---------------------------------- | ---------------------------------- |
| `section-` | Full-page sections                 | `section-hero-home`, `section-cta` |
| `card-`    | Reusable content cards             | `card-simple`, `card-geo`          |
| `grid-`    | Layout grids wrapping child blocks | `grid-cards-simple`                |
| `element-` | Small text/layout elements         | `element-body-md`                  |

Each block directory contains:

```
blocks/<block-name>/
  block.json          # Metadata, attributes, styles
  <block-name>.twig   # Server-side Twig template
  <block-name>.css    # Frontend-only styles (viewStyle)
  editor.css          # Editor-only styles (optional)
```

### Template Resolution

Timber is configured with three loader paths (`inc/theme-setup.php`):

1. Theme root — `{% include 'blocks/...' %}`
2. `blocks/` — `{% include 'card-simple/card-simple.twig' %}`
3. `views/` — `{% include 'partials/header-default.twig' %}`

Page-level templates live in `views/templates/`, extending `views/base.twig`.

### PHP Modules (`inc/`)

| File                     | Responsibility                                                    |
| ------------------------ | ----------------------------------------------------------------- |
| `theme-setup.php`        | Timber init, menus, theme supports                                |
| `enqueue-assets.php`     | CSS inlining (SCRIPT_DEBUG gated), script deferral, font preloads |
| `block-renderer.php`     | Twig render callback, inner block serialization, context builders |
| `blocks.php`             | Block auto-discovery + registration, webpack runtime enqueue      |
| `twig-filters.php`       | Custom Twig filters (`strip_html`)                                |
| `seo.php`                | Sitemap, robots.txt, canonical URLs                               |
| `analytics.php`          | GA4, Leadfeeder, Cookiebot settings                               |
| `schema-markup.php`      | Schema.org itemscope/itemprop                                     |
| `speculation-rules.php`  | Chrome navigation prefetch                                        |
| `content-filters.php`    | Title filters, read-more links                                    |
| `device-detection.php`   | UA-based HTML classes                                             |
| `image-optimization.php` | WebP MIME, disables intermediate sizes                            |

### Design Token System (3-Tier)

No `theme.json` — all styling uses hand-written CSS with a 3-tier custom property system:

| Tier                | Location                                 | Purpose                                                                         |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| **Utility classes** | `client/css/global/typography-scale.css` | Ready-to-use classes (`.heading-hero`, `.heading-lg`, `.body-md`, etc.)         |
| **Theme tokens**    | `client/css/tokens/theme-*.css`          | Semantic aliases (`--size-heading-lg`, `--colour-text-heading-default`)         |
| **Base tokens**     | `client/css/tokens/base-*.css`           | Raw primitives (`--typography-size-32`, `--colour-neutral-800`, `--spacing-24`) |

Prefer utility classes in Twig templates, theme tokens in block CSS, and avoid base tokens directly.

## Development

```bash
npm run start        # webpack watch mode (blocks + client JS + global CSS)
npm run build        # production build
npm run build:zip    # build + create distributable zip in dist/
```

### Dev Mode

Set in `wp-config.php`:

```php
define( 'SCRIPT_DEBUG', true );
```

This switches CSS from inlined `<style>` to standard `<link>` tags, enabling webpack watch-mode hot reloads.

## Linting & Formatting

```bash
# PHP
composer phpcs        # check against WordPress Coding Standards
composer phpcbf       # auto-fix
composer fix          # alias for phpcbf

# JS/TS & CSS
npm run lint:ts       # eslint on src/ and client/
npm run lint:css      # stylelint on all .css
npm run lint          # all of the above

# Format
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

### VS Code Task

`PHPCS Fix` (default build task) — runs phpcbf on the current file.
