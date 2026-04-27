<?php
$section_title = $attributes['sectionTitle'] ?? '';
?>

<section class="wp-block-observata-cards-grid">
    <?php if ($section_title): ?>
        <h2 class="intro-heading"><?php echo wp_kses_post($section_title); ?></h2>
    <?php endif; ?>

    <div class="cards-container">
        <?php echo observata_render_block('observata/card-swoosh-icon', array(
            'cardTitle' => 'Unify every data source',
            'cardText' => 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.',
            'iconNumber' => '01'
        )); ?>

        <?php echo observata_render_block('observata/card-swoosh-icon', array(
            'cardTitle' => 'Zero cost migration',
            'cardText' => 'Transition from legacy tools without migration headache. As Elastic specialists, we manage your end-to-end move for free—ensuring a seamless shift to a faster, more flexible observability standard.',
            'iconNumber' => '02'
        )); ?>

        <?php echo observata_render_block('observata/card-swoosh-icon', array(
            'cardTitle' => 'Unlimited optimisation',
            'cardText' => 'Transform static charts into actionable dashboards using ML and AI. Our team provides ongoing tuning and predictive analytics, delivering true operational resilience without the risk of vendor lock-in.',
            'iconNumber' => '03'
        )); ?>

        <?php echo observata_render_block('observata/card-swoosh-icon', array(
            'cardTitle' => 'Simplified licencing',
            'cardText' => 'Eliminate complex billing with one flat monthly fee. Our all-inclusive model covers ingestion, licensing, and operational support. Ensuring you never face surprise charges or "data taxes" from third-party vendors.',
            'iconNumber' => '04'
        )); ?>

        <?php echo observata_render_block('observata/card-swoosh-icon', array(
            'cardTitle' => 'Support & training',
            'cardText' => 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.',
            'iconNumber' => '05'
        )); ?>

        <?php echo observata_render_block('observata/card-swoosh-icon', array(
            'cardTitle' => 'Unify every data source',
            'cardText' => 'Master your data flow with a seamless ingestion strategy. Using OpenTelemetry and custom SDKs, we unify logs and traces across your entire stack to break down silos and deliver actionable insights.',
            'iconNumber' => '06'
        )); ?>
    </div>
</section>
