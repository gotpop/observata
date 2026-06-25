<?php $args = array(
	// translators: %s is a left-pointing arrow icon.
	'prev_text' => sprintf( esc_html__( '%s older', 'observata' ), '<span class="meta-nav">&larr;</span>' ),
	// translators: %s is a right-pointing arrow icon.
	'next_text' => sprintf( esc_html__( 'newer %s', 'observata' ), '<span class="meta-nav">&rarr;</span>' ),
);
the_posts_navigation( $args );
