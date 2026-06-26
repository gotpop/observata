<?php

$context               = \Timber\Timber::context();
$context['posts']      = \Timber\Timber::get_posts();
$context['body_class'] = implode( ' ', get_body_class() );
$context['header']     = do_blocks( '<!-- wp:observata/header /-->' );
$context['footer']     = do_blocks( '<!-- wp:observata/footer /-->' );

\Timber\Timber::render( 'templates/blog-index.twig', $context );
