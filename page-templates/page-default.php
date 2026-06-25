<?php
/**
 * Template Name: Default Page
 */

$context  = \Timber\Timber::context();
$post_obj = \Timber\Timber::get_post();
$post_obj->setup();
$context['post'] = $post_obj;
$blocks          = parse_blocks( get_the_content() );
$hero_content    = '';
$body_content    = '';

// Split the hero block from the rest so non-hero content can be wrapped.
foreach ( $blocks as $block ) {
	if ( $block['blockName'] === 'observata/section-hero-page' ) {
		$hero_content .= render_block( $block );
	} else {
		$body_content .= render_block( $block );
	}
}

$context['hero']       = $hero_content;
$context['content']    = $body_content;
$context['body_class'] = implode( ' ', get_body_class( 'page' ) );
$context['header']     = do_blocks( '<!-- wp:observata/header /-->' );
$context['footer']     = do_blocks( '<!-- wp:observata/footer /-->' );

\Timber\Timber::render( 'templates/page-default.twig', $context );
