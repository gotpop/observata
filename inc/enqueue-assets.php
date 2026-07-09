<?php

// ── Remove WordPress defaults ───────────────────────────────────

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );
remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
add_filter( 'emoji_svg_url', '__return_false' );

add_filter( 'should_load_separate_core_block_assets', '__return_false' );

remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles_css_custom_properties' );
remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles_styles' );
remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );

// ── Theme hooks ─────────────────────────────────────────────────

add_action( 'wp_enqueue_scripts', 'observata_remove_default_styles', 100 );
add_filter( 'style_loader_src', 'observata_cache_bust_theme_styles', 10, 2 );
add_action( 'wp_head', 'observata_preload_fonts', 1 );
add_action( 'wp_head', 'observata_preload_hero_scripts', 2 );
add_action( 'wp_head', 'observata_inline_critical_css', 1 );
add_action( 'wp_head', 'observata_add_favicon' );
add_action( 'enqueue_block_assets', 'observata_editor_styles' );
add_action( 'wp_enqueue_scripts', 'observata_enqueue' );

// ─────────────────────────────────────────────────────────────────

// Remove default WordPress frontend block styles.
function observata_remove_default_styles(): void {
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'classic-theme-styles' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'wp-img-auto-sizes' );
}

// Cache-bust block viewStyle CSS via filemtime().
function observata_cache_bust_theme_styles( string $src, string $handle ): string {
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

// Preload fonts so the browser discovers them before CSS is parsed.
function observata_preload_fonts(): void {
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

// Preload the homepage hero shader engine at high fetch priority.
function observata_preload_hero_scripts(): void {
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

// Inline critical CSS into <head> to eliminate render-blocking requests.
function observata_inline_critical_css(): void {
	// Development mode: use a <link> tag for dev tools + webpack watch refreshes.
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

	// Rewrite relative asset URLs to absolute paths so inlined CSS resolves fonts and assets correctly.
	$theme_uri = get_template_directory_uri();
	$css       = preg_replace(
		'/url\(\s*[\'"]?\.\.\/(assets\/[^)\'"]+)[\'"]?\)/',
		'url(\'' . $theme_uri . '/$1\')',
		$css
	);

	// Inline the CSS (already minified by webpack in production mode).
	printf(
		'<style id="observata-inline-css">%s</style>' . "\n",
		$css // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}

// Enqueue theme scripts and styles with cache-busting.
function observata_enqueue(): void {
	// CSS bundle with content-hash version; falls back to style.css if no build exists.
	$bundle_css = get_template_directory() . '/build/style-global.css';
	$asset_path = get_template_directory() . '/build/style-global.asset.php';

	// Production: CSS is inlined by observata_inline_critical_css(). Dev: enqueue <link> tag.
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

	// Read webpack asset manifest and register script with runtime + vendor dependencies.
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

	// Vendors chunk: three.js + shaders, shared by all entry points.
	$vendor_deps  = array();
	$vendors_path = $build_dir . '/vendors.asset.php';

	if ( file_exists( $vendors_path ) ) {
		$vendors_asset = require $vendors_path;
		wp_register_script( 'observata-vendors', $build_uri . '/vendors.js', $runtime_deps, $vendors_asset['version'], true );
		$vendor_deps = array( 'observata-vendors' );
	}

	// client.js — menu, intersection observer, tabs, subpage/card shaders. Loaded on all pages.
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

	// Defer all theme scripts — every script in the chain must be deferred or WP 6.3+ cascades back to render-blocking.
	$defer_handles = array( 'observata-runtime', 'observata-vendors', 'observata-client' );

	if ( wp_script_is( 'observata-home', 'enqueued' ) ) {
		$defer_handles[] = 'observata-home';
	}
	foreach ( $defer_handles as $handle ) {
		wp_script_add_data( $handle, 'strategy', 'defer' );
	}
}

// Add SVG favicon to <head>.
function observata_add_favicon(): void {
	echo '<link rel="icon" type="image/svg+xml" href="' . esc_url( get_template_directory_uri() . '/assets/favicon.svg' ) . '">' . "\n";
}

// Enqueue editor-only stylesheet; guarded with is_admin() so it only loads in the editor.
function observata_editor_styles(): void {
	if ( ! is_admin() ) {
		return;
	}

	wp_enqueue_style(
		'observata-editor',
		get_template_directory_uri() . '/style-editor.css',
		array(),
		filemtime( get_template_directory() . '/style-editor.css' )
	);
}
