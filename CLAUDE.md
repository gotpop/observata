# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development

```bash
npm run start   # watch mode for block editor assets
npm run build   # production build
```

## Architecture

This is a custom WordPress theme built on [BlankSlate](https://github.com/webguyio/blankslate) with the following key architectural patterns:

### Dynamic Blocks

All custom blocks are **dynamic (PHP-rendered)**. Frontend output is controlled by `blocks/{block-name}/render.php` — no rebuild required for frontend changes.

Block structure:
- `block.json` — block metadata, attributes, and file references
- `render.php` — PHP template for frontend rendering (required)
- `*.css` — block-specific styles (optional)
- `src/{block-name}/edit.jsx` — Gutenberg editor interface (required)
- `src/{block-name}/save.jsx` — returns `null` (dynamic blocks don't save HTML)

Blocks are registered in `inc/blocks.php` which:
1. Auto-discovers all blocks via `blocks/*/block.json`
2. Restricts the block inserter to only theme blocks (no core blocks allowed)
3. Provides `observata_render_block()` helper for programmatic block rendering

### Client-Side Shaders

The hero block uses WebGPU shaders (WebGL fallback) via the `shaders` package. Implementation is in `client/ts/index.ts`:
- Initializes on `<canvas>` elements with class `hero-shader`
- Requires HTTPS or localhost for WebGPU support
- Auto-restricts to secure contexts with graceful degradation

### Twig Templating with Timber

Page templates use Timber (`views/templates/*.twig`) with a base layout (`views/base.twig`). Pattern:

```php
$context = \Timber\Timber::context();
$context['post'] = \Timber\Timber::get_post();
\Timber\Timber::render('templates/page-default.twig', $context);
```

### InnerBlocks Pattern

Container blocks (e.g., `observata/cards`) use `InnerBlocks` in their edit component:

```jsx
const ALLOWED_BLOCKS = ['observata/card'];
const TEMPLATE = [['observata/card'], ['observata/card']];

<InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={TEMPLATE} />
```

The PHP render receives `$content` containing rendered child blocks:

```php
<div class="cards-grid">
    <?php echo $content; ?>
</div>
```

## Adding a New Block

1. Create `blocks/{name}/block.json` with metadata and attributes
2. Create `blocks/{name}/render.php` for frontend output
3. Create `src/{name}/edit.jsx` with Gutenberg UI components
4. Create `src/{name}/save.jsx` returning `null`
5. Import and register in `src/index.js`

If the block should be usable inside InnerBlocks (like `observata/card`), it will be automatically included in the allowed blocks list by `inc/blocks.php`.
