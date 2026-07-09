<?php
/**
 * Disable comments site-wide and clean up admin UI.
 */

add_action( 'init', 'observata_disable_comments' );

// ─────────────────────────────────────────────────────────────────

// Remove support from post types, close frontend, hide admin UI.
function observata_disable_comments(): void {
	foreach ( get_post_types( array( 'public' => true ) ) as $post_type ) {
		remove_post_type_support( $post_type, 'comments' );
		remove_post_type_support( $post_type, 'trackbacks' );
	}

	add_filter( 'comments_open', '__return_false' );
	add_filter( 'pings_open', '__return_false' );

	add_action( 'admin_menu', function () {
		remove_menu_page( 'edit-comments.php' );
	} );

	add_action( 'add_meta_boxes', function () {
		remove_meta_box( 'commentsdiv', 'post', 'normal' );
		remove_meta_box( 'commentstatusdiv', 'post', 'normal' );
	}, 999 );
}
