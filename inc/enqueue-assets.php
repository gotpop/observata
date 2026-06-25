<?php

// Disable WordPress emoji scripts and styles.
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );
remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
add_filter( 'emoji_svg_url', '__return_false' );

/**
 * Remove default WordPress frontend styles that inject unwanted CSS variables
 * and inline styles into <head>. This theme provides its own complete design
 * system and doesn't rely on WordPress defaults.
 */
add_action( 'wp_enqueue_scripts', 'observata_remove_default_styles', 100 );
function observata_remove_default_styles() {
	// Core block library styles (wp-block-library, wp-block-library-inline-css)
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );

	// Classic theme styles (classic-theme-styles-inline-css)
	wp_dequeue_style( 'classic-theme-styles' );

	// Global styles / theme.json (global-styles-inline-css)
	wp_dequeue_style( 'global-styles' );

	// Image auto-sizes inline styles (wp-img-auto-sizes-contain-inline-css)
	wp_dequeue_style( 'wp-img-auto-sizes' );

	// Defer to register_block_styles for its inline styles. The filter
	// below stops core from registering all default block stylesheets.
}

// Prevent WordPress from registering and enqueuing block stylesheets
// bundled with core (e.g. wp-block-button, wp-block-quote, etc.).
add_filter( 'should_load_separate_core_block_assets', '__return_false' );

// Remove the global styles (theme.json) REST endpoint and inline CSS output.
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles_css_custom_properties' );
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles_styles' );
remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );

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

// Preload fonts so the browser starts downloading them immediately,
// before the CSS is parsed and @font-face is discovered.
add_action( 'wp_head', 'observata_preload_fonts', 1 );
function observata_preload_fonts() {
	$fonts = array(
		'inter'   => '/assets/fonts/inter/inter.woff2',
		'gantari' => '/assets/fonts/gantari/gantari.woff2',
	);

	foreach ( $fonts as $path ) {
		printf(
			'<link rel="preload" href="%1$s" as="font" type="font/woff2" crossorigin>' . "\n",
			esc_url( get_template_directory_uri() . $path )
		);
	}
}

// High-priority preload of the vendors chunk on the homepage so the shader
// engine starts downloading the instant the browser parses <head> — in
// parallel with the HTML and at the same fetch priority a blocking script
// would get. Paired with the `defer` strategy on observata-home, this
// eliminates render blocking without slowing the shader's start time.
add_action( 'wp_head', 'observata_preload_hero_scripts', 2 );
function observata_preload_hero_scripts() {
	if ( ! is_front_page() ) {
		return;
	}

	$vendors_asset_path = get_template_directory() . '/build/vendors.asset.php';
	if ( ! file_exists( $vendors_asset_path ) ) {
		return;
	}

	$vendors_asset = require $vendors_asset_path;

	printf(
		'<link rel="preload" href="%1$s" as="script" fetchpriority="high">' . "\n",
		esc_url( get_template_directory_uri() . '/build/vendors.js?ver=' . $vendors_asset['version'] )
	);
}

// Inline the global stylesheet directly into <head> to eliminate the last
// render-blocking CSS request. Registered at the top level so the hook is in
// place before wp_head fires — all conditional logic lives inside the function.
add_action( 'wp_head', 'observata_inline_critical_css', 1 );
function observata_inline_critical_css() {
	// Development mode: use a regular <link> tag for dev tools + webpack
	// watch refreshes. The <link> is enqueued by observata_enqueue().
	if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
		return;
	}

	$bundle_css = get_template_directory() . '/build/style-global.css';

	if ( ! file_exists( $bundle_css ) ) {
		return;
	}

	$css = file_get_contents( $bundle_css ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

	if ( false === $css || '' === trim( $css ) ) {
		return;
	}

	// Rewrite relative asset URLs to absolute paths. When CSS is loaded via
	// a <link> tag, relative URLs resolve relative to the stylesheet's
	// location (build/ → ../assets/ resolves correctly). When inlined in a
	// <style> tag, relative URLs resolve relative to the document URL
	// (the page itself), which breaks font and asset paths.
	$theme_uri = get_template_directory_uri();
	$css       = preg_replace(
		'/url\(\s*[\'"]?\.\.\/(assets\/[^)\'"]+)[\'"]?\)/',
		'url(\'' . $theme_uri . '/$1\')',
		$css
	);

	// Inline the CSS. No minification here — webpack already produces
	// minified output in production mode.
	printf(
		'<style id="observata-inline-css">%s</style>' . "\n",
		$css // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}

// Enqueue bundled stylesheet and compiled client JS (with cache-busting).
add_action( 'wp_enqueue_scripts', 'observata_enqueue' );
function observata_enqueue() {
	// Webpack bundles all @imported CSS into build/style-global.css with a
	// content-hash version. Falls back to style.css if the build doesn't exist.
	$bundle_css = get_template_directory() . '/build/style-global.css';
	$asset_path = get_template_directory() . '/build/style-global.asset.php';

	// CSS strategy:
	// - Production (SCRIPT_DEBUG off): inlined into <head> by
	// observata_inline_critical_css(). Do NOT enqueue here — that would
	// create a render-blocking <link> tag.
	// - Development (SCRIPT_DEBUG on): enqueue a regular <link> tag so dev
	// tools and webpack watch-mode refreshes work as expected.
	// - Pre-build fallback: enqueue style.css.
	if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
		// Development: standard <link> tag for dev tools + webpack refreshes.
		if ( file_exists( $bundle_css ) && file_exists( $asset_path ) ) {
			$asset = require $asset_path;
			wp_enqueue_style( 'observata-style', get_template_directory_uri() . '/build/style-global.css', array(), $asset['version'] );
		} else {
			// Fallback for development before first build.
			wp_enqueue_style( 'observata-style', get_stylesheet_uri(), array(), filemtime( get_template_directory() . '/style.css' ) );
		}
	}

	// Helper: read a webpack asset.php manifest and register + enqueue the
	// script with its runtime + vendor chunk dependencies.
	$build_dir    = get_template_directory() . '/build';
	$build_uri    = get_template_directory_uri() . '/build';
	$runtime_path = $build_dir . '/runtime.asset.php';

	// The runtime chunk manages all webpack chunk loading — must come first.
	$runtime_deps = array();
	if ( file_exists( $runtime_path ) ) {
		$runtime_asset = require $runtime_path;
		wp_register_script( 'observata-runtime', $build_uri . '/runtime.js', array(), $runtime_asset['version'], true );
		$runtime_deps = array( 'observata-runtime' );
	}

	// The vendors chunk contains three.js + shaders library — shared by all
	// entry points so the library is only downloaded once.
	$vendor_deps  = array();
	$vendors_path = $build_dir . '/vendors.asset.php';
	if ( file_exists( $vendors_path ) ) {
		$vendors_asset = require $vendors_path;
		wp_register_script( 'observata-vendors', $build_uri . '/vendors.js', $runtime_deps, $vendors_asset['version'], true );
		$vendor_deps = array( 'observata-vendors' );
	}

	// client.js — menu, intersection observer, tabs, subpage/card shaders.
	// Loaded on all pages.
	$client_asset_path = $build_dir . '/client.asset.php';
	if ( file_exists( $client_asset_path ) ) {
		$client_asset = require $client_asset_path;
		$client_deps  = array_merge( $client_asset['dependencies'], $vendor_deps );
		wp_enqueue_script( 'observata-client', $build_uri . '/client.js', $client_deps, $client_asset['version'], true );
	}

	// home.js — homepage hero shader. Only loaded on the homepage.
	$home_asset_path = $build_dir . '/home.asset.php';
	if ( is_front_page() && file_exists( $home_asset_path ) ) {
		$home_asset = require $home_asset_path;
		$home_deps  = array_merge( $home_asset['dependencies'], $vendor_deps );
		wp_register_script( 'observata-home', $build_uri . '/home.js', $home_deps, $home_asset['version'], false );
		wp_enqueue_script( 'observata-home' );
	}

	// Apply `defer` strategy to ALL theme scripts consistently.
	//
	// All theme scripts run inside DOMContentLoaded handlers, so deferring
	// is safe — deferred scripts execute in dependency order after parsing
	// completes and before DOMContentLoaded fires.
	//
	// CRITICAL: This MUST cover every script in the dependency chain.
	// WordPress 6.3+ will strip `defer` from a script if a non-deferred
	// (blocking) script depends on it — to preserve execution order.
	// Previously client.js (blocking) depended on vendors.js (deferred),
	// which cascaded and stripped defer from vendors.js AND runtime.js,
	// making them all render-blocking again.
	//
	// With all four handles deferred, the browser's preload scanner starts
	// every download immediately (in parallel with the HTML, no blocking),
	// and the H1 (the LCP element) paints as soon as it's parsed.
	$defer_handles = array( 'observata-runtime', 'observata-vendors', 'observata-client' );
	if ( wp_script_is( 'observata-home', 'enqueued' ) ) {
		$defer_handles[] = 'observata-home';
	}
	foreach ( $defer_handles as $handle ) {
		wp_script_add_data( $handle, 'strategy', 'defer' );
	}
}
