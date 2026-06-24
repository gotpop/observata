---
name: create-block
description: 'Use when: creating a new Gutenberg block, adding a block, scaffolding a block, making a new section/card/element/grid block. Guides the full structure for observata blocks (block.json, Twig template, CSS).'
---

# Create Block

Scaffolds a new WordPress Gutenberg block following the observata pattern.

## Block Types

| Prefix     | Purpose                                        | Example                   |
| ---------- | ---------------------------------------------- | ------------------------- |
| `section-` | Full-page sections (hero, intro, CTA, contact) | `section-hero-home`       |
| `card-`    | Reusable card components                       | `card-simple`, `card-geo` |
| `element-` | Small text/layout elements                     | `element-body-md`         |
| `grid-`    | Layout grids that wrap child blocks            | `grid-cards-simple`       |

## File Structure

Every block lives in `blocks/<block-name>/` and contains at minimum:

```
blocks/<block-name>/
  block.json       # Block metadata, attributes, styles
  <block-name>.twig  # Server-side Twig render template
  <block-name>.css   # Scoped styles (CSS nesting, no preprocessor)
```

## block.json Template

```json
{
	"$schema": "https://schemas.wp.org/trunk/block.json",
	"apiVersion": 3,
	"name": "observata/<block-name>",
	"title": "<Block Title>",
	"category": "theme",
	"description": "<Short description for the editor>",
	"attributes": {
		"content": {
			"type": "string",
			"default": ""
		}
	},
	"supports": {
		"html": false
	},
	"textdomain": "observata",
	"viewStyle": "file:<block-name>.css",
	"example": {
		"attributes": {
			"content": "Default preview content"
		}
	}
}
```

### Attribute Naming

- camelCase in `block.json` (`readMoreText`, `iconGeo`)
- snake_case in Twig (`read_more_text`, `icon_geo`) — convert with `|default('')`

## Twig Template Conventions

```twig
{# Pull attributes with defaults #}
{% set content = attributes.content|default('') %}

{# Use strip_html for user-entered text fields #}
<div class="<block-name>">
	{{ content|strip_html }}
</div>
```

### GOTCHA: Never use `=>` in Twig files

The `=>` character sequence gets corrupted by the toolchain. Rephrase comments or use alternative syntax.

### Available Custom Filters

- `|strip_html` — strip HTML tags from user input
- `|esc_url` — escape URLs
- `|default('')` — provide fallback

## CSS Conventions

- Use **CSS nesting** (no SCSS/PostCSS nesting plugins)
- Scope everything under the block class (e.g. `.card-simple { ... }`)
- Use design tokens from `:root` (e.g. `var(--spacing-24)`, `var(--colour-text-heading-default)`)
- Class naming: BEM-ish, kebab-case

```css
.card-simple {
	display: grid;
	gap: var(--spacing-24);

	.title {
		color: var(--colour-text-heading-default);
		font-size: 24px;
		font-weight: 600;
	}

	.body {
		color: var(--colour-text-body-default);
	}
}
```

## Registration

Blocks are **auto-discovered**. No manual registration needed.

`inc/blocks.php` recursively scans `blocks/` for `block.json` files. If a matching `.twig` file exists alongside it, the block uses the Twig render callback; otherwise it falls back to standard PHP rendering.

## Steps

1. Ask the user for the block name and type (section/card/element/grid)
2. Ask what attributes the block needs
3. Create the directory `blocks/<block-name>/`
4. Create `block.json` with attributes and sensible defaults
5. Create `<block-name>.twig` with attribute extraction and markup
6. Create `<block-name>.css` with scoped styles using design tokens
7. Remind the user to run `npm run build` to rebuild the editor assets
