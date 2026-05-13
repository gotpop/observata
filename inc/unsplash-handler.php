<?php
/**
 * Unsplash Image Handler
 * Provides REST API endpoints for searching Unsplash and downloading images with WebP conversion
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register REST API routes for Unsplash operations
 */
function observata_register_unsplash_routes() {
    register_rest_route('wp/v2', '/unsplash/search', [
        'methods' => 'GET',
        'callback' => 'observata_unsplash_search_handler',
        'permission_callback' => 'observata_unsplash_search_permission_callback',
        'args' => [
            'query' => [
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field',
                'validate_callback' => function($param) {
                    return !empty($param) && strlen($param) <= 200;
                }
            ],
            'page' => [
                'default' => 1,
                'sanitize_callback' => 'absint',
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param >= 1 && $param <= 10;
                }
            ],
            'per_page' => [
                'default' => 12,
                'sanitize_callback' => 'absint',
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param >= 1 && $param <= 30;
                }
            ]
        ]
    ]);

    register_rest_route('wp/v2', '/unsplash/download', [
        'methods' => 'POST',
        'callback' => 'observata_unsplash_download_handler',
        'permission_callback' => 'observata_unsplash_download_permission_callback',
        'args' => [
            'image_url' => [
                'required' => true,
                'sanitize_callback' => 'esc_url_raw',
                'validate_callback' => function($param) {
                    return filter_var($param, FILTER_VALIDATE_URL) !== false;
                }
            ],
            'photographer' => [
                'required' => false,
                'sanitize_callback' => 'sanitize_text_field',
                'default' => 'Unsplash'
            ],
            'unsplash_url' => [
                'required' => false,
                'sanitize_callback' => 'esc_url_raw',
                'default' => ''
            ]
        ]
    ]);
}
add_action('rest_api_init', 'observata_register_unsplash_routes');

/**
 * Permission callback for Unsplash search - requires edit_posts capability
 */
function observata_unsplash_search_permission_callback() {
    return current_user_can('edit_posts');
}

/**
 * Permission callback for Unsplash download - requires upload_files capability
 */
function observata_unsplash_download_permission_callback() {
    return current_user_can('upload_files');
}

/**
 * Get Unsplash API key from WordPress options
 */
function observata_get_unsplash_api_key() {
    return get_option('observata_unsplash_api_key', '');
}

/**
 * Handler for Unsplash search endpoint
 */
function observata_unsplash_search_handler($request) {
    $api_key = observata_get_unsplash_api_key();

    if (empty($api_key)) {
        return new WP_Error(
            'unsplash_api_key_missing',
            'Unsplash API key is not configured. Please add it in Theme Options.',
            ['status' => 500]
        );
    }

    $query = $request->get_param('query');
    $page = $request->get_param('page');
    $per_page = $request->get_param('per_page');

    // Check if GD library is available
    if (!extension_loaded('gd') || !function_exists('imagecreatefromjpeg')) {
        return new WP_Error(
            'gd_library_missing',
            'GD library is required for image processing. Please enable it on your server.',
            ['status' => 500]
        );
    }

    // Make request to Unsplash API
    $url = add_query_arg([
        'query' => $query,
        'page' => $page,
        'per_page' => $per_page,
        'orientation' => 'landscape',
    ], 'https://api.unsplash.com/search/photos');

    $response = wp_remote_get($url, [
        'headers' => [
            'Authorization' => 'Client-ID ' . $api_key,
            'Accept-Version' => 'v1'
        ],
        'timeout' => 15
    ]);

    if (is_wp_error($response)) {
        error_log('[observata] Unsplash API error: ' . $response->get_error_message());
        return new WP_Error(
            'unsplash_api_error',
            'Failed to connect to Unsplash API. Please try again.',
            ['status' => 500]
        );
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('[observata] Unsplash JSON decode error: ' . json_last_error_msg());
        return new WP_Error(
            'unsplash_json_error',
            'Failed to parse Unsplash API response.',
            ['status' => 500]
        );
    }

    if (!isset($data['results'])) {
        // Check for rate limit errors
        if (isset($data['errors']) && is_array($data['errors'])) {
            $error_msg = $data['errors'][0] ?? 'Unknown error';
            return new WP_Error(
                'unsplash_api_error',
                'Unsplash API error: ' . $error_msg,
                ['status' => 400]
            );
        }

        return new WP_Error(
            'unsplash_invalid_response',
            'Invalid response from Unsplash API.',
            ['status' => 500]
        );
    }

    // Extract relevant image data
    $images = [];
    foreach ($data['results'] as $result) {
        if (!isset($result['urls'])) {
            continue;
        }

        $images[] = [
            'id' => $result['id'],
            'description' => $result['description'] ?? $result['alt_description'] ?? '',
            'urls' => [
                'regular' => $result['urls']['regular'] ?? '',
                'small' => $result['urls']['small'] ?? '',
                'thumb' => $result['urls']['thumb'] ?? '',
            ],
            'user' => [
                'name' => $result['user']['name'] ?? 'Unknown',
                'username' => $result['user']['username'] ?? 'unknown',
                'portfolio_url' => $result['user']['portfolio_url'] ?? '',
            ],
            'links' => [
                'html' => $result['links']['html'] ?? '',
            ],
            'dimensions' => [
                'width' => $result['width'] ?? 0,
                'height' => $result['height'] ?? 0,
            ]
        ];
    }

    return rest_ensure_response([
        'images' => $images,
        'total' => $data['total'] ?? 0,
        'total_pages' => $data['total_pages'] ?? 0,
    ]);
}

/**
 * Handler for Unsplash download and upload endpoint
 */
function observata_unsplash_download_handler($request) {
    $image_url = $request->get_param('image_url');
    $photographer = $request->get_param('photographer');
    $unsplash_url = $request->get_param('unsplash_url');

    // Validate image URL size (prevent downloading huge files)
    $head_response = wp_remote_head($image_url, ['timeout' => 10]);

    if (is_wp_error($head_response)) {
        error_log('[observata] Image HEAD request failed: ' . $head_response->get_error_message());
        return new WP_Error(
            'image_download_error',
            'Failed to check image size.',
            ['status' => 500]
        );
    }

    $content_length = wp_remote_retrieve_header($head_response, 'content-length');
    $max_size = 5 * 1024 * 1024; // 5MB limit

    if ($content_length && $content_length > $max_size) {
        return new WP_Error(
            'image_too_large',
            sprintf('Image is too large. Maximum size is %sMB.', $max_size / (1024 * 1024)),
            ['status' => 400]
        );
    }

    // Download image
    $response = wp_remote_get($image_url, [
        'timeout' => 30,
        'stream' => false,
    ]);

    if (is_wp_error($response)) {
        error_log('[observata] Image download failed: ' . $response->get_error_message());
        return new WP_Error(
            'image_download_error',
            'Failed to download image from Unsplash.',
            ['status' => 500]
        );
    }

    $image_data = wp_remote_retrieve_body($response);

    if (empty($image_data)) {
        return new WP_Error(
            'image_empty',
            'Downloaded image data is empty.',
            ['status' => 500]
        );
    }

    // Get file info
    $temp_path = tempnam(sys_get_temp_dir(), 'unsplash_');

    if ($temp_path === false) {
        return new WP_Error(
            'temp_file_error',
            'Failed to create temporary file.',
            ['status' => 500]
        );
    }

    // Write downloaded data to temp file
    file_put_contents($temp_path, $image_data);

    // Convert to WebP
    $webp_path = $temp_path . '.webp';
    $quality = apply_filters('observata_webp_quality', 80); // Default 80%

    try {
        // Detect image type and create image resource
        $image_info = getimagesize($temp_path);

        if ($image_info === false) {
            throw new Exception('Could not get image information.');
        }

        $mime_type = $image_info['mime'];
        $image = null;

        switch ($mime_type) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($temp_path);
                break;
            case 'image/png':
                $image = imagecreatefrompng($temp_path);
                break;
            case 'image/webp':
                // Already WebP, just copy
                copy($temp_path, $webp_path);
                $image = null; // Skip conversion
                break;
            default:
                throw new Exception('Unsupported image format: ' . $mime_type);
        }

        if ($image !== null) {
            // Convert to WebP
            $result = imagewebp($image, $webp_path, $quality);

            if (!$result) {
                throw new Exception('Failed to convert image to WebP.');
            }

            imagedestroy($image);
        }

        // Read WebP data
        if (!file_exists($webp_path)) {
            throw new Exception('WebP file was not created.');
        }

        $webp_data = file_get_contents($webp_path);

        if ($webp_data === false) {
            throw new Exception('Failed to read WebP file.');
        }

        // Generate filename
        $filename = 'unsplash-' . md5($image_url) . '.webp';

        // Upload to WordPress media library
        $upload = wp_upload_bits($filename, null, $webp_data);

        if ($upload['error']) {
            throw new Exception($upload['error']);
        }

        // Check available disk space (rough check)
        $upload_dir = wp_upload_dir();
        $free_space = disk_free_space($upload_dir['basedir']);

        if ($free_space !== false && $free_space < 10 * 1024 * 1024) { // Less than 10MB
            wp_delete_attachment($upload['attachment_id'], true);
            throw new Exception('Insufficient disk space for upload.');
        }

        // Create attachment
        $attachment = [
            'post_mime_type' => 'image/webp',
            'post_title' => sanitize_file_name($filename),
            'post_content' => '',
            'post_status' => 'inherit'
        ];

        $attach_id = wp_insert_attachment($attachment, $upload['file']);

        if (is_wp_error($attach_id)) {
            wp_delete_file($upload['file']);
            throw new Exception($attach_id->get_error_message());
        }

        // Generate thumbnails
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $attachment_data = wp_generate_attachment_metadata($attach_id, $upload['file']);

        if (!is_wp_error($attachment_data)) {
            wp_update_attachment_metadata($attach_id, $attachment_data);
        }

        // Add attribution meta data
        update_post_meta($attach_id, 'unsplash_photographer', $photographer);
        if (!empty($unsplash_url)) {
            update_post_meta($attach_id, 'unsplash_source_url', $unsplash_url);
        }

        // Clean up temp files
        @unlink($temp_path);
        @unlink($webp_path);

        return rest_ensure_response([
            'success' => true,
            'attachment_id' => $attach_id,
            'url' => $upload['url']
        ]);

    } catch (Exception $e) {
        error_log('[observata] Unsplash download error: ' . $e->getMessage());

        // Clean up temp files
        @unlink($temp_path);
        @unlink($webp_path);

        return new WP_Error(
            'image_processing_error',
            $e->getMessage(),
            ['status' => 500]
        );
    }
}

/**
 * Enqueue the Unsplash sidebar script only on the post editor.
 */
function observata_enqueue_unsplash_sidebar($hook) {
    if ($hook !== 'post.php' && $hook !== 'post-new.php') {
        return;
    }

    $asset_file = get_template_directory() . '/build/unsplash-sidebar.asset.php';

    if (!file_exists($asset_file)) {
        return;
    }

    $asset = require $asset_file;

    wp_enqueue_script(
        'observata-unsplash-sidebar',
        get_template_directory_uri() . '/build/unsplash-sidebar.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );

    wp_enqueue_style(
        'observata-unsplash-sidebar',
        get_template_directory_uri() . '/build/style-unsplash-sidebar.css',
        ['wp-components'],
        $asset['version']
    );
}
add_action('admin_enqueue_scripts', 'observata_enqueue_unsplash_sidebar');

/**
 * Add admin notice if Unsplash API key is not configured
 */
function observata_unsplash_api_notice() {
    // Only show on post editor pages
    $screen = get_current_screen();
    if (!$screen || $screen->base !== 'post') {
        return;
    }

    $api_key = observata_get_unsplash_api_key();

    if (empty($api_key)) {
        ?>
        <div class="notice notice-warning is-dismissible">
            <p>
                <strong>Unsplash Integration:</strong>
                To use Unsplash images in your posts, please add your Unsplash API key.
                <a href="<?php echo admin_url('options-general.php'); ?>">Add it in Settings → General</a>.
            </p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'observata_unsplash_api_notice');

/**
 * Add Unsplash API key field to WordPress settings
 */
function observata_add_unsplash_api_key_setting() {
    add_settings_section(
        'observata_unsplash_section',
        'Unsplash Integration',
        'observata_unsplash_section_callback',
        'general'
    );

    add_settings_field(
        'observata_unsplash_api_key',
        'Unsplash API Key',
        'observata_unsplash_api_key_render',
        'general',
        'observata_unsplash_section'
    );

    register_setting('general', 'observata_unsplash_api_key', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '',
    ]);
}
add_action('admin_init', 'observata_add_unsplash_api_key_setting');

/**
 * Section callback for Unsplash settings
 */
function observata_unsplash_section_callback() {
    echo '<p>Add your Unsplash API key to enable image search in the post editor. Get your key at <a href="https://unsplash.com/developers" target="_blank">unsplash.com/developers</a>.</p>';
}

/**
 * Render Unsplash API key input field
 */
function observata_unsplash_api_key_render() {
    $api_key = get_option('observata_unsplash_api_key', '');
    ?>
    <input type="password"
           id="observata_unsplash_api_key"
           name="observata_unsplash_api_key"
           value="<?php echo esc_attr($api_key); ?>"
           class="regular-text"
           placeholder="Enter your Unsplash API key">
    <p class="description">Your API key will be stored securely and used only for server-side requests to Unsplash.</p>
    <?php
}