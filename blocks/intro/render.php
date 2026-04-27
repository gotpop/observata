<?php
$section_title = $attributes['sectionTitle'] ?? '';
?>

<section class="wp-block-observata-intro">
    <div class="logo-strip">
        <div class="logo-item">
            <img src="https://www.figma.com/api/mcp/asset/c0cc033c-1ffa-4544-bd2d-92323c9ab84" alt="AF" />
        </div>
        <div class="logo-item">
            <img src="https://www.figma.com/api/mcp/asset/c6d9e55b-6084-48f3-8b1e-5af4e63cd760" alt="Tele Dark" />
        </div>
        <div class="logo-item">
            <img src="https://www.figma.com/api/mcp/asset/e56a58d7-806e-4eb9-9ee1-11734ea7f061" alt="Elastic" />
        </div>
        <div class="logo-item">
            <img src="https://www.figma.com/api/mcp/asset/c0cc033c-f9cf-4a39-94d6-302e-5b93d9e86885" alt="Crowdstrike" />
        </div>
    </div>

    <?php if ($section_title): ?>
        <h2 class="intro-section-title"><?php echo wp_kses_post($section_title); ?></h2>
    <?php endif; ?>

    <div class="cards-container">
        <?php echo do_blocks_shortcode('observata/card-with-border', array(
            'cardTitle' => 'Embedded experts',
            'cardText' => 'We embed directly into your environment to tune pipelines and triage alerts. Eliminate skill gaps and lower overhead with 24/7 lifecycle coverage and executive-level reporting.',
            'iconClass' => 'icon-24'
        )); ?>

        <?php echo do_blocks_shortcode('observata/card-with-border', array(
            'cardTitle' => 'One fee — Zero surprises',
            'cardText' => 'We own the license; you pay one flat monthly bill for data usage. This includes unlimited support, optimization, and knowledge transfer to ensure total operational stability.',
            'iconClass' => 'icon-28'
        )); ?>

        <?php echo do_blocks_shortcode('observata/card-with-border', array(
            'cardTitle' => 'Achieve higher ROI',
            'cardText' => 'We embed directly into your environment to tune pipelines and triage alerts. Eliminate skill gaps and lower overhead with 24/7 lifecycle coverage and executive-level reporting.',
            'iconClass' => 'icon-26'
        )); ?>
    </div>
</section>
