<?php

// Disable big image downscaling and remove unused intermediate image sizes.
add_filter( 'big_image_size_threshold', '__return_false' );
add_filter( 'intermediate_image_sizes_advanced', 'observata_image_insert_override' );
function observata_image_insert_override( $sizes ) {
	unset( $sizes['medium_large'] );
	unset( $sizes['1536x1536'] );
	unset( $sizes['2048x2048'] );
	return $sizes;
}

// Add WebP MIME type support for uploads.
add_filter( 'upload_mimes', 'observata_add_webp_mime_type' );
function observata_add_webp_mime_type( $mimes ) {
	$mimes['webp'] = 'image/webp';
	return $mimes;
}

// Ensure WordPress recognizes WebP images as displayable.
add_filter( 'file_is_displayable_image', 'observata_webp_is_displayable', 10, 2 );
function observata_webp_is_displayable( $result, $path ) {
	if ( $result === false && pathinfo( $path, PATHINFO_EXTENSION ) === 'webp' ) {
		return true;
	}
	return $result;
}
