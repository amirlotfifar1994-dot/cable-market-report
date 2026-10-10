<?php
/** Native Yoast metadata remains editable; integrate Barad's custom storefront. */
defined('ABSPATH') || exit;
function barad_yoast_utility_ids() {
    $ids=array_filter([wc_get_page_id('cart'),wc_get_page_id('checkout'),wc_get_page_id('myaccount')],fn($id)=>$id>0);
    foreach(['quote','sample-page','shop','برگه-نمونه'] as $slug){$page=get_page_by_path($slug);if($page)$ids[]=$page->ID;}
    foreach(get_posts(['post_type'=>'page','post_status'=>'publish','numberposts'=>-1]) as $page)if(in_array(rawurldecode($page->post_name),['برگه-نمونه','sample-page'],true))$ids[]=$page->ID;
    foreach(get_posts(['post_type'=>'post','post_status'=>'publish','numberposts'=>-1]) as $post)if(in_array(rawurldecode($post->post_name),['hello-world','سلام-دنیا'],true))$ids[]=$post->ID;
    foreach($ids as $id)foreach(['fa','en'] as $lang){$translated=apply_filters('wpml_object_id',$id,'page',false,$lang);if($translated)$ids[]=$translated;}
    return array_unique(array_map('absint',$ids));
}
function barad_yoast_field($field) {
    if(is_tax('product_cat'))return WPSEO_Taxonomy_Meta::get_term_meta(get_queried_object(),'product_cat',$field);
    return get_post_meta(get_queried_object_id(),'_yoast_wpseo_'.$field,true);
}
foreach(['title'=>'title','metadesc'=>'description'] as $filter=>$field)add_filter('wpseo_'.$filter,function($value)use($filter,$field){
    if(!barad_seo_managed())return $value;
    if(!barad_yoast_field($filter))return barad_seo_meta()[$field];
    // Native per-page fields hold the base title; paginated archives stay distinct.
    if($filter==='title' && is_tax('product_cat') && get_query_var('paged')>1 && strpos($value,barad_t(' — صفحه '))===false)$value.=barad_t(' — صفحه ').(int)get_query_var('paged');
    return $value;
},30);
add_filter('wpseo_canonical',function($url){
    if(!barad_seo_managed())return $url;
    // Keep manually entered native Yoast canonical values, except filtered catalog URLs.
    return barad_seo_filtered() || !barad_yoast_field('canonical') ? barad_seo_url() : $url;
},30);
add_filter('wpseo_opengraph_url',fn($url)=>barad_seo_managed()?apply_filters('wpseo_canonical',$url):$url,30);
add_filter('wpseo_robots_array',function($robots){
    if(barad_seo_filtered() || (is_page() && in_array(get_queried_object_id(),barad_yoast_utility_ids(),true))){$robots['index']='noindex';$robots['follow']='follow';}
    return $robots;
},30);
add_filter('wpseo_exclude_from_sitemap_by_post_ids',fn($ids)=>array_unique(array_merge($ids,barad_yoast_utility_ids())));
// Yoast's index counts do not apply its per-entry exclusions. Keep them aligned
// so a sitemap for the excluded WordPress starter post is not advertised.
foreach(['wpseo_typecount_where','wpseo_posts_where'] as $filter)add_filter($filter,function($where,$type){
    if(!in_array($type,['page','post'],true))return $where;
    global $wpdb;$ids=barad_yoast_utility_ids();
    return (string)$where.($ids?' AND '.$wpdb->posts.'.ID NOT IN ('.implode(',',array_map('absint',$ids)).')':'');
},20,2);
add_filter('wpseo_sitemap_exclude_taxonomy',fn($exclude,$taxonomy)=>in_array($taxonomy,['product_brand','product_tag','category','post_tag'],true)?true:$exclude,20,2);
add_filter('wpseo_sitemap_exclude_post_type',fn($exclude,$type)=>in_array($type,['barad_request','elementor_library','cms_block','woodmart_layout','woodmart_slide'],true)?true:$exclude,20,2);
add_filter('wpseo_sitemap_post_type_archive_link',fn($url,$type)=>$type==='product'?false:$url,20,2);
add_action('template_redirect',function(){if(is_post_type_archive('product') || barad_is_page('shop')){wp_safe_redirect(barad_url('catalog'),301);exit;}},9);
add_filter('wpseo_sitemap_entry',function($url,$type,$object){
    if($type==='term' && $object->taxonomy==='product_cat'){
        if(!$object->count)return false;
        if(!defined('ICL_SITEPRESS_VERSION') && str_ends_with($object->slug,'-en'))return false;
    }
    return $url;
},20,3);
// The custom templates bypass WooCommerce's default product and breadcrumb actions.
// Extend Yoast's connected graph rather than printing a second schema block.
add_filter('wpseo_schema_graph',function($graph,$context){
    if(!barad_seo_managed())return $graph;
    $organization_id='';$page_id='';$breadcrumb_id='';
    foreach($graph as &$node){
        $types=(array)($node['@type']??[]);
        if(in_array('Organization',$types,true)){
            $organization_id=$node['@id'];
            if(!defined('WPSEO_LOCAL_VERSION')){
                $node['telephone']=barad_phone();
                $node['address']=['@type'=>'PostalAddress','streetAddress'=>barad_t(get_option('barad_address')),'addressLocality'=>barad_t('تهران'),'addressCountry'=>'IR'];
            }
        }
        if(in_array('WebSite',$types,true))$node['potentialAction']=['@type'=>'SearchAction','target'=>['@type'=>'EntryPoint','urlTemplate'=>barad_url('catalog').'?q={search_term_string}'],'query-input'=>'required name=search_term_string'];
        if(in_array('WebPage',$types,true) || in_array('CollectionPage',$types,true) || in_array('ItemPage',$types,true)){
            $page_id=$node['@id'];$breadcrumb_id=$node['breadcrumb']['@id']??$page_id.'#breadcrumb';
            if(is_singular('product')){$node['@type']='ItemPage';$node['mainEntity']=['@id'=>barad_seo_url().'#product'];}
            elseif(is_tax('product_cat') || barad_is_page('catalog'))$node['@type']='CollectionPage';
            if(is_front_page())unset($node['breadcrumb']);
        }
    }unset($node);
    $graph=array_values(array_filter($graph,fn($node)=>!array_intersect((array)($node['@type']??[]),['Product','BreadcrumbList'])));
    if(!is_front_page()){
        $items=[];foreach(barad_breadcrumb_items() as $i=>$item)$items[]=['@type'=>'ListItem','position'=>$i+1,'name'=>$item['name'],'item'=>$item['url']];
        $graph[]=['@type'=>'BreadcrumbList','@id'=>$breadcrumb_id,'itemListElement'=>$items];
        foreach($graph as &$node)if(($node['@id']??'')===$page_id)$node['breadcrumb']=['@id'=>$breadcrumb_id];unset($node);
    }
    if(is_singular('product')){
        $product=barad_product_schema(wc_get_product(get_queried_object_id()));
        $product['mainEntityOfPage']=['@id'=>$page_id];
        if(isset($product['offers']) && $organization_id)$product['offers']['seller']=['@id'=>$organization_id];
        $graph[]=$product;
    }
    return $graph;
},30,2);
foreach(['product','website','breadcrumb'] as $type)add_filter('woocommerce_structured_data_'.$type,fn($data)=>defined('WPSEO_VERSION') && barad_seo_managed()?[]:$data,100);
