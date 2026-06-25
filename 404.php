<?php
/**
 * 404 Error Page
 *
 * Renders an editable "error-404" WordPress page using the theme's block system.
 * Create a page with the slug "error-404" in the WP admin to control its content
 * with the full block editor. Falls back to a simple message if no page exists.
 */

$context = \Timber\Timber::context();
$context['body_class'] = implode( ' ', get_body_class( 'error-404' ) );
$context['header']     = do_blocks( '<!-- wp:observata/header /-->' );
$context['footer']     = do_blocks( '<!-- wp:observata/footer /-->' );

// Look for a user-editable 404 page.
$not_found = \Timber\Timber::get_post(
	array(
		'post_type'  => 'page',
		'name'       => 'error-404',
		'post_status' => 'publish',
	)
);

if ( $not_found ) {
	$not_found->setup();
	$context['post']    = $not_found;
	$context['content'] = apply_filters( 'the_content', $not_found->post_content );
	$context['title']   = get_the_title( $not_found );
} else {
	// Fallback: basic message when no editable 404 page exists.
	$context['post']    = null;
	$context['title']   = __( 'Page Not Found', 'observata' );
	$context['content'] = '<section class="error-404-fallback"><p>'
		. esc_html__( 'Nothing found for the requested page. Try a search instead?', 'observata' )
		. '</p>' . get_search_form( false ) . '</section>';
}

\Timber\Timber::render( 'templates/404.twig', $context );