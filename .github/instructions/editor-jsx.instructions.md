---
description: 'Block editor (React/JSX) component patterns for observata blocks'
applyTo:
  - 'src/**/*.jsx'
  - 'src/**/*.js'
---

# Block Editor (JSX) Guidelines

## Comments

Keep AI-generated comments to a minimum. Only comment non-obvious logic; do not restate what the code already says.

## edit.jsx Pattern

```jsx
import { RichText, useBlockProps } from '@wordpress/block-editor';
import BlockLabel from '../components/block-label';
import './editor.css';

export default function Edit({ attributes, setAttributes }) {
	const { title } = attributes;
	const blockProps = useBlockProps({ className: 'block-<block-name>' });

	return (
		<div {...blockProps}>
			<BlockLabel name="<Block Title>" />
			<RichText
				tagName="h3"
				className="title"
				value={title}
				onChange={(val) => setAttributes({ title: val })}
				placeholder="Title…"
				allowedFormats={[]}
			/>
		</div>
	);
}
```

## save.jsx — Always Returns null

```jsx
export default function Save() {
	return null; // Twig handles all rendering server-side
}
```

## Registration in src/index.js

Import edit and save components, then call `registerBlockType`:

```js
import MyBlockEdit from './<block-name>/edit';
import MyBlockSave from './<block-name>/save';

registerBlockType('observata/<block-name>', {
	edit: MyBlockEdit,
	save: MyBlockSave,
});
```

## Common Components

- `BlockLabel` (`../components/block-label`) — Shows the block name in the editor UI
- `ControlsLayout` (`../components/controls-layout`) — Grid layout for inspector controls
- `GeoIcon` (`../components/geo-icon`) — Previews numbered geo icons
- `useSelect` from `@wordpress/data` — Fetch posts/pages for dropdowns

## Attribute Naming

- camelCase in JSX and block.json (`iconGeo`, `readMoreText`)
- snake_case in Twig only — never in JS
