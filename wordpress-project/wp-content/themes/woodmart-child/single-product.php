<?php
defined('ABSPATH') || exit;
?><!doctype html><html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><?php wp_head(); ?></head><body <?php body_class('barad-site'); ?> data-design="<?php echo esc_attr(get_option('barad_design', 'blueprint')); ?>"><?php wp_body_open(); echo barad_header(); ?><main id="main-content"><?php while (have_posts()) { the_post(); echo do_shortcode('[barad_product]'); } ?></main><?php echo barad_footer(); wp_footer(); ?></body></html>
