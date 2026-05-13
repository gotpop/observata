<?php

// Hide the admin toolbar on the front end.
add_filter( 'show_admin_bar', '__return_false' );

// Customise the wp-admin bar: brand colour and custom logo.
add_action( 'admin_head', 'observata_admin_bar_styles' );
function observata_admin_bar_styles() {
	$logo_id  = get_theme_mod( 'custom_logo' );
	$logo_url = $logo_id ? wp_get_attachment_image_url( $logo_id, 'full' ) : null;
	?>
	<style>
		#wpadminbar,
		#wpadminbar .quicklinks .menupop ul,
		#wpadminbar .ab-top-menu>li.hover>.ab-item,
		#wpadminbar>#wp-toolbar>#wp-admin-bar-root-default .ab-item:hover,
		#wpadminbar .menupop .ab-sub-wrapper {
			background: #113768;
		}

		#wpadminbar .ab-top-menu>li>.ab-item:focus,
		#wpadminbar .ab-top-menu>li:hover>.ab-item {
			background: #0d2b54;
		}

		#adminmenuwrap,
		#adminmenuback,
		#adminmenu,
		#adminmenu .wp-submenu {
			background: #071828;
		}

		#adminmenu a,
		#adminmenu .wp-submenu a {
			color: #c8d8f0;
		}

		#adminmenu li.current a.menu-top,
		#adminmenu li.wp-has-current-submenu a.wp-has-current-submenu,
		#adminmenu li a:hover,
		#adminmenu .wp-submenu a:hover {
			background: #040e18;
			color: #fff;
		}

		#adminmenu li.wp-has-current-submenu .wp-submenu-head {
			background: #040e18;
		}

		<?php if ( $logo_url ) : ?>
			#wpadminbar #wp-admin-bar-wp-logo>.ab-item .ab-icon {
				background-image: url('<?php echo esc_url( $logo_url ); ?>');
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
			}

			#wpadminbar #wp-admin-bar-wp-logo>.ab-item .ab-icon::before {
				content: '' !important;
				background: none;
			}

		<?php endif; ?>
	</style>
	<?php
}