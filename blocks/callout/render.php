<?php
$text     = $attributes['text'] ?? '';
$variant  = $attributes['variant'] ?? 'info';
$cta_text = $attributes['ctaText'] ?? '';
$cta_url  = $attributes['ctaUrl'] ?? '';
?>
<aside class="wp-block-observata-callout is-<?php echo esc_attr( $variant ); ?>">
	<div class="callout-inner">
		<?php if ( $text ) : ?>
			<p class="callout-text"><?php echo wp_kses_post( $text ); ?></p>
		<?php endif; ?>
		<?php if ( $cta_text && $cta_url ) : ?>
			<a href="<?php echo esc_url( $cta_url ); ?>" class="callout-cta"><?php echo esc_html( $cta_text ); ?></a>
		<?php endif; ?>
	</div>
</aside>
