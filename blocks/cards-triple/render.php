<?php
$section_title = $attributes['sectionTitle'] ?? '';
?>

<section class="wp-block-observata-cards-triple">
    <?php if ($section_title): ?>
        <h2 class="section-title"><?php echo wp_kses_post($section_title); ?></h2>
    <?php endif; ?>

    <div class="cards-container">
        <?php echo do_blocks_shortcode('observata/service-card', array(
            'serviceTitle' => 'Search as a Service',
            'serviceText' => 'Enable your employees to securely and fast locate information across all internal systems.',
            'readMoreText' => 'Discover search',
            'readMoreUrl' => '#'
        )); ?>

        <?php echo do_blocks_shortcode('observata/service-card', array(
            'serviceTitle' => 'MDR as a Service',
            'serviceText' => 'We protect your critical assets 24/7. Detecting threats, responding fast and preventing attacks.',
            'readMoreText' => 'Discover MDR',
            'readMoreUrl' => '#'
        )); ?>

        <?php echo do_blocks_shortcode('observata/service-card', array(
            'serviceTitle' => 'Observability as a Service',
            'serviceText' => 'Powered by Elastic. Managed by experts. Detect early, respond fast.',
            'readMoreText' => 'Discover observability',
            'readMoreUrl' => '#'
        )); ?>
    </div>
</section>
