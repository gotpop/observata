<?php
/**
 * SEO enhancements: sitemap optimisation, robots.txt, canonical URLs,
 * and noindex for low-value pages.
 *
 * Meta description, Open Graph, Twitter Card, and JSON-LD schema are
 * handled by the "Native SEO Meta Tags" plugin. This file only provides
 * what the plugin does not cover.
 *
 * Uses WordPress 5.5+ core sitemaps as the foundation and enhances them.
 */

// ─── Core Sitemap Optimisation ────────────────────────────────────────────────

/**
 * Exclude utility pages from the sitemap.
 * WordPress core sitemaps already include posts, pages, categories, tags, and users.
 */
add_filter(
	'wp_sitemaps_posts_query_args',
	function ( $args ) {
		if ( isset( $args['meta_query'] ) ) {
			return $args;
		}

		// Exclude the error-404 page from the sitemap.
		$error_page = get_page_by_path( 'error-404' );
		if ( $error_page ) {
			$args['post__not_in']   = isset( $args['post__not_in'] ) ? $args['post__not_in'] : array();
			$args['post__not_in'][] = $error_page->ID;
		}

		return $args;
	}
);

/**
 * Set maximum entries per sitemap page.
 * Lower value = faster sitemap generation, less server load.
 */
add_filter( 'wp_sitemaps_max_urls', function () {
	return 500;
} );

/**
 * Include homepage in the sitemap with proper lastmod.
 */
add_filter(
	'wp_sitemaps_posts_entry',
	function ( $entry, $post ) {
		if ( 'page' === $post->post_type && (int) get_option( 'page_on_front' ) === $post->ID ) {
			$entry['lastmod'] = get_post_modified_time( 'c', false, $post );
		}
		return $entry;
	},
	10,
	2
);

// ─── robots.txt Virtual File ──────────────────────────────────────────────────

/**
 * Generate a virtual robots.txt. WordPress will serve this at /robots.txt
 * automatically when no physical robots.txt file exists in the root.
 */
add_filter(
	'robots_txt',
	function ( $output, $public ) {
		if ( '0' === $public ) {
			return $output;
		}

		$site_url = wp_parse_url( site_url() );
		$path     = isset( $site_url['path'] ) ? $site_url['path'] : '';

		$output  = "User-agent: *\n";
		$output .= "Disallow: $path/wp-admin/\n";
		$output .= "Disallow: $path/wp-includes/\n";
		$output .= "Disallow: $path/wp-content/plugins/\n";
		$output .= "Disallow: $path/wp-content/cache/\n";
		$output .= "Disallow: $path/trackback/\n";
		$output .= "Disallow: $path/feed/\n";
		$output .= "Disallow: $path/comments/feed/\n";
		$output .= "Disallow: $path/?s=\n";
		$output .= "Allow: $path/wp-admin/admin-ajax.php\n";
		$output .= "Allow: $path/wp-content/themes/\n";
		$output .= "Allow: $path/wp-content/uploads/\n";
		$output .= "\n";
		$output .= "Sitemap: " . esc_url( home_url( '/wp-sitemap.xml' ) ) . "\n";

		return $output;
	},
	10,
	2
);

// ─── Canonical URL ───────────────────────────────────────────────────────────

/**
 * Ensure clean canonical URLs for archive and taxonomy pages.
 * Singular post canonicals are handled by WordPress core + the SEO plugin.
 */
add_action( 'wp_head', 'observata_canonical_url', 2 );
function observata_canonical_url() {
	$url = '';

	if ( is_category() || is_tag() || is_tax() ) {
		$url = get_term_link( get_queried_object() );
	} elseif ( is_author() ) {
		$url = get_author_posts_url( get_queried_object_id() );
	} elseif ( is_post_type_archive() ) {
		$url = get_post_type_archive_link( get_post_type() );
	} elseif ( is_home() && ! is_front_page() ) {
		$url = get_permalink( get_option( 'page_for_posts' ) );
	}

	if ( $url && ! is_wp_error( $url ) ) {
		printf(
			'<link rel="canonical" href="%s">' . "\n",
			esc_url( $url )
		);
	}
}

// ─── Noindex for Low-Value Pages ─────────────────────────────────────────────

/**
 * Prevent search engines from indexing low-value pages.
 */
add_action( 'wp_head', 'observata_noindex', 0 );
function observata_noindex() {
	$noindex = false;

	if ( is_search() || is_404() ) {
		$noindex = true;
	}

	// Allow filtering.
	$noindex = apply_filters( 'observata_noindex', $noindex );

	if ( $noindex ) {
		echo '<meta name="robots" content="noindex, follow">' . "\n";
	}
}
