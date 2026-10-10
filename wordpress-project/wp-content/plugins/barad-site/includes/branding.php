<?php
defined('ABSPATH') || exit;
// Custom templates use native image URLs and browser lazy loading. WoodMart's
// placeholder loader can leave the logo and offscreen images blank on mobile.
add_filter('woodmart_enable_lazy_loading',function($enabled){return barad_seo_managed() ? false : $enabled;});
add_action('wp',function(){if(barad_seo_managed() && function_exists('woodmart_lazy_loading_deinit'))woodmart_lazy_loading_deinit(true);},99);
add_shortcode('barad_contact_band',function(){return barad_t('<section class="section w"><div class="contact-band"><div><h2>برای انتخاب کابل، با فروش صحبت کنید.</h2><p>مدل، مقدار و شرایط پروژه را بگویید؛ مشخصات و امکان تأمین را با هم بررسی می‌کنیم.</p></div><a class="btn primary" href="tel:').esc_attr(barad_phone()).barad_t('">تماس با فروش · <bdi>').esc_html(barad_phone()).'</bdi></a></div></section>';});
add_action('admin_enqueue_scripts',function($hook){
    if($hook==='settings_page_barad-settings'){wp_enqueue_media();wp_enqueue_script('barad-admin',plugins_url('../admin.js',__FILE__),['jquery'],filemtime(__DIR__.'/../admin.js'),true);}
});
add_action('admin_menu',function(){add_options_page(barad_t('تنظیمات باراد'),barad_t('باراد'),'manage_options','barad-settings',function(){
    if(!current_user_can('manage_options'))return;
    if(isset($_POST['barad_save'])){
        check_admin_referer('barad_settings');
        $design=sanitize_key(barad_value($_POST,'design','blueprint'));if(in_array($design,['blueprint','studio','signal'],true))update_option('barad_design',$design);
        foreach(['phone','mobile','hours']as$key)update_option('barad_'.$key,sanitize_text_field(barad_digits(barad_value($_POST,$key))));
        update_option('barad_email',sanitize_email(barad_value($_POST,'email')));
        update_option('barad_address',sanitize_textarea_field(barad_value($_POST,'address')));
        update_option('barad_map_url',esc_url_raw(barad_value($_POST,'map_url')));
        $logo=absint(barad_value($_POST,'logo_id'));if(!$logo||wp_attachment_is_image($logo))update_option('barad_logo_id',$logo);
        echo barad_t('<div class="notice notice-success"><p>تنظیمات ذخیره شد.</p></div>');
    }
    ?><div class="wrap"><h1><?php echo esc_html(barad_t('تنظیمات باراد')); ?></h1><form method="post"><?php wp_nonce_field('barad_settings'); ?><table class="form-table">
        <tr><th><?php echo esc_html(barad_t('لوگوی شرکت')); ?></th><td><div id="barad-logo-preview"><?php echo wp_get_attachment_image(absint(get_option('barad_logo_id')),'medium',false,['style'=>'max-width:120px;height:auto;background:transparent;padding:0']); ?></div><input id="barad-logo-id" type="hidden" name="logo_id" value="<?php echo esc_attr(get_option('barad_logo_id')); ?>"><button type="button" class="button" id="barad-pick-logo"><?php echo esc_html(barad_t('انتخاب از رسانه‌ها')); ?></button></td></tr>
        <tr><th><label for="barad-palette"><?php echo esc_html(barad_t('پالت رنگ')); ?></label></th><td><select id="barad-palette" name="design"><?php foreach(['blueprint'=>barad_t('مهندسی'),'studio'=>barad_t('روشن'),'signal'=>barad_t('ارتباط')]as$v=>$label)echo '<option value="'.esc_attr($v).'" '.selected(get_option('barad_design','blueprint'),$v,false).'>'.esc_html($label).'</option>'; ?></select><p class="description"><?php echo esc_html(barad_t('پالت رنگ، رنگ‌بندی را تغییر می‌دهد؛ چیدمان صفحه در المنتور ویرایش می‌شود.')); ?></p></td></tr>
        <?php foreach(['phone'=>barad_t('تلفن / فکس'),'mobile'=>barad_t('پیام‌رسان'),'email'=>barad_t('ایمیل'),'hours'=>barad_t('ساعت کاری'),'map_url'=>barad_t('لینک نقشه')]as$key=>$label){ ?><tr><th><label for="barad-<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></label></th><td><input class="regular-text" id="barad-<?php echo esc_attr($key); ?>" name="<?php echo esc_attr($key); ?>" type="<?php echo $key==='email'?'email':($key==='map_url'?'url':'text'); ?>" value="<?php echo esc_attr(get_option('barad_'.$key)); ?>"></td></tr><?php } ?>
        <tr><th><label for="barad-address"><?php echo esc_html(barad_t('نشانی')); ?></label></th><td><textarea class="large-text" id="barad-address" name="address" rows="3"><?php echo esc_textarea(get_option('barad_address')); ?></textarea></td></tr>
    </table><button class="button button-primary" name="barad_save"><?php echo esc_html(barad_t('ذخیره')); ?></button></form><p><?php echo esc_html(barad_t('کالا و قیمت: محصولات ووکامرس. صفحات: ویرایش با المنتور. درخواست‌ها: درخواست‌های باراد.')); ?></p></div><?php
});});
