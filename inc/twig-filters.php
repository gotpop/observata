<?php
/**
 * Register custom Twig filters with Timber.
 *
 * @param \Twig\Environment $twig
 * @return \Twig\Environment
 */
function observata_register_twig_filters( $twig ) {
	$strip_html = function ( string $text ): string {
		return wp_strip_all_tags( $text );
	};

	$twig->addFilter( new \Twig\TwigFilter( 'strip_html', $strip_html ) );

	return $twig;
}

add_filter( 'timber/twig', 'observata_register_twig_filters' );
