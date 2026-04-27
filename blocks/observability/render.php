<?php
$section_title = $attributes['sectionTitle'] ?? 'Being observed is not the same as being observable';
$intro_text = $attributes['introText'] ?? 'Most observability stacks were built for dashboards and not decisions.';
?>

<section class="wp-block-observata-observability">
	<div class="observability-inner">
		<?php if ($section_title): ?>
			<h2 class="observability-title"><?php echo esc_html($section_title); ?></h2>
		<?php endif; ?>

		<?php if ($intro_text): ?>
			<p class="observability-intro"><?php echo esc_html($intro_text); ?></p>
		<?php endif; ?>

		<div class="observability-cards">
			<article class="observability-card">
				<h3>Alert fatigue</h3>
				<p>Too many noisy alerts hide the incidents that matter most.</p>
			</article>
			<article class="observability-card">
				<h3>Cost sprawl</h3>
				<p>Unmanaged ingestion and retention policies inflate platform spend.</p>
			</article>
			<article class="observability-card">
				<h3>Blind spots</h3>
				<p>Disconnected logs, metrics, and traces prevent fast root-cause analysis.</p>
			</article>
		</div>
	</div>
</section>