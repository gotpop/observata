<?php

// Hide the admin toolbar on the front end.
add_filter( 'show_admin_bar', '__return_false' );

// Replace "Howdy," with a friendlier greeting in the admin bar.
add_filter( 'gettext', 'observata_replace_howdy', 10, 3 );
function observata_replace_howdy( $translated, $text, $domain ) {
	if ( 'default' === $domain && false !== strpos( $text, 'Howdy' ) ) {
		$translated = str_replace( 'Howdy', 'Hej', $text );
	}
	return $translated;
}

// Enqueue admin stylesheet.
add_action( 'admin_enqueue_scripts', 'observata_admin_styles' );
function observata_admin_styles() {
	wp_enqueue_style(
		'observata-admin',
		get_template_directory_uri() . '/client/css/admin.css',
		array(),
		filemtime( get_template_directory() . '/client/css/admin.css' )
	);
}