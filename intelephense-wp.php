<?php
/**
 * Intelephense WordPress Bootstrap
 *
 * This file helps Intelephense recognize WordPress functions
 */

// Load WordPress stubs
if ( file_exists( __DIR__ . '/vendor/php-stubs/wordpress-stubs/wordpress-stubs.php' ) ) {
	require_once __DIR__ . '/vendor/php-stubs/wordpress-stubs/wordpress-stubs.php';
}

// Define common WordPress functions if stubs don't work
if ( ! function_exists( 'esc_html__' ) ) {
	/**
	 * Retrieve the translation of $text and escapes it for safe use in HTML output.
	 *
	 * @param string $text   Text to translate.
	 * @param string $domain Optional. Text domain. Default 'default'.
	 * @return string Translated text.
	 */
	function esc_html__( $text, $domain = 'default' ) {
		return esc_html( translate( $text, $domain ) );
	}
}

if ( ! function_exists( '__' ) ) {
	/**
	 * Retrieve the translation of $text.
	 *
	 * @param string $text   Text to translate.
	 * @param string $domain Optional. Text domain. Default 'default'.
	 * @return string Translated text.
	 */
	function __( $text, $domain = 'default' ) {
		return translate( $text, $domain );
	}
}

if ( ! function_exists( '_e' ) ) {
	/**
	 * Display translated text.
	 *
	 * @param string $text   Text to translate.
	 * @param string $domain Optional. Text domain. Default 'default'.
	 */
	function _e( $text, $domain = 'default' ) {
		echo translate( $text, $domain );
	}
}

if ( ! function_exists( 'esc_html' ) ) {
	/**
	 * Escaping for HTML blocks.
	 *
	 * @param string $text Text to escape.
	 * @return string Escaped text.
	 */
	function esc_html( $text ) {
		return htmlspecialchars( $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'translate' ) ) {
	/**
	 * Retrieve the translation of $text.
	 *
	 * @param string $text   Text to translate.
	 * @param string $domain Optional. Text domain. Default 'default'.
	 * @return string Translated text.
	 */
	function translate( $text, $domain = 'default' ) {
		return $text;
	}
}
