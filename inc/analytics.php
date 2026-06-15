<?php
/**
 * Analytics integration: Google Analytics 4 and Leadfeeder.
 *
 * Adds a "Theme Settings" page under Settings in WP admin
 * with fields for tracking IDs. Outputs the corresponding
 * snippets in <head> when configured.
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
	register_setting( 'observata_settings', 'observata_ga4_id', array(
		'type'              => 'string',
		'sanitize_callback' => 'observata_sanitize_ga4_id',
		'default'           => '',
	) );

	register_setting( 'observata_settings', 'observata_leadfeeder_id', array(
		'type'              => 'string',
		'sanitize_callback' => 'observata_sanitize_leadfeeder_id',
		'default'           => '',
	) );

	register_setting( 'observata_settings', 'observata_cookiebot_id', array(
		'type'              => 'string',
		'sanitize_callback' => 'observata_sanitize_cookiebot_id',
		'default'           => '',
	) );

	add_settings_section(
		'observata_analytics_section',
		__( 'Analytics', 'observata' ),
		'__return_null',
		'observata-settings'
	);

	add_settings_field(
		'observata_ga4_id',
		__( 'GA4 Measurement ID', 'observata' ),
		'observata_ga4_id_field',
		'observata-settings',
		'observata_analytics_section'
	);

	add_settings_field(
		'observata_leadfeeder_id',
		__( 'Leadfeeder Tracker ID', 'observata' ),
		'observata_leadfeeder_id_field',
		'observata-settings',
		'observata_analytics_section'
	);

	add_settings_field(
		'observata_cookiebot_id',
		__( 'CookieBot Domain Group ID', 'observata' ),
		'observata_cookiebot_id_field',
		'observata-settings',
		'observata_analytics_section'
	);
}

/**
 * Sanitize the GA4 Measurement ID — allow G- or GT- prefixed IDs.
 */
function observata_sanitize_ga4_id( $value ) {
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

/**
 * Render the GA4 ID input field.
 */
function observata_ga4_id_field() {
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

/**
 * Sanitize the Leadfeeder Tracker ID.
 */
function observata_sanitize_leadfeeder_id( $value ) {
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

/**
 * Render the Leadfeeder ID input field.
 */
function observata_leadfeeder_id_field() {
	$value = get_option( 'observata_leadfeeder_id', '' );
	printf(
		'<input type="text" name="observata_leadfeeder_id" value="%s" class="regular-text" placeholder="XXXXXXXXXXXXXXXXXXXX">',
		esc_attr( $value )
	);
	printf(
		'<p class="description">%s</p>',
		esc_html__( 'Enter your Leadfeeder/Dealfront Web Visitors Tracker ID (found in Settings > Company > Website Tracker > Tracking Script). Leave blank to disable.', 'observata' )
	);
}

/**
 * Sanitize the CookieBot Domain Group ID (UUID format).
 */
function observata_sanitize_cookiebot_id( $value ) {
	$value = sanitize_text_field( $value );
	if ( $value && ! preg_match( '/^[a-f0-9\-]+$/i', $value ) ) {
		add_settings_error(
			'observata_cookiebot_id',
			'invalid-cookiebot-id',
			__( 'Invalid CookieBot Domain Group ID. Expected a UUID format.', 'observata' )
		);
		return '';
	}
	return $value;
}

/**
 * Render the CookieBot ID input field.
 */
function observata_cookiebot_id_field() {
	$value = get_option( 'observata_cookiebot_id', '' );
	printf(
		'<input type="text" name="observata_cookiebot_id" value="%s" class="regular-text" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">',
		esc_attr( $value )
	);
	printf(
		'<p class="description">%s</p>',
		esc_html__( 'Enter your CookieBot Domain Group ID. Leave blank to disable.', 'observata' )
	);
}

/**
 * Render the settings page.
 */
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

// ─── GA4 Script Output ────────────────────────────────────────────────────────

/**
 * Output the GA4 gtag.js snippet when a Measurement ID is configured.
 */
add_action( 'wp_head', 'observata_output_ga4_script', 99 );
function observata_output_ga4_script() {
	$ga4_id = get_option( 'observata_ga4_id', '' );

	if ( empty( $ga4_id ) ) {
		return;
	}

	// Only output for non-admin pages.
	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	printf(
		'<!-- Google Analytics (GA4) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=%1$s"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "%1$s");
  console.info("Google Analytics (GA4) loaded. Measurement ID: %1$s");
</script>
',
		esc_js( $ga4_id )
	);
}

// ─── Leadfeeder Script Output ─────────────────────────────────────────────────

/**
 * Output the Leadfeeder tracking snippet when a Tracker ID is configured.
 */
add_action( 'wp_head', 'observata_output_leadfeeder_script', 100 );
function observata_output_leadfeeder_script() {
	$lf_id = get_option( 'observata_leadfeeder_id', '' );

	if ( empty( $lf_id ) ) {
		return;
	}

	// Only output for non-admin pages.
	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	printf(
		'<!-- Leadfeeder Web Visitors Tracker -->
<script>(function(){window.ldfdr=window.ldfdr||function(){(window.ldfdr._q=window.ldfdr._q||[]).push(arguments)};var sf=document.createElement("script");sf.async=!0;sf.setAttribute("data-cookieconsent","ignore");sf.src="https://lftracker.leadfeeder.com/lftracker_v1_%1$s.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(sf,s);})();</script>
',
		esc_js( $lf_id )
	);
}

// ─── CookieBot Script Output ──────────────────────────────────────────────────

/**
 * Output the CookieBot consent banner script when a Domain Group ID is configured.
 */
add_action( 'wp_head', 'observata_output_cookiebot_script', 1 );
function observata_output_cookiebot_script() {
	$cb_id = get_option( 'observata_cookiebot_id', '' );

	if ( empty( $cb_id ) ) {
		return;
	}

	// Only output for non-admin pages.
	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	printf(
		'<!-- CookieBot -->
<script id="CookieBot" src="https://consent.cookiebot.com/uc.js" data-cbid="%1$s" data-blockingmode="auto" type="text/javascript"></script>
',
		esc_attr( $cb_id )
	);
}
