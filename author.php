<?php

$context = \Timber\Timber::context();
$context['posts'] = \Timber\Timber::get_posts();
$context['archive_title'] = get_the_archive_title();
$context['archive_description'] = get_the_archive_description();
$context['body_class'] = implode(' ', get_body_class());

\Timber\Timber::render('templates/blog-archive.twig', $context);