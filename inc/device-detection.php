<?php

// Inject device/browser classes on <html> for CSS targeting.
add_action( 'wp_footer', 'observata_footer' );
function observata_footer() {
	?>
	<script>
		(function () {
			const ua = navigator.userAgent.toLowerCase();
			const html = document.documentElement;
			if (/(iphone|ipod|ipad)/.test(ua)) {
				html.classList.add('ios', 'mobile');
			}
			else if (/android/.test(ua)) {
				html.classList.add('android', 'mobile');
			}
			else {
				html.classList.add('desktop');
			}
			if (/chrome/.test(ua) && !/edg|brave/.test(ua)) {
				html.classList.add('chrome');
			}
			else if (/safari/.test(ua) && !/chrome/.test(ua)) {
				html.classList.add('safari');
			}
			else if (/edg/.test(ua)) {
				html.classList.add('edge');
			}
			else if (/firefox/.test(ua)) {
				html.classList.add('firefox');
			}
			else if (/brave/.test(ua)) {
				html.classList.add('brave');
			}
			else if (/opr|opera/.test(ua)) {
				html.classList.add('opera');
			}
		})();
	</script>
	<?php
}