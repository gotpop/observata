<?php

// Timber template directory — must be set BEFORE init() so the loader picks up the custom path.
\Timber\Timber::$dirname = array( 'views' );
\Timber\Timber::init();

add_filter( 'timber/twig/environment/options', 'observata_twig_cache_options' );
add_filter( 'timber/loader/loader', 'observata_twig_loader_paths' );
add_action( 'after_setup_theme', 'observata_setup' );

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
