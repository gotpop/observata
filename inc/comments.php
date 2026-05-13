<?php

// Render pingback/trackback comments as a simple list item.
function observata_custom_pings($comment)
{
	?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
		<?php comment_author_link(); ?>
	</li>
	<?php
}

// Count only approved non-pingback comments for display.
add_filter('get_comments_number', 'observata_comment_count', 0);
function observata_comment_count($count)
{
	if (!is_admin()) {
		global $id;
		$get_comments = get_comments([
			'status' => 'approve',
			'post_id' => $id,
		]);
		$comments_by_type = separate_comments($get_comments);
		return count($comments_by_type['comment']);
	} else {
		return $count;
	}
}