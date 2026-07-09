<?php
/**
 * SEO enhancements: sitemap, robots.txt, canonical URLs, noindex.
 *
 * Meta description, Open Graph, Twitter Card, and JSON-LD schema are
 * handled by the "Native SEO Meta Tags" plugin.
 */

add_filter( 'wp_sitemaps_posts_query_args', 'observata_sitemap_exclude_pages' );
add_filter( 'wp_sitemaps_max_urls', 'observata_sitemap_max_urls' );
add_filter( 'wp_sitemaps_posts_entry', 'observata_sitemap_entry_lastmod', 10, 2 );
add_filter( 'robots_txt', 'observata_robots_txt', 10, 2 );
add_action( 'wp_head', 'observata_canonical_url', 2 );
add_action( 'wp_head', 'observata_noindex', 0 );

// ─────────────────────────────────────────────────────────────────

// Exclude utility pages from the core sitemap.
function observata_sitemap_exclude_pages( array $args ): array {
	$error_page = get_page_by_path( 'error-404' );

	if ( $error_page ) {
		$args['post__not_in']   = isset( $args['post__not_in'] ) ? $args['post__not_in'] : array();
		$args['post__not_in'][] = $error_page->ID;
	}

	return $args;
}

// Limit sitemap entries per page for faster generation.
function observata_sitemap_max_urls(): int {
	return 500;
}

// Include homepage lastmod in sitemap.
function observata_sitemap_entry_lastmod( array $entry, \WP_Post $post ): array {
	if ( 'page' === $post->post_type && (int) get_option( 'page_on_front' ) === $post->ID ) {
		$entry['lastmod'] = get_post_modified_time( 'c', false, $post );
	}

	return $entry;
}

// Generate a virtual robots.txt at /robots.txt.
function observata_robots_txt( string $output, string $public ): string {
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
	$output .= 'Sitemap: ' . esc_url( home_url( '/wp-sitemap.xml' ) ) . "\n";

	return $output;
}

// Ensure clean canonical URLs for archive and taxonomy pages.
function observata_canonical_url(): void {
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

// Prevent search engines from indexing low-value pages.
function observata_noindex(): void {
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
