<?php
/**
 * Leadfeeder / Dealfront Web Visitors Tracker integration.
 *
 * Registers the Leadfeeder Tracker ID setting, renders the admin field,
 * and outputs the consent-gated tracking snippet in <head>.
 */

add_action( 'admin_init', 'observata_leadfeeder_register_setting' );
add_action( 'wp_head', 'observata_output_leadfeeder_script', 100 );

// ─────────────────────────────────────────────────────────────────

// Register the Leadfeeder Tracker ID setting and admin field.
function observata_leadfeeder_register_setting(): void {
	register_setting(
		'observata_settings',
		'observata_leadfeeder_id',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'observata_sanitize_leadfeeder_id',
			'default'           => '',
		)
	);

	add_settings_field(
		'observata_leadfeeder_id',
		__( 'Leadfeeder Tracker ID', 'observata' ),
		'observata_leadfeeder_id_field',
		'observata-settings',
		'observata_analytics_section'
	);
}


// Sanitize and validate the Leadfeeder Tracker ID format.
function observata_sanitize_leadfeeder_id( string $value ): string {
	$value = sanitize_text_field( $value );

	if ( $value && ! preg_match( '/^[a-zA-Z0-9\-]+$/', $value ) ) {
		add_settings_error(
			'observata_leadfeeder_id',
			'invalid-leadfeeder-id',
			__( 'Invalid Leadfeeder Tracker ID format.', 'observata' )
		);

		return '';
	}
	return $value;
}


// Render the Leadfeeder Tracker ID input field.
function observata_leadfeeder_id_field(): void {
	$value = get_option( 'observata_leadfeeder_id', '' );
	printf(
		'<input type="text" name="observata_leadfeeder_id" value="%s" class="regular-text" placeholder="XXXXXXXXXXXXXXXXXXXX">',
		esc_attr( $value )
	);
	printf(
		'<p class="description">%s</p>',
		esc_html__( 'Enter your Leadfeeder/Dealfront Web Visitors Tracker ID. Leave blank to disable.', 'observata' )
	);
}

// Output the consent-gated Leadfeeder tracking snippet in <head>.
function observata_output_leadfeeder_script(): void {
	if ( ! observata_is_production() ) {
		return;
	}

	$lf_id = get_option( 'observata_leadfeeder_id', '' );

	if ( empty( $lf_id ) ) {
		return;
	}

	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	printf(
		'<!-- Leadfeeder Web Visitors Tracker (consent-gated via CookieBot) -->
<script type="text/plain" data-cookieconsent="statistics">
(function(){window.ldfdr=window.ldfdr||function(){(window.ldfdr._q=window.ldfdr._q||[]).push(arguments)};var sf=document.createElement("script");sf.async=!0;sf.src="https://lftracker.leadfeeder.com/lftracker_v1_%1$s.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(sf,s);})();
</script>
',
		esc_js( $lf_id )
	);
}
