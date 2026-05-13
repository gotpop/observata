<?php
/**
 * Rich Text Block Template
 *
 * @package observata
 */

$block_id  = 'rich-text-' . $block['id'];
$alignment = $block['align'] ?? '';
?>

<div class="rich-text<?php echo $alignment ? ' align' . esc_attr( $alignment ) : ''; ?>" id="<?php echo esc_attr( $block_id ); ?>">
	<div class="rich-text__content">
		<?php echo $content; ?>
	</div>
</div>
