<?php
/**
 * Breadcrumbs logic for the breadcrumbs block.
 *
 * Builds an array of breadcrumb items that the Twig template renders.
 * Called from observata_render_block_twig() in block-renderer.php.
 */

/**
 * Build an array of breadcrumb items for the breadcrumbs block.
 *
 * Each item is [ 'label' => string, 'url' => string|null ].
 * A null url indicates the current page (rendered as plain text).
 *
 * @return array Array of breadcrumb items.
 */
function observata_build_breadcrumbs(): array {
	$breadcrumbs = array();

	if ( ! is_front_page() ) {
		$breadcrumbs[] = array(
			'label' => __( 'Home', 'observata' ),
			'url'   => home_url( '/' ),
		);
	}

	if ( is_home() || is_singular( 'post' ) ) {
		$blog_page_id = get_option( 'page_for_posts' );
		if ( $blog_page_id ) {
			$breadcrumbs[] = array(
				'label' => get_the_title( $blog_page_id ),
				'url'   => get_permalink( $blog_page_id ),
			);
		}
	}

	if ( is_category() || is_tag() || is_tax() ) {
		$breadcrumbs[] = array(
			'label' => single_term_title( '', false ),
			'url'   => null,
		);
	} elseif ( is_search() ) {
		$breadcrumbs[] = array(
			'label' => sprintf(
				/* translators: %s: Search query. */
				__( 'Search Results: "%s"', 'observata' ),
				get_search_query()
			),
			'url'   => null,
		);
	} elseif ( is_author() ) {
		$author        = get_queried_object();
		$breadcrumbs[] = array(
			'label' => sprintf(
				/* translators: %s: Author display name. */
				__( 'Author: %s', 'observata' ),
				$author->display_name
			),
			'url'   => null,
		);
	} elseif ( is_date() ) {
		if ( is_day() ) {
			$label = get_the_date();
		} elseif ( is_month() ) {
			$label = get_the_date( 'F Y' );
		} else {
			$label = get_the_date( 'Y' );
		}
		$breadcrumbs[] = array(
			'label' => $label,
			'url'   => null,
		);
	} elseif ( is_singular() ) {
		$current_post_id = get_the_ID();
		$ancestors       = array_reverse( get_post_ancestors( $current_post_id ) );

		foreach ( $ancestors as $ancestor ) {
			$breadcrumbs[] = array(
				'label' => get_the_title( $ancestor ),
				'url'   => get_permalink( $ancestor ),
			);
		}

		if ( ! is_front_page() ) {
			$breadcrumbs[] = array(
				'label' => get_the_title(),
				'url'   => null,
			);
		}
	}

	return $breadcrumbs;
}
