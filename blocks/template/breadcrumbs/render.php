<?php
$separator = ' &raquo; ';
$breadcrumbs = [];
$home_title = 'Home';

if (!is_front_page()) {
    $breadcrumbs[] = '<a href="' . home_url('/') . '">' . esc_html($home_title) . '</a>';
}

if (is_home() || is_singular('post')) {
    $blog_page_id = get_option('page_for_posts');
    if ($blog_page_id) {
        $breadcrumbs[] = '<a href="' . get_permalink($blog_page_id) . '">' . get_the_title($blog_page_id) . '</a>';
    }
}

if (is_category() || is_tag() || is_tax()) {
    $term = get_queried_object();
    $breadcrumbs[] = single_term_title('', false);
} elseif (is_search()) {
    $breadcrumbs[] = 'Search Results: "' . get_search_query() . '"';
} elseif (is_author()) {
    $author = get_queried_object();
    $breadcrumbs[] = 'Author: ' . $author->display_name;
} elseif (is_date()) {
    if (is_day()) {
        $breadcrumbs[] = get_the_date();
    } elseif (is_month()) {
        $breadcrumbs[] = get_the_date('F Y');
    } elseif (is_year()) {
        $breadcrumbs[] = get_the_date('Y');
    }
} elseif (is_singular()) {
    $post_id = get_the_ID();
    $ancestors = get_post_ancestors($post_id);
    $ancestors = array_reverse($ancestors);

    foreach ($ancestors as $ancestor) {
        $breadcrumbs[] = '<a href="' . get_permalink($ancestor) . '">' . get_the_title($ancestor) . '</a>';
    }

    if (!is_front_page()) {
        $breadcrumbs[] = get_the_title();
    }
}

$breadcrumbs_html = '';

if (!empty($breadcrumbs)) {
    $breadcrumbs_html = '<nav class="breadcrumbs" aria-label="Breadcrumb">';
    $breadcrumbs_html .= implode($separator, $breadcrumbs);
    $breadcrumbs_html .= '</nav>';
}

echo $breadcrumbs_html;
