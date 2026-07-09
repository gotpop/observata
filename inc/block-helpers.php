<?php
/**
 * Block utility functions — hero/content split, block serialization,
 * and template path resolution.
 */

// Split a page's post_content into hero block + body content.
function observata_split_hero_from_content( string $post_content, string $hero_block_name ): array {
	$blocks      = parse_blocks( $post_content );
	$hero_output = '';
	$body_output = '';

	foreach ( $blocks as $block ) {
		if ( $block['blockName'] === $hero_block_name ) {
			$hero_output .= render_block( $block );
		} else {
			$body_output .= render_block( $block );
		}
	}

	return array(
		'hero'    => $hero_output,
		'content' => $body_output,
	);
}

// Serialize block objects into WordPress block-delimiter HTML comments.
function observata_serialize_blocks_recursive( array $blocks ): string {
	$output = '';

	foreach ( $blocks as $block ) {
		if ( empty( $block['name'] ) ) {
			continue;
		}

		$attrs = '';

		if ( ! empty( $block['attributes'] ) ) {
			$attrs = ' ' . wp_json_encode(
				$block['attributes'],
				JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
			);
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			// Block with children — use opening/closing delimiters
			$inner   = observata_serialize_blocks_recursive( $block['innerBlocks'] );
			$output .= "<!-- wp:{$block['name']}{$attrs} -->{$inner}<!-- /wp:{$block['name']} -->";
		} else {
			// Leaf block — self-closing delimiter
			$output .= "<!-- wp:{$block['name']}{$attrs} /-->";
		}
	}

	return $output;
}

// Build a cached template_name => relative path map (once per request).
function observata_get_template_map(): array {
	static $map = null;

	if ( $map !== null ) {
		return $map;
	}

	$map        = array();
	$blocks_dir = get_template_directory() . '/blocks';
	$iterator   = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $blocks_dir, RecursiveDirectoryIterator::SKIP_DOTS )
	);

	foreach ( $iterator as $file ) {
		if ( $file->getExtension() === 'twig' ) {
			$relative   = str_replace( $blocks_dir . '/', '', $file->getPathname() );
			$basename   = $file->getBasename( '.twig' );
			$parent_dir = basename( $file->getPath() );

			// Prefer canonical locations where directory name matches template name.
			if ( $parent_dir === $basename || ! isset( $map[ $basename ] ) ) {
				$map[ $basename ] = $relative;
			}
		}
	}

	return $map;
}
