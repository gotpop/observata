<?php
/**
 * Block registration and Gutenberg configuration.
 */

add_action('init', 'observata_register_blocks');
function observata_register_blocks()
{
	$asset_file = get_template_directory() . '/build/index.asset.php';

	if (!file_exists($asset_file)) {
		return;
	}

	$asset = require $asset_file;

	wp_register_script(
		'observata-blocks',
		get_template_directory_uri() . '/build/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	foreach (glob(get_template_directory() . '/blocks/*/block.json') as $block_json) {
		$block_name = basename(dirname($block_json));
		$twig_template = get_template_directory() . "/blocks/{$block_name}/{$block_name}.twig";

		if (file_exists($twig_template)) {
			// Use Twig renderer
			register_block_type_from_metadata(
				dirname($block_json),
				['render_callback' => 'observata_render_block_twig']
			);
		} else {
			// Use standard PHP renderer
			register_block_type(dirname($block_json));
		}
	}
}

/**
 * Restrict the block inserter to only our custom blocks.
 * observata/card is intentionally included so it can be added
 * inside the Cards block via InnerBlocks.
 * observata/section-intro is excluded as it's only used internally by parent blocks.
 */
add_filter('allowed_block_types_all', 'observata_allowed_blocks', 10, 2);
function observata_allowed_blocks($allowed_blocks, $editor_context)
{
	$allowed = [];

	foreach (glob(get_template_directory() . '/blocks/*/block.json') as $block_json) {
		$metadata = json_decode(file_get_contents($block_json), true);

		// Skip internal blocks
		if (!empty($metadata['name']) && $metadata['name'] === 'observata/section-intro') {
			continue;
		}

		if (!empty($metadata['name'])) {
			$allowed[] = $metadata['name'];
		}
	}

	return $allowed;
}

/**
 * Render a dynamic block by name + attributes from PHP templates.
 */
function observata_render_block(string $block_name, array $attributes = []): string
{
	$attrs = '';

	if (!empty($attributes)) {
		$attrs = ' ' . wp_json_encode($attributes, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
	}

	return do_blocks("<!-- wp:{$block_name}{$attrs} /-->");
}
