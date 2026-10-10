<?php
defined('ABSPATH') || exit;

function barad_pricing_state($p) {
    $from=$p->get_date_on_sale_from('edit');$to=$p->get_date_on_sale_to('edit');
    $state=['regular'=>$p->get_regular_price('edit'),'sale'=>$p->get_sale_price('edit'),'price'=>$p->get_price('edit'),'from'=>$from?$from->getTimestamp():null,'to'=>$to?$to->getTimestamp():null];
    return hash('sha256',wp_json_encode($state));
}
function barad_pricing_item($p) {
    $cats=wp_get_post_terms($p->get_id(),'product_cat');$brands=wp_get_post_terms($p->get_id(),'product_brand');
    return ['id'=>$p->get_id(),'name'=>$p->get_name(),'sku'=>$p->get_sku(),'size'=>$p->get_meta('_barad_size'),'model'=>$p->get_attribute('مدل خانواده'),'regular'=>$p->get_regular_price('edit'),'sale'=>$p->get_sale_price('edit'),'contact'=>$p->get_price('edit')==='','version'=>barad_pricing_state($p),'scheduled'=>(bool)($p->get_date_on_sale_from('edit')||$p->get_date_on_sale_to('edit')),'unit'=>$p->get_attribute('واحد فروش')?:'متر','categories'=>array_map(fn($t)=>['id'=>$t->term_id,'name'=>$t->name],is_wp_error($cats)?[]:$cats),'brands'=>array_map(fn($t)=>['id'=>$t->term_id,'name'=>$t->name],is_wp_error($brands)?[]:$brands),'edit'=>get_edit_post_link($p->get_id(),'raw'),'url'=>$p->get_permalink(),'updated'=>$p->get_meta('_barad_price_updated_at')];
}
function barad_pricing_decimal($raw,$optional=false) {
    if(!is_string($raw))return new WP_Error('price','قیمت را به شکل عدد وارد کنید.');
    $value=trim(str_replace(['٬','٫'],[',','.'],barad_digits($raw)));
    if($value===''&&$optional)return '';
    if(!preg_match('/^(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+)(?:\.[0-9]+)?$/D',$value))return new WP_Error('price','قیمت باید عدد مثبت باشد؛ مانند ۱۲۵٬۰۰۰.');
    $value=str_replace(',','',$value);$parts=explode('.',$value);
    if(strlen(ltrim($parts[0],'0'))>12||isset($parts[1])&&strlen($parts[1])>wc_get_price_decimals())return new WP_Error('price','تعداد رقم یا رقم اعشار قیمت مجاز نیست.');
    $decimal=wc_format_decimal($value,wc_get_price_decimals());
    if((float)$decimal<=0)return new WP_Error('price','قیمت باید بیشتر از صفر باشد؛ برای قیمت نامشخص «تماس برای قیمت» را انتخاب کنید.');
    return $decimal;
}
add_action('admin_menu',function(){
    add_submenu_page('edit.php?post_type=product','قیمت‌گذاری کالاها','قیمت‌گذاری کالاها','edit_products','barad-pricing','barad_pricing_page');
});
add_action('admin_enqueue_scripts',function($hook){
    if($hook!=='product_page_barad-pricing')return;
    wp_enqueue_style('barad-pricing',plugins_url('../pricing.css',__FILE__),[],filemtime(__DIR__.'/../pricing.css'));
    wp_enqueue_script('barad-pricing',plugins_url('../pricing.js',__FILE__),[],filemtime(__DIR__.'/../pricing.js'),true);
    wp_localize_script('barad-pricing','baradPricing',['ajax'=>admin_url('admin-ajax.php'),'nonce'=>wp_create_nonce('barad_pricing'),'decimals'=>wc_get_price_decimals(),'currency'=>get_woocommerce_currency_symbol(),'currencyCode'=>get_woocommerce_currency()]);
});
function barad_pricing_page(){
    if(!current_user_can('edit_products'))wp_die('دسترسی به قیمت‌گذاری ندارید.');
    $pricing_language=barad_language();do_action('wpml_switch_language','fa');
    $products=wc_get_products(['status'=>'publish','type'=>'simple','limit'=>-1,'orderby'=>'menu_order','order'=>'ASC']);$items=[];$cats=[];$brands=[];
    foreach($products as $p){if($p->get_id()!=(int)apply_filters('wpml_object_id',$p->get_id(),'product',true,'fa'))continue;if($p->get_meta('_barad_demo')||!current_user_can('edit_post',$p->get_id()))continue;$item=barad_pricing_item($p);$items[]=$item;foreach($item['categories'] as $t)$cats[$t['id']]=$t['name'];foreach($item['brands'] as $t)$brands[$t['id']]=$t['name'];}
    do_action('wpml_switch_language',$pricing_language);
    ?>
    <div class="wrap barad-pricing" id="barad-pricing">
      <header class="bp-heading"><div><h1>قیمت‌گذاری کالاها</h1><p>قیمت هر کالا را وارد کنید و تغییرات را یک‌جا ذخیره کنید.</p></div><span class="bp-currency">واحد پول: <?php echo esc_html(get_woocommerce_currency_symbol()); ?></span></header>
      <div id="bp-notice" role="status" aria-live="polite" hidden></div>
      <section class="bp-panel bp-filters" aria-label="فیلتر کالاها">
        <label for="bp-search">جست‌وجوی کالا<input id="bp-search" type="search" placeholder="نام، کد یا سایز؛ مثل ۴×۱۶"></label>
        <label for="bp-category">دسته<select id="bp-category"><option value="">همه دسته‌ها</option><?php foreach($cats as $id=>$name)echo '<option value="'.esc_attr($id).'">'.esc_html($name).'</option>'; ?></select></label>
        <label for="bp-brand">برند<select id="bp-brand"><option value="">همه برندها</option><?php foreach($brands as $id=>$name)echo '<option value="'.esc_attr($id).'">'.esc_html($name).'</option>'; ?></select></label>
        <label for="bp-price-filter">وضعیت قیمت<select id="bp-price-filter"><option value="">همه کالاها</option><option value="contact">تماس برای قیمت</option><option value="priced">قیمت‌دار</option><option value="dirty">تغییرات ذخیره‌نشده</option></select></label>
      </section>
      <section class="bp-panel bp-bulk" aria-label="تغییر گروهی قیمت">
        <strong id="bp-selected">۰ کالا انتخاب شده</strong>
        <label class="screen-reader-text" for="bp-operation">عملیات گروهی</label><select id="bp-operation"><option value="set">قیمت پایه یکسان</option><option value="percent">افزایش / کاهش درصدی قیمت پایه</option><option value="contact">تماس برای قیمت</option></select>
        <label class="screen-reader-text" for="bp-bulk-value">مقدار تغییر گروهی</label><input id="bp-bulk-value" type="text" inputmode="decimal" placeholder="قیمت هر واحد">
        <button id="bp-apply" class="button" type="button">اعمال روی انتخاب‌شده‌ها</button>
        <small>اعمال گروهی آمادهٔ ذخیره می‌شود؛ دکمهٔ ذخیره را بزنید.</small>
      </section>
      <div class="bp-list-summary"><span id="bp-count"></span><small>قیمت خالی با انتخاب «تماس برای قیمت» نمایش داده می‌شود.</small></div>
      <div class="bp-table-wrap"><table class="widefat bp-table"><thead><tr><th class="bp-check"><input id="bp-select-all" type="checkbox" aria-label="انتخاب همه کالاهای نمایش‌داده‌شده"></th><th>کالا</th><th>قیمت هر واحد (<?php echo esc_html(get_woocommerce_currency_symbol()); ?>)</th><th>وضعیت</th></tr></thead><tbody id="bp-rows"></tbody></table></div>
      <p id="bp-empty" hidden>کالایی مطابق این فیلترها پیدا نشد.</p>
      <div class="bp-savebar"><span id="bp-dirty" aria-live="polite">تغییری ایجاد نشده</span><div><button id="bp-reset" class="button" type="button" disabled>بازگرداندن تغییرات</button><button id="bp-save" class="button button-primary" type="button" disabled>ذخیره تغییرات</button></div></div>
      <p class="description">قیمت‌ها بعد از ذخیره در سایت اعمال می‌شوند. قیمت ویژه اختیاری است؛ زمان‌بندی تخفیف از «ویرایش محصول» مدیریت می‌شود.</p>
      <noscript><div class="notice notice-warning"><p>برای استفاده از این صفحه جاوااسکریپت مرورگر را فعال کنید. همچنین می‌توانید قیمت را از ویرایش محصول تغییر دهید.</p></div></noscript>
      <script type="application/json" id="bp-data"><?php echo wp_json_encode($items,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_UNESCAPED_UNICODE); ?></script>
    </div>
    <?php
}
add_action('wp_ajax_barad_save_prices',function(){
    if(!current_user_can('edit_products'))wp_send_json_error(['message'=>'دسترسی به قیمت‌گذاری ندارید.'],403);
    if(!check_ajax_referer('barad_pricing','nonce',false))wp_send_json_error(['message'=>'نشست صفحه منقضی شده؛ صفحه را تازه کنید.'],403);
    $raw=barad_value($_POST,'changes');
    if(strlen($raw)>200000)wp_send_json_error(['message'=>'درخواست بیش از حد بزرگ است.'],400);
    $changes=json_decode($raw,true);
    if(!is_array($changes)||!$changes||count($changes)>300)wp_send_json_error(['message'=>'فهرست تغییرات معتبر نیست.'],400);
    $prepared=[];$errors=[];$seen=[];
    foreach($changes as $row){
        if(!is_array($row)||!isset($row['id'])||!is_int($row['id'])||$row['id']<1){$errors[]=['id'=>0,'message'=>'شناسه کالا معتبر نیست.'];continue;}
        $id=$row['id'];if($id!=(int)apply_filters('wpml_object_id',$id,'product',true,'fa')){$errors[]=['id'=>$id,'message'=>'قیمت را از نسخه فارسی کالا تغییر دهید؛ قیمت انگلیسی همگام است.'];continue;}$p=wc_get_product($id);
        if(isset($seen[$id])){$errors[]=['id'=>$id,'message'=>'کالا در درخواست تکرار شده است.'];continue;}$seen[$id]=true;
        if(!$p||!$p->is_type('simple')||$p->get_status()!=='publish'||$p->get_meta('_barad_demo')||!current_user_can('edit_post',$id)){$errors[]=['id'=>$id,'message'=>'اجازه تغییر این کالا را ندارید.'];continue;}
        if(!is_string($row['version']??null)||!hash_equals(barad_pricing_state($p),$row['version'])){$errors[]=['id'=>$id,'message'=>'قیمت این کالا در جای دیگری تغییر کرده؛ صفحه را تازه کنید.'];continue;}
        if(!is_bool($row['contact']??null)){$errors[]=['id'=>$id,'message'=>'وضعیت قیمت معتبر نیست.'];continue;}
        $regular=$row['contact']?'':barad_pricing_decimal($row['regular']??null);
        $sale=$row['contact']?'':barad_pricing_decimal($row['sale']??null,true);
        if(is_wp_error($regular)||is_wp_error($sale)){$errors[]=['id'=>$id,'message'=>is_wp_error($regular)?$regular->get_error_message():$sale->get_error_message()];continue;}
        if($sale!==''&&(float)$sale>=(float)$regular){$errors[]=['id'=>$id,'message'=>'قیمت ویژه باید از قیمت پایه کمتر باشد.'];continue;}
        // Scheduled discounts must be managed in the native product editor.
        if(($p->get_date_on_sale_from('edit')||$p->get_date_on_sale_to('edit'))&&($row['contact']||$sale!==wc_format_decimal($p->get_sale_price('edit'),wc_get_price_decimals()))){$errors[]=['id'=>$id,'message'=>'این کالا تخفیف زمان‌بندی‌شده دارد؛ برای تغییر وضعیت یا تخفیف از ویرایش محصول استفاده کنید.'];continue;}
        $prepared[]=['product'=>$p,'regular'=>$regular,'sale'=>$sale];
    }
    if($errors)wp_send_json_error(['message'=>'تغییرات ذخیره نشد؛ خطاهای مشخص‌شده را اصلاح کنید.','errors'=>$errors],409);
    $saved=[];
    try{
        foreach($prepared as $change){
            $p=$change['product'];$p->set_regular_price($change['regular']);$p->set_sale_price($change['sale']);
            $p->set_price($p->is_on_sale('edit')?$change['sale']:$change['regular']);
            $p->update_meta_data('_barad_price_updated_at',wp_date('Y/m/d H:i'));$p->update_meta_data('_barad_price_updated_by',get_current_user_id());
            $p->save();wc_delete_product_transients($p->get_id());$saved[]=barad_pricing_item($p);
        }
    }catch(Throwable $e){wp_send_json_error(['message'=>'ذخیره کامل نشد؛ ردیف‌های موفق مشخص شده‌اند. دوباره تلاش کنید.','items'=>$saved],500);}
    wp_send_json_success(['message'=>count($saved).' کالا ذخیره شد.','items'=>$saved]);
});
