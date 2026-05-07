<?php
/**
 * Custom block renderer that uses Twig templates for block output.
 */

/**
 * Recursively serialize an array of block objects into WordPress
 * block-delimiter HTML comments, preserving the full nesting tree.
 *
 * The controlled InnerBlocks (value/onChange) stores blocks as:
 *   [ name, attributes, innerBlocks ]
 * This function converts them to the <!-- wp:... --> format do_blocks() expects.
 *
 * @param array $blocks Array of block objects from InnerBlocks onChange.
 * @return string Serialized block-delimiter HTML.
 */
function observata_serialize_blocks_recursive(array $blocks): string
{
    $output = '';

    foreach ($blocks as $block) {
        if (empty($block['name'])) {
            continue;
        }

        $attrs = '';
        if (!empty($block['attributes'])) {
            $attrs = ' ' . wp_json_encode(
                $block['attributes'],
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
            );
        }

        if (!empty($block['innerBlocks'])) {
            // Block with children — use opening/closing delimiters
            $inner = observata_serialize_blocks_recursive($block['innerBlocks']);
            $output .= "<!-- wp:{$block['name']}{$attrs} -->{$inner}<!-- /wp:{$block['name']} -->";
        } else {
            // Leaf block — self-closing delimiter
            $output .= "<!-- wp:{$block['name']}{$attrs} /-->";
        }
    }

    return $output;
}

/**
 * Cached mapping of template_name => relative path from blocks/ dir.
 * Built once per request to avoid repeated filesystem scans.
 */
function observata_get_template_map(): array
{
    static $map = null;

    if ($map !== null) {
        return $map;
    }

    $map = [];
    $blocks_dir = get_template_directory() . '/blocks';
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($blocks_dir, RecursiveDirectoryIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if ($file->getExtension() === 'twig') {
            $relative = str_replace($blocks_dir . '/', '', $file->getPathname());
            $basename = $file->getBasename('.twig');
            $parent_dir = basename($file->getPath());
            // Prefer canonical locations where directory name matches template name
            // (e.g. cards/card-geo-shader/card-geo-shader.twig over repeatable/grid-cards-shader/card-geo-shader.twig)
            if ($parent_dir === $basename || !isset($map[$basename])) {
                $map[$basename] = $relative;
            }
        }
    }

    return $map;
}

function observata_render_block_twig($attributes, $content, $block)
{
    $block_name = $block->block_type->name;
    $template_name = str_replace('observata/', '', $block_name);

    // Look up the template in the cached map
    $map = observata_get_template_map();
    $twig_relative = $map[$template_name] ?? null;

    if (!$twig_relative) {
        error_log("[observata] No twig template found for: {$template_name}");
        return '';
    }

    // Ensure inner blocks are rendered (they may arrive as raw block delimiters)
    $rendered_content = $content ? do_blocks($content) : '';

    $context = array_merge(
        \Timber\Timber::context(),
        [
            'attributes' => $attributes,
            'content' => $rendered_content,
            'block' => $block,
        ]
    );

    // Add WordPress main menu to context for header block
    if ($template_name === 'header') {
        $context['main_menu'] = \Timber\Timber::get_menu('main-menu');

        // Enqueue styles for header partial blocks (included via Twig, not as WP blocks)
        $partials = ['header-logo', 'header-navigation', 'header-navigation-trigger'];
        foreach ($partials as $partial) {
            $partial_dir = get_template_directory() . "/blocks/template/{$partial}";
            if (!is_dir($partial_dir)) {
                continue;
            }
            $css_files = glob("{$partial_dir}/*.css");
            foreach ($css_files as $css_file) {
                $css_basename = basename($css_file, '.css');
                $css_relative = "blocks/template/{$partial}/{$css_basename}.css";
                wp_enqueue_style(
                    "observata-{$css_basename}",
                    get_template_directory_uri() . "/{$css_relative}",
                    [],
                    filemtime($css_file)
                );
            }
        }
    }

    // Add footer menus to context for footer block
    if ($template_name === 'footer') {
        $footer_menus = [
            'footer_support' => 'footer-support',
            'footer_services' => 'footer-services',
            'footer_resources' => 'footer-resources',
            'footer_company' => 'footer-company',
        ];

        foreach ($footer_menus as $key => $location) {
            if (has_nav_menu($location)) {
                $menu_items = wp_get_nav_menu_items(get_nav_menu_locations()[$location]);
                $menu_obj = wp_get_nav_menu_object(get_nav_menu_locations()[$location]);
                $context[$key] = [
                    'name' => $menu_obj->name,
                    'items' => $menu_items,
                ];
            }
        }
    }

    // Special handling for pricing-tabs to pre-render inner blocks for each tab.
    // Uses recursive serialization to preserve nested inner blocks (e.g. plan-features-row
    // inside plan-features-table) so the full block tree is processed by do_blocks().
    if ($template_name === 'pricing-tabs') {
        $rendered_tabs = [];
        $tab_names = ['mdr', 'observability', 'search'];

        foreach ($tab_names as $tab_name) {
            $inner_blocks = $attributes[$tab_name . 'InnerBlocks'] ?? [];
            $serialized = observata_serialize_blocks_recursive($inner_blocks);
            $rendered_tabs[$tab_name] = do_blocks($serialized);
        }

        $context['renderedTabs'] = $rendered_tabs;
    }

    try {
        return \Timber\Timber::compile('blocks/' . $twig_relative, $context);
    } catch (\Exception $e) {
        error_log("[observata] Twig error for {$template_name}: " . $e->getMessage());
        return '';
    }
}