<?php
$logo_text = $attributes['logo'] ?? 'Observata';
$services = $attributes['services'] ?? 'Services';
$pricing = $attributes['pricing'] ?? 'Pricing';
$resources = $attributes['resources'] ?? 'Resources';
$about = $attributes['about'] ?? 'About Us';
$contact = $attributes['contact'] ?? 'Contact Us';
?>

<header id="header" class="observata-header">
    <div class="header-content">
        <div class="header-logo">
            <h1><a href="{{ site.url }}" title="{{ site.name }}">{{ logo_text }}</a></h1>
        </div>

        <div class="header-navigation">
            <nav id="menu" role="navigation" aria-label="<?php echo esc_attr($services); ?>">
                <?php echo function('wp_nav_menu', array(
                    'theme_location' => 'main-menu',
                    'link_before' => '<span>',
                    'link_after' => '</span>',
                    'container' => '<ul class="menu-list">',
                    'items_wrap' => '<li><a href="%3$s">%4$s</a></li>',
                    'fallback_cb' => function() {
                        return '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html(home_url('/')) . '</a></li>';
                    }
                )); ?>
                <span class="menu-toggle" data-target="services">Services</span>
            </nav>

            <nav id="menu" role="navigation" aria-label="<?php echo esc_attr($pricing); ?>">
                <?php echo function('wp_nav_menu', array(
                    'theme_location' => 'main-menu',
                    'link_before' => '<span>',
                    'link_after' => '</span>',
                    'container' => '<ul class="menu-list">',
                    'items_wrap' => '<li><a href="%3$s">%4$s</a></li>',
                    'fallback_cb' => function() {
                        return '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html(home_url('/')) . '</a></li>';
                    }
                )); ?>
                <span class="menu-toggle" data-target="pricing">Pricing</span>
            </nav>

            <nav id="menu" role="navigation" aria-label="<?php echo esc_attr($resources); ?>">
                <?php echo function('wp_nav_menu', array(
                    'theme_location' => 'main-menu',
                    'link_before' => '<span>',
                    'link_after' => '</span>',
                    'container' => '<ul class="menu-list">',
                    'items_wrap' => '<li><a href="%3$s">%4$s</a></li>',
                    'fallback_cb' => function() {
                        return '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html(home_url('/')) . '</a></li>';
                    }
                )); ?>
                <span class="menu-toggle" data-target="resources">Resources</span>
            </nav>

            <nav id="menu" role="navigation" aria-label="<?php echo esc_attr($about); ?>">
                <?php echo function('wp_nav_menu', array(
                    'theme_location' => 'main-menu',
                    'link_before' => '<span>',
                    'link_after' => '</span>',
                    'container' => '<ul class="menu-list">',
                    'items_wrap' => '<li><a href="%3$s">%4$s</a></li>',
                    'fallback_cb' => function() {
                        return '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html(home_url('/')) . '</a></li>';
                    }
                )); ?>
                <span class="menu-toggle" data-target="about">About Us</span>
            </nav>

            <nav id="menu" role="navigation" aria-label="<?php echo esc_attr($contact); ?>">
                <?php echo function('wp_nav_menu', array(
                    'theme_location' => 'main-menu',
                    'link_before' => '<span>',
                    'link_after' => '</span>',
                    'container' => '<ul class="menu-list">',
                    'items_wrap' => '<li><a href="%3$s">%4$s</a></li>',
                    'fallback_cb' => function() {
                        return '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html(home_url('/')) . '</a></li>';
                    }
                )); ?>
                <span class="menu-toggle" data-target="contact">Contact Us</span>
            </nav>
    </div>
</header>
