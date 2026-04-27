<?php
$section_title = $attributes['sectionTitle'] ?? '';
?>

<section class="wp-block-observata-cards-triple">
    <?php if ($section_title): ?>
        <h2 class="section-title"><?php echo wp_kses_post($section_title); ?></h2>
    <?php endif; ?>

    <div class="cards-container">
        <?php echo observata_render_block('observata/card-swoosh-icon', array(
            'cardTitle' => 'Search as a Service',
            'cardText' => 'Enable your employees to securely and fast locate information across all internal systems.',
            'iconNumber' => '01'
        )); ?>

        <?php echo observata_render_block('observata/card-swoosh-icon', array(
            'cardTitle' => 'MDR as a Service',
            'cardText' => 'We protect your critical assets 24/7. Detecting threats, responding fast and preventing attacks.',
            'iconNumber' => '02'
        )); ?>

        <?php echo observata_render_block('observata/card-swoosh-icon', array(
            'cardTitle' => 'Observability as a Service',
            'cardText' => 'Powered by Elastic. Managed by experts. Detect early, respond fast.',
            'iconNumber' => '03'
        )); ?>
    </div>
</section>
