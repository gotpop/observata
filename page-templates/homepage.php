<?php
/**
 * Template Name: Homepage
 *
 * Assign this template to any page via Page Attributes → Template in the WP admin.
 * Set that page as the front page under Settings → Reading → "A static page".
 */

$context  = \Timber\Timber::context();
$post_obj = \Timber\Timber::get_post();
$post_obj->setup();
$context['post']       = $post_obj;
$blocks                = parse_blocks( get_the_content() );
$hero_content          = '';
$body_content          = '';

// Split the hero block from the rest so non-hero content can be wrapped.
foreach ( $blocks as $block ) {
	if ( $block['blockName'] === 'observata/section-hero-home' ) {
		$hero_content .= render_block( $block );
	} else {
		$body_content .= render_block( $block );
	}
}

$context['hero']       = $hero_content;
$context['content']    = $body_content;
$context['body_class'] = implode( ' ', get_body_class( 'has-homepage-header' ) );
$context['header']     = do_blocks( '<!-- wp:observata/header /-->' );
$context['footer']     = do_blocks( '<!-- wp:observata/footer /-->' );

\Timber\Timber::render( 'templates/page-home.twig', $context );
