<?php

$context     = \Timber\Timber::context();
$timber_post = \Timber\Timber::get_post();

if ( ! $timber_post ) {
	wp_safe_redirect( home_url( '/' ) );
	exit;
}

$timber_post->setup();
$context['post']                = $timber_post;
$context['body_class']          = implode( ' ', get_body_class() );
$context['is_image_attachment'] = wp_attachment_is_image( $timber_post->ID );
$context['attachment_url']      = wp_get_attachment_url( $timber_post->ID );

if ( $timber_post->post_parent ) {
	$context['parent_permalink'] = get_permalink( $timber_post->post_parent );
	$context['parent_title']     = get_the_title( $timber_post->post_parent );
}

if ( $context['is_image_attachment'] ) {
	$context['attachment_image'] = wp_get_attachment_image_src( $timber_post->ID, 'full' );
}

\Timber\Timber::render( 'templates/blog-attachment.twig', $context );
