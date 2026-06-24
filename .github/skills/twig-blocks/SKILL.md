---
name: twig-blocks
description: 'Use when: implementing or debugging Gutenberg blocks with Twig/Timber, fixing block render issues, troubleshooting Twig template errors, working with inner blocks, adding new block context data, debugging block attributes not appearing, fixing template path resolution, working with renderedInnerBlocks.'
---

# Twig/Timber Block Implementation and Debugging

## How the Render Pipeline Works

```
WP saves block markup in post_content
        |
        v
do_blocks() calls render callback
        |
        v
observata_render_block_twig($attributes, $content, $block)
  in inc/block-renderer.php
        |
        v
1. Strips 'observata/' prefix from block name to get template_name
2. Looks up .twig path in observata_get_template_map() (cached scan)
3. Runs do_blocks($content) to render inner blocks
4. Merges Timber::context() with block-specific data
5. Handles special blocks (header menus, footer menus, blog posts)
6. Auto-renders any attribute ending in 'InnerBlocks'
7. Timber::compile('blocks/<path>.twig', $context)
```

## Available Context in Every Twig Template

| Variable              | Type        | Source                                   |
| --------------------- | ----------- | ---------------------------------------- | ----------------------------------- |
| `attributes`          | array       | Block attributes from block.json         |
| `content`             | string      | Pre-rendered inner blocks (already HTML) |
| `block`               | WP_Block    | Full block object                        |
| `theme_url`           | string      | `get_template_directory_uri()`           |
| `site`                | Timber\Site | Timber site context                      |
| `renderedInnerBlocks` | array       | none                                     | Named inner block slots (see below) |

**Special block context** (added conditionally in `block-renderer.php`):

- `header` block: `main_menu` (Timber menu)
- `footer` block: `footer_1` through `footer_4` (menu arrays)
- `section-blog-posts` block: `posts` (Timber post collection)
- `section-blog-pagination` block: `prev_post`, `next_post`

## Attribute Extraction Pattern

```twig
{# camelCase in block.json becomes snake_case in Twig #}
{% set title = attributes.title|default('') %}
{% set icon_geo = attributes.iconGeo|default('24') %}
{% set read_more_text = attributes.readMoreText|default('Read more') %}
{% set read_more_url = attributes.readMoreUrl|default('#') %}
```

**Always extract to local variables at the top of the template.** This keeps the markup clean and provides defaults.

## Custom Twig Filters

| Filter | PHP function | Use case              |
| ------ | ------------ | --------------------- | -------------------------------------- |
| `      | strip_html`  | `wp_strip_all_tags()` | All user-entered text fields           |
| `      | esc_url`     | `esc_url()`           | All URL attributes                     |
| `      | default('')` | native Twig           | Fallback for missing attributes        |
| `      | raw`         | native Twig           | Pre-escaped HTML (inner blocks, menus) |

## Template Path Resolution

Timber has three loader paths (configured in `inc/theme-setup.php`):

1. **Theme root** — `{% include 'blocks/section-hero-home/section-hero-home.twig' %}`
2. **blocks/ directory** — `{% include 'card-simple/card-simple.twig' %}`
3. **views/ directory** — `{% include 'partials/header-default.twig' %}`

**The render callback always compiles using the full path:**
`Timber::compile('blocks/' . $twig_relative, $context)`

The template map (`observata_get_template_map()`) scans all `.twig` files in `blocks/` recursively and caches a `template_name => relative_path` mapping. When two directories contain the same template basename, it prefers the one where the directory name matches the template name.

## Inner Blocks: Two Patterns

### Pattern 1: Standard InnerBlocks (content variable)

The simplest pattern. The block allows InnerBlocks in the editor, and the rendered output arrives in the `content` variable.

```twig
{# In the Twig template #}
<div class="my-grid">
	{{ content|raw }}
</div>
```

### Pattern 2: Named InnerBlocks Slots (renderedInnerBlocks)

For blocks with multiple named slots (e.g., tabs, multi-column layouts). The block attribute stores an array of child blocks with a key ending in `InnerBlocks` (e.g., `tab1InnerBlocks`). The render callback auto-detects these, serializes them, runs `do_blocks()`, and exposes them in `renderedInnerBlocks`.

```twig
{# renderedInnerBlocks is keyed by the attribute name minus 'InnerBlocks' #}
<div class="tab">
	{{ renderedInnerBlocks.tab1|raw }}
</div>
<div class="tab">
	{{ renderedInnerBlocks.tab2|raw }}
</div>
```

**Always use `|raw` on renderedInnerBlocks** — the HTML is already escaped by `do_blocks()`.

## GOTCHA: Never use `=>` in Twig files

The `=>` character sequence gets corrupted by the toolchain (replaced with `__TWIG_ARROW_FUNC_0__`). This only affects comments and text content, not actual Twig code (which uses `:` for hash syntax). Rephrase comments to avoid `=>`.

## Debugging Guide

### Block renders empty on frontend

1. **Check error log** — `observata_render_block_twig()` logs to `error_log` on failure:
   - `[observata] No twig template found for: <name>` — template map mismatch
   - `[observata] Twig error for <name>: <message>` — Twig syntax/runtime error

2. **Verify the template map** — The `.twig` file must exist inside `blocks/`. Check that the directory name or filename matches the block name (minus `observata/` prefix).

3. **Check for Twig exceptions** — Timber catches exceptions and returns empty string. Inspect PHP error log for the actual error message.

### Block shows "unsupported" in editor

This is the webpack runtime chunk issue (see repo memory). The `build/runtime.js` must be registered and enqueued. Check `inc/blocks.php` for:

- `wp_register_script('observata-runtime', ...)`
- `add_action('enqueue_block_editor_assets', 'observata_enqueue_editor_runtime', 1)`

### Attributes not appearing in template

1. **Check block.json** — The attribute must be declared with the correct `type` and `default`
2. **Check camelCase to snake_case** — `iconGeo` in block.json becomes `icon_geo` in Twig
3. **Check the extraction** — Always use `attributes.fieldName|default('')`, not just `attributes.fieldName`
4. **Check editor save** — The `edit.jsx` must `setAttributes()` and `save.jsx` must return `null`

### Inner blocks not rendering

1. **Pattern 1 (content)** — Ensure the block.json does NOT restrict InnerBlocks, and the Twig template outputs `{{ content|raw }}`
2. **Pattern 2 (renderedInnerBlocks)** — The attribute key must end with `InnerBlocks` (case-sensitive). Check that `edit.jsx` stores child blocks in the correct attribute.

### Template not found

The template map is cached per-request (static variable). If you add a new `.twig` file, it will be found on the next request. If a template is not found:

- Verify the file is named `<block-name>.twig` inside `blocks/<block-name>/`
- Verify the file extension is `.twig` (not `.tpl` or `.html`)
- Check file permissions

### Twig syntax errors

Common mistakes:

- Missing `{% endif %}`, `{% endfor %}`, `{% endblock %}`
- Using `=>` in comments (corrupted by toolchain)
- Using `$variable` instead of `variable` (no PHP sigils in Twig)
- Using `array.key` instead of `array.key` or `attribute(array, 'key')`

### Timber compile vs render

`observata_render_block_twig()` uses `Timber::compile()` (returns string), not `Timber::render()` (echoes). Never call `Timber::render()` inside a block template — it will output before the rest of the page.

## Adding Special Block Context

To add custom context data for a specific block, add a conditional in `observata_render_block_twig()` in `inc/block-renderer.php`:

```php
if ( $template_name === 'section-your-block' ) {
    $context['custom_data'] = get_custom_data();
}
```

Then access it in the Twig template:

```twig
{% set custom_data = custom_data|default([]) %}
```

## Timber Cache

Timber caches compiled templates. The cache directory is `cache/twig/`. If template changes are not appearing:

- In dev: set `SCRIPT_DEBUG` to enable watch mode
- Clear the cache: delete the `cache/twig/` directory
- Timber auto-recompiles when the source `.twig` file changes (file mtime check)
