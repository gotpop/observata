---
description: 'Twig template patterns and gotchas for observata blocks and views'
applyTo:
  - '**/*.twig'
---

# Twig Template Guidelines

## Attribute Extraction

Always extract block attributes to local variables at the top of the template:

```twig
{% set title = attributes.title|default('') %}
{% set icon_geo = attributes.iconGeo|default('24') %}
{% set read_more_url = attributes.readMoreUrl|default('#') %}
```

## Escaping Rules

- **User text fields**: Always `|strip_html` — strips all HTML tags
- **URLs**: Always `|esc_url`
- **Pre-rendered HTML** (inner blocks, menus): Use `|raw`
- **Raw attributes from PHP**: Use `|raw` if already escaped server-side

## GOTCHA: Never use `=>` in Twig

The `=>` sequence gets corrupted by the toolchain (replaced with `__TWIG_ARROW_FUNC_0__`). This affects comments and text content. Rephrase to avoid.

## Template Includes

Paths resolve from three locations (theme root, `blocks/`, `views/`):

```twig
{% include 'icons/geo/' ~ icon_geo ~ '.twig' %}
{% include 'icons/lucide/arrow-right.twig' %}
{% include 'partials/header-default.twig' %}
```

## Inner Blocks

Two patterns:

```twig
{# Standard: pre-rendered content variable #}
{{ content|raw }}

{# Named slots: from attributes ending in 'InnerBlocks' #}
{{ renderedInnerBlocks.slotName|raw }}
```

## Available Context

- `attributes` — block attributes from block.json
- `content` — pre-rendered inner blocks
- `block` — WP block object
- `theme_url` — template directory URI
- `site` — Timber site object
- `renderedInnerBlocks` — named inner block slots (array or undefined)

## Common Mistakes

- Forgetting `|default('')` on attribute extraction
- Using `$variable` (PHP syntax) instead of `variable` (Twig syntax)
- Using `array.key` syntax for dynamic keys instead of `attribute(array, key)`
- Calling `Timber::render()` instead of letting the render callback handle compilation
