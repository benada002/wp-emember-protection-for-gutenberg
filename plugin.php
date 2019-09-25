<?php
/**
 * Plugin Name: WP-eMember Protection for Gutenberg
 * Plugin URI: https://github.com/benada002
 * Description: Adds WP-eMember Protection options to Gutenberg blocks
 * Author: benada002
 * Author URI: https://github.com/benada002
 * Version: 1.0.0
 */

if(!defined('ABSPATH')) exit;

include_once plugin_dir_path( __FILE__ ) . 'add-endpoint.php';

function gep_block_assets() { // phpcs:ignore
	wp_enqueue_script(
        'plu-js',
        plugins_url( '/dist/index.js', __FILE__ ),
        ['wp-compose', 'wp-hooks', 'wp-editor', 'wp-element', 'wp-components', 'wp-api-fetch']
    );
}
add_action( 'enqueue_block_editor_assets', 'gep_block_assets' );

function gep_filter_content($content, $block){
    if(isset($block['attrs']['ememberProtect']) && $block['attrs']['ememberProtect'] && !is_admin()){
        foreach($block['attrs']['ememberProtectAttrs'] as $key => $value){
            if(!$value || $value === ""){
                unset($block['attrs']['ememberProtectAttrs'][$key]);
            }
        }
        return emember_protected_handler(($block['attrs']['ememberProtectAttrs']), $content, $codes = '');
    }

    return $content;
}
add_filter('render_block', 'gep_filter_content',10, 2);