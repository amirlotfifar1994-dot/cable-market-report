<?php
/** Localize display text while preserving links, form data and structured data. */
defined('ABSPATH') || exit;
function barad_persian_digits($text){
    return strtr($text,['0'=>'۰','1'=>'۱','2'=>'۲','3'=>'۳','4'=>'۴','5'=>'۵','6'=>'۶','7'=>'۷','8'=>'۸','9'=>'۹','٠'=>'۰','١'=>'۱','٢'=>'۲','٣'=>'۳','٤'=>'۴','٥'=>'۵','٦'=>'۶','٧'=>'۷','٨'=>'۸','٩'=>'۹']);
}
function barad_localize_display_html($html){
    $processor=new WP_HTML_Tag_Processor($html);
    while($processor->next_token()){
        if($processor->get_token_type()==='#text'){
            $text=$processor->get_modifiable_text();$localized=barad_persian_digits($text);
            if($text!==$localized)$processor->set_modifiable_text($localized);
        }elseif($processor->get_token_type()==='#tag' && !$processor->is_tag_closer()){
            if($processor->get_tag()==='TITLE')$processor->set_modifiable_text(barad_persian_digits($processor->get_modifiable_text()));
            foreach(['placeholder','aria-label','title','alt'] as $attribute){
                $value=$processor->get_attribute($attribute);
                if(is_string($value) && $value!==barad_persian_digits($value))$processor->set_attribute($attribute,barad_persian_digits($value));
            }
            if($processor->get_tag()==='META'){
                $name=$processor->get_attribute('name')?:$processor->get_attribute('property');
                if(in_array($name,['description','og:title','og:description','twitter:title','twitter:description'],true)){
                    $value=$processor->get_attribute('content');if(is_string($value))$processor->set_attribute('content',barad_persian_digits($value));
                }
            }
        }
    }
    return $processor->get_updated_html();
}
add_action('template_redirect',function(){
    if(!is_admin() && !wp_doing_ajax() && !is_feed() && barad_language()==='fa' && barad_seo_managed())ob_start('barad_localize_display_html');
},20);
