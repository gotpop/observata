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

	wp_localize_script('observata-blocks', 'observata', [
		'templateUrl' => get_template_directory_uri(),
	]);

	// Ensure templateUrl is available even when blocks load via block.json editorScript handles
	add_action('admin_enqueue_scripts', function () {
		$script = 'window.observata = window.observata || {};';
		$script .= 'window.observata.templateUrl = ' . wp_json_encode(get_template_directory_uri()) . ';';
		wp_add_inline_script('wp-blocks', $script, 'before');
	});

	// Recursively discover blocks in blocks/ and any subdirectories
	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator(get_template_directory() . '/blocks', RecursiveDirectoryIterator::SKIP_DOTS)
	);

	foreach ($iterator as $file) {
		if ($file->getFilename() !== 'block.json') {
			continue;
		}

		$block_dir = $file->getPath();
		$block_name = basename($block_dir);
		$twig_template = "{$block_dir}/{$block_name}.twig";

		if (file_exists($twig_template)) {
			// Use Twig renderer
			register_block_type_from_metadata(
				$block_dir,
				['render_callback' => 'observata_render_block_twig']
			);
		} else {
			// Use standard PHP renderer
			register_block_type($block_dir);
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

	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator(get_template_directory() . '/blocks', RecursiveDirectoryIterator::SKIP_DOTS)
	);

	foreach ($iterator as $file) {
		if ($file->getFilename() !== 'block.json') {
			continue;
		}

		$metadata = json_decode(file_get_contents($file->getPathname()), true);

		// Skip internal blocks
		if (!empty($metadata['name']) && in_array($metadata['name'], [
			'observata/section-intro',
			'observata/header-logo',
			'observata/header-navigation',
			'observata/header-navigation-trigger',
		])) {
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