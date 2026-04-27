<?php
$logo_text = $attributes['logo'] ?? 'Observata';
$services = $attributes['services'] ?? 'Services';
$pricing = $attributes['pricing'] ?? 'Pricing';
$resources = $attributes['resources'] ?? 'Resources';
$about = $attributes['about'] ?? 'About Us';
$contact = $attributes['contact'] ?? 'Contact Us';

$nav_items = [
    'services' => $services,
    'pricing' => $pricing,
    'resources' => $resources,
    'about-us' => $about,
    'contact-us' => $contact,
];
?>

<header id="header" class="observata-header">
    <div class="header-content">
        <div class="header-logo">
            <h1><a href="<?php echo esc_url(home_url('/')); ?>"
                    title="<?php echo esc_attr(get_bloginfo('name')); ?>"><?php echo esc_html($logo_text ?: get_bloginfo('name')); ?></a>
            </h1>
        </div>

        <div class="header-navigation">
            <nav id="menu" role="navigation"
                aria-label="<?php esc_attr_e('Primary Navigation', 'observata'); ?>">
                <ul class="menu-list">
                    <?php foreach ($nav_items as $slug => $label): ?>
                        <li
                            class="menu-item menu-item-<?php echo esc_attr($slug); ?>">
                            <a
                                href="<?php echo esc_url(home_url('/' . $slug . '/')); ?>"><span><?php echo esc_html($label); ?></span></a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </nav>
        </div>
    </div>
</header>