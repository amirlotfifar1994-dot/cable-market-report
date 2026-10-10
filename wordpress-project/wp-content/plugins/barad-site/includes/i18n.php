<?php
defined('ABSPATH') || exit;
function barad_language() { return apply_filters('wpml_current_language',null) ?: 'fa'; }
function barad_is_page($slugs) {
    if (!is_page()) return false;
    $id=apply_filters('wpml_object_id',get_queried_object_id(),'page',true,'fa');
    return in_array(get_post_field('post_name',$id),(array)$slugs,true);
}
function barad_source_term($term,$taxonomy) {
    $id=apply_filters('wpml_object_id',$term->term_id,$taxonomy,true,'fa');
    $original=get_term($id,$taxonomy);
    return !is_wp_error($original) && $original ? $original : $term;
}
function barad_has_brand($slug,$id) {
    $source=apply_filters('wpml_object_id',$id,'product',true,'fa');
    return has_term($slug,'product_brand',$source);
}
function barad_current_product_id($id) { return (int)apply_filters('wpml_object_id',(int)$id,'product',true,barad_language()); }
function barad_english_defaults() {
    static $map;
    if($map===null){$map=json_decode(file_get_contents(__DIR__.'/../languages/en-defaults.json'),true) ?: [];uksort($map,fn($a,$b)=>strlen($b)<=>strlen($a));}
    return $map;
}
function barad_t($text) {
    if (!is_string($text) || barad_language()!=='en') return $text;
    $translated=apply_filters('wpml_translate_single_string',$text,'Barad Site',md5($text),'en');
    if($translated!==$text)return $translated;
    return strtr($text,barad_english_defaults());
}
function barad_language_switcher() {
    if(!defined('ICL_SITEPRESS_VERSION'))return '';
    $languages=apply_filters('wpml_active_languages',null,['skip_missing'=>1,'orderby'=>'code']);
    if(!$languages)return '';
    $html='<nav class="barad-languages" aria-label="Language">';
    foreach($languages as $code=>$language){$label=$code==='fa'?'فارسی':'English';$html.='<a lang="'.esc_attr($code).'" href="'.esc_url($language['url']).'" '.($language['active']?'aria-current="true"':'').'>'.esc_html($label).'</a>';}
    return $html.'</nav>';
}
add_filter('wp_get_attachment_image_attributes',function($attr){if(barad_language()==='en')$attr['alt']=barad_t($attr['alt']??'');return $attr;},30);
add_filter('woocommerce_currency_symbol',function($symbol,$currency){return barad_language()==='en' && $currency==='IRT' ? 'toman' : $symbol;},20,2);
add_filter('woocommerce_get_price_html',function($html){return barad_language()==='en' ? barad_t($html) : $html;},20);
add_filter('language_attributes',function($attributes){return barad_language()==='en' && !str_contains($attributes,'dir=') ? $attributes.' dir="ltr"' : $attributes;},30);

// Barad's bulk editor saves via WooCommerce CRUD rather than the product edit screen.
// Explicitly synchronize price fields through WPML for AJAX, REST and CLI saves alike.
add_action('woocommerce_after_product_object_save',function($product){
    static $syncing=false;
    if($syncing || !defined('ICL_SITEPRESS_VERSION') || !$product->is_type('simple'))return;
    $id=$product->get_id();
    if($id!==(int)apply_filters('wpml_object_id',$id,'product',true,'fa'))return;
    $translated=apply_filters('wpml_object_id',$id,'product',false,'en');
    if(!$translated || $translated===$id)return;
    $syncing=true;
    try{
        foreach(['_regular_price','_sale_price','_price','_sale_price_dates_from','_sale_price_dates_to','_barad_price_updated_at'] as $key)do_action('wpml_sync_custom_field',$id,$key);
        clean_post_cache($translated);wc_delete_product_transients($translated);
        if(function_exists('wcml_product_data_store_cpt'))wcml_product_data_store_cpt()->update_lookup_table_data($translated);
    }finally{$syncing=false;}
},100);
