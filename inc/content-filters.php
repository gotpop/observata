<?php

add_filter( 'document_title_separator', 'observata_document_title_separator' );
add_filter( 'the_title', 'observata_title' );
add_filter( 'the_content_more_link', 'observata_read_more_link' );
add_filter( 'excerpt_more', 'observata_excerpt_read_more_link' );
add_filter( 'body_class', 'observata_clean_body_class', 10, 2 );

// Use | as the document title separator.
function observata_document_title_separator( string $sep ): string {
	$sep = esc_html( '|' );

	return $sep;
}

// Fall back to '...' for empty post titles.
function observata_title( string $title ): string {
	if ( $title == '' ) {
		return esc_html( '...' );
	} else {
		return wp_kses_post( $title );
	}
}

// Custom "read more" link for post content.
function observata_read_more_link(): string {
	if ( ! is_admin() ) {
		/* translators: %s is a visual arrow icon. */
		return ' <a href="' . esc_url( get_permalink() ) . '" class="more-link">' . sprintf( __( '...%s', 'observata' ), '<span class="screen-reader-text">  ' . esc_html( get_the_title() ) . '</span>' ) . '</a>';
	}

	return '';
}

// Custom "read more" link for post excerpts.
function observata_excerpt_read_more_link( string $more ): string {
	if ( ! is_admin() ) {
		global $post;
		/* translators: %s is a visual arrow icon. */
		return ' <a href="' . esc_url( get_permalink( $post->ID ) ) . '" class="more-link">' . sprintf( __( '...%s', 'observata' ), '<span class="screen-reader-text">  ' . esc_html( get_the_title() ) . '</span>' ) . '</a>';
	}

	return '';
}

// Strip verbose WordPress body classes — keep only explicit custom classes.
function observata_clean_body_class( array $classes, array|string $class ): array {
	return is_array( $class ) ? $class : array();
}
