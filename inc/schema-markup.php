<?php

add_filter( 'nav_menu_link_attributes', 'observata_schema_url', 10 );

// ─────────────────────────────────────────────────────────────────

// Output Schema.org itemscope/itemtype attributes for the current page.
function observata_schema_type(): void {
	$schema = 'https://schema.org/';

	if ( is_single() ) {
		$type = 'Article';
	} elseif ( is_author() ) {
		$type = 'ProfilePage';
	} elseif ( is_search() ) {
		$type = 'SearchResultsPage';
	} else {
		$type = 'WebPage';
	}
	
	echo 'itemscope itemtype="' . esc_url( $schema ) . esc_attr( $type ) . '"';
}

// Add itemprop="url" to nav menu links for Schema.org compliance.
function observata_schema_url( array $atts ): array {
	$atts['itemprop'] = 'url';

	return $atts;
}
