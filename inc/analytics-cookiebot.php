<?php
/**
 * CookieBot consent management integration.
 *
 * Registers the CookieBot Domain Group ID setting, renders the admin field,
 * and outputs the lazy-loaded consent banner script in <head>.
 */

// ─── Setting Registration ────────────────────────────────────────────────────

add_action( 'admin_init', 'observata_cookiebot_register_setting' );
function observata_cookiebot_register_setting() {
	register_setting(
		'observata_settings',
		'observata_cookiebot_id',
		array(
			'type'              => 'string',
			'sanitize_callback' => 'observata_sanitize_cookiebot_id',
			'default'           => '',
		)
	);

	add_settings_field(
		'observata_cookiebot_id',
		__( 'CookieBot Domain Group ID', 'observata' ),
		'observata_cookiebot_id_field',
		'observata-settings',
		'observata_analytics_section'
	);
}

// ─── Sanitize ─────────────────────────────────────────────────────────────────

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

// ─── Admin Field ──────────────────────────────────────────────────────────────

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

// ─── Frontend Output ──────────────────────────────────────────────────────────

add_action( 'wp_head', 'observata_output_cookiebot_script', 1 );
function observata_output_cookiebot_script() {
	if ( ! observata_is_production() ) {
		return;
	}

	$cb_id = get_option( 'observata_cookiebot_id', '' );

	if ( empty( $cb_id ) ) {
		return;
	}

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
