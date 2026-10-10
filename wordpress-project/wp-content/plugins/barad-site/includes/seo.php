<?php
/** Metadata for the custom Barad templates; prices always come from WooCommerce. */
defined('ABSPATH') || exit;

function barad_afshar_groups() {
    return [
        'afshar-wire'=>barad_t('سیم افشان مسی افشارنژاد خراسان در سایزهای مختلف؛ مشخصات هادی، سطح مقطع و برگه فنی هر سیم را پیش از سفارش بررسی کنید.'),
        'afshar-flexible'=>barad_t('کابل افشان مسی افشارنژاد خراسان؛ انتخاب بر اساس تعداد رشته، سطح مقطع و مدل. ولتاژ و کاربرد هر سایز در مشخصات اختصاصی همان کالا درج شده است.'),
        'afshar-underground'=>barad_t('کابل زمینی مسی افشارنژاد خراسان از خانواده NYY؛ مشخصات تعداد رشته، سطح مقطع، عایق و روکش برای انتخاب کابل برق پروژه.'),
        'afshar-cooler'=>barad_t('کابل کولری افشارنژاد خراسان؛ بررسی تعداد رشته، سطح مقطع و برگه فنی برای انتخاب کابل متناسب با مدار کولر.'),
        'afshar-telephone'=>barad_t('کابل تلفنی افشارنژاد خراسان؛ انتخاب بر اساس تعداد زوج و قطر هادی. قطر هادی در این گروه با میلی‌متر بیان می‌شود، نه میلی‌متر مربع.'),
        'afshar-coax'=>barad_t('کابل کواکسیال افشارنژاد خراسان؛ مشخصات مدل، هادی و ساختار کابل را در صفحه کالا و برگه فنی بررسی کنید.'),
        'afshar-shielded'=>barad_t('کابل شیلددار مسی افشارنژاد خراسان؛ مقایسه تعداد رشته، سایز و مدل برای مدارهای نیازمند شیلد. انتخاب نهایی مطابق مشخصات مدار انجام می‌شود.'),
        'afshar-double'=>barad_t('کابل دو روکشه افشارنژاد خراسان؛ مشخصات هادی، عایق، روکش و سایزهای موجود به همراه منابع فنی هر کالا.'),
    ];
}
function barad_seo_managed() {
    return is_page_template('page-barad.php') || is_singular('product') || is_tax('product_cat');
}
function barad_seo_external() {
    return defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION') || defined('SEOPRESS_VERSION') || defined('THE_SEO_FRAMEWORK_VERSION');
}
function barad_seo_filtered() {
    if (!barad_is_page('catalog')) return false;
    foreach (['q','brand','group'] as $key) if (isset($_GET[$key]) && is_scalar($_GET[$key]) && trim((string) wp_unslash($_GET[$key])) !== '') return true;
    return false;
}
function barad_seo_url() {
    if (is_tax('product_cat')) {
        $url = get_term_link(get_queried_object());
        if (is_wp_error($url)) return home_url('/');
        $page = max(1, (int) get_query_var('paged'));
        return $page > 1 ? trailingslashit($url).'page/'.$page.'/' : $url;
    }
    $url = get_permalink(get_queried_object_id());
    return $url ?: home_url('/');
}
function barad_seo_text($html) {
    return trim(preg_replace('/\s+/u', ' ', html_entity_decode(wp_strip_all_tags(strip_shortcodes($html)), ENT_QUOTES, 'UTF-8')));
}
function barad_seo_meta() {
    $id = get_queried_object_id();
    $page = is_tax('product_cat') ? max(1, (int)get_query_var('paged')) : (barad_is_page('catalog') && barad_seo_filtered() ? max(1, absint($_GET['catalog_page'] ?? 1)) : 1);
    $titles = [
        'home'=>barad_t('باراد | تأمین سیم، کابل و تجهیزات ارتباطی'),
        'afsharnejad'=>barad_t('نمایندگی رسمی افشارنژاد خراسان | باراد'),
        'ghandi'=>barad_t('نمایندگی شهید قندی یزد؛ کابل نوری و مخابراتی | باراد'),
        'catalog'=>barad_t('کالاهای باراد؛ مشخصات سیم و کابل و استعلام قیمت'),
        'about'=>barad_t('درباره باراد | تأمین کابل و تجهیزات ارتباطی'),
        'contact'=>barad_t('تماس با باراد | مشاوره و فروش سیم و کابل'),
        'quote'=>barad_t('درخواست پیش‌فاکتور سیم و کابل | باراد'),
    ];
    $descriptions = [
        'home'=>barad_t('ایده‌آفرینان باراد؛ تأمین سیم، کابل و تجهیزات ارتباطی و نمایندگی افشارنژاد خراسان و شهید قندی یزد. انتخاب محصول بر اساس مشخصات فنی و هماهنگی قیمت و سفارش با فروش.'),
        'afsharnejad'=>barad_t('خرید و استعلام قیمت سیم و کابل افشارنژاد خراسان از نمایندگی رسمی باراد؛ سیم افشان، کابل زمینی، شیلددار، تلفنی و کولری با مشخصات و برگه فنی.'),
        'ghandi'=>barad_t('ایده‌آفرینان باراد، نماینده شهید قندی یزد؛ مشاوره انتخاب و استعلام کابل فیبر نوری و کابل مخابراتی مسی بر اساس مدل، مشخصات پروژه و مقدار سفارش.'),
        'catalog'=>barad_t('دسته‌بندی کالاهای باراد؛ سیم‌ها، کابل افشان و کنترل، کابل قدرت و نصب ثابت، کابل مخابراتی و کواکسیال. جست‌وجوی زیردسته، مدل، کد و سایز سیم و کابل و استعلام قیمت روز.'),
        'about'=>barad_t('آشنایی با ایده‌آفرینان باراد؛ فعالیت‌های تأمین سیم و کابل و تجهیزات ارتباطی، نمایندگی افشارنژاد خراسان و شهید قندی یزد و اسناد معرفی مجموعه.'),
        'contact'=>barad_t('اطلاعات تماس و نشانی ایده‌آفرینان باراد برای مشاوره انتخاب محصول، استعلام قیمت سیم و کابل و هماهنگی سفارش برندهای طرف همکاری.'),
        'quote'=>barad_t('درخواست پیش‌فاکتور سیم و کابل از باراد؛ مدل، سایز و مقدار مورد نیاز را با فروش هماهنگ کنید.'),
    ];
    if (is_tax('product_cat')) {
        $term = get_queried_object();
        $title = $term->name.barad_t('؛ مشخصات و قیمت | باراد');
        $description = barad_seo_text($term->description).barad_t(' برای قیمت روز و شرایط سفارش با فروش باراد تماس بگیرید.');
    } elseif (is_singular('product')) {
        $p = wc_get_product($id);
        $title = $p->get_name().barad_t(' | باراد');
        $description = barad_t('مشخصات ').$p->get_name().barad_t('؛ ').barad_seo_text($p->get_short_description()).barad_t(' استعلام قیمت روز و سفارش از نمایندگی رسمی افشارنژاد در باراد.');
    } else {
        $source_id=apply_filters('wpml_object_id',$id,'page',true,'fa');
        $slug = get_post_field('post_name', $source_id);
        $title = $titles[$slug] ?? get_the_title($id).barad_t(' | باراد');
        $description = $descriptions[$slug] ?? barad_seo_text(get_post_field('post_excerpt', $id));
    }
    if (!is_tax('product_cat')) {
        $title = get_post_meta($id, '_barad_seo_title', true) ?: $title;
        $description = get_post_meta($id, '_barad_seo_description', true) ?: $description;
    }
    if ($page > 1) $title .= barad_t(' — صفحه ').$page;
    // Snippets are display hints; each product keeps its specific name and size.
    $description = wp_html_excerpt(barad_seo_text($description), 230, '…');
    return ['title'=>$title, 'description'=>$description, 'url'=>barad_seo_url()];
}
add_filter('pre_get_document_title', function($title) {
    return barad_seo_managed() && !barad_seo_external() ? barad_seo_meta()['title'] : $title;
}, 30);
add_filter('get_canonical_url', function($url, $post) {
    return barad_seo_managed() && !barad_seo_external() && $post->ID === get_queried_object_id() ? barad_seo_url() : $url;
}, 20, 2);
add_filter('wp_robots', function($robots) {
    if (barad_seo_filtered() || barad_is_page('quote')) {
        $robots['noindex'] = true;
        unset($robots['index']);
        if (!isset($robots['nofollow'])) $robots['follow'] = true;
    }
    return $robots;
});
function barad_breadcrumb_items() {
    $items = [['name'=>barad_t('باراد'),'url'=>barad_url()]];
    if (is_tax('product_cat') || is_singular('product')) {
        $p = is_singular('product') ? wc_get_product(get_queried_object_id()) : null;
        $items[] = ['name'=>barad_t('کالاها'),'url'=>barad_url('catalog')];
        $term=$p ? null : get_queried_object();
        if($p){$terms=wp_get_post_terms($p->get_id(),'product_cat');if(!is_wp_error($terms)){usort($terms,fn($a,$b)=>count(get_ancestors($b->term_id,'product_cat','taxonomy'))<=>count(get_ancestors($a->term_id,'product_cat','taxonomy')));$term=$terms[0]??null;}}
        if($term){foreach(array_reverse(get_ancestors($term->term_id,'product_cat','taxonomy')) as $ancestor){$parent=get_term($ancestor,'product_cat');if($parent&&!is_wp_error($parent))$items[]=['name'=>$parent->name,'url'=>get_term_link($parent)];}$items[]=['name'=>$term->name,'url'=>$p?get_term_link($term):barad_seo_url()];}
        if($p)$items[]=['name'=>$p->get_name(),'url'=>$p->get_permalink()];
    } elseif (!is_front_page()) $items[] = ['name'=>get_the_title(get_queried_object_id()),'url'=>barad_seo_url()];
    return $items;
}
function barad_breadcrumb_html() {
    $items = barad_breadcrumb_items();
    $html = barad_t('<nav class="breadcrumb" aria-label="مسیر صفحه">');
    foreach ($items as $i=>$item) {
        if ($i) $html .= '<span aria-hidden="true"> / </span>';
        $html .= $i === count($items)-1 ? '<span aria-current="page">'.esc_html($item['name']).'</span>' : '<a href="'.esc_url($item['url']).'">'.esc_html($item['name']).'</a>';
    }
    return $html.'</nav>';
}
function barad_product_schema($p) {
    $url = $p->get_permalink();
    $schema = ['@type'=>'Product','@id'=>$url.'#product','url'=>$url,'name'=>$p->get_name(),'sku'=>$p->get_sku(),'description'=>barad_seo_text($p->get_short_description()),'mainEntityOfPage'=>['@id'=>$url.'#webpage']];
    $image = wp_get_attachment_image_url($p->get_image_id(),'full');
    if ($image) $schema['image'] = [$image];
    $brands = wp_get_post_terms($p->get_id(),'product_brand',['fields'=>'names']);
    if ($brands && !is_wp_error($brands)) $schema['brand'] = ['@type'=>'Brand','name'=>implode(barad_t('، '),$brands)];
    if (barad_has_brand('afshar',$p->get_id())) $schema['manufacturer'] = ['@type'=>'Organization','name'=>barad_t('شرکت صنعتی الکتریک خراسان (افشارنژاد)'),'url'=>'https://khorasanelectric.com/'];
    foreach ($p->get_attributes() as $attribute) $schema['additionalProperty'][] = ['@type'=>'PropertyValue','name'=>barad_t(wc_attribute_label($attribute->get_name())),'value'=>implode(barad_t('، '),$attribute->get_options())];
    $currency = get_woocommerce_currency();
    // IRT is WooCommerce's toman code, not ISO 4217. One toman equals ten IRR.
    $iso_currencies = array_keys(get_woocommerce_currencies());
    if ($p->get_price() !== '' && (float)$p->get_price() > 0 && ($currency === 'IRT' || (strlen($currency) === 3 && in_array($currency,$iso_currencies,true) && !in_array($currency,['IRT','BTC'],true)))) {
        // Match barad_price(), which displays this active WooCommerce amount.
        $price = (float)$p->get_price();
        $schema['offers'] = ['@type'=>'Offer','url'=>$url,'price'=>wc_format_decimal($currency === 'IRT' ? $price*10 : $price, wc_get_price_decimals()),'priceCurrency'=>$currency === 'IRT' ? 'IRR' : $currency,'availability'=>'https://schema.org/'.($p->is_on_backorder(1) ? 'BackOrder' : ($p->is_in_stock() ? 'InStock' : 'OutOfStock')),'seller'=>['@id'=>trailingslashit(get_option('home')).'#organization']];
    }
    return $schema;
}
add_action('wp_head', function() {
    if (!barad_seo_managed() || barad_seo_external()) return;
    $meta = barad_seo_meta();
    echo '<meta name="description" content="'.esc_attr($meta['description']).'">' . "\n";
    if (!is_singular()) echo '<link rel="canonical" href="'.esc_url($meta['url']).'">' . "\n";
    $image = is_singular('product') ? wp_get_attachment_image_url(wc_get_product(get_queried_object_id())->get_image_id(),'full') : wp_get_attachment_image_url(get_option('barad_logo_id'),'full');
    foreach (['og:title'=>$meta['title'],'og:description'=>$meta['description'],'og:url'=>$meta['url'],'og:type'=>'website','og:site_name'=>barad_t(get_bloginfo('name')),'og:locale'=>barad_language()==='en'?'en_US':'fa_IR'] as $key=>$value) echo '<meta property="'.esc_attr($key).'" content="'.esc_attr($value).'">' . "\n";
    if ($image) echo '<meta property="og:image" content="'.esc_url($image).'">' . "\n";
    echo '<meta name="twitter:card" content="summary">' . "\n";
    $root = trailingslashit(get_option('home'));
    $organization = ['@type'=>'Organization','@id'=>$root.'#organization','name'=>barad_t(get_bloginfo('name')),'alternateName'=>barad_t('باراد'),'url'=>$root,'description'=>barad_t('ایده‌آفرینان باراد؛ تأمین سیم، کابل و تجهیزات ارتباطی و نمایندگی افشارنژاد خراسان و شهید قندی یزد.'),'telephone'=>barad_phone()];
    $logo = wp_get_attachment_image_url(get_option('barad_logo_id'),'full');
    if ($logo) $organization['logo'] = ['@type'=>'ImageObject','url'=>$logo];
    $page = ['@type'=>is_singular('product') ? 'ItemPage' : (is_tax('product_cat') || barad_is_page(['catalog','afsharnejad']) ? 'CollectionPage' : 'WebPage'),'@id'=>$meta['url'].'#webpage','url'=>$meta['url'],'name'=>$meta['title'],'description'=>$meta['description'],'inLanguage'=>barad_language()==='en'?'en-US':'fa-IR','isPartOf'=>['@id'=>$root.'#website'],'publisher'=>['@id'=>$root.'#organization']];
    $graph = [$organization, ['@type'=>'WebSite','@id'=>$root.'#website','url'=>$root,'name'=>barad_t('باراد'),'alternateName'=>barad_t('ایده‌آفرینان باراد'),'inLanguage'=>barad_language()==='en'?'en-US':'fa-IR','publisher'=>['@id'=>$root.'#organization']], $page];
    if (is_singular('product')) $graph[] = barad_product_schema(wc_get_product(get_queried_object_id()));
    if (is_tax('product_cat') || is_singular('product') || barad_is_page(['afsharnejad','ghandi'])) {
        $list = [];
        foreach (barad_breadcrumb_items() as $i=>$item) $list[] = ['@type'=>'ListItem','position'=>$i+1,'name'=>$item['name'],'item'=>$item['url']];
        $graph[] = ['@type'=>'BreadcrumbList','@id'=>$meta['url'].'#breadcrumb','itemListElement'=>$list];
    }
    echo '<script type="application/ld+json">'.wp_json_encode(['@context'=>'https://schema.org','@graph'=>$graph],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT).'</script>' . "\n";
}, 5);
// These custom templates supply one graph instead of WooCommerce's partial graph.
foreach (['product','website','breadcrumb'] as $type) add_filter('woocommerce_structured_data_'.$type, function($data) {
    return barad_seo_managed() && !barad_seo_external() ? [] : $data;
}, 99);

add_action('template_redirect', function() {
    if (is_tax('product_brand') && barad_source_term(get_queried_object(),'product_brand')->slug==='afshar' && get_page_by_path('afsharnejad')) { wp_safe_redirect(barad_url('afsharnejad'),301); exit; }
    if (is_tax('product_brand') && barad_source_term(get_queried_object(),'product_brand')->slug==='ghandi' && get_page_by_path('ghandi')) { wp_safe_redirect(barad_url('ghandi'),301); exit; }
});
add_filter('template_include', function($template) {
    return is_tax('product_cat') ? __DIR__.'/../templates/category.php' : $template;
}, 99);
add_action('pre_get_posts',function($query) {
    if (!is_admin() && $query->is_main_query() && $query->is_tax('product_cat')) { $query->set('posts_per_page',12); $query->set('orderby','menu_order title'); $query->set('order','ASC'); }
}, 30);
add_shortcode('barad_afshar_hub',function() {
    $html = barad_t('<section class="section w afshar-hub"><div class="section-title"><div><h2>انواع سیم و کابل افشارنژاد خراسان</h2><p>گروه کالا را انتخاب کنید و مشخصات سایزهای مختلف را ببینید.</p></div></div><div class="afshar-groups">');
    foreach (barad_afshar_groups() as $slug=>$description) {
        $term = get_term_by('slug',$slug,'product_cat');
        if($term)$term=get_term(apply_filters('wpml_object_id',$term->term_id,'product_cat',true),'product_cat');
        if (!$term || is_wp_error($term) || !$term->count) continue;
        $html .= '<article class="info-box"><h3><a href="'.esc_url(get_term_link($term)).'">'.esc_html($term->name).'</a></h3><p>'.esc_html($description).'</p><a class="btn" href="'.esc_url(get_term_link($term)).barad_t('">مشاهده ').$term->count.barad_t(' کالا ←</a></article>');
    }
    return $html.'</div></section>';
});

// Core XML sitemaps become available when indexing is enabled on the live site.
add_filter('wp_sitemaps_posts_query_args',function($args,$type) {
    if ($type === 'page') {
        $excluded = array_filter([wc_get_page_id('cart'),wc_get_page_id('checkout'),wc_get_page_id('myaccount'),(get_page_by_path('quote')->ID ?? 0),(get_page_by_path('sample-page')->ID ?? 0),(get_page_by_path('برگه-نمونه')->ID ?? 0),(get_page_by_path('shop')->ID ?? 0)],function($id){return $id>0;});
        // Persian starter content can store either raw or percent-encoded slugs.
        foreach (get_posts(['post_type'=>'page','post_status'=>'publish','numberposts'=>-1]) as $page) if (in_array(rawurldecode($page->post_name),['برگه-نمونه','sample-page'],true)) $excluded[] = $page->ID;
        foreach($excluded as $original)foreach(['fa','en'] as $language){$translated=apply_filters('wpml_object_id',$original,'page',false,$language);if($translated)$excluded[]=$translated;}
        $args['post__not_in'] = array_unique(array_map('absint',array_merge($args['post__not_in'] ?? [],$excluded)));
    }
    return $args;
},10,2);
add_filter('wp_sitemaps_taxonomies_query_args',function($args,$taxonomy) {
    if ($taxonomy === 'product_brand') foreach (['afshar','ghandi'] as $slug) { $term = get_term_by('slug',$slug,$taxonomy); if ($term) {$ids=[$term->term_id];foreach(['fa','en'] as $language){$translated=apply_filters('wpml_object_id',$term->term_id,$taxonomy,false,$language);if($translated)$ids[]=$translated;}$args['exclude'] = array_unique(array_merge((array)($args['exclude'] ?? []),$ids));} }
    return $args;
},10,2);
add_action('add_meta_boxes',function() {
    if (barad_seo_external()) return;
    foreach (['page','product'] as $type) add_meta_box('barad-seo',barad_t('عنوان و توضیح سئو — باراد'),function($post) {
        wp_nonce_field('barad_seo_save','barad_seo_nonce');
        echo barad_t('<p>خالی بگذارید تا عنوان و توضیح متناسب با صفحه یا کالا به‌صورت خودکار ساخته شوند.</p><p><label>عنوان در جست‌وجو<br><input class="widefat" name="barad_seo_title" value="').esc_attr(get_post_meta($post->ID,'_barad_seo_title',true)).barad_t('"></label></p><p><label>توضیح در جست‌وجو<br><textarea class="widefat" rows="3" name="barad_seo_description">').esc_textarea(get_post_meta($post->ID,'_barad_seo_description',true)).'</textarea></label></p>';
    },$type,'normal');
});
add_action('save_post',function($id) {
    if (!isset($_POST['barad_seo_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['barad_seo_nonce'])),'barad_seo_save') || !current_user_can('edit_post',$id) || wp_is_post_revision($id) || wp_is_post_autosave($id)) return;
    foreach (['title','description'] as $field) if (isset($_POST['barad_seo_'.$field]) && is_scalar($_POST['barad_seo_'.$field])) update_post_meta($id,'_barad_seo_'.$field,sanitize_text_field(wp_unslash($_POST['barad_seo_'.$field])));
});
