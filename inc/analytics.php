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
	register_setting(
		'observata_settings',
		'observata_ga4_id',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'observata_sanitize_ga4_id',
			'default'           => '',
		)
	);

	register_setting(
		'observata_settings',
		'observata_leadfeeder_id',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'observata_sanitize_leadfeeder_id',
			'default'           => '',
		)
	);

	register_setting(
		'observata_settings',
		'observata_cookiebot_id',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'observata_sanitize_cookiebot_id',
			'default'           => '',
		)
	);

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
 * Sanitize footer email — validate if non-empty.
 */
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

/**
 * Render the footer email input field.
 */
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

/**
 * Render the footer address textarea.
 */
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

/**
 * Render the footer locations input field.
 */
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

/**
 * Render the footer copyright input field.
 */
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

// ─── Environment Helper ──────────────────────────────────────────────────────

/**
 * Check if the current environment is production.
 *
 * Reads the WP_ENVIRONMENT constant (e.g. define( 'WP_ENVIRONMENT', 'production' )
 * in wp-config.php). Returns false for all other values or if undefined.
 */
function observata_is_production() {
	return defined( 'WP_ENVIRONMENT' ) && 'production' === WP_ENVIRONMENT;
}

// ─── GA4 Script Output ────────────────────────────────────────────────────────

/**
 * Output the GA4 gtag.js snippet when a Measurement ID is configured.
 *
 * Consent-gated via CookieBot using type="text/plain" so the library and
 * page-view call only fire after the user accepts statistics cookies.
 * The dataLayer queue and gtag() function are initialised immediately so
 * any queued events flush correctly once the library loads.
 */
add_action( 'wp_head', 'observata_output_ga4_script', 99 );
function observata_output_ga4_script() {
	// Only output in production.
	if ( ! observata_is_production() ) {
		return;
	}

	$ga4_id = get_option( 'observata_ga4_id', '' );

	if ( empty( $ga4_id ) ) {
		return;
	}

	// Only output for non-admin pages.
	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	// phpcs:disable WordPress.WP.EnqueuedResources.NonEnqueuedScript -- GA4 consent-gated via CookieBot
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
</script>
',
		esc_js( $ga4_id )
	);
	// phpcs:enable
}

// ─── Leadfeeder Script Output ─────────────────────────────────────────────────

/**
 * Output the Leadfeeder tracking snippet when a Tracker ID is configured.
 *
 * Consent-gated via CookieBot using type="text/plain" so the tracker only
 * fires after the user accepts statistics cookies.
 */
add_action( 'wp_head', 'observata_output_leadfeeder_script', 100 );
function observata_output_leadfeeder_script() {
	// Only output in production.
	if ( ! observata_is_production() ) {
		return;
	}

	$lf_id = get_option( 'observata_leadfeeder_id', '' );

	if ( empty( $lf_id ) ) {
		return;
	}

	// Only output for non-admin pages.
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

// ─── CookieBot Script Output ──────────────────────────────────────────────────

/**
 * Output the CookieBot consent banner script when a Domain Group ID is configured.
 *
 * Lazy-loaded on first user interaction (or after a 3s timeout). Legal
 * compliance is maintained because GA4 and Leadfeeder are gated with
 * type="text/plain" — the browser ignores those scripts entirely until
 * CookieBot activates them after consent is given.
 */
add_action( 'wp_head', 'observata_output_cookiebot_script', 1 );
function observata_output_cookiebot_script() {
	// Only output in production.
	if ( ! observata_is_production() ) {
		return;
	}

	$cb_id = get_option( 'observata_cookiebot_id', '' );

	if ( empty( $cb_id ) ) {
		return;
	}

	// Only output for non-admin pages.
	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	printf(
		'<!-- CookieBot (lazy-loaded on first interaction) -->
<script type="text/javascript">
(function(){
	var loaded=false;
	function loadCB(){
		if(loaded)return;loaded=true;
		var s=document.createElement("script");
		s.id="CookieBot";
		s.src="https://consent.cookiebot.com/uc.js";
		s.setAttribute("data-cbid","%1$s");
		s.setAttribute("data-blockingmode","auto");
		s.async=true;
		document.head.appendChild(s);
		var evts=["mousemove","scroll","touchstart","keydown","click"];
		evts.forEach(function(e){document.removeEventListener(e,loadCB,{passive:true});});
	}
	var evts=["mousemove","scroll","touchstart","keydown","click"];
	evts.forEach(function(e){document.addEventListener(e,loadCB,{passive:true});});
	setTimeout(loadCB,3000);
})();
</script>
',
		esc_attr( $cb_id )
	);
}
