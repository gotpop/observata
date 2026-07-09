---
description: 'PHP coding standards and WordPress block architecture patterns'
applyTo:
  - '**/*.php'
---

# PHP Guidelines

## Versions

- **Timber**: ^2.0 (currently `v2.4.0`) — server-side Twig rendering for WordPress
- **Twig**: `v3.x` (currently `v3.24.0`, bundled via Timber)
- PHP 8.1+ required

## Coding Standards

Follow WordPress Coding Standards (WPCS). Run `composer fix` to auto-fix.

- Use tabs for indentation
- snake_case for functions and variables
- Prefix all functions with `observata_`
- Use `wp_` functions (not raw PHP) for escaping, DB, etc.

### Type safety

All functions must have **parameter types** and **return types** — no untyped signatures.

```php
// ✓ Good
function observata_build_breadcrumbs(): array { ... }
function observata_add_menu_context( string $template_name, array &$context ): void { ... }

// ✗ Bad
function observata_build_breadcrumbs() { ... }
function observata_add_menu_context( $template_name, &$context ) { ... }
```

Run `composer phpstan` to type-check. CI fails PRs that break types (`.github/workflows/phpstan.yml`, level 5). Treat PHPStan errors like `tsc` errors — fix the code, don't suppress.

### Comments

- **File header**: One `/** */` docblock per file explaining its purpose. The only multi-line comment allowed.
- **Everything else**: `//` single-line comments only. No `/** */` on functions.
- Keep comments minimal — state why, not what.

### Spacing

Blank line before `return` and `if` statements inside functions. No blank line between `{` and the first statement.

```php
function example( string $value ): string {
    $result = do_something( $value );

    if ( ! $result ) {
        return '';
    }

    return $result;
}
```

### File organization

Each file does **one thing**. Hooks (`add_action`/`add_filter`) go at the top after the header docblock. Function definitions follow below.

```php
<?php
/**
 * File header — what this module does.
 */

add_action( 'hook', 'observata_callback', 10 );

function observata_callback(): void {
    // ...
}
```

No ASCII-art section dividers (`// ───`). No standalone `analytics.php` index files — each integration gets its own file.

## Block Registration

Blocks are auto-discovered in `inc/blocks.php`. Never manually call `register_block_type`. Adding a `block.json` file in `blocks/` is sufficient.

### Render Callback

`observata_render_block_twig()` in `inc/block-renderer.php` is the main render callback. Utility functions (split, serialize, template map) live in `inc/block-helpers.php`.

The render callback delegates context injection to focused helper functions in the same file:

```php
observata_add_menu_context( $template_name, $context );          // header/footer menus
observata_add_post_context( $template_name, $attributes, $context ); // blog posts + pagination
observata_add_breadcrumb_context( $template_name, $attributes, $context ); // breadcrumbs
observata_render_inner_blocks( $attributes, $context );          // InnerBlocks auto-render
```

Each helper receives `$context` by reference (`&$context`). Add new block-specific context data by adding a new helper function following the same pattern.

## Module Organization

All PHP lives in `inc/` and is loaded via `functions.php`. Each file handles **one concern**:

| File                        | Concern                                                       |
| --------------------------- | ------------------------------------------------------------- |
| `block-helpers.php`         | Block utility functions (split hero, serialize, template map) |
| `block-renderer.php`        | Render callback + context injection helpers                   |
| `blocks.php`                | Block registration, editor runtime, allowed blocks            |
| `enqueue-assets.php`        | Asset enqueuing, CSS inlining, font preloading                |
| `theme-setup.php`           | Timber config, theme supports, body classes, env helpers      |
| `analytics-ga4.php`         | GA4 registration + output                                     |
| `analytics-leadfeeder.php`  | Leadfeeder registration + output                              |
| `analytics-cookiebot.php`   | CookieBot registration + output                               |
| `theme-settings.php`        | Settings page + sections                                      |
| `theme-settings-footer.php` | Footer content fields                                         |

## Type Checking (PHPStan)

```bash
composer phpstan          # level 5 — catches type errors, wrong arg counts, undefined functions
```

Config in `phpstan.neon`. CI runs on every PR — fails if types break. Level 5 catches all critical issues without requiring `@param array<...>` annotations on every iterable.

## Environment Flags

The constant `WP_ENVIRONMENT` is defined in `wp-config.php`:

| Value        | Twig Cache         | CSS Inlining          | Notes                               |
| ------------ | ------------------ | --------------------- | ----------------------------------- |
| `production` | ON (`cache/twig/`) | ON (`wp_head` inline) | Full performance optimisations      |
| `staging`    | OFF (hot reload)   | OFF (`SCRIPT_DEBUG`)  | Test changes without flushing cache |
| (undefined)  | OFF (hot reload)   | OFF (`SCRIPT_DEBUG`)  | Local development default           |

- **Twig compilation cache** (`inc/theme-setup.php`): Gated by `WP_ENVIRONMENT === 'production'`. Caches compiled PHP templates with `auto_reload => true` — no manual flush needed.
- **CSS inlining** (`inc/enqueue-assets.php`): Controlled by `SCRIPT_DEBUG` constant (separate from `WP_ENVIRONMENT`).
- Never enable output caching (`$expires` param in `Timber::compile()`) for block rendering — blocks contain dynamic data and per-instance attributes that make output caching unsafe without per-block TTL management.
