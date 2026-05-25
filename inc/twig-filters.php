<?php
/**
 * Custom Twig filters for block templates.
 */

/**
 * Add global Twig filter to strip all HTML tags.
 * Available in all Twig templates as: {{ text|strip_html }}
 */
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
