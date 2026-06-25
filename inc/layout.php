<?php
/**
 * Fluent layout builder.
 *
 * Usage:
 *
 *   Layout::make()
 *       ->bodyClass( 'my-class' )
 *       ->header( 'headers/my-header' )
 *       ->content( 'content/my-content' )
 *       ->footer( 'footers/my-footer' )
 *       ->render();
 *
 * Partial paths are relative to template-parts/ and do not need the .php extension.
 * All slots are optional.
 */
class Layout {

	private array $body_classes = array();
	private ?string $header     = null;
	private ?string $content    = null;
	private ?string $footer     = null;

	public static function make(): self {
		return new self();
	}

	public function bodyClass( string ...$classes ): self {
		$this->body_classes = array_merge( $this->body_classes, $classes );
		return $this;
	}

	public function header( string $partial ): self {
		$this->header = $partial;
		return $this;
	}

	public function content( string $partial ): self {
		$this->content = $partial;
		return $this;
	}

	public function footer( string $partial ): self {
		$this->footer = $partial;
		return $this;
	}

	public function render(): void {
		$base = get_template_directory() . '/template-parts/';
		?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> <?php observata_schema_type(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
		<?php wp_head(); ?>
</head>
<body <?php body_class( $this->body_classes ); ?>>
		<?php wp_body_open(); ?>
<div id="wrapper" class="hfeed">

		<?php
		if ( $this->header ) {
			require $base . $this->header . '.php';}
		?>

	<div id="container">
		<main id="content" class="site-main">
			<?php
			if ( $this->content ) {
				require $base . $this->content . '.php';}
			?>
		</main>
	</div>

		<?php
		if ( $this->footer ) {
			require $base . $this->footer . '.php';}
		?>

</div>
		<?php wp_footer(); ?>
</body>
</html>
		<?php
	}
}
