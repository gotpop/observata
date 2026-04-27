<?php
/**
 * Custom block renderer that uses Twig templates for block output.
 */

function observata_render_block_twig($attributes, $content, $block) {
    $block_name = $block->block_type->name;
    $template_name = str_replace('observata/', '', $block_name);

    $context = array_merge(
        \Timber\Timber::context(),
        [
            'attributes' => $attributes,
            'content' => $content,
            'block' => $block,
        ]
    );

    $template_path = "blocks/{$template_name}.twig";

    try {
        return \Timber\Timber::compile($template_path, $context);
    } catch (\Twig\Error\LoaderError $e) {
        // Fallback to PHP render if Twig template doesn't exist
        $render_php = get_template_directory() . "/blocks/{$template_name}/render.php";
        if (file_exists($render_php)) {
            ob_start();
            include $render_php;
            return ob_get_clean();
        }
        return '';
    }
}