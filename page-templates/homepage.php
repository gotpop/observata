<?php
/**
 * Template Name: Homepage
 *
 * Assign this template to any page via Page Attributes → Template in the WP admin.
 * Set that page as the front page under Settings → Reading → "A static page".
 */

$context               = \Timber\Timber::context();
$post_obj              = \Timber\Timber::get_post();
$post_obj->setup();
$context['post']       = $post_obj;
$context['content']    = apply_filters( 'the_content', get_the_content() );
$context['body_class'] = implode( ' ', get_body_class( 'has-homepage-header' ) );

\Timber\Timber::render( 'templates/page-home.twig', $context );
