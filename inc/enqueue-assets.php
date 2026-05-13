<?php

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

// Enqueue comment-reply script only when threaded comments are enabled.
add_action('comment_form_before', 'observata_enqueue_comment_reply_script');
function observata_enqueue_comment_reply_script()
{
	if (get_option('thread_comments')) {
		wp_enqueue_script('comment-reply');
	}
}