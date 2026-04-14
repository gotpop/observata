<?php
$media_url  = $attributes['mediaUrl'] ?? '';
$card_title = $attributes['cardTitle'] ?? '';
$card_text  = $attributes['cardText'] ?? '';
$link_url   = $attributes['linkUrl'] ?? '';
$link_text  = $attributes['linkText'] ?? 'Learn more';
?>
<article class="wp-block-observata-card">
	<?php if ( $media_url ) : ?>
		<div class="card-image-area">
			<img src="<?php echo esc_url( $media_url ); ?>" alt="" class="card-image" />
		</div>
	<?php endif; ?>
	<div class="card-body">
		<?php if ( $card_title ) : ?>
			<h3><?php echo wp_kses_post( $card_title ); ?></h3>
		<?php endif; ?>
		<?php if ( $card_text ) : ?>
			<p class="card-text"><?php echo wp_kses_post( $card_text ); ?></p>
		<?php endif; ?>
		<?php if ( $link_url ) : ?>
			<a href="<?php echo esc_url( $link_url ); ?>" class="card-link"><?php echo esc_html( $link_text ); ?></a>
		<?php endif; ?>
	</div>
</article>
