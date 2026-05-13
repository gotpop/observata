<?php

$context = \Timber\Timber::context();
$post    = \Timber\Timber::get_post();

if ( ! $post ) {
	wp_safe_redirect( home_url( '/' ) );
	exit;
}

$post->setup();
$context['post']                = $post;
$context['body_class']          = implode( ' ', get_body_class() );
$context['is_image_attachment'] = wp_attachment_is_image( $post->ID );
$context['attachment_url']      = wp_get_attachment_url( $post->ID );

if ( $post->post_parent ) {
	$context['parent_permalink'] = get_permalink( $post->post_parent );
	$context['parent_title']     = get_the_title( $post->post_parent );
}

if ( $context['is_image_attachment'] ) {
	$context['attachment_image'] = wp_get_attachment_image_src( $post->ID, 'full' );
}

$context['show_comments'] = comments_open( $post->ID ) && ! post_password_required( $post->ID );

\Timber\Timber::render( 'templates/blog-attachment.twig', $context );
