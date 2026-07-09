<?php
/**
 * Theme Settings admin page.
 *
 * Registers the "Theme Settings" page under Settings and the two
 * settings sections (Analytics, Footer Content). Individual tracking
 * fields (GA4, Leadfeeder, CookieBot) are registered in analytics-*.php.
 * Footer fields are registered in theme-settings-footer.php.
 */

add_action( 'admin_menu', 'observata_theme_settings_page' );
add_action( 'admin_init', 'observata_theme_settings_sections' );

// Register the Theme Settings page under Settings.
function observata_theme_settings_page(): void {
	add_options_page(
		__( 'Theme Settings', 'observata' ),
		__( 'Theme Settings', 'observata' ),
		'manage_options',
		'observata-settings',
		'observata_theme_settings_render'
	);
}

// Register Analytics and Footer Content settings sections.
function observata_theme_settings_sections(): void {
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
}


// Render the Theme Settings admin page.
function observata_theme_settings_render(): void {
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
