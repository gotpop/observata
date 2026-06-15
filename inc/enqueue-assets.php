<?php

/**
 * Compute a cache-busting version from style.css and all CSS files it imports.
 *
 * style.css is just a stub containing @import './client/css/index.css', so
 * hashing style.css alone would never change when the actual styles change.
 * This hashes style.css plus every CSS file under client/css/ recursively.
 */
function observata_get_style_version(): string {
	$theme_dir = get_template_directory();
	$hashes    = array();

	// Hash style.css itself.
	$style_path = $theme_dir . '/style.css';
	if ( file_exists( $style_path ) ) {
		$hashes[] = md5_file( $style_path );
	}

	// Recursively hash every CSS file under client/css/.
	$css_dir = $theme_dir . '/client/css';
	if ( is_dir( $css_dir ) ) {
		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( $css_dir, RecursiveDirectoryIterator::SKIP_DOTS )
		);
		foreach ( $iterator as $file ) {
			if ( $file->getExtension() === 'css' ) {
				$hashes[] = md5_file( $file->getPathname() );
			}
		}
	}

	return md5( implode( '', $hashes ) );
}

/**
 * Cache-bust every theme CSS file via filemtime().
 *
 * Block viewStyle CSS files (registered via block.json) get the static theme
 * version ('1.0.0') from WordPress core — this filter overrides that with the
 * file's modification time so changes are always reflected.
 *
 * Runs on both frontend and editor styles.
 */
add_filter( 'style_loader_src', 'observata_cache_bust_theme_styles', 10, 2 );
function observata_cache_bust_theme_styles( $src, $handle ) {
	// Skip the main stylesheet — it uses the comprehensive hash from observata_get_style_version().
	if ( $handle === 'observata-style' ) {
		return $src;
	}

	$theme_uri = get_template_directory_uri();

	// Only process assets that belong to this theme.
	if ( strpos( $src, $theme_uri ) === false ) {
		return $src;
	}

	// Resolve the URL to a filesystem path.
	$theme_path = wp_parse_url( $theme_uri, PHP_URL_PATH );
	$url_path   = wp_parse_url( $src, PHP_URL_PATH );

	if ( ! $theme_path || ! $url_path || strpos( $url_path, $theme_path ) !== 0 ) {
		return $src;
	}

	$relative  = substr( $url_path, strlen( $theme_path ) );
	$file_path = get_template_directory() . $relative;

	if ( file_exists( $file_path ) ) {
		$src = remove_query_arg( 'ver', $src );
		$src = add_query_arg( 'ver', filemtime( $file_path ), $src );
	}

	return $src;
}

// Enqueue theme stylesheet and compiled client JS (with cache-busting).
add_action( 'wp_enqueue_scripts', 'observata_enqueue' );
function observata_enqueue() {
	// Version includes style.css + every @imported CSS file.
	$version = observata_get_style_version();
	wp_enqueue_style( 'observata-style', get_stylesheet_uri(), array(), $version );

	$client_asset_path = get_template_directory() . '/build/client.asset.php';
	if ( file_exists( $client_asset_path ) ) {
		$client_asset = require $client_asset_path;
		wp_enqueue_script( 'observata-client', get_template_directory_uri() . '/build/client.js', $client_asset['dependencies'], $client_asset['version'], true );
	}
}

// Preload fonts for faster loading and reduce FOUT
add_action( 'wp_head', 'observata_preload_fonts', 1 );
function observata_preload_fonts() {
	$font_url = get_template_directory_uri() . '/assets/fonts';
	?>
	<link rel="preload" href="<?php echo esc_url( $font_url ); ?>/inter/inter.woff2" as="font" type="font/woff2" crossorigin="anonymous">
	<link rel="preload" href="<?php echo esc_url( $font_url ); ?>/gantari/gantari.woff2" as="font" type="font/woff2" crossorigin="anonymous">
	<?php
}
