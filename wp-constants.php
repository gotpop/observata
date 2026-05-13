<?php
/**
 * WordPress constants and functions for IDE support
 * This file provides basic WordPress function definitions for Intelephense
 */

// Basic WordPress functions
if (!function_exists('add_action')) {
    function add_action($tag, $function_to_add, $priority = 10, $accepted_args = 1) {
        return true;
    }
}

if (!function_exists('add_filter')) {
    function add_filter($tag, $function_to_add, $priority = 10, $accepted_args = 1) {
        return true;
    }
}

if (!function_exists('do_action')) {
    function do_action($tag, $arg = '') {
        // Empty function for IDE support
    }
}

if (!function_exists('apply_filters')) {
    function apply_filters($tag, $value, $arg = '') {
        return $value;
    }
}

if (!function_exists('__')) {
    function __($text, $domain = 'default') {
        return $text;
    }
}

if (!function_exists('_e')) {
    function _e($text, $domain = 'default') {
        echo $text;
    }
}

if (!function_exists('esc_html')) {
    function esc_html($text) {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('esc_attr')) {
    function esc_attr($text) {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('get_template_directory')) {
    function get_template_directory() {
        return __DIR__;
    }
}

if (!function_exists('get_stylesheet_directory_uri')) {
    function get_stylesheet_directory_uri() {
        return '';
    }
}