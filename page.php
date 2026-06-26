<?php
$context  = \Timber\Timber::context();
$post_obj = \Timber\Timber::get_post();

if ( ! $post_obj ) {
	wp_safe_redirect( home_url( '/404' ), 307 );
	exit;
}

$post_obj->setup();
$context['post'] = $post_obj;

$split              = observata_split_hero_from_content( get_the_content(), 'observata/section-hero-page' );
$context['hero']    = $split['hero'];
$context['content'] = $split['content'];

$context['body_class'] = implode( ' ', get_body_class( 'page' ) );
$context['header']     = do_blocks( '<!-- wp:observata/header /-->' );
$context['footer']     = do_blocks( '<!-- wp:observata/footer /-->' );

\Timber\Timber::render( 'templates/page-default.twig', $context );
$post_obj->cleanup();
