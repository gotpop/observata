<?php
$heading    = $attributes['heading'] ?? '';
$subheading = $attributes['subheading'] ?? '';
$media_url  = $attributes['mediaUrl'] ?? '';
$cta_text   = $attributes['ctaText'] ?? '';
$cta_url    = $attributes['ctaUrl'] ?? '';

$style = $media_url ? ' style="background-image:url(' . esc_url( $media_url ) . ')"' : '';
?>
<section class="wp-block-observata-hero"<?php echo $style; ?>>
	<div class="hero-inner hey">
		<?php if ( $heading ) : ?>
			<h1><?php echo wp_kses_post( $heading ); ?></h1>
		<?php endif; ?>
		<?php if ( $subheading ) : ?>
			<p class="hero-subheading"><?php echo wp_kses_post( $subheading ); ?></p>
		<?php endif; ?>
		<?php if ( $cta_text && $cta_url ) : ?>
			<a href="<?php echo esc_url( $cta_url ); ?>" class="hero-cta"><?php echo esc_html( $cta_text ); ?></a>
		<?php endif; ?>
	</div>
</section>
