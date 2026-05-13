# Observata Theme

Custom WordPress theme built on top of [BlankSlate](https://github.com/webguyio/blankslate) by WebGuy.

## Stack

- [BlankSlate](https://github.com/webguyio/blankslate) — base starter theme
- [Timber](https://timber.github.io/docs/) — Twig templating for PHP
- [Twig](https://twig.symfony.com/) — template engine
- [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/) — block build tooling

## Development

```bash
npm run start   # watch mode
npm run build   # production build
```

## Linting & Formatting

### PHP (WordPress Standards)

```bash
composer phpcs        # Check PHP files against WordPress Coding Standards
composer phpcbf       # Auto-fix PHP files
composer check        # Alias for phpcs
composer fix          # Alias for phpcbf
```

### JavaScript & TypeScript

```bash
npm run lint:ts       # Lint TypeScript/JavaScript files
npm run lint          # Lint all (TS + CSS)
```

### CSS

```bash
npm run lint:css      # Lint CSS files
npm run lint          # Lint all (TS + CSS)
```

### Code Formatting

```bash
npm run format        # Format all code files
npm run format:check  # Check formatting without making changes
```

## Blocks

All custom blocks are dynamic (PHP-rendered). To modify frontend output, edit the `render.php` in the relevant block folder — no rebuild required.

```
blocks/
  hero/       → render.php
  cards/      → render.php
  card/       → render.php
  callout/    → render.php
```
