<?php

$context = \Timber\Timber::context();
$post = \Timber\Timber::get_post();

if (!$post) {
    wp_safe_redirect(home_url('/'));
    exit;
}

$post->setup();
$context['post'] = $post;
$context['body_class'] = implode(' ', get_body_class());
$context['show_comments'] = comments_open($post->ID) && !post_password_required($post->ID);

\Timber\Timber::render('templates/blog-single.twig', $context);