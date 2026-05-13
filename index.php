<?php

$context               = \Timber\Timber::context();
$context['posts']      = \Timber\Timber::get_posts();
$context['body_class'] = implode( ' ', get_body_class() );

\Timber\Timber::render( 'templates/blog-index.twig', $context );
