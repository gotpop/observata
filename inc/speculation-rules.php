<?php

// Output speculation rules for improved navigation performance.
add_action( 'wp_head', 'observata_speculation_rules', 2 );
function observata_speculation_rules() {
	// Only output on front end, not admin or preview
	if ( is_admin() || is_preview() ) {
		return;
	}

	// Get main menu URLs for speculation
	$urls = array();

	// Try to get menu by location first
	$locations = get_nav_menu_locations();
	$menu_id   = isset( $locations['main-menu'] ) ? $locations['main-menu'] : 0;

	// If no menu found by location, try to get it by name/slug
	if ( ! $menu_id ) {
		$menu = get_term_by( 'slug', 'main-menu', 'nav_menu' );
		if ( $menu ) {
			$menu_id = $menu->term_id;
		}
	}

	// Get menu items if we have a menu
	if ( $menu_id ) {
		$menu_items = wp_get_nav_menu_items( $menu_id );
		if ( $menu_items ) {
			foreach ( $menu_items as $item ) {
				// Include all internal navigation links
				$url = esc_url( $item->url );
				// Check if it's an internal URL (starts with home URL) and not a hash link
				if ( strpos( $url, home_url( '/' ) ) === 0 && strpos( $url, '#' ) !== 0 && ! in_array( $url, $urls ) ) {
					$urls[] = $url;
				}
			}
		}
	}

	// If still no URLs, add some common internal pages as fallback
	if ( empty( $urls ) ) {
		// Try to get common pages
		$common_pages = array(
			'about',
			'services',
			'contact',
			'blog',
			'news',
		);

		foreach ( $common_pages as $page_slug ) {
			$page = get_page_by_path( $page_slug );
			if ( $page ) {
				$url = get_permalink( $page->ID );
				if ( $url && ! in_array( $url, $urls ) ) {
					$urls[] = $url;
				}
			}
		}
	}

	// If no URLs found, don't output speculation rules
	if ( empty( $urls ) ) {
		return;
	}

	// Build speculation rules configuration
	$rules = array(
		'prefetch' => array(
			array(
				'source'    => 'list',
				'urls'      => $urls,
				'eagerness' => 'moderate',
			),
		),
	);
	$json  = wp_json_encode( $rules, JSON_UNESCAPED_SLASHES );
	if ( $json === false ) {
		return;
	}
	?>
	<script type="speculationrules">
	<?php echo $json; ?>
	</script>
	<?php
}

// Output pingback link tag for singular posts that allow pings.
add_action( 'wp_head', 'observata_pingback_header' );
function observata_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">' . "\n", esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}