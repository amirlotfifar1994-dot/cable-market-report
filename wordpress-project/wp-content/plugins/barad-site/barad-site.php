<?php
/**
 * Plugin Name: Barad Site
 * Description: Barad catalog and guest quotation with WooCommerce data and Elementor pages.
 * Version: 0.2.0
 */
defined('ABSPATH') || exit;
require_once __DIR__.'/includes/i18n.php';
function barad_url($page = '') {
    if (!$page) return apply_filters('wpml_home_url', home_url('/'));
    $post = get_page_by_path($page, OBJECT, 'page');
    if ($post) {
        $id = apply_filters('wpml_object_id', $post->ID, 'page', true);
        return get_permalink($id);
    }
    return home_url('/'.$page.'/');
}
function barad_phone() { return get_option('barad_phone', '02121000001'); }
function barad_asset($file) { return plugins_url('assets/' . $file, __FILE__); }
function barad_mark() {
    $logo = absint(get_option('barad_logo_id'));
    $image = $logo ? wp_get_attachment_image($logo, 'full', false, ['class'=>'barad-logo', 'alt'=>barad_t('ایده‌آفرینان باراد'), 'loading'=>'eager']) : '';
    if (!$image) $image = '<img class="barad-logo" src="'.esc_url(barad_asset('images/barad-fingerprint-transparent.png')).barad_t('" alt="ایده‌آفرینان باراد">');
    return '<a class="brand" href="' . esc_url(barad_url()) . barad_t('" aria-label="ایده‌آفرینان باراد؛ صفحه اصلی"><span class="barad-logo-plate">').$image.'</span></a>';
}
function barad_header() {
    ob_start(); ?>
    <a class="screen-reader-text" href="#main-content"><?php echo esc_html(barad_t('رفتن به محتوا')); ?></a>
    <div class="demo-strip barad-announcement"><span><?php echo esc_html(barad_t('باراد؛ تأمین سیم، کابل و تجهیزات ارتباطی')); ?></span><a href="tel:<?php echo esc_attr(barad_phone()); ?>"><?php echo esc_html(barad_t('مشاوره و استعلام قیمت')); ?>: <bdi><?php echo esc_html(barad_phone()); ?></bdi></a></div>
    <div class="topline"><div class="w"><b><?php echo esc_html(barad_t('سیم و کابل برق · مخابرات · فیبر نوری')); ?></b><span><?php echo esc_html(barad_t('انتخاب مدل | پیش‌فاکتور | تماس با فروش')); ?></span></div></div>
    <header class="head"><div class="w"><div class="head-main"><?php echo barad_mark(); echo barad_language_switcher(); ?><button class="barad-menu-toggle" aria-expanded="false" aria-controls="barad-main-nav"><span aria-hidden="true">☰</span><?php echo esc_html(barad_t(' منو')); ?></button><form class="search" action="<?php echo esc_url(barad_url('catalog')); ?>"><input name="q" aria-label="<?php echo esc_attr(barad_t('جست‌وجوی مدل کابل')); ?>" placeholder="<?php echo esc_attr(barad_t('جست‌وجوی کالا، دسته یا سایز')); ?>" value="<?php echo esc_attr(sanitize_text_field(barad_value($_GET,'q'))); ?>"><button aria-label="<?php echo esc_attr(barad_t('جست‌وجو')); ?>"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg></button></form><div class="head-contact"><?php echo esc_html(barad_t('مشاوره و فروش')); ?><a href="tel:<?php echo esc_attr(barad_phone()); ?>" dir="ltr"><?php echo esc_html(barad_phone()); ?></a></div></div><nav class="nav" id="barad-main-nav" aria-label="<?php echo esc_attr(barad_t('منوی اصلی')); ?>"><?php foreach ([''=>barad_t('خانه'), 'catalog'=>barad_t('تمام کالاها'), 'about'=>barad_t('درباره باراد'), 'contact'=>barad_t('تماس')] as $slug=>$title) { ?><a href="<?php echo esc_url(barad_url($slug)); ?>" <?php if (($slug === '' && is_front_page()) || barad_is_page($slug ?: 'home')) echo 'aria-current="page"'; ?>><?php echo esc_html($title); ?></a><?php } ?><a href="<?php echo esc_url(barad_url('afsharnejad')); ?>"><?php echo esc_html(barad_t('افشارنژاد')); ?></a><a href="<?php echo esc_url(barad_url('ghandi')); ?>"><?php echo esc_html(barad_t('شهید قندی')); ?></a><a class="quote-link" href="<?php echo esc_url(barad_url('quote')); ?>"><?php echo esc_html(barad_t('پیش‌فاکتور')); ?></a></nav></div></header>
    <?php return ob_get_clean();
}
function barad_footer() {
    ob_start(); ?><footer class="footer"><div class="w"><div class="footer-grid"><div><?php echo barad_mark(); ?><p><?php echo esc_html(barad_t('ایده‌آفرینان باراد؛ همراه شما در تأمین سیم، کابل و تجهیزات ارتباطی. نمایندهٔ رسمی افشارنژاد خراسان و نمایندهٔ شهید قندی یزد.')); ?></p></div><div class="footer-links"><h3><?php echo esc_html(barad_t('دسترسی سریع')); ?></h3><?php foreach (['catalog'=>barad_t('کالاها'),'quote'=>barad_t('پیش‌فاکتور'),'about'=>barad_t('درباره ما'),'contact'=>barad_t('تماس')] as $s=>$t) echo '<a href="'.esc_url(barad_url($s)).'">'.esc_html($t).'</a>'; if($local_url=barad_local_page_url())echo '<a href="'.esc_url($local_url).'">'.esc_html(barad_t('سیم و کابل در تهران')).'</a>'; ?></div><div><h3><?php echo esc_html(barad_t('ارتباط با باراد')); ?></h3><a dir="ltr" href="tel:<?php echo esc_attr(barad_phone()); ?>"><?php echo esc_html(barad_phone()); ?></a><p><?php echo esc_html(barad_t(get_option('barad_address','تهران، نیاوران؛ نشانی نهایی پیش از انتشار تأیید شود.'))); ?></p></div></div><div class="footer-bottom"><span><?php echo esc_html(barad_t('تمام حقوق این وب‌سایت برای ایده‌آفرینان باراد محفوظ است.')); ?></span></div></div></footer><div class="mobile-actions"><a href="tel:<?php echo esc_attr(barad_phone()); ?>"><?php echo esc_html(barad_t('تماس با فروش')); ?></a><a href="<?php echo esc_url(barad_url('quote')); ?>"><?php echo esc_html(barad_t('پیش‌فاکتور')); ?></a></div><?php return ob_get_clean();
}
add_action('wp_enqueue_scripts', function() {
    if (is_page_template('page-barad.php') || is_singular('product') || is_tax('product_cat')) {
        wp_enqueue_style('barad-site', plugins_url('barad.css',__FILE__), [], filemtime(__DIR__.'/barad.css'));
        wp_enqueue_style('barad-review',plugins_url('review.css',__FILE__),['barad-site'],filemtime(__DIR__.'/review.css'));
        wp_enqueue_style('barad-catalog',plugins_url('catalog.css',__FILE__),['barad-review'],filemtime(__DIR__.'/catalog.css'));
        wp_enqueue_style('barad-modern',plugins_url('modern.css',__FILE__),['barad-catalog'],filemtime(__DIR__.'/modern.css'));
        wp_enqueue_script('barad-site', plugins_url('barad.js',__FILE__), [], filemtime(__DIR__.'/barad.js'),true);
        wp_localize_script('barad-site','baradFrontend',['locale'=>barad_language()==='en'?'en-US':'fa-IR','invalidQuantity'=>barad_t('مقدار معتبر وارد کنید')]);
    }
}, 1100);
add_action('init',function() {
    register_post_type('barad_request',['labels'=>['name'=>barad_t('درخواست‌های باراد'),'singular_name'=>barad_t('درخواست باراد')],'public'=>false,'show_ui'=>true,'menu_icon'=>'dashicons-email','supports'=>['title','editor'],'capability_type'=>'post','map_meta_cap'=>true]);
});
function barad_price($p) {
    if ($p->get_price() === '') return barad_t('<span>تماس برای قیمت و تأمین</span>');
    return '<b>' . wc_price($p->get_price()) . barad_t('</b> / متر') . ($p->get_meta('_barad_demo') ? barad_t('<small>قیمت آزمایشی؛ برای خرید معتبر نیست</small>') : '');
}
function barad_card($p) {
    if(!$p)return '';
    $brands=wp_get_post_terms($p->get_id(),'product_brand',['fields'=>'names']);
    ob_start(); ?><article class="product-card"><a class="product-image" href="<?php echo esc_url($p->get_permalink()); ?>"><?php echo $p->get_image('medium_large'); ?><?php if($p->get_meta('_barad_size')){ ?><span class="barad-size-pill" aria-label="<?php echo esc_attr(barad_t('سایز کالا')); ?>"><bdi><?php echo esc_html($p->get_meta('_barad_size')); ?></bdi></span><?php } ?></a><div class="card-body"><small class="barad-card-brand"><?php echo esc_html(implode(barad_t('، '),$brands)); ?></small><h3><a href="<?php echo esc_url($p->get_permalink()); ?>"><?php echo barad_product_name($p->get_name()); ?></a></h3><small class="barad-card-sku"><bdi><?php echo esc_html($p->get_sku()); ?></bdi></small><p><?php echo wp_kses_post($p->get_short_description()); ?></p><div class="product-price"><?php echo barad_price($p); ?></div><div class="card-actions"><a class="btn primary" href="<?php echo esc_url($p->get_permalink()); ?>"><?php echo esc_html(barad_t('مشخصات و استعلام')); ?><span aria-hidden="true">↗</span></a></div></div></article><?php return ob_get_clean();
}
add_shortcode('barad_products', function() {
    $products=wc_get_products(['status'=>'publish','visibility'=>'visible','limit'=>3,'orderby'=>'menu_order','order'=>'ASC']);
    return barad_t('<section class="section w"><div class="section-title"><div><h2>از میان کالاهای باراد</h2><p>سیم و کابل مسی افشارنژاد در سبد فعلی؛ مشخصات و منابع هر کالا را بررسی کنید.</p></div><a href="').esc_url(barad_url('catalog')).barad_t('">تمام کالاها ←</a></div><div class="products">').implode('',array_map('barad_card',$products)).'</div></section>';
});
require_once __DIR__.'/includes/catalog.php';
function barad_product_name($name) {
    return preg_replace('/([0-9]+(?:\.[0-9]+)?x[0-9]+(?:\.[0-9]+)?(?:x[0-9]+(?:\.[0-9]+)?)?(?:\+[0-9]+(?:\.[0-9]+)?)?|4\.5C-2V)/', '<bdi>$1</bdi>', esc_html($name));
}
function barad_catalog_search($q) {
    $q=str_replace(['ي','ك','‌','٫'],['ی','ک',' ','.'],barad_digits($q));
    $q=preg_replace('/\s+/u',' ',trim($q));
    $q=str_replace('افشار نژاد','افشارنژاد',$q);
    return preg_replace('/(?<=\d)\s*[*×xX]\s*(?=\d)/u','x',$q);
}
add_shortcode('barad_product',function() {
    $p=wc_get_product(get_the_ID()); if(!$p) return '';
    $sheet=absint($p->get_meta('_barad_datasheet_id'));
    ob_start(); ?>
    <div class="subhero w"><?php echo barad_breadcrumb_html(); ?></div>
    <section class="w product-layout">
      <div class="product-gallery"><div class="product-image"><?php echo $p->get_image('large'); ?></div>
        <?php if($sheet) { ?><a class="barad-datasheet" href="<?php echo esc_url(wp_get_attachment_url($sheet)); ?>" target="_blank" rel="noopener"><?php echo wp_get_attachment_image($sheet,'medium'); ?><span><?php echo esc_html(barad_t('باز کردن برگه فنی همین سایز ↗')); ?></span></a><?php } ?>
        <p><?php echo $p->get_meta('_barad_spec_status')==='basic-only' ? barad_t('برگه فنی اختصاصی این کالا هنوز تأیید نشده؛ مشخصات تکمیلی را از فروش بگیرید.') : (str_contains($p->get_meta('_barad_image_caption'),'خانواده') ? barad_t('تصویر خانواده، نمای عمومی محصول است. مشخصات اختصاصی را در جدول و برگه فنی بررسی کنید.') : barad_t('برگه نمایش‌داده‌شده مربوط به همین سایز است؛ برای مطالعه، نسخه کامل آن را باز کنید.')); ?></p>
      </div>
      <div class="product-copy"><a class="brand-pill" href="<?php echo esc_url(barad_url(barad_has_brand('afshar',$p->get_id()) ? 'afsharnejad' : 'catalog')); ?>"><?php echo esc_html(implode(barad_t('، '),wp_get_post_terms($p->get_id(),'product_brand',['fields'=>'names']))); ?></a><h1><?php echo barad_product_name($p->get_name()); ?></h1><?php echo wp_kses_post(wpautop($p->get_short_description())); ?><div class="product-meta"><?php echo esc_html(barad_t('کد کالا: ')); ?><bdi><?php echo esc_html($p->get_sku()); ?></bdi></div><div class="buy-box"><div class="product-price"><?php echo barad_price($p); ?></div>
        <?php if(barad_can_quote($p)){ ?><form method="get" action="<?php echo esc_url(barad_url('quote')); ?>"><input type="hidden" name="product_id" value="<?php echo esc_attr($p->get_id()); ?>"><label for="product-qty"><?php echo esc_html(barad_t('مقدار (متر)')); ?></label><input id="product-qty" name="quantity" type="number" min="1" max="100000" step="1" value="100" required><button class="btn primary"><?php echo esc_html(barad_t('ادامه پیش‌فاکتور بدون حساب')); ?></button></form><p class="buy-note"><?php echo esc_html(barad_t('قیمت و مقدار هنگام صدور، سمت سرور بررسی می‌شوند.')); ?></p><?php } else { ?><p><?php echo esc_html(barad_t('برای قیمت روز و شرایط سفارش با فروش تماس بگیرید.')); ?></p><?php } ?>
        <a class="btn" href="tel:<?php echo esc_attr(barad_phone()); ?>"><?php echo esc_html(barad_t('تماس با فروش')); ?></a>
      </div></div>
    </section>
    <section class="w product-info"><article class="info-box"><h2><?php echo esc_html(barad_t('مشخصات فنی')); ?></h2><table class="specs"><?php foreach($p->get_attributes() as $a) { ?><tr><td><?php echo esc_html(barad_t(wc_attribute_label($a->get_name()))); ?></td><td><bdi><?php echo esc_html(implode(barad_t('، '),$a->get_options())); ?></bdi></td></tr><?php } ?></table><div class="barad-product-sources"><h3><?php echo esc_html(barad_t('منابع مشخصات')); ?></h3><?php foreach((array)$p->get_meta('_barad_sources') as $source) { ?><a class="source-link" href="<?php echo esc_url($source['url']); ?>" target="_blank" rel="noopener"><?php echo esc_html(barad_t($source['label'])); ?> ↗</a><?php } ?></div></article><article class="info-box"><h2><?php echo esc_html(barad_t('کاربرد و نکات سفارش')); ?></h2><?php echo wp_kses_post(wpautop($p->get_description())); ?></article></section>
    <?php return ob_get_clean();
});
function barad_rate_limit() {
    $key='barad_rate_'.hash('sha256',($_SERVER['REMOTE_ADDR']??'local').wp_salt());
    $count=(int)get_transient($key); if($count>=10) return false;
    set_transient($key,$count+1,10*MINUTE_IN_SECONDS); return true;
}
require_once __DIR__.'/includes/forms.php';
require_once __DIR__.'/includes/branding.php';
require_once __DIR__.'/includes/pricing.php';
require_once __DIR__.'/includes/seo.php';
require_once __DIR__.'/includes/yoast.php';
require_once __DIR__.'/includes/local-seo.php';
require_once __DIR__.'/includes/catalog-content.php';
require_once __DIR__.'/includes/display.php';
add_action('template_redirect',function() {
    if(barad_is_page(['quote','contact'])) { nocache_headers(); header('Referrer-Policy: no-referrer'); if(barad_is_page('quote')) header('X-Robots-Tag: noindex, follow'); }
});
add_filter('woocommerce_is_purchasable', function($allowed,$p){ return $p->get_meta('_barad_demo') ? false : $allowed; },10,2);
