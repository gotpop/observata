<?php
/**
 * Custom block renderer that uses Twig templates for block output.
 */

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
    }

    try {
        return \Timber\Timber::compile('blocks/' . $twig_relative, $context);
    } catch (\Exception $e) {
        error_log("[observata] Twig error for {$template_name}: " . $e->getMessage());
        return '';
    }
}