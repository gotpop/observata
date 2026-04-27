<?php
$section_title = $attributes['sectionTitle'] ?? '';

$intro_cards = [
    [
        'title' => 'Embedded experts',
        'text' => 'We embed directly into your environment to tune pipelines and triage alerts. Eliminate skill gaps and lower overhead with 24/7 lifecycle coverage and executive-level reporting.',
        'icon_class' => 'icon-24',
    ],
    [
        'title' => 'One fee — Zero surprises',
        'text' => 'We own the license; you pay one flat monthly bill for data usage. This includes unlimited support, optimization, and knowledge transfer to ensure total operational stability.',
        'icon_class' => 'icon-28',
    ],
    [
        'title' => 'Achieve higher ROI',
        'text' => 'We embed directly into your environment to tune pipelines and triage alerts. Eliminate skill gaps and lower overhead with 24/7 lifecycle coverage and executive-level reporting.',
        'icon_class' => 'icon-26',
    ],
];
?>

<section class="wp-block-observata-intro">
    <div class="logo-strip">
        <div class="logo-item">
            <img src="https://www.figma.com/api/mcp/asset/c0cc033c-1ffa-4544-bd2d-92323c9ab84"
                alt="AF" />
        </div>
        <div class="logo-item">
            <img src="https://www.figma.com/api/mcp/asset/c6d9e55b-6084-48f3-8b1e-5af4e63cd760"
                alt="Tele Dark" />
        </div>
        <div class="logo-item">
            <img src="https://www.figma.com/api/mcp/asset/e56a58d7-806e-4eb9-9ee1-11734ea7f061"
                alt="Elastic" />
        </div>
        <div class="logo-item">
            <img src="https://www.figma.com/api/mcp/asset/c0cc033c-f9cf-4a39-94d6-302e-5b93d9e86885"
                alt="Crowdstrike" />
        </div>
    </div>

    <?php if ($section_title): ?>
        <h2 class="intro-section-title"><?php echo wp_kses_post($section_title); ?>
        </h2>
    <?php endif; ?>

    <div class="cards-container">
        <?php foreach ($intro_cards as $card): ?>
            <article
                class="intro-card <?php echo esc_attr($card['icon_class']); ?>">
                <div class="intro-card-icon" aria-hidden="true"></div>
                <div class="intro-card-body">
                    <h3 class="intro-card-title">
                        <?php echo esc_html($card['title']); ?></h3>
                    <p class="intro-card-text">
                        <?php echo esc_html($card['text']); ?></p>
                </div>
            </article>
        <?php endforeach; ?>
    </div>
</section>