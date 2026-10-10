<?php
/** One real Barad office; local content and Yoast Local share contact details. */
defined('ABSPATH') || exit;
function barad_local_page_url(){
    $id=(int)get_option('barad_local_page_id');
    if(barad_language()==='en'){$translated=(int)apply_filters('wpml_object_id',$id,'page',false,'en');if(!$translated || $translated===$id)return ''; $id=$translated;}
    return $id && get_post_status($id)==='publish'?get_permalink($id):'';
}
function barad_local_has_coordinates(){
    $options=get_option('wpseo_local',[]);
    return isset($options['location_coords_lat'],$options['location_coords_long']) && is_numeric($options['location_coords_lat']) && is_numeric($options['location_coords_long']);
}
// Do not advertise an empty KML map while the exact office pin is unverified.
add_filter('wpseo_sitemap_index',function($xml){return barad_local_has_coordinates()?$xml:preg_replace('~<sitemap>\s*<loc>[^<]*geo-sitemap\.xml</loc>.*?</sitemap>~s','',$xml);},90);
add_action('init',function(){
    if(defined('WPSEO_LOCAL_VERSION') && !barad_local_has_coordinates() && preg_match('~/(geo-sitemap\.xml|locations\.kml)$~',wp_parse_url($_SERVER['REQUEST_URI']??'',PHP_URL_PATH)??'')){status_header(404);nocache_headers();exit;}
},0);
function barad_visit_note(){return barad_t('مراجعهٔ حضوری به دفتر باراد فقط با هماهنگی قبلی انجام می‌شود. پیش از حرکت با فروش تماس بگیرید.');}
function barad_local_hours_html(){
    if(defined('WPSEO_LOCAL_VERSION')){
        $options=get_option('wpseo_local',[]);
        return ($options['hide_opening_hours']??'on')==='on'?esc_html(barad_t('در سایت اصلی اعلام نشده است')):do_shortcode('[wpseo_opening_hours]');
    }
    return esc_html(get_option('barad_hours')?:barad_t('در سایت اصلی اعلام نشده است'));
}
function barad_local_phone($number){
    $number=preg_replace('/[^0-9+]/','',barad_digits($number));
    if(str_starts_with($number,'+98'))return '0'.substr($number,3);
    if(str_starts_with($number,'0098'))return '0'.substr($number,4);
    return $number;
}
function barad_local_international_phone($number){$number=barad_local_phone($number);return str_starts_with($number,'0')?'+98'.substr($number,1):$number;}
function barad_local_sync_options($source,$value){
    static $syncing=false;if($syncing || !defined('WPSEO_LOCAL_VERSION'))return;
    $syncing=true;
    try{
        if($source==='wpseo_local'){
            $address=implode('، ',array_filter([$value['location_city']??'', $value['location_address']??'', $value['location_address_2']??'']));
            if($address)update_option('barad_address',$address);
            if(!empty($value['location_phone']))update_option('barad_phone',barad_local_phone($value['location_phone']));
            if(!empty($value['location_email']))update_option('barad_email',sanitize_email($value['location_email']));
        }else{
            $options=get_option('wpseo_local',[]);
            if($source==='barad_address'){$options['location_address']=preg_replace('/^تهران[،\s-]+/u','',$value);$options['location_address_2']='';}
            if($source==='barad_phone')$options['location_phone']=barad_local_international_phone($value);
            if($source==='barad_email')$options['location_email']=$value;
            update_option('wpseo_local',$options);
        }
    }finally{$syncing=false;}
}
foreach(['wpseo_local','barad_address','barad_phone','barad_email'] as $source)add_action('update_option_'.$source,function($old,$value)use($source){barad_local_sync_options($source,$value);},30,2);
add_filter('wpseo_schema_graph',function($graph){
    if(!barad_seo_managed() || !defined('WPSEO_LOCAL_VERSION'))return $graph;
    $address_fallback=null;
    foreach($graph as &$node){
        if(in_array('Organization',(array)($node['@type']??[]),true)){
            // Local 15.9 omits an address without a postcode. Use the verified
            // street address without inventing the optional postal code.
            if(empty($node['address'])){
                $options=get_option('wpseo_local',[]);
                if(!empty($options['location_address']) && !empty($options['location_country'])){
                    $address_fallback=array_filter(['@type'=>'PostalAddress','@id'=>home_url('/#barad-office-address'),'streetAddress'=>implode('، ',array_filter([$options['location_address'],$options['location_address_2']??''])),'addressLocality'=>$options['location_city']??'','addressRegion'=>$options['location_state']??'','addressCountry'=>$options['location_country']]);
                    $node['address']=['@id'=>$address_fallback['@id']];
                }
            }
            $node['hasMap']=get_option('barad_map_url');
            $node['areaServed']=[['@type'=>'City','name'=>barad_t('تهران')],['@type'=>'Place','name'=>barad_t('شمال تهران')]];
            $node['description']=barad_t('ایده‌آفرینان باراد؛ تأمین سیم، کابل و تجهیزات ارتباطی در تهران با دفتر نیاوران. مراجعهٔ حضوری با هماهنگی قبلی.');
            $node['telephone']=barad_local_international_phone(barad_phone());
            if(empty($node['openingHoursSpecification']))unset($node['openingHoursSpecification']);
        }
        if(($node['@type']??'')==='PostalAddress')foreach(['postalCode','streetAddress','addressRegion','addressLocality'] as $key)if(empty($node[$key]))unset($node[$key]);
    }unset($node);
    if($address_fallback)$graph[]=$address_fallback;
    return $graph;
},40);
add_shortcode('barad_local_location',function(){
    $options=get_option('wpseo_local',[]);ob_start(); ?>
    <section class="w section barad-local-location" id="barad-office"><article class="info-box"><span class="eyebrow"><?php echo esc_html(barad_t('دفتر باراد در نیاوران')); ?></span><h2><?php echo esc_html(barad_t('نشانی و هماهنگی مراجعه')); ?></h2><p><?php echo esc_html(barad_t(get_option('barad_address'))); ?></p><p class="barad-visit-note"><?php echo esc_html(barad_visit_note()); ?></p><?php if(!empty($options['location_zipcode'])){ ?><p><?php echo esc_html(barad_t('کدپستی: ')); ?><bdi><?php echo esc_html($options['location_zipcode']); ?></bdi></p><?php } ?>
    <div class="actions"><a class="btn primary" href="tel:<?php echo esc_attr(barad_phone()); ?>"><?php echo esc_html(barad_t('هماهنگی با فروش')); ?> · <bdi><?php echo esc_html(barad_phone()); ?></bdi></a><?php if(get_option('barad_map_url')){ ?><a class="btn" href="<?php echo esc_url(get_option('barad_map_url')); ?>" target="_blank" rel="noopener"><?php echo esc_html(barad_t('موقعیت دفتر در نقشه ↗')); ?></a><?php } ?></div></article></section><?php return ob_get_clean();
});
add_shortcode('barad_local_teaser',function(){
    $url=barad_local_page_url();if(!$url)return '';
    return '<section class="section w barad-local-teaser"><div class="contact-band"><div><span class="eyebrow">'.esc_html(barad_t('تهران · دفتر نیاوران')).'</span><h2>'.esc_html(barad_t('تأمین سیم و کابل در تهران و شمال تهران')).'</h2><p>'.esc_html(barad_t('انتخاب کالا بر اساس مشخصات پروژه، استعلام قیمت و هماهنگی سفارش با باراد. برای مراجعه به دفتر نیاوران، پیش از حرکت تماس بگیرید.')).'</p></div><a class="btn primary" href="'.esc_url($url).'">'.esc_html(barad_t('راهنمای خرید و مراجعه')).'</a></div></section>';
});
add_shortcode('barad_local_categories',function(){
    return '<section class="w section barad-catalog-categories barad-local-categories"><div class="section-title"><div><h2>'.esc_html(barad_t('انتخاب سیم و کابل بر اساس دسته')).'</h2><p>'.esc_html(barad_t('از دستهٔ کالا شروع کنید و مشخصات مدل و سایز مورد نیازتان را بررسی کنید.')).'</p></div><a class="btn" href="'.esc_url(barad_url('catalog')).'">'.esc_html(barad_t('مشاهدهٔ همهٔ دسته‌ها')).'</a></div>'.barad_catalog_category_cards(barad_catalog_terms(0)).'</section>';
});
