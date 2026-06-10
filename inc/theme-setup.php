<?php

// Init Timber with views/ directory only.
// Block templates are loaded via Twig paths added in the timber/loader/loader filter.
\Timber\Timber::init();
\Timber\Timber::$dirname = array( 'views' );

// Add blocks/ directory and theme root to Twig's search paths.
// This avoids Timber's LocationManager scanning blocks/ subdirectories,
// while still allowing Timber::compile('blocks/...') to resolve correctly.
add_filter(
	'timber/loader/loader',
	function ( $loader ) {
		$theme_root = get_template_directory();
		// Add theme root so 'blocks/...' paths resolve
		$loader->addPath( $theme_root );
		// Add blocks/ root so relative includes like 'section-intro/section-intro.twig' work
		$loader->addPath( $theme_root . '/blocks' );
		// Add views/ so existing view includes work from within block templates
		$loader->addPath( $theme_root . '/views' );
		return $loader;
	}
);

// Theme setup: supports, menus, text domain.
add_action( 'after_setup_theme', 'observata_setup' );
function observata_setup() {
	load_theme_textdomain( 'observata', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'html5', array( 'search-form', 'comment-list', 'comment-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );

	add_theme_support( 'appearance-tools' );
	add_theme_support( 'woocommerce' );

	// Disable comments across the site.
	add_action( 'init', 'observata_disable_comments' );

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

// Add favicon to wp_head.
add_action( 'wp_head', 'observata_add_favicon' );
function observata_add_favicon() {
	echo '<link rel="icon" type="image/svg+xml" href="' . esc_url( get_template_directory_uri() . '/assets/favicon.svg' ) . '">' . "\n";
}

// Enqueue editor-only stylesheet directly.
add_action( 'enqueue_block_editor_assets', 'observata_editor_styles' );
function observata_editor_styles() {
	wp_enqueue_style(
		'observata-editor',
		get_template_directory_uri() . '/style-editor.css',
		array(),
		filemtime( get_template_directory() . '/style-editor.css' )
	);
}

/**
 * Disable comments site-wide: removes support, hides from admin, and blocks the REST endpoint.
 */
function observata_disable_comments() {
	// Remove comments/trackbacks support from all post types.
	$post_types = get_post_types( array( 'public' => true ) );
	foreach ( $post_types as $post_type ) {
		if ( post_type_supports( $post_type, 'comments' ) ) {
			remove_post_type_support( $post_type, 'comments' );
			remove_post_type_support( $post_type, 'trackbacks' );
		}
	}

	// Close comments on the front end.
	add_filter( 'comments_open', '__return_false', 20, 2 );
	add_filter( 'pings_open', '__return_false', 20, 2 );

	// Hide existing comments.
	add_filter( 'comments_array', '__return_empty_array', 10, 2 );

	// Remove the comments admin page and menu item.
	add_action( 'admin_menu', function () {
		remove_menu_page( 'edit-comments.php' );
	} );

	// Redirect any direct access to comments admin pages.
	add_action( 'admin_init', function () {
		global $pagenow;
		if ( 'edit-comments.php' === $pagenow || 'comment.php' === $pagenow || 'options-discussion.php' === $pagenow ) {
			wp_safe_redirect( admin_url() );
			exit;
		}
	} );

	// Remove the comments metabox from the editor.
	add_action( 'add_meta_boxes', function () {
		remove_meta_box( 'commentsdiv', null, 'normal' );
		remove_meta_box( 'commentstatusdiv', null, 'normal' );
	}, 999 );

	// Disable comments REST endpoint.
	add_filter( 'rest_endpoints', function ( $endpoints ) {
		if ( isset( $endpoints['/wp/v2/comments'] ) ) {
			unset( $endpoints['/wp/v2/comments'] );
		}
		if ( isset( $endpoints['/wp/v2/comments/(?P<id>[\d]+)'] ) ) {
			unset( $endpoints['/wp/v2/comments/(?P<id>[\d]+)'] );
		}
		return $endpoints;
	} );
}

/**
 * Strip verbose WordPress body classes.
 * Keeps only custom classes passed via Layout::bodyClass() or get_body_class( '...' ).
 */
add_filter( 'body_class', 'observata_clean_body_class', 10, 2 );
function observata_clean_body_class( $classes, $class ) {
	// Classes injected by the theme (e.g. 'has-homepage-header') are in the $class param.
	// $classes contains everything WP auto-generates. Return only the explicit ones.
	return is_array( $class ) ? $class : array();
}
