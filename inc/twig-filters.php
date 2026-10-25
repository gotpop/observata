<?php
add_filter( 'timber/twig', 'observata_register_twig_filters' );

// Register custom Twig filters with Timber.
function observata_register_twig_filters( $twig ) {
	$strip_html = function ( string $text ): string {
		return wp_strip_all_tags( $text );
	};

	// Allow only inline emphasis and line breaks (e.g. RichText headings).
	$kses_inline = function ( string $text ): string {
		return wp_kses(
			$text,
			array(
				'em' => array(),
				'br' => array(),
			)
		);
	};

	$twig->addFilter( new \Twig\TwigFilter( 'strip_html', $strip_html ) );
	$twig->addFilter( new \Twig\TwigFilter( 'kses_inline', $kses_inline, array( 'is_safe' => array( 'html' ) ) ) );

	return $twig;
}
