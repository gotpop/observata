<?php

// Output speculation rules for improved navigation performance.
add_action( 'wp_head', 'observata_speculation_rules', 2 );
function observata_speculation_rules() {
	// Allow disabling via query param: ?no_speculation=1
	if ( isset( $_GET['no_speculation'] ) ) {
		return;
	}

	// Allow disabling via constant in wp-config.php: define( 'OBSERVATA_NO_SPECULATION', true );
	if ( defined( 'OBSERVATA_NO_SPECULATION' ) && OBSERVATA_NO_SPECULATION ) {
		return;
	}

	// Allow disabling via Settings > General
	if ( get_option( 'observata_disable_speculation', false ) ) {
		return;
	}

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
		'prerender' => array(
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

// Add speculation rules toggle to Settings > General.
add_action( 'admin_init', 'observata_speculation_settings' );
function observata_speculation_settings() {
	add_settings_section(
		'observata_performance_section',
		'Performance',
		'observata_performance_section_callback',
		'general'
	);

	add_settings_field(
		'observata_disable_speculation',
		'Speculation Rules',
		'observata_disable_speculation_render',
		'general',
		'observata_performance_section'
	);

	register_setting(
		'general',
		'observata_disable_speculation',
		array(
			'type'              => 'boolean',
			'sanitize_callback' => 'rest_sanitize_boolean',
			'default'           => false,
		)
	);
}

function observata_performance_section_callback() {
	echo '<p>Performance-related settings for the Observata theme.</p>';
}

function observata_disable_speculation_render() {
	$checked = (bool) get_option( 'observata_disable_speculation', false );
	?>
	<label>
		<input type="checkbox"
				id="observata_disable_speculation"
				name="observata_disable_speculation"
				value="1"
				<?php checked( $checked ); ?>>
		Disable speculation rules (prerendering)
	</label>
	<p class="description">When checked, pages from the main menu will not be speculatively prerendered. Useful for debugging navigation or scripting issues.</p>
	<?php
}