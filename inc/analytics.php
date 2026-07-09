<?php
/**
 * Theme Settings page and shared analytics helpers.
 *
 * Provides the "Theme Settings" admin page (Analytics + Footer sections),
 * the environment helper, and the settings section registration.
 * Individual tracking integrations (GA4, Leadfeeder, CookieBot) live
 * in their own files: analytics-ga4.php, analytics-leadfeeder.php,
 * analytics-cookiebot.php.
 */

// ─── Settings Page ────────────────────────────────────────────────────────────

add_action( 'admin_menu', 'observata_analytics_settings_page' );
function observata_analytics_settings_page() {
	add_options_page(
		__( 'Theme Settings', 'observata' ),
		__( 'Theme Settings', 'observata' ),
		'manage_options',
		'observata-settings',
		'observata_analytics_settings_render'
	);
}

add_action( 'admin_init', 'observata_analytics_register_settings' );
function observata_analytics_register_settings() {
	// Footer content fields
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

	add_settings_section(
		'observata_analytics_section',
		__( 'Analytics', 'observata' ),
		'__return_null',
		'observata-settings'
	);

	add_settings_section(
		'observata_footer_section',
		__( 'Footer Content', 'observata' ),
		'__return_null',
		'observata-settings'
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

// ─── Footer Field Sanitizers ──────────────────────────────────────────────────

function observata_sanitize_footer_email( $value ) {
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

// ─── Footer Field Renderers ───────────────────────────────────────────────────

function observata_footer_email_field() {
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

function observata_footer_address_field() {
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

function observata_footer_locations_field() {
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

function observata_footer_copyright_field() {
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

// ─── Settings Page Renderer ───────────────────────────────────────────────────

function observata_analytics_settings_render() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Theme Settings', 'observata' ); ?></h1>
		<form method="post" action="options.php">
			<?php
			settings_fields( 'observata_settings' );
			do_settings_sections( 'observata-settings' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

// ─── Environment Helper ──────────────────────────────────────────────────────

function observata_is_production() {
	return defined( 'WP_ENVIRONMENT' ) && 'production' === WP_ENVIRONMENT;
}
