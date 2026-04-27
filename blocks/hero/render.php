<?php
$heading = $attributes['heading'] ?? '';
$subheading = $attributes['subheading'] ?? '';
$cta_text = $attributes['ctaText'] ?? 'Review Your Observability Structure';
$cta_url = $attributes['ctaUrl'] ?? '#';
$read_more_text = $attributes['readMoreText'] ?? 'Discover';
$read_more_url = $attributes['readMoreUrl'] ?? '#';
?>

<section class="wp-block-observata-hero">
    <div class="gradient-background"></div>
    <div class="ribbon-shader"></div>

    <div class="hero-content">
        <div class="hero-text">
            <?php if ($heading): ?>
                <h1><?php echo wp_kses_post($heading); ?></h1>
            <?php endif; ?>

            <?php if ($subheading): ?>
                <p class="hero-subheading"><?php echo wp_kses_post($subheading); ?></p>
            <?php endif; ?>
        </div>

        <div class="hero-buttons">
            <?php if ($cta_text && $cta_url): ?>
                <a href="<?php echo esc_url($cta_url); ?>" class="hero-cta-primary"><?php echo esc_html($cta_text); ?></a>
            <?php endif; ?>

            <?php if ($read_more_text && $read_more_url): ?>
                <div class="hero-read-more">
                    <p><?php echo esc_html($read_more_text); ?></p>
                    <div class="arrow-icon"></div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>
