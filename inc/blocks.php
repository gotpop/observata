<?php
/**
 * Block registration and Gutenberg configuration.
 *
 * Build/index.js uses webpack chunk loading via runtime.js — without it,
 * registerBlockType calls never run and no blocks appear. The runtime must
 * be registered on init and enqueued in the editor before block scripts load.
 */

add_action( 'init', 'observata_register_blocks' );
add_action( 'enqueue_block_editor_assets', 'observata_enqueue_editor_runtime', 1 );
add_filter( 'allowed_block_types_all', 'observata_allowed_blocks', 10, 2 );

// ─────────────────────────────────────────────────────────────────

// Register all blocks discovered in the blocks/ directory.
function observata_register_blocks(): void {
	$build_dir = get_template_directory() . '/build';
	$build_uri = get_template_directory_uri() . '/build';

	// Register the webpack runtime chunk (required for block editor).
	$runtime_path = $build_dir . '/runtime.asset.php';

	if ( file_exists( $runtime_path ) ) {
		$runtime_asset = require $runtime_path;
		wp_register_script(
			'observata-runtime',
			$build_uri . '/runtime.js',
			array(),
			$runtime_asset['version'],
			true
		);
	}

	$asset_file = $build_dir . '/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = require $asset_file;

	// Ensure the blocks script depends on the runtime so it always loads first.
	$deps = $asset['dependencies'];

	if ( wp_script_is( 'observata-runtime', 'registered' ) ) {
		$deps[] = 'observata-runtime';
	}

	wp_register_script(
		'observata-blocks',
		$build_uri . '/index.js',
		$deps,
		$asset['version'],
		true
	);

	wp_localize_script(
		'observata-blocks',
		'observata',
		array(
			'templateUrl' => get_template_directory_uri(),
		)
	);

	// Ensure templateUrl is available even when blocks load via block.json editorScript handles.
	add_action(
		'admin_enqueue_scripts',
		function () {
			$script  = 'window.observata = window.observata || {};';
			$script .= 'window.observata.templateUrl = ' . wp_json_encode( get_template_directory_uri() ) . ';';
			wp_add_inline_script( 'wp-blocks', $script, 'before' );
		}
	);

	// Recursively discover blocks in blocks/ and any subdirectories
	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( get_template_directory() . '/blocks', RecursiveDirectoryIterator::SKIP_DOTS )
	);

	foreach ( $iterator as $file ) {
		if ( $file->getFilename() !== 'block.json' ) {
			continue;
		}

		$block_dir     = $file->getPath();
		$block_name    = basename( $block_dir );
		$twig_template = "{$block_dir}/{$block_name}.twig";

		if ( file_exists( $twig_template ) ) {
			// Use Twig renderer
			register_block_type_from_metadata(
				$block_dir,
				array( 'render_callback' => 'observata_render_block_twig' )
			);
		} else {
			// Standard PHP renderer — reads block.json for metadata.
			register_block_type_from_metadata( $block_dir );
		}
	}
}

// Enqueue the webpack runtime chunk in the block editor.
function observata_enqueue_editor_runtime(): void {
	if ( ! wp_script_is( 'observata-runtime', 'registered' ) ) {
		return;
	}

	wp_enqueue_script( 'observata-runtime' );

	// Patch runtime as a dependency for all build/index.js editor scripts.
	global $wp_scripts;
	foreach ( $wp_scripts->registered as $handle => $script ) {
		if ( $script->src && false !== strpos( $script->src, 'build/index.js' ) ) {
			if ( ! in_array( 'observata-runtime', $script->deps, true ) ) {
				$wp_scripts->registered[ $handle ]->deps[] = 'observata-runtime';
			}
		}
	}
}

// Restrict the block inserter to only our custom blocks.
function observata_allowed_blocks( bool|array $allowed_blocks, \WP_Block_Editor_Context $editor_context ): array {
	$allowed = array();

	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( get_template_directory() . '/blocks', RecursiveDirectoryIterator::SKIP_DOTS )
	);

	foreach ( $iterator as $file ) {
		if ( $file->getFilename() !== 'block.json' ) {
			continue;
		}

		$metadata = json_decode( file_get_contents( $file->getPathname() ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

		// Skip internal blocks
		if ( ! empty( $metadata['name'] ) && in_array(
			$metadata['name'],
			array(
				'observata/header-logo',
				'observata/header-navigation',
				'observata/header-navigation-trigger',
				'observata/section-intro',
				'observata/breadcrumbs',
			),
			true
		) ) {
			continue;
		}

		// Restrict section-blog-pagination to single blog posts only
		if ( $metadata['name'] === 'observata/section-blog-pagination' ) {
			if ( ! isset( $editor_context->post ) || $editor_context->post->post_type !== 'post' ) {
				continue;
			}
		}

		if ( ! empty( $metadata['name'] ) ) {
			$allowed[] = $metadata['name'];
		}
	}

	return $allowed;
}

// Render a dynamic block by name + attributes from PHP templates.
function observata_render_block( string $block_name, array $attributes = array() ): string {
	$attrs = '';

	if ( ! empty( $attributes ) ) {
		$attrs = ' ' . wp_json_encode( $attributes, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
	}

	return do_blocks( "<!-- wp:{$block_name}{$attrs} /-->" );
}
