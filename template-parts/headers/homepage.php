<header id="header" class="header-homepage" role="banner">
	<div id="branding">
		<div id="site-title" itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
			<?php
			echo '<h1>';
			echo '<a href="' . esc_url( home_url( '/' ) ) . '" title="' . esc_attr( get_bloginfo( 'name' ) ) . '" rel="home" itemprop="url"><span itemprop="name">' . esc_html( get_bloginfo( 'name' ) ) . '</span></a>';
			echo '</h1>';
			?>
		</div>
	</div>
	<nav id="menu" role="navigation" aria-label="<?php esc_attr_e( 'Primary Navigation', 'observata' ); ?>" itemscope itemtype="https://schema.org/SiteNavigationElement">
		<?php wp_nav_menu( array( 'theme_location' => 'main-menu', 'link_before' => '<span itemprop="name">', 'link_after' => '</span>' ) ); ?>
	</nav>
</header>
