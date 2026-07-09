<?php
add_filter( 'timber/twig', 'observata_register_twig_filters' );

// Register custom Twig filters with Timber.
function observata_register_twig_filters( $twig ) {
	$strip_html = function ( string $text ): string {
		return wp_strip_all_tags( $text );
	};

	$twig->addFilter( new \Twig\TwigFilter( 'strip_html', $strip_html ) );

	return $twig;
}
