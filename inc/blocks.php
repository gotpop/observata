<?php
/**
 * Block registration and Gutenberg configuration.
 */

add_action( 'init', 'observata_register_blocks' );
function observata_register_blocks() {
	$asset_file = get_template_directory() . '/build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
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

	$blocks = [ 'hero', 'cards', 'card', 'callout' ];

	foreach ( $blocks as $block ) {
		register_block_type(
			get_template_directory() . '/blocks/' . $block,
			[ 'editor_script' => 'observata-blocks' ]
		);
	}
}

/**
 * Restrict the block inserter to only our custom blocks.
 * observata/card is intentionally included so it can be added
 * inside the Cards block via InnerBlocks.
 */
add_filter( 'allowed_block_types_all', 'observata_allowed_blocks', 10, 2 );
function observata_allowed_blocks( $allowed_blocks, $editor_context ) {
	return [
		'observata/hero',
		'observata/cards',
		'observata/card',
		'observata/callout',
	];
}
