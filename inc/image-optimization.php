<?php

add_filter( 'big_image_size_threshold', '__return_false' );
add_filter( 'intermediate_image_sizes_advanced', 'observata_image_insert_override' );
add_filter( 'upload_mimes', 'observata_add_webp_mime_type' );
add_filter( 'file_is_displayable_image', 'observata_webp_is_displayable', 10, 2 );

// ─────────────────────────────────────────────────────────────────

// Remove unused intermediate image sizes.
function observata_image_insert_override( array $sizes ): array {
	unset( $sizes['medium_large'] );
	unset( $sizes['1536x1536'] );
	unset( $sizes['2048x2048'] );

	return $sizes;
}

// Add WebP MIME type support for uploads.
function observata_add_webp_mime_type( array $mimes ): array {
	$mimes['webp'] = 'image/webp';

	return $mimes;
}

// Ensure WordPress recognizes WebP images as displayable.
function observata_webp_is_displayable( bool $result, string $path ): bool {
	if ( $result === false && pathinfo( $path, PATHINFO_EXTENSION ) === 'webp' ) {
		return true;
	}

	return $result;
}
