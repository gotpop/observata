<?php

// Load Composer autoloader (Timber, Twig, etc.) and custom block registration.
require get_template_directory() . '/vendor/autoload.php';

// Load theme functionality from inc/ directory
require get_template_directory() . '/inc/admin-bar.php';
require get_template_directory() . '/inc/theme-setup.php';
require get_template_directory() . '/inc/enqueue-assets.php';
require get_template_directory() . '/inc/device-detection.php';
require get_template_directory() . '/inc/content-filters.php';
require get_template_directory() . '/inc/schema-markup.php';
require get_template_directory() . '/inc/accessibility.php';
require get_template_directory() . '/inc/image-optimization.php';
require get_template_directory() . '/inc/widgets.php';
require get_template_directory() . '/inc/speculation-rules.php';
require get_template_directory() . '/inc/comments.php';

// Load existing functionality
require get_template_directory() . '/inc/block-renderer.php';
require get_template_directory() . '/inc/blocks.php';
require get_template_directory() . '/inc/unsplash-handler.php';




