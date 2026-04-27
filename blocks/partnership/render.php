<?php
$section_title = $attributes['sectionTitle'] ?? '';
?>

<section class="wp-block-observata-partnership">
    <div class="swoosh-gradient"></div>
    <div class="swoosh-mask">
        <div class="swoop"></div>
    </div>

    <div class="content-wrapper">
        <?php if ($section_title): ?>
            <h2 class="section-title"><?php echo wp_kses_post($section_title); ?></h2>
        <?php endif; ?>

        <div class="phases-wrap">
            <div class="phase">
                <div class="phase-box">
                    <div class="phase-number">01</div>
                    <div class="phase-title">The entry point</div>
                </div>
                <div class="phase-content">
                    <p class="phase-text">Migrate from your current observability tool to Elastic at no extra cost.</p>
                    <p class="phase-text">Our experts will audit your current set-up and optimise for success.</p>
                </div>
            </div>

            <div class="phase">
                <div class="phase-box">
                    <div class="phase-number">02</div>
                    <div class="phase-title">The partnership</div>
                </div>
                <div class="phase-content">
                    <p class="phase-text">Once your environment is implemented and optimised, you'll move into Observata's continuous elevation of your observability. This is where the real value lives.</p>
                    <p class="phase-text">Our experts will audit your current set-up and optimise for success.</p>
                </div>
            </div>
        </div>

        <div class="icon-container">
            <div class="icon-circle"></div>
            <div class="arrow-icon"></div>
        </div>

        <?php if ($section_title): ?>
            <a href="#partnership-phase" class="partnership-cta"><?php echo esc_html($cta_url); ?></a>
        <?php endif; ?>
    </div>
</section>
