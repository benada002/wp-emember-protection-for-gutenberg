<?php

/**
 * Plugin Name: WP-eMember Gutenberg Block Protection
 * Plugin URI: https://github.com/benada002/wp-emember-protection-for-gutenberg
 * Description: Adds WP-eMember Protection options to Gutenberg blocks
 * Author: benada002
 * Author URI: https://github.com/benada002
 * Version: 2.0.0
 */

if (!defined('ABSPATH')) exit;

if (function_exists('emember_protected_handler')) {
    require_once plugin_dir_path(__FILE__) . 'add-endpoint.php';

    /**
     * Registers all block assets so that they can be enqueued through the block editor
     * in the corresponding context.
     *
     * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
     */
    function benada_gep_block_init()
    {
        $dir = dirname(__FILE__);

        $script_asset_path = "$dir/build/index.asset.php";
        if (!file_exists($script_asset_path)) {
            throw new Error(
                'You need to run `npm start` or `npm run build`'
            );
        }
        $index_js     = 'build/index.js';
        $script_asset = require($script_asset_path);
        wp_enqueue_script(
            'benada002_gep_block',
            plugins_url($index_js, __FILE__),
            $script_asset['dependencies'],
            $script_asset['version']
        );
    }
    add_action('enqueue_block_editor_assets', 'benada_gep_block_init');

    function gep_filter_content($content, $block)
    {
        if (
            isset($block['attrs']['ememberProtect'])
            && $block['attrs']['ememberProtect']
            && !is_admin()
        ) {
            foreach ($block['attrs']['ememberProtectAttrs'] as $key => $value) {
                if (!$value || $value === "") {
                    unset($block['attrs']['ememberProtectAttrs'][$key]);
                }

                if (is_array($value) && count($value) > 0) {
                    $block['attrs']['ememberProtectAttrs'][$key] = implode('-', $value);
                }
            }

            return emember_protected_handler(($block['attrs']['ememberProtectAttrs']), $content, $codes = '');
        }

        return $content;
    }
    add_filter('render_block', 'gep_filter_content', 10, 2);
} else {
    function gep_error_notice()
    {
        $class = 'notice notice-error';
        $message = 'You need to install/activate WP-eMember!!!';

        printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
    }
    add_action('admin_notices', 'gep_error_notice');
}
