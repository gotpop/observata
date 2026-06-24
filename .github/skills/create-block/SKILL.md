---
name: create-block
description: 'Use when: creating a new Gutenberg block, adding a block, scaffolding a block, making a new section/card/element/grid block, writing block.json, edit.jsx, save.jsx. Guides the full structure for observata blocks.'
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
  block.json          # Block metadata, attributes, styles
  <block-name>.twig   # Server-side Twig render template
  <block-name>.css    # Frontend styles (viewStyle), CSS nesting
```

Editor components live in `src/<block-name>/`:

```
src/<block-name>/
  edit.jsx            # Block editor UI
  save.jsx            # Always returns null (Twig renders output)
  editor.css          # Editor-only styles (optional)
```

Blocks must also be imported in `src/index.js` and registered via `registerBlockType`.

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
		"title": {
			"type": "string",
			"default": ""
		},
		"iconGeo": {
			"type": "string",
			"default": "24"
		},
		"readMoreText": {
			"type": "string",
			"default": "Read more"
		},
		"readMoreUrl": {
			"type": "string",
			"default": ""
		}
	},
	"supports": {
		"html": false
	},
	"textdomain": "observata",
	"editorScript": "file:../../build/index.js",
	"editorStyle": "file:../../build/index.css",
	"viewStyle": "file:<block-name>.css",
	"example": {
		"attributes": {
			"title": "Default preview title"
		}
	}
}
```

### Key Fields

- `editorScript` / `editorStyle` — Point to `build/index.js` and `build/index.css` (two levels up from block dir). These are shared across ALL blocks.
- `viewStyle` — Points to the block's own CSS file (frontend only, relative to block dir).

### Attribute Naming

- camelCase in `block.json` (`readMoreText`, `iconGeo`)
- snake_case in Twig (`read_more_text`, `icon_geo`) — convert with `|default('')`

## Twig Template Conventions

```twig
{# Pull attributes with defaults at the top #}
{% set title = attributes.title|default('') %}
{% set icon_geo = attributes.iconGeo|default('24') %}
{% set read_more_text = attributes.readMoreText|default('Read more') %}
{% set read_more_url = attributes.readMoreUrl|default('#') %}

<article class="card-simple icon-{{ icon_geo }}">
	{% include 'icons/geo/' ~ icon_geo ~ '.twig' %}
	<h3 class="title">
		{{ title|strip_html }}
	</h3>

	{% if read_more_url %}
		<a href="{{ read_more_url|esc_url }}" class="read-more">
			<span>{{ read_more_text|strip_html }}</span>
		</a>
	{% endif %}
</article>
```

### Available Custom Filters

- `|strip_html` — strip HTML tags from user input (use on ALL text fields)
- `|esc_url` — escape URLs (use on ALL url attributes)
- `|default('')` — provide fallback
- `|raw` — pre-escaped HTML (inner blocks, menus)

### GOTCHA: Never use `=>` in Twig files

The `=>` character sequence gets corrupted by the toolchain. Rephrase comments or use alternative syntax.

## Editor Component Conventions

### edit.jsx

```jsx
import { RichText, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import BlockLabel from '../components/block-label';
import './editor.css';

export default function Edit({ attributes, setAttributes }) {
	const { title, iconGeo } = attributes;

	const blockProps = useBlockProps({ className: 'block-card-simple' });

	return (
		<article {...blockProps}>
			<BlockLabel name="Card Simple" />
			<RichText
				tagName="h3"
				className="title"
				value={title}
				onChange={(val) => setAttributes({ title: val })}
				placeholder="Card title…"
				allowedFormats={[]}
			/>
		</article>
	);
}
```

### save.jsx — Always returns null

```jsx
export default function Save() {
	return null; // Twig handles all rendering
}
```

### Register in src/index.js

Import the edit and save components, then call `registerBlockType`:

```js
import CardSimpleEdit from './card-simple/edit';
import CardSimpleSave from './card-simple/save';

registerBlockType('observata/card-simple', {
	edit: CardSimpleEdit,
	save: CardSimpleSave,
});
```

## CSS Conventions

- Use **CSS nesting** (native, no preprocessor)
- Scope everything under the block's class (e.g. `.card-simple { ... }`)
- Use design tokens from `:root` (e.g. `var(--spacing-24)`, `var(--colour-text-heading-default)`)
- Class naming: kebab-case

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

## Inner Blocks

Two patterns depending on the block:

### Standard InnerBlocks (single slot)

In `edit.jsx`, allow InnerBlocks. The rendered HTML arrives in the `content` variable in Twig.

```twig
<div class="my-grid">
	{{ content|raw }}
</div>
```

### Named InnerBlocks (multiple slots)

Store child blocks in attributes ending with `InnerBlocks` (e.g. `tab1InnerBlocks`). The render callback auto-detects and renders them.

```twig
<div class="tab">
	{{ renderedInnerBlocks.tab1|raw }}
</div>
```

See the `twig-blocks` skill for full details.

## Steps

1. Ask the user for the block name and type (section/card/element/grid)
2. Ask what attributes the block needs
3. Create `blocks/<block-name>/` with `block.json`, `<block-name>.twig`, `<block-name>.css`
4. Create `src/<block-name>/edit.jsx` and `src/<block-name>/save.jsx`
5. Import and register the block in `src/index.js`
6. Run `npm run build` to rebuild editor assets
7. Verify the block appears in the editor and renders on the frontend
