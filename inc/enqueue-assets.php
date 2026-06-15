<?php

/**
 * Cache-bust block viewStyle CSS via filemtime().
 *
 * The main stylesheet (observata-style) is bundled by webpack and gets a
 * content-hash version automatically. Block viewStyle files are registered
 * by WordPress core with the static theme version — this filter overrides
 * that with the file's modification time.
 */
add_filter( 'style_loader_src', 'observata_cache_bust_theme_styles', 10, 2 );
function observata_cache_bust_theme_styles( $src, $handle ) {
	// Skip the webpack-bundled stylesheet — it already has a content-hash version.
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

// Enqueue bundled stylesheet and compiled client JS (with cache-busting).
add_action( 'wp_enqueue_scripts', 'observata_enqueue' );
function observata_enqueue() {
	// Webpack bundles all @imported CSS into build/style-global.css with a
	// content-hash version. Falls back to style.css if the build doesn't exist.
	$bundle_css  = get_template_directory() . '/build/style-global.css';
	$asset_path  = get_template_directory() . '/build/style-global.asset.php';

	if ( file_exists( $bundle_css ) && file_exists( $asset_path ) ) {
		$asset = require $asset_path;
		wp_enqueue_style( 'observata-style', get_template_directory_uri() . '/build/style-global.css', array(), $asset['version'] );
	} else {
		// Fallback for development before first build.
		wp_enqueue_style( 'observata-style', get_stylesheet_uri(), array(), filemtime( get_template_directory() . '/style.css' ) );
	}

	$client_asset_path = get_template_directory() . '/build/client.asset.php';
	if ( file_exists( $client_asset_path ) ) {
		$client_asset = require $client_asset_path;
		wp_enqueue_script( 'observata-client', get_template_directory_uri() . '/build/client.js', $client_asset['dependencies'], $client_asset['version'], true );
	}
}
