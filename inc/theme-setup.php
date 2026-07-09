<?php

// Timber template directory — must be set BEFORE init() so the loader picks up the custom path.
\Timber\Timber::$dirname = array( 'views' );
\Timber\Timber::init();

add_filter( 'timber/twig/environment/options', 'observata_twig_cache_options' );
add_filter( 'timber/loader/loader', 'observata_twig_loader_paths' );
add_action( 'after_setup_theme', 'observata_setup' );
add_action( 'wp_head', 'observata_add_favicon' );
add_action( 'enqueue_block_assets', 'observata_editor_styles' );
add_action( 'init', 'observata_disable_comments' );
add_filter( 'body_class', 'observata_clean_body_class', 10, 2 );

// ─────────────────────────────────────────────────────────────────

// Enable Twig compilation cache in production only; dev/staging skip caching.
function observata_twig_cache_options( array $options ): array {
	if ( defined( 'WP_ENVIRONMENT' ) && 'production' === WP_ENVIRONMENT ) {
		$options['cache']       = get_template_directory() . '/cache/twig';
		$options['auto_reload'] = true;
	}

	return $options;
}

// Add blocks/ and views/ to Twig's search paths so relative includes resolve correctly.
function observata_twig_loader_paths( $loader ) {
	$theme_root = get_template_directory();
	$loader->addPath( $theme_root );
	$loader->addPath( $theme_root . '/blocks' );
	$loader->addPath( $theme_root . '/views' );

	return $loader;
}

// Theme setup: supports, menus, text domain.
function observata_setup(): void {
	load_theme_textdomain( 'observata', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-list', 'comment-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'appearance-tools' );

	global $content_width;

	if ( ! isset( $content_width ) ) {
		$content_width = 1920;
	}

	register_nav_menus(
		array(
			'main-menu' => esc_html__( 'Main Menu', 'observata' ),
			'footer-1'  => esc_html__( 'Footer 1', 'observata' ),
			'footer-2'  => esc_html__( 'Footer 2', 'observata' ),
			'footer-3'  => esc_html__( 'Footer 3', 'observata' ),
			'footer-4'  => esc_html__( 'Footer 4', 'observata' ),
		)
	);
}


// Check if the current environment is production (reads WP_ENVIRONMENT constant).
function observata_is_production(): bool {
	return defined( 'WP_ENVIRONMENT' ) && 'production' === WP_ENVIRONMENT;
}

// Add favicon to wp_head.
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

// Disable comments site-wide and clean up admin UI.
function observata_disable_comments(): void {
	// Remove support from all public post types.
	foreach ( get_post_types( array( 'public' => true ) ) as $post_type ) {
		remove_post_type_support( $post_type, 'comments' );
		remove_post_type_support( $post_type, 'trackbacks' );
	}

	// Close comments on the front end.
	add_filter( 'comments_open', '__return_false' );
	add_filter( 'pings_open', '__return_false' );

	// Remove comments menu from admin sidebar.
	add_action( 'admin_menu', function () {
		remove_menu_page( 'edit-comments.php' );
	} );

	// Remove discussion metabox from the editor.
	add_action( 'add_meta_boxes', function () {
		remove_meta_box( 'commentsdiv', 'post', 'normal' );
		remove_meta_box( 'commentstatusdiv', 'post', 'normal' );
	}, 999 );
}

// Strip verbose WordPress body classes — keep only explicit custom classes.
function observata_clean_body_class( array $classes, array|string $class ): array {
	return is_array( $class ) ? $class : array();
}
