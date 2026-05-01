<?php
/**
 * Custom block renderer that uses Twig templates for block output.
 */

function observata_render_block_twig($attributes, $content, $block)
{
    $block_name = $block->block_type->name;
    $template_name = str_replace('observata/', '', $block_name);

    // Search recursively for the twig template under blocks/
    $template_path = observata_find_block_template($template_name);

    $context = array_merge(
        \Timber\Timber::context(),
        [
            'attributes' => $attributes,
            'content' => $content,
            'block' => $block,
        ]
    );

    // Add WordPress main menu to context for header block
    if ($template_name === 'header') {
        $context['main_menu'] = \Timber\Timber::get_menu('main-menu');
    }

    if (!$template_path) {
        error_log("[observata] No twig template found for: {$template_name}");
        return '';
    }

    // Build relative path from blocks/ dir for Timber::compile
    $blocks_dir = get_template_directory() . '/blocks/';
    $twig_relative = str_replace($blocks_dir, '', $template_path);

    try {
        return \Timber\Timber::compile($twig_relative, $context);
    } catch (\Exception $e) {
        error_log("[observata] Twig error for {$template_name}: " . $e->getMessage());
        return '';
    }
}

/**
 * Recursively find a block's twig template under blocks/.
 */
function observata_find_block_template(string $template_name): ?string
{
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator(get_template_directory() . '/blocks', RecursiveDirectoryIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if ($file->getFilename() === "{$template_name}.twig") {
            return $file->getPathname();
        }
    }

    return null;
}