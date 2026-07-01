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

## save.jsx — Depends on InnerBlocks

Twig handles all frontend rendering, but `save.jsx` controls what markup is persisted to the database. The Twig template's `{{ content|raw }}` receives this saved markup as the `$content` variable.

**Blocks WITHOUT InnerBlocks** — return `null` (attributes are read by Twig directly):

```jsx
export default function Save() {
	return null;
}
```

**Blocks WITH InnerBlocks** — MUST return `<InnerBlocks.Content />`, otherwise child blocks are never saved to the database and will be missing on the frontend:

```jsx
import { InnerBlocks } from '@wordpress/block-editor';

export default function Save() {
	return <InnerBlocks.Content />;
}
```

### Critical Gotcha: InnerBlocks save.jsx

If a block uses `<InnerBlocks>` in `edit.jsx` but `save.jsx` returns `null`:

- **Symptom:** Block renders correctly in the editor but child blocks are missing on the frontend — `{{ content|raw }}` in Twig is empty. In the database the block is stored as a self-closing tag (`<!-- wp:observata/block-name /-->`) with no inner content.
- **Cause:** `save.jsx` returned `null` instead of `<InnerBlocks.Content />`. The `save` function serialises block markup to `post_content`; returning `null` means inner blocks are never written.
- **Fix:** Return `<InnerBlocks.Content />` from `save.jsx`.
- **Migration gotcha:** Existing blocks already saved with `null` will NOT auto-migrate — they stay as self-closing tags in `post_content`. Must manually delete and re-add existing instances, or register a `deprecated` array to handle old markup.

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
