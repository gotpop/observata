<?php
/**
 * Custom block renderer that uses Twig templates for block output.
 */

function observata_render_block_twig($attributes, $content, $block) {
    $block_name = $block->block_type->name;
    $template_name = str_replace('observata/', '', $block_name);
    $template_path = get_template_directory() . "/blocks/{$template_name}/{$template_name}.twig";

    $context = array_merge(
        \Timber\Timber::context(),
        [
            'attributes' => $attributes,
            'content' => $content,
            'block' => $block,
        ]
    );

    if (!file_exists($template_path)) {
        return '';
    }

    try {
        return \Timber\Timber::compile("{$template_name}/{$template_name}.twig", $context);
    } catch (\Exception $e) {
        return '';
    }
}