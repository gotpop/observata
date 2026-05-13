<?php
/**
 * Template Name: Default Page
 */

$context  = \Timber\Timber::context();
$post_obj = \Timber\Timber::get_post();
$post_obj->setup();
$context['post']       = $post_obj;
$context['content']    = apply_filters( 'the_content', get_the_content() );
$context['body_class'] = implode( ' ', get_body_class() );
$context['header']     = do_blocks( '<!-- wp:observata/header /-->' );
$context['footer']     = do_blocks( '<!-- wp:observata/footer /-->' );

\Timber\Timber::render( 'templates/page-default.twig', $context );
