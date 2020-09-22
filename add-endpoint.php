<?php
if (!defined('ABSPATH')) exit;

global $wpdb;

class GEP_Add_Enpoint
{
    /**
     * WP DB Instance
     *
     * @var object
     */
    private $wpdb;

    /**
     * Namespace for the Endpoint
     *
     * @var string
     */
    private $namespace;

    function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;

        $this->namespace = 'gepemebergutenberg/v1';

        add_action('rest_api_init', array($this, 'add_enpoints'));
    }

    public function add_enpoints()
    {
        register_rest_route($this->namespace, '/levels/', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_levels'),
            'permission_callback' => array($this, 'user_is_permitted')
        ));
    }

    private function create_response($to_transform, $label, $value)
    {
        $response = array();

        foreach ($to_transform as $key => $val) {
            $response[] = array(
                'value' => $val->{$value},
                'label' => $val->{$label}
            );
        }

        return $response;
    }

    public function user_is_permitted()
    {
        return current_user_can('list_users');
    }

    public function get_levels()
    {
        $levels = $this->wpdb->get_results("SELECT id, alias FROM {$this->wpdb->prefix}wp_eMember_membership_tbl WHERE id > 1");
        $response = $this->create_response($levels, 'alias', 'id');

        return $response;
    }
}

new GEP_Add_Enpoint();
