<?php



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
