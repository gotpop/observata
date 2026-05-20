<?php

// Enqueue theme stylesheet and compiled client JS (with cache-busting).
add_action( 'wp_enqueue_scripts', 'observata_enqueue' );
function observata_enqueue() {
	$style_path = get_template_directory() . '/style.css';
	$version    = file_exists( $style_path ) ? md5_file( $style_path ) : null;
	wp_enqueue_style( 'observata-style', get_stylesheet_uri(), array(), $version );

	$client_asset_path = get_template_directory() . '/build/client.asset.php';
	if ( file_exists( $client_asset_path ) ) {
		$client_asset = require $client_asset_path;
		wp_enqueue_script( 'observata-client', get_template_directory_uri() . '/build/client.js', $client_asset['dependencies'], $client_asset['version'], true );
	}
}

// Preload fonts for faster loading and reduce FOUT
add_action( 'wp_head', 'observata_preload_fonts', 1 );
function observata_preload_fonts() {
	$font_url = get_template_directory_uri() . '/assets/fonts';
	?>
	<link rel="preload" href="<?php echo esc_url( $font_url ); ?>/inter/inter.woff2" as="font" type="font/woff2" crossorigin="anonymous">
	<link rel="preload" href="<?php echo esc_url( $font_url ); ?>/gantari/gantari.woff2" as="font" type="font/woff2" crossorigin="anonymous">
	<?php
}

// Enqueue comment-reply script only when threaded comments are enabled.
add_action( 'comment_form_before', 'observata_enqueue_comment_reply_script' );
function observata_enqueue_comment_reply_script() {
	if ( get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
