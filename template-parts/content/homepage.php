<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
	<div id="post-<?php the_ID(); ?>" <?php post_class( 'homepage-content' ); ?>>
		<?php the_content(); ?>
	</div>
<?php endwhile; endif; ?>
