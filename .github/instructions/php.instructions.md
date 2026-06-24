---
description: 'PHP coding standards and WordPress block architecture patterns'
applyTo:
  - '**/*.php'
---

# PHP Guidelines

## Coding Standards

Follow WordPress Coding Standards (WPCS). Run `composer fix` to auto-fix.

- Use tabs for indentation
- snake_case for functions and variables
- Prefix all functions with `observata_`
- Use `wp_` functions (not raw PHP) for escaping, DB, etc.

## Block Registration

Blocks are auto-discovered in `inc/blocks.php`. Never manually call `register_block_type`. Adding a `block.json` file in `blocks/` is sufficient.

### Render Callback

`observata_render_block_twig()` in `inc/block-renderer.php` handles all Twig-based blocks. It:

1. Strips `observata/` prefix to find the template name
2. Looks up the Twig file via `observata_get_template_map()`
3. Runs `do_blocks()` on inner content
4. Merges `Timber::context()` with block-specific data
5. Calls `Timber::compile()` (returns string, does not echo)

## Asset Enqueue Strategy

- **Production**: Global CSS inlined via `wp_head` hook (not `wp_enqueue_style`)
- **Dev** (`SCRIPT_DEBUG`): Standard `<link>` tags
- **Scripts**: All deferred — apply `strategy => defer` to ALL scripts in dependency chain or WP strips it
- **Removed**: wp-block-library, classic-theme-styles, global-styles

## Adding Block Context Data

Add conditionals in `observata_render_block_twig()` for block-specific data:

```php
if ( $template_name === 'section-your-block' ) {
	$context['custom_data'] = get_custom_data();
}
```

## Module Organization

All PHP lives in `inc/` and is loaded via `functions.php`. Each file handles one concern. Follow existing naming: `enqueue-assets.php`, `block-renderer.php`, `twig-filters.php`, etc.
