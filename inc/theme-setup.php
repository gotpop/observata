<?php

// Init Timber with views/ directory only.
// Block templates are loaded via Twig paths added in the timber/loader/loader filter.
\Timber\Timber::init();
\Timber\Timber::$dirname = ['views'];

// Add blocks/ directory and theme root to Twig's search paths.
// This avoids Timber's LocationManager scanning blocks/ subdirectories,
// while still allowing Timber::compile('blocks/...') to resolve correctly.
add_filter('timber/loader/loader', function ($loader) {
	$theme_root = get_template_directory();
	// Add theme root so 'blocks/...' paths resolve
	$loader->addPath($theme_root);
	// Add blocks/ root so relative includes like 'section-intro/section-intro.twig' work
	$loader->addPath($theme_root . '/blocks');
	// Add views/ so existing view includes work from within block templates
	$loader->addPath($theme_root . '/views');
	return $loader;
});

// Theme setup: supports, menus, text domain.
add_action('after_setup_theme', 'observata_setup');
function observata_setup()
{
	load_theme_textdomain('observata', get_template_directory() . '/languages');
	add_theme_support('title-tag');
	add_theme_support('automatic-feed-links');
	add_theme_support('post-thumbnails');
	add_theme_support('custom-logo');
	add_theme_support('html5', array('search-form', 'comment-list', 'comment-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets'));
	add_theme_support('responsive-embeds');
	add_theme_support('align-wide');
	add_theme_support('wp-block-styles');
	add_theme_support('editor-styles');
	add_editor_style('style-editor.css');
	add_editor_style('client/css/global/fonts.css');
	add_editor_style('client/css/global/variables.css');
	add_editor_style('client/css/global/layout.css');

	// Auto-discover all block CSS files and register as editor styles.
	$blocks_dir = get_template_directory() . '/blocks';
	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator($blocks_dir, RecursiveDirectoryIterator::SKIP_DOTS)
	);
	foreach ($iterator as $file) {
		if ($file->isFile() && $file->getExtension() === 'css') {
			$relative = str_replace(get_template_directory() . '/', '', $file->getPathname());
			add_editor_style($relative);
		}
	}

	add_theme_support('appearance-tools');
	add_theme_support('woocommerce');
	global $content_width;
	if (!isset($content_width)) {
		$content_width = 1920;
	}
	register_nav_menus(array(
		'main-menu' => esc_html__('Main Menu', 'observata'),
		'footer-1' => esc_html__('Footer 1', 'observata'),
		'footer-2' => esc_html__('Footer 2', 'observata'),
		'footer-3' => esc_html__('Footer 3', 'observata'),
		'footer-4' => esc_html__('Footer 4', 'observata'),
	));
}