<?php
$card_title = $attributes['cardTitle'] ?? '';
$card_text = $attributes['cardText'] ?? '';
$icon_number = $attributes['iconNumber'] ?? '01';
?>

<article class="wp-block-observata-card-swoosh-icon">
    <div class="swoosh-background">
        <div class="icon-circle">
            <span class="icon-number"><?php echo esc_html($icon_number); ?></span>
        </div>
    </div>

    <div class="card-body">
        <?php if ($card_title): ?>
            <h3 class="card-title"><?php echo wp_kses_post($card_title); ?></h3>
        <?php endif; ?>
        <?php if ($card_text): ?>
            <p class="card-text"><?php echo wp_kses_post($card_text); ?></p>
        <?php endif; ?>
    </div>
</article>
