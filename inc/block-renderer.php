<?php
/**
 * Block render callback — compiles blocks through Twig templates.
 *
 * Utility functions (split, serialize, template map) live in block-helpers.php.
 */

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
		$menu = \Timber\Timber::get_menu( 'main-menu' );

		if ( $menu ) {
			$context['main_menu'] = $menu;
		}
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

	// Query latest posts for section-blog-posts via Timber.
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

	// Build prev/next cycling array for section-blog-pagination.
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

	// Inject rendered breadcrumbs into section-hero-page when enabled.
	if ( $template_name === 'section-hero-page' && ( $attributes['showBreadcrumbs'] ?? true ) ) {
		$context['breadcrumbs_html'] = do_blocks( '<!-- wp:observata/breadcrumbs /-->' );
	}

	// Auto-render attributes ending in 'InnerBlocks' (e.g. 'tab1InnerBlocks' → renderedInnerBlocks.tab1).
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
