<?php

$context                 = \Timber\Timber::context();
$context['posts']        = \Timber\Timber::get_posts();
$context['search_query'] = get_search_query();
$context['body_class']   = implode( ' ', get_body_class() );

\Timber\Timber::render( 'templates/blog-search.twig', $context );
