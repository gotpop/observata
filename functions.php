<?php

// Hide the admin toolbar on the front end.
add_filter('show_admin_bar', '__return_false');

// Hide the Posts menu item from wp-admin (no blog on this site).
add_action('admin_menu', 'observata_remove_admin_menus');
function observata_remove_admin_menus()
{
	remove_menu_page('edit.php');
}

// Load Composer autoloader (Timber, Twig, etc.) and custom block registration.
require get_template_directory() . '/vendor/autoload.php';
require get_template_directory() . '/inc/blocks.php';

// Init Timber and point it to the views/ directory for Twig templates.
\Timber\Timber::init();
\Timber\Timber::$dirname = ['views'];

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
	add_editor_style('editor-style.css');
	add_theme_support('appearance-tools');
	add_theme_support('woocommerce');
	global $content_width;
	if (!isset($content_width)) {
		$content_width = 1920;
	}
	register_nav_menus(array('main-menu' => esc_html__('Main Menu', 'observata')));
}

// Enqueue theme stylesheet and compiled client JS (with cache-busting).
add_action('wp_enqueue_scripts', 'observata_enqueue');
function observata_enqueue()
{
	$style_path = get_template_directory() . '/style.css';
	$version = file_exists($style_path) ? md5_file($style_path) : null;
	wp_enqueue_style('observata-style', get_stylesheet_uri(), [], $version);

	$client_asset_path = get_template_directory() . '/build/client.asset.php';
	if (file_exists($client_asset_path)) {
		$client_asset = require $client_asset_path;
		wp_enqueue_script('observata-client', get_template_directory_uri() . '/build/client.js', $client_asset['dependencies'], $client_asset['version'], true);
	}
}

// Inject device/browser classes on <html> for CSS targeting.
add_action('wp_footer', 'observata_footer');
function observata_footer()
{
	?>
	<script>
		(function () {
			const ua = navigator.userAgent.toLowerCase();
			const html = document.documentElement;
			if (/(iphone|ipod|ipad)/.test(ua)) {
				html.classList.add('ios', 'mobile');
			}
			else if (/android/.test(ua)) {
				html.classList.add('android', 'mobile');
			}
			else {
				html.classList.add('desktop');
			}
			if (/chrome/.test(ua) && !/edg|brave/.test(ua)) {
				html.classList.add('chrome');
			}
			else if (/safari/.test(ua) && !/chrome/.test(ua)) {
				html.classList.add('safari');
			}
			else if (/edg/.test(ua)) {
				html.classList.add('edge');
			}
			else if (/firefox/.test(ua)) {
				html.classList.add('firefox');
			}
			else if (/brave/.test(ua)) {
				html.classList.add('brave');
			}
			else if (/opr|opera/.test(ua)) {
				html.classList.add('opera');
			}
		})();
	</script>
	<?php
}

// Use | as the document title separator.
add_filter('document_title_separator', 'observata_document_title_separator');
function observata_document_title_separator($sep)
{
	$sep = esc_html('|');
	return $sep;
}

// Fall back to '...' for empty post titles.
add_filter('the_title', 'observata_title');
function observata_title($title)
{
	if ($title == '') {
		return esc_html('...');
	} else {
		return wp_kses_post($title);
	}
}

// Output Schema.org itemscope/itemtype attributes based on the current page type.
function observata_schema_type()
{
	$schema = 'https://schema.org/';
	if (is_single()) {
		$type = "Article";
	} elseif (is_author()) {
		$type = 'ProfilePage';
	} elseif (is_search()) {
		$type = 'SearchResultsPage';
	} else {
		$type = 'WebPage';
	}
	echo 'itemscope itemtype="' . esc_url($schema) . esc_attr($type) . '"';
}

// Add itemprop="url" to nav menu links for Schema.org compliance.
add_filter('nav_menu_link_attributes', 'observata_schema_url', 10);
function observata_schema_url($atts)
{
	$atts['itemprop'] = 'url';
	return $atts;
}

// Compatibility shim for wp_body_open().
if (!function_exists('observata_wp_body_open')) {
	function observata_wp_body_open()
	{
		do_action('wp_body_open');
	}
}

// Output a skip-to-content link for keyboard/screen reader accessibility.
add_action('wp_body_open', 'observata_skip_link', 5);
function observata_skip_link()
{
	echo '<a href="#content" class="skip-link screen-reader-text">' . esc_html__('Skip to the content', 'observata') . '</a>';
}

// Custom "read more" link for post content and excerpts.
add_filter('the_content_more_link', 'observata_read_more_link');
function observata_read_more_link()
{
	if (!is_admin()) {
		return ' <a href="' . esc_url(get_permalink()) . '" class="more-link">' . sprintf(__('...%s', 'observata'), '<span class="screen-reader-text">  ' . esc_html(get_the_title()) . '</span>') . '</a>';
	}
}
add_filter('excerpt_more', 'observata_excerpt_read_more_link');
function observata_excerpt_read_more_link($more)
{
	if (!is_admin()) {
		global $post;
		return ' <a href="' . esc_url(get_permalink($post->ID)) . '" class="more-link">' . sprintf(__('...%s', 'observata'), '<span class="screen-reader-text">  ' . esc_html(get_the_title()) . '</span>') . '</a>';
	}
}

// Disable big image downscaling and remove unused intermediate image sizes.
add_filter('big_image_size_threshold', '__return_false');
add_filter('intermediate_image_sizes_advanced', 'observata_image_insert_override');
function observata_image_insert_override($sizes)
{
	unset($sizes['medium_large']);
	unset($sizes['1536x1536']);
	unset($sizes['2048x2048']);
	return $sizes;
}

// Register the primary sidebar widget area.
add_action('widgets_init', 'observata_widgets_init');
function observata_widgets_init()
{
	register_sidebar(array(
		'name' => esc_html__('Sidebar Widget Area', 'observata'),
		'id' => 'primary-widget-area',
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	));
}

// Output pingback link tag for singular posts that allow pings.
add_action('wp_head', 'observata_pingback_header');
function observata_pingback_header()
{
	if (is_singular() && pings_open()) {
		printf('<link rel="pingback" href="%s">' . "\n", esc_url(get_bloginfo('pingback_url')));
	}
}

// Enqueue comment-reply script only when threaded comments are enabled.
add_action('comment_form_before', 'observata_enqueue_comment_reply_script');
function observata_enqueue_comment_reply_script()
{
	if (get_option('thread_comments')) {
		wp_enqueue_script('comment-reply');
	}
}

// Render pingback/trackback comments as a simple list item.
function observata_custom_pings($comment)
{
	?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
		<?php comment_author_link(); ?></li>
	<?php
}

// Count only approved non-pingback comments for display.
add_filter('get_comments_number', 'observata_comment_count', 0);
function observata_comment_count($count)
{
	if (!is_admin()) {
		global $id;
		$get_comments = get_comments('status=approve&post_id=' . $id);
		$comments_by_type = separate_comments($get_comments);
		return count($comments_by_type['comment']);
	} else {
		return $count;
	}
}
