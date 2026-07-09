<?php
/**
 * Footer content settings fields.
 *
 * Registers and renders the footer customisation fields
 * (email, address, locations, copyright) on the Theme Settings page.
 */

add_action( 'admin_init', 'observata_footer_register_settings' );

// Register footer settings fields.
function observata_footer_register_settings(): void {
	register_setting(
		'observata_settings',
		'observata_footer_email',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'observata_sanitize_footer_email',
			'default'           => '',
		)
	);

	register_setting(
		'observata_settings',
		'observata_footer_address',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_textarea_field',
			'default'           => '',
		)
	);

	register_setting(
		'observata_settings',
		'observata_footer_locations',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'default'           => '',
		)
	);

	register_setting(
		'observata_settings',
		'observata_footer_copyright',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
			'default'           => '',
		)
	);

	add_settings_field(
		'observata_footer_email',
		__( 'Contact Email', 'observata' ),
		'observata_footer_email_field',
		'observata-settings',
		'observata_footer_section'
	);

	add_settings_field(
		'observata_footer_address',
		__( 'Contact Address', 'observata' ),
		'observata_footer_address_field',
		'observata-settings',
		'observata_footer_section'
	);

	add_settings_field(
		'observata_footer_locations',
		__( 'Locations', 'observata' ),
		'observata_footer_locations_field',
		'observata-settings',
		'observata_footer_section'
	);

	add_settings_field(
		'observata_footer_copyright',
		__( 'Copyright', 'observata' ),
		'observata_footer_copyright_field',
		'observata-settings',
		'observata_footer_section'
	);
}

// Validate and sanitize the footer email address.
function observata_sanitize_footer_email( string $value ): string {
	$value = sanitize_email( $value );

	if ( $value && ! is_email( $value ) ) {
		add_settings_error(
			'observata_footer_email',
			'invalid-footer-email',
			__( 'The footer email address is not valid.', 'observata' )
		);

		return '';
	}
	
	return $value;
}

// Render the footer email input field.
function observata_footer_email_field(): void {
	$value = get_option( 'observata_footer_email', '' );

	printf(
		'<input type="email" name="observata_footer_email" value="%s" class="regular-text" placeholder="sales@observata.com">',
		esc_attr( $value )
	);

	printf(
		'<p class="description">%s</p>',
		esc_html__( 'Contact email shown in the site footer. Leave blank to use the theme default.', 'observata' )
	);
}

// Render the footer address textarea.
function observata_footer_address_field(): void {
	$value = get_option( 'observata_footer_address', '' );

	printf(
		'<textarea name="observata_footer_address" rows="3" class="large-text" placeholder="Trade Center Halmstad Box 837 SE - 30118 Halmstad Sweden">%s</textarea>',
		esc_textarea( $value )
	);

	printf(
		'<p class="description">%s</p>',
		esc_html__( 'Postal address shown in the site footer. Leave blank to use the theme default.', 'observata' )
	);
}

// Render the footer locations input field.
function observata_footer_locations_field(): void {
	$value = get_option( 'observata_footer_locations', '' );

	printf(
		'<input type="text" name="observata_footer_locations" value="%s" class="regular-text" placeholder="Denmark | Sweden | Finland | Norway">',
		esc_attr( $value )
	);

	printf(
		'<p class="description">%s</p>',
		esc_html__( 'Pipe-separated list of locations shown in the footer bottom bar. Leave blank to use the theme default.', 'observata' )
	);
}

// Render the footer copyright input field.
function observata_footer_copyright_field(): void {
	$value = get_option( 'observata_footer_copyright', '' );

	printf(
		'<input type="text" name="observata_footer_copyright" value="%s" class="regular-text" placeholder="© Observata AB 2026">',
		esc_attr( $value )
	);

	printf(
		'<p class="description">%s</p>',
		esc_html__( 'Copyright notice shown in the footer bottom bar. Leave blank to use the theme default.', 'observata' )
	);
}
