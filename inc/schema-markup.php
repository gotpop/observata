<?php

// Output Schema.org itemscope/itemtype attributes based on the current page type.
function observata_schema_type()
{
	$schema = 'https://schema.org/';
	if (is_single()) {
		$type = "Article";
	} elseif (is_author()) {
		$type = 'ProfilePage';
	} elseif (is_search()) {
		$type = 'SearchResultsPage';
	} else {
		$type = 'WebPage';
	}
	echo 'itemscope itemtype="' . esc_url($schema) . esc_attr($type) . '"';
}

// Add itemprop="url" to nav menu links for Schema.org compliance.
add_filter('nav_menu_link_attributes', 'observata_schema_url', 10);
function observata_schema_url($atts)
{
	$atts['itemprop'] = 'url';
	return $atts;
}