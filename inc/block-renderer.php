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

/**
 * Cached mapping of template_name => relative path from blocks/ dir.
 * Built once per request to avoid repeated filesystem scans.
 */
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
			// Prefer canonical locations where directory name matches template name
			// (e.g. cards/card-geo-shader/card-geo-shader.twig over repeatable/grid-cards-shader/card-geo-shader.twig)
			if ( $parent_dir === $basename || ! isset( $map[ $basename ] ) ) {
				$map[ $basename ] = $relative;
			}
		}
	}

	return $map;
}

function observata_render_block_twig( $attributes, $content, $block ) {
	$block_name    = $block->block_type->name;
	$template_name = str_replace( 'observata/', '', $block_name );

	// Look up the template in the cached map
	$map           = observata_get_template_map();
	$twig_relative = $map[ $template_name ] ?? null;

	if ( ! $twig_relative ) {
		error_log( "[observata] No twig template found for: {$template_name}" ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		return '';
	}

	// Ensure inner blocks are rendered (they may arrive as raw block delimiters)
	$rendered_content = $content ? do_blocks( $content ) : '';

	$context = array_merge(
		\Timber\Timber::context(),
		array(
			'attributes' => $attributes,
			'content'    => $rendered_content,
			'block'      => $block,
			'theme_url'  => get_template_directory_uri(),
		)
	);

	// Add WordPress main menu to context for header block
	if ( $template_name === 'header' ) {
		$context['main_menu'] = \Timber\Timber::get_menu( 'main-menu' );

		// Header partial styles are bundled in style-global.css via webpack.
	}

	// Add footer menus to context for footer block
	if ( $template_name === 'footer' ) {
		$footer_menus = array(
			'footer_1' => 'footer-1',
			'footer_2' => 'footer-2',
			'footer_3' => 'footer-3',
			'footer_4' => 'footer-4',
		);

		foreach ( $footer_menus as $key => $location ) {
			if ( has_nav_menu( $location ) ) {
				$menu_items      = wp_get_nav_menu_items( get_nav_menu_locations()[ $location ] );
				$menu_obj        = wp_get_nav_menu_object( get_nav_menu_locations()[ $location ] );
				$context[ $key ] = array(
					'name'  => $menu_obj->name,
					'items' => $menu_items,
				);
			}
		}
	}

	// Special handling for blog-posts to query latest posts via Timber.
	if ( $template_name === 'section-blog-posts' ) {
		$posts_per_page   = $attributes['postsPerPage'] ?? 10;
		$context['posts'] = \Timber\Timber::get_posts(
			array(
				'post_type'      => 'post',
				'posts_per_page' => $posts_per_page,
				'orderby'        => 'date',
				'order'          => 'DESC',
				'post_status'    => 'publish',
			)
		);
	}

	// Special handling for section-blog-pagination to create cycling array of posts.
	if ( $template_name === 'section-blog-pagination' ) {
		$all_posts = \Timber\Timber::get_posts(
			array(
				'post_type'      => 'post',
				'posts_per_page' => -1,
				'orderby'        => 'date',
				'order'          => 'DESC',
				'post_status'    => 'publish',
			)
		);

		if ( ! empty( $all_posts ) ) {
			$total_posts = count( $all_posts );

			// Find current post position in array
			$current_post_id = get_the_ID();
			$current_index   = 0;
			for ( $i = 0; $i < $total_posts; $i++ ) {
				if ( $all_posts[ $i ]->ID == $current_post_id ) {
					$current_index = $i;
					break;
				}
			}

			// Calculate previous and next indices with wrapping
			$prev_index = ( $current_index - 1 + $total_posts ) % $total_posts;
			$next_index = ( $current_index + 1 ) % $total_posts;

			// Pass posts to template
			$context['prev_post'] = $total_posts > 1 ? $all_posts[ $prev_index ] : null;
			$context['next_post'] = $total_posts > 1 ? $all_posts[ $next_index ] : null;
		}
	}

	// Build breadcrumb trail for the breadcrumbs block.
	if ( $template_name === 'breadcrumbs' ) {
		$context['breadcrumbs'] = observata_build_breadcrumbs();
	}

	// TODO: Delete this once new tabs are used
	// Generic handling: auto-render any attribute ending in 'InnerBlocks'.
	// Scans all attributes for keys like 'tab1InnerBlocks' or 'mdrInnerBlocks',
	// serializes the block array, runs do_blocks(), and exposes the result in
	// $context['renderedInnerBlocks'] keyed by the attribute name (minus the suffix).
	// e.g. 'tab1InnerBlocks' becomes available as renderedInnerBlocks['tab1'].
	$rendered_inner = array();
	foreach ( $attributes as $key => $value ) {
		if ( ! is_array( $value ) || ! str_ends_with( $key, 'InnerBlocks' ) ) {
			continue;
		}
		$short_key                    = substr( $key, 0, -11 ); // strip 'InnerBlocks'
		$serialized                   = observata_serialize_blocks_recursive( $value );
		$rendered_inner[ $short_key ] = do_blocks( $serialized );
	}
	if ( ! empty( $rendered_inner ) ) {
		$context['renderedInnerBlocks'] = $rendered_inner;
	}

	try {
		return \Timber\Timber::compile( 'blocks/' . $twig_relative, $context );
	} catch ( \Exception $e ) {
		error_log( "[observata] Twig error for {$template_name}: " . $e->getMessage() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		return '';
	}
}
