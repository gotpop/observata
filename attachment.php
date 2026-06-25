<?php

$context  = \Timber\Timber::context();
$post_obj = \Timber\Timber::get_post();

if ( ! $post_obj ) {
	wp_safe_redirect( home_url( '/' ) );
	exit;
}

$post_obj->setup();
$context['post']                = $post_obj;
$context['body_class']          = implode( ' ', get_body_class() );
$context['is_image_attachment'] = wp_attachment_is_image( $post_obj->ID );
$context['attachment_url']      = wp_get_attachment_url( $post_obj->ID );

if ( $post_obj->post_parent ) {
	$context['parent_permalink'] = get_permalink( $post_obj->post_parent );
	$context['parent_title']     = get_the_title( $post_obj->post_parent );
}

if ( $context['is_image_attachment'] ) {
	$context['attachment_image'] = wp_get_attachment_image_src( $post_obj->ID, 'full' );
}

\Timber\Timber::render( 'templates/blog-attachment.twig', $context );
