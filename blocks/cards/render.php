<?php
$section_title = $attributes['sectionTitle'] ?? '';
?>
<div class="wp-block-observata-cards">
	<?php if ( $section_title ) : ?>
		<h2 class="cards-section-title"><?php echo wp_kses_post( $section_title ); ?></h2>
	<?php endif; ?>
	<div class="cards-grid">
		<?php echo $content; ?>
	</div>
</div>
