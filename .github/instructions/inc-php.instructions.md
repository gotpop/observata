---
description: 'Code organisation and style conventions for PHP modules in inc/'
applyTo:
  - '**/inc/*.php'
---

# inc/ PHP Module Conventions

These conventions apply to all files in `inc/`. Follow these on top of the
general [PHP guidelines](php.instructions.md).

## File organisation

Each file handles **one concern**. Hooks (`add_action`/`add_filter`) go at
the top after the file header docblock. Function definitions follow below.

```php
<?php
/**
 * File header — what this module does.
 */

add_action( 'after_setup_theme', 'observata_setup' );
add_filter( 'body_class', 'observata_clean_body_class', 10, 2 );

// ─────────────────────────────────────────────────────────────────

// Theme setup: supports, menus, text domain.
function observata_setup(): void {
    // ...
}

// Strip verbose WordPress body classes.
function observata_clean_body_class( array $classes, array|string $class ): array {
    // ...
}
```

- **Hooks at top**: All `add_action`/`add_filter` calls grouped together
  immediately after the header docblock.
- **One divider line**: `// ───` separates hooks from function definitions.
  No other ASCII dividers elsewhere in the file.
- **Comments on functions, not hooks**: Each function gets a one-line `//`
  comment above it describing its purpose. The hooks block at the top has
  no per-line comments — the function comments carry the meaning.

## Section dividers

When a file has logical groups of hooks (e.g., WordPress defaults removal
vs. theme hooks), use named section dividers:

```php
// ── Remove WordPress defaults ───────────────────────────────────

remove_action( ... );
add_filter( 'emoji_svg_url', '__return_false' );

// ── Theme hooks ─────────────────────────────────────────────────

add_action( 'wp_head', 'observata_preload_fonts', 1 );
add_action( 'wp_enqueue_scripts', 'observata_enqueue' );
```

## Named functions vs. inline closures

- **Default to named functions**. Every hook callback should be a named
  `observata_`-prefixed function.
- **Inline closures only** when the callback is small (≤ 5 lines), tightly
  coupled to its registration context, and naming it would add noise.
  Example: an `admin_enqueue_scripts` closure inside `init` that depends
  on `wp-blocks` being available.

## Comments

- **File header**: One `/** */` docblock explaining the module's purpose.
  The only multi-line comment allowed in the file.
- **Function comments**: One `//` line above each function.
- **Inline comments**: Keep them short, state why not what. No block comments
  (`/* */`), no `/** */` on functions.

## No redundant docblocks

Native PHP types (`: void`, `: array`, `: bool`) document the signature.
Do not add `@param` or `@return` tags unless the type alone doesn't tell
the full story (e.g., two similar-typed params with distinct meanings).

## Spacing

- One blank line between the header docblock and the hooks block.
- One blank line between the divider and the first function.
- Two blank lines between functions.
- One blank line before `return` and `if` blocks inside functions.

## Naming

- All functions prefixed with `observata_`.
- Hook callback names should hint at the hook they serve:
  `observata_twig_cache_options` (for `timber/twig/environment/options`),
  `observata_sitemap_exclude_pages` (for `wp_sitemaps_posts_query_args`).
