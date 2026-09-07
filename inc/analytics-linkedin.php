<?php
/**
 * LinkedIn Insight Tag integration.
 *
 * Registers the LinkedIn Partner ID setting, renders the admin field,
 * and outputs the consent-gated Insight Tag snippet in <head>.
 */

add_action( 'admin_init', 'observata_linkedin_register_setting' );
add_action( 'wp_head', 'observata_output_linkedin_script', 100 );

// ─────────────────────────────────────────────────────────────────

// Register the LinkedIn Partner ID setting and admin field.
function observata_linkedin_register_setting(): void {
	register_setting(
		'observata_settings',
		'observata_linkedin_id',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'observata_sanitize_linkedin_id',
			'default'           => '',
		)
	);

	add_settings_field(
		'observata_linkedin_id',
		__( 'LinkedIn Partner ID', 'observata' ),
		'observata_linkedin_id_field',
		'observata-settings',
		'observata_analytics_section'
	);
}

// Sanitize and validate the LinkedIn Partner ID format.
function observata_sanitize_linkedin_id( string $value ): string {
	$value = sanitize_text_field( $value );

	if ( $value && ! preg_match( '/^[0-9]+$/', $value ) ) {
		add_settings_error(
			'observata_linkedin_id',
			'invalid-linkedin-id',
			__( 'Invalid LinkedIn Partner ID. Expected digits only.', 'observata' )
		);

		return '';
	}

	return $value;
}

// Render the LinkedIn Partner ID input field.
function observata_linkedin_id_field(): void {
	$value = get_option( 'observata_linkedin_id', '' );

	printf(
		'<input type="text" name="observata_linkedin_id" value="%s" class="regular-text" placeholder="10849473">',
		esc_attr( $value )
	);

	printf(
		'<p class="description">%s</p>',
		esc_html__( 'Enter your LinkedIn Partner ID (Insight Tag). Leave blank to disable.', 'observata' )
	);
}

// Output the consent-gated LinkedIn Insight Tag snippet in <head>.
function observata_output_linkedin_script(): void {
	if ( ! observata_is_production() ) {
		return;
	}

	$linkedin_id = get_option( 'observata_linkedin_id', '' );

	if ( empty( $linkedin_id ) ) {
		return;
	}

	if ( is_admin() || wp_doing_ajax() ) {
		return;
	}

	// phpcs:disable WordPress.WP.EnqueuedResources.NonEnqueuedScript -- consent-gated via CookieBot
	printf(
		'<!-- LinkedIn Insight Tag (consent-gated via CookieBot) -->
		<script type="text/plain" data-cookieconsent="marketing">
			_linkedin_partner_id = "%1$s";
			window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
			window._linkedin_data_partner_ids.push(_linkedin_partner_id);
		</script>
		<script type="text/plain" data-cookieconsent="marketing">
			(function(l) {
				if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
				window.lintrk.q=[]}
				var s = document.getElementsByTagName("script")[0];
				var b = document.createElement("script");
				b.type = "text/javascript";b.async = true;
				b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
				s.parentNode.insertBefore(b, s);
			})(window.lintrk);
		</script>
		<noscript>
			<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=%2$s&amp;fmt=gif" />
		</noscript>',
		esc_js( $linkedin_id ),
		esc_attr( $linkedin_id )
	);
	// phpcs:enable
}
