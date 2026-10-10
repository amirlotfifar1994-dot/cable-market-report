<?php
defined('ABSPATH') || exit;
// Contact information remains editable through Barad settings and Yoast Local.
add_shortcode('barad_catalog_contact',function(){
    $icons=get_option('barad_catalog_contact_icons',[]);
    $local=get_option('wpseo_local',[]);
    $rows=[
        [95,'نشانی دفتر',barad_t(get_option('barad_address')),''],
        [97,'تلفن فروش',barad_phone(),'tel:'.barad_phone()],
        [99,'ایمیل',get_option('barad_email'),'mailto:'.get_option('barad_email')],
    ];
    $mobile=get_option('barad_mobile');
    if($mobile)$rows[]=[101,'تلفن همراه',$mobile,'tel:'.preg_replace('/[^0-9+]/','',barad_digits($mobile))];
    if(!empty($local['location_zipcode']))$rows[]=[95,'کدپستی',$local['location_zipcode'],''];
    $html='<section class="section w barad-cf-contact"><h2>'.esc_html(barad_t('راه‌های ارتباط با باراد')).'</h2><div class="barad-cf-contact-grid">';
    foreach($rows as [$number,$label,$value,$url]){
        $html.='<article class="info-box">';
        if(!empty($icons[$number]))$html.=wp_get_attachment_image($icons[$number],'thumbnail',false,['alt'=>'','class'=>'barad-cf-contact-icon','loading'=>'lazy']);
        $html.='<h3>'.esc_html(barad_t($label)).'</h3><p>';
        $content=$number===95&&$label!=='کدپستی'?esc_html($value):'<bdi>'.esc_html($value).'</bdi>';
        $html.=($url?'<a href="'.esc_url($url).'">'.$content.'</a>':$content).'</p></article>';
    }
    return $html.'</div><p class="barad-visit-note">'.esc_html(barad_visit_note()).'</p></section>';
});
