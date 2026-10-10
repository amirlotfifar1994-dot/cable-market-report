<?php
defined('ABSPATH') || exit;

function barad_catalog_terms($parent = null) {
    $args=['taxonomy'=>'product_cat','hide_empty'=>true,'pad_counts'=>true];
    if($parent!==null)$args['parent']=(int)$parent;
    $terms=get_terms($args);if(is_wp_error($terms))return [];
    $order=['wire'=>0,'flex'=>1,'power'=>2,'telecom'=>3];
    usort($terms,function($a,$b)use($order){$aa=$order[barad_source_term($a,'product_cat')->slug]??99;$bb=$order[barad_source_term($b,'product_cat')->slug]??99;return $aa<=>$bb ?: strcmp($a->name,$b->name);});
    return $terms;
}
function barad_catalog_tokens($q) {
    return array_slice(array_values(array_filter(preg_split('/\s+/u',barad_catalog_search($q)))),0,12);
}
function barad_catalog_matching_terms($q) {
    $tokens=barad_catalog_tokens($q);if(!$tokens)return [];
    return array_values(array_filter(barad_catalog_terms(),function($term)use($tokens){
        $name=preg_replace('/\s+/u','',barad_catalog_search($term->name.' '.$term->slug));
        foreach($tokens as $token)if(mb_stripos($name,$token)===false)return false;
        return true;
    }));
}
function barad_catalog_search_form($q='') {
    ob_start();?><form class="barad-catalog-search" method="get" action="<?php echo esc_url(barad_url('catalog')); ?>"><label for="catalog-q"><?php echo esc_html(barad_t('جست‌وجوی دسته یا کالا')); ?></label><div><input id="catalog-q" type="search" name="q" maxlength="160" value="<?php echo esc_attr($q); ?>" placeholder="<?php echo esc_attr(barad_t('نام دسته، کالا، کد یا سایز؛ مثلاً کابل کولری یا ۴×۱۶')); ?>"><button class="btn primary"><?php echo esc_html(barad_t('جست‌وجو')); ?></button></div><p><?php echo esc_html(barad_t('در همهٔ دسته‌ها و کالاها جست‌وجو کنید.')); ?></p></form><?php return ob_get_clean();
}
function barad_catalog_view_controls() {
    return '<div class="barad-view-controls" role="group" aria-label="'.esc_attr(barad_t('نحوهٔ نمایش کالاها')).'"><button type="button" data-barad-view="grid" aria-pressed="true" aria-label="'.esc_attr(barad_t('نمایش شبکه‌ای')).'"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></button><button type="button" data-barad-view="list" aria-pressed="false" aria-label="'.esc_attr(barad_t('نمایش فهرستی')).'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h13M8 12h13M8 19h13"/><circle cx="3" cy="5" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="19" r="1"/></svg></button></div>';
}
function barad_catalog_visual() {
    return '<figure class="barad-collection-visual"><img src="'.esc_url(barad_asset('images/copper-hero.webp')).'" alt="'.esc_attr(barad_t('مقطع کابل چندرشته‌ای مسی با شیلد بافته‌شده و روکش مشکی')).'" width="960" height="640" loading="eager"></figure>';
}
function barad_catalog_sibling_links($term) {
    if(!$term->parent)return '';
    $siblings=barad_catalog_terms($term->parent);if(count($siblings)<2)return '';
    $html='<nav class="barad-category-pills" aria-label="'.esc_attr(barad_t('زیردسته‌های این گروه')).'">';
    foreach($siblings as $sibling){$url=get_term_link($sibling);if(is_wp_error($url))continue;$html.='<a href="'.esc_url($url).'" '.($sibling->term_id===$term->term_id?'aria-current="page"':'').'>'.esc_html($sibling->name).'<span>'.esc_html(number_format_i18n($sibling->count)).'</span></a>';}
    return $html.'</nav>';
}
function barad_catalog_category_icon($term) {
    $source=barad_source_term($term,'product_cat');$slug=$source->slug;
    if($source->parent){$parent=get_term($source->parent,'product_cat');if($parent&&!is_wp_error($parent))$slug=$parent->slug;}
    $paths=[
        'wire'=>'<path d="M9 43V24a9 9 0 0 1 18 0v9a5 5 0 0 0 10 0V10M14 43V24a4 4 0 0 1 8 0v9a10 10 0 0 0 20 0V10"/><path d="M35 10h9M7 43h9"/>',
        'flex'=>'<path d="M6 41c13 0 7-29 20-29s7 29 20 29M6 35c9 0 7-29 20-29s11 29 20 29"/><circle cx="6" cy="38" r="4"/><circle cx="46" cy="38" r="4"/>',
        'power'=>'<path d="M21 5v10M33 5v10M17 15h20v9a10 10 0 0 1-20 0v-9ZM27 34v6a7 7 0 0 1-7 7H8"/><path d="m28 18-5 7h8l-5 6"/>',
        'telecom'=>'<circle cx="26" cy="29" r="4"/><circle cx="26" cy="29" r="11"/><circle cx="26" cy="29" r="18"/><path d="M6 47h40M11 14l-5-7M41 14l5-7M26 11V3"/>',
    ];
    return '<svg viewBox="0 0 52 52" fill="none">'.($paths[$slug]??'<rect x="7" y="7" width="15" height="15" rx="4"/><rect x="30" y="7" width="15" height="15" rx="4"/><rect x="7" y="30" width="15" height="15" rx="4"/><rect x="30" y="30" width="15" height="15" rx="4"/>').'</svg>';
}
function barad_catalog_category_cards($terms) {
    ob_start();?><div class="barad-category-grid"><?php foreach($terms as $term){$url=get_term_link($term);if(is_wp_error($url))continue;$children=barad_catalog_terms($term->term_id);?><a class="barad-category-card" data-term-id="<?php echo esc_attr($term->term_id); ?>" href="<?php echo esc_url($url); ?>"><span class="barad-category-icon" aria-hidden="true"><?php echo barad_catalog_category_icon($term); ?></span><h3><?php echo esc_html($term->name); ?></h3><p><?php echo esc_html(wp_trim_words(wp_strip_all_tags($term->description),25,'…')); ?></p><span class="barad-category-meta"><?php echo esc_html(number_format_i18n($term->count)); ?> <?php echo esc_html(barad_t('کالا')); ?><?php if($children)echo ' · '.esc_html(number_format_i18n(count($children))).' '.esc_html(barad_t('زیردسته')); ?></span><b><?php echo esc_html(barad_t($children?'مشاهدهٔ زیردسته‌ها ←':'مشاهدهٔ کالاها ←')); ?></b></a><?php } ?></div><?php return ob_get_clean();
}
function barad_catalog_render() {
    $brand=sanitize_title(barad_value($_GET,'brand'));$group=sanitize_title(barad_value($_GET,'group'));
    $q=mb_substr(barad_catalog_search(sanitize_text_field(barad_value($_GET,'q'))),0,160);
    $searching=$q!==''||$brand!==''||$group!=='';
    ob_start();?><section class="subhero w barad-catalog-intro"><div class="barad-collection-header"><div class="barad-collection-copy"><span class="barad-collection-kicker"><?php echo esc_html(barad_t('کاتالوگ باراد')); ?></span><h1><?php echo esc_html(barad_t('کالاهای باراد')); ?></h1><p><?php echo esc_html(barad_t('از دستهٔ کلی شروع کنید، زیردسته را انتخاب کنید و سپس مشخصات و سایز کالاها را ببینید.')); ?></p><a class="barad-collection-jump" href="#catalog-content"><?php echo esc_html(barad_t('شروع انتخاب کالا')); ?><span aria-hidden="true">↓</span></a></div><?php echo barad_catalog_visual(); ?></div><div class="barad-collection-tools"><?php echo barad_catalog_search_form($q); ?></div></section><?php
    if(!$searching){?><section class="section w barad-catalog-categories" id="catalog-content"><div class="section-title"><div><h2><?php echo esc_html(barad_t('دسته‌بندی کالاها')); ?></h2><p><?php echo esc_html(barad_t('دستهٔ مورد نیازتان را انتخاب کنید.')); ?></p></div></div><?php echo barad_catalog_category_cards(barad_catalog_terms(0)); ?></section><?php return ob_get_clean();}
    $paged=max(1,absint(barad_value($_GET,'catalog_page',1)));
    $tax=[['taxonomy'=>'product_visibility','field'=>'slug','terms'=>['exclude-from-catalog','exclude-from-search'],'operator'=>'NOT IN']];
    if($brand)$tax[]=['taxonomy'=>'product_brand','field'=>'slug','terms'=>$brand];if($group)$tax[]=['taxonomy'=>'product_cat','field'=>'slug','terms'=>$group];
    $query=new WP_Query(['post_type'=>'product','post_status'=>'publish','posts_per_page'=>12,'paged'=>$paged,'barad_sku_search'=>$q,'tax_query'=>$tax,'orderby'=>'menu_order title','order'=>'ASC']);
    $matches=$q!==''?barad_catalog_matching_terms($q):[];
    ?><section class="section w barad-catalog-results" id="catalog-content"><div class="catalog-toolbar"><span><?php echo esc_html(barad_t('نتایج جست‌وجو')); ?><?php if($q!=='')echo ': «'.esc_html($q).'»'; ?></span><a href="<?php echo esc_url(barad_url('catalog')); ?>"><?php echo esc_html(barad_t('بازگشت به دسته‌بندی‌ها ←')); ?></a></div><?php
    if($matches){?><div class="section-title"><h2><?php echo esc_html(barad_t('دسته‌ها و زیردسته‌های مرتبط')); ?></h2></div><?php echo barad_catalog_category_cards($matches);}
    ?><div class="section-title barad-result-heading"><h2><?php echo esc_html(barad_t('کالاهای مرتبط')); ?> <small>(<?php echo esc_html(number_format_i18n($query->found_posts)); ?>)</small></h2><?php if($query->have_posts()){?><?php echo barad_catalog_view_controls(); ?><?php } ?></div><div class="products" id="barad-catalog"><?php foreach($query->posts as $post)echo barad_card(wc_get_product($post->ID));if(!$query->have_posts()){?><div class="empty"><p><?php echo esc_html(barad_t('کالایی مطابق جست‌وجوی شما پیدا نشد. نام، کد یا سایز دیگری را امتحان کنید.')); ?></p><a class="btn" href="<?php echo esc_url(barad_url('catalog')); ?>"><?php echo esc_html(barad_t('مشاهدهٔ دسته‌بندی‌ها')); ?></a></div><?php } ?></div><nav class="barad-pagination" aria-label="<?php echo esc_attr(barad_t('صفحه‌های کالاها')); ?>"><?php echo wp_kses_post(paginate_links(['base'=>add_query_arg('catalog_page','%#%'),'format'=>'','current'=>$paged,'total'=>$query->max_num_pages])?:''); ?></nav></section><?php wp_reset_postdata();return ob_get_clean();
}
add_shortcode('barad_catalog','barad_catalog_render');
add_action('template_redirect',function(){
    // The wire subcategory moved out of the flexible-cable parent; keep old links working.
    $path=rawurldecode((string)wp_parse_url($_SERVER['REQUEST_URI']??'',PHP_URL_PATH));
    foreach([['wire','flex','afshar-wire'],['wire-en','flex-en','afshar-wire-en']] as [$parent,$old_parent,$slug]){
        $term=get_term_by('slug',$slug,'product_cat');if(!$term)continue;
        $target=get_term_link($term);if(is_wp_error($target))continue;
        $old=str_replace('/'.$parent.'/'.$slug.'/','/'.$old_parent.'/'.$slug.'/',$target);
        if($old!==$target&&untrailingslashit($path)===untrailingslashit((string)wp_parse_url($old,PHP_URL_PATH))){wp_safe_redirect($target,301);exit;}
    }
    if(barad_is_page('catalog')&&!barad_seo_filtered()&&absint(barad_value($_GET,'catalog_page',1))>1){wp_safe_redirect(barad_url('catalog'),301);exit;}
    if(is_tax('product_cat')&&get_query_var('paged')>1&&barad_catalog_terms(get_queried_object_id())){wp_safe_redirect(get_term_link(get_queried_object()),301);exit;}
},8);

// A complete size token must match the product's actual size, not another size
// or a size mentioned in descriptive prose. Other tokens match names, SKU or categories.
add_filter('posts_where',function($where,$query){
    $q=$query->get('barad_sku_search');if(!is_string($q)||$q==='')return $where;
    global $wpdb;
    foreach(barad_catalog_tokens($q) as $token){
        if(preg_match('/^\d+(?:\.\d+)?x\d+(?:\.\d+)?(?:x\d+(?:\.\d+)?)?(?:\+\d+(?:\.\d+)?)?$/',$token)){
            $where.=$wpdb->prepare(" AND EXISTS (SELECT 1 FROM {$wpdb->postmeta} sz WHERE sz.post_id={$wpdb->posts}.ID AND sz.meta_key='_barad_size' AND REPLACE(REPLACE(sz.meta_value,'×','x'),' ','')=%s)",$token);continue;
        }
        $like='%'.$wpdb->esc_like($token).'%';
        $title="REPLACE(REPLACE(REPLACE({$wpdb->posts}.post_title,'ي','ی'),'ك','ک'),'‌','')";
        $clause=$wpdb->prepare("($title LIKE %s OR {$wpdb->posts}.post_excerpt LIKE %s OR EXISTS (SELECT 1 FROM {$wpdb->postmeta} sku WHERE sku.post_id={$wpdb->posts}.ID AND sku.meta_key='_sku' AND sku.meta_value LIKE %s)",$like,$like,$like);
        $ids=[];foreach(barad_catalog_matching_terms($token) as $term){$ids[]=$term->term_id;$ids=array_merge($ids,get_term_children($term->term_id,'product_cat'));}
        $ids=array_unique(array_map('absint',$ids));if($ids)$clause.=" OR EXISTS (SELECT 1 FROM {$wpdb->term_relationships} tr INNER JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id=tt.term_taxonomy_id WHERE tr.object_id={$wpdb->posts}.ID AND tt.taxonomy='product_cat' AND tt.term_id IN (".implode(',',$ids)."))";
        $where.=' AND '.$clause.')';
    }
    return $where;
},10,2);
