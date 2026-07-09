<?php
/**
 * Google Analytics 4 integration.
 *
 * Registers the GA4 Measurement ID setting, renders the admin field,
 * and outputs the consent-gated gtag.js snippet in <head>.
 */

add_action( 'admin_init', 'observata_ga4_register_setting' );
add_action( 'wp_head', 'observata_output_ga4_script', 99 );

// ─────────────────────────────────────────────────────────────────

// Register the GA4 Measurement ID setting and admin field.
function observata_ga4_register_setting(): void {
	register_setting(
		'observata_settings',
		'observata_ga4_id',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'observata_sanitize_ga4_id',
			'default'           => '',
		)
	);

	add_settings_field(
		'observata_ga4_id',
		__( 'GA4 Measurement ID', 'observata' ),
		'observata_ga4_id_field',
		'observata-settings',
		'observata_analytics_section'
	);
}

// Sanitize and validate the GA4 Measurement ID format.
function observata_sanitize_ga4_id( string $value ): string {
	$value = sanitize_text_field( $value );

	if ( $value && ! preg_match( '/^G[T-]?[A-Z0-9]+$/i', $value ) ) {
		add_settings_error(
			'observata_ga4_id',
			'invalid-ga4-id',
			__( 'Invalid GA4 Measurement ID format. Expected format: G-XXXXXXXXXX', 'observata' )
		);

		return '';
	}

	return $value;
}

// Render the GA4 Measurement ID input field.
function observata_ga4_id_field(): void {
	$value = get_option( 'observata_ga4_id', '' );

	printf(
		'<input type="text" name="observata_ga4_id" value="%s" class="regular-text" placeholder="G-XXXXXXXXXX">',
		esc_attr( $value )
	);

	printf(
		'<p class="description">%s</p>',
		esc_html__( 'Enter your Google Analytics 4 Measurement ID. Leave blank to disable.', 'observata' )
	);
}

// Output the consent-gated GA4 gtag.js snippet in <head>.
function observata_output_ga4_script(): void {
	if ( ! observata_is_production() ) {
		return;
	}

	$ga4_id = get_option( 'observata_ga4_id', '' );

	if ( empty( $ga4_id ) ) {
		return;
	}

	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	// phpcs:disable WordPress.WP.EnqueuedResources.NonEnqueuedScript -- consent-gated via CookieBot
	printf(
		'<!-- Google Analytics (GA4) (consent-gated via CookieBot) -->
		<script>
			window.dataLayer=window.dataLayer||[];
			function gtag(){dataLayer.push(arguments);}
		</script>
		<script type="text/plain" data-cookieconsent="statistics" async src="https://www.googletagmanager.com/gtag/js?id=%1$s"></script>
		<script type="text/plain" data-cookieconsent="statistics">
			gtag("js",new Date());
			gtag("config","%1$s");
		</script>',
		esc_js( $ga4_id )
	);
	// phpcs:enable
}
