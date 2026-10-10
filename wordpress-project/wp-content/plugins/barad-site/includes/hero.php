<?php
defined('ABSPATH') || exit;
// Keep the native Elementor contact button in sync with the office settings.
add_filter('elementor/widget/render_content',function($html,$widget){
    if($widget->get_name()!=='button' || !in_array('barad-hero-call',explode(' ',(string)$widget->get_settings('_css_classes')),true))return $html;
    $processor=new WP_HTML_Tag_Processor($html);
    if($processor->next_tag('A'))$processor->set_attribute('href','tel:'.barad_phone());
    return $processor->get_updated_html();
},30,2);
