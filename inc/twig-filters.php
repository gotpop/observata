<?php
/**
 * Custom Twig filters.
 */

// Add |strip_html filter — removes all HTML tags from a string.
add_filter(
	'timber/twig',
	function ( $twig ) {
		$twig->addFilter(
			new \Twig\TwigFilter(
				'strip_html',
				function ( $text ) {
					return wp_strip_all_tags( $text );
				}
			)
		);

		return $twig;
	}
);
