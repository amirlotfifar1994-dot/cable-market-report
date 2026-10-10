<?php
defined('ABSPATH') || exit;

function barad_value($source, $key, $fallback = '') {
    $value = $source[$key] ?? $fallback;
    return is_scalar($value) ? (string) wp_unslash($value) : $fallback;
}
function barad_digits($value) {
    return strtr($value, array_combine(preg_split('//u', '۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩', -1, PREG_SPLIT_NO_EMPTY), str_split('01234567890123456789')));
}
function barad_can_quote($p) {
    return $p && $p->get_status() === 'publish' && $p->is_type('simple') && $p->get_price() !== '' && $p->is_in_stock();
}
function barad_form_key($scope) {
    $key = bin2hex(random_bytes(24));
    set_transient('barad_form_' . hash('sha256', $key), ['scope' => $scope], HOUR_IN_SECONDS);
    return $key;
}
function barad_doc_url($token) {
    return add_query_arg('document', $token, barad_url('quote'));
}
function barad_document_price($doc, $field) {
    return wc_price($doc[$field], ['currency' => $doc['currency'] ?? get_woocommerce_currency(), 'decimals' => $doc['decimals'] ?? wc_get_price_decimals()]);
}

// Process before any page markup so a refresh never repeats the POST.
add_action('template_redirect', function () {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;
    $scope = barad_is_page('quote') && isset($_POST['barad_quote_submit']) ? 'quote' : (barad_is_page('contact') && isset($_POST['barad_contact_submit']) ? 'contact' : '');
    if (!$scope) return;
    $error = '';
    $key = barad_value($_POST, 'submission_key');
    $state_key = 'barad_form_' . hash('sha256', $key);
    $state = preg_match('/^[a-f0-9]{48}$/D', $key) ? get_transient($state_key) : false;
    if (!wp_verify_nonce(sanitize_text_field(barad_value($_POST, '_wpnonce')), 'barad_' . $scope)) {
        $error = barad_t('نشست منقضی شده؛ صفحه را تازه کنید.');
    } elseif (!$state || $state['scope'] !== $scope) {
        $error = barad_t('اعتبار فرم تمام شده؛ صفحه را تازه کنید.');
    } elseif (!empty($state['redirect'])) {
        wp_safe_redirect($state['redirect'], 303); exit;
    } elseif (!empty($_POST['website']) || !barad_rate_limit()) {
        $error = barad_t('درخواست‌های زیادی ثبت شده؛ چند دقیقه دیگر تلاش کنید.');
    } else {
        $name = sanitize_text_field(barad_value($_POST, 'customer_name'));
        $phone = sanitize_text_field(barad_digits(barad_value($_POST, 'customer_phone')));
        if (!$name || mb_strlen($name) > 100 || !preg_match('/^[0-9+()\s-]{7,20}$/D', $phone)) {
            $error = barad_t('نام و شماره تماس معتبر وارد کنید.');
        } elseif ($scope === 'quote') {
            $p = wc_get_product(barad_current_product_id(absint(barad_value($_POST, 'product_id'))));
            $qty = filter_var(barad_digits(barad_value($_POST, 'quantity')), FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 100000]]);
            $email = sanitize_email(barad_value($_POST, 'customer_email'));
            if (!barad_can_quote($p)) $error = barad_t('قیمت معتبر یا وضعیت تأمین برای این کالا ثبت نشده است.');
            elseif ($qty === false || !is_email($email)) $error = barad_t('ایمیل و مقدار صحیح بین ۱ تا ۱۰۰٬۰۰۰ متر وارد کنید.');
            else {
                $doc = ['date' => wp_date('Y/m/d H:i'), 'name' => $name, 'phone' => $phone, 'email' => $email, 'product' => $p->get_name(), 'sku' => $p->get_sku(), 'quantity' => $qty, 'price' => (float)$p->get_price(), 'total' => round((float)$p->get_price() * $qty, wc_get_price_decimals()), 'demo' => (bool)$p->get_meta('_barad_demo'), 'currency' => get_woocommerce_currency(), 'decimals' => wc_get_price_decimals(), 'issuer' => ['name' => barad_t('ایده‌آفرینان باراد'), 'phone' => barad_phone(), 'address' => barad_t(get_option('barad_address'))]];
                $request = wp_insert_post(['post_type' => 'barad_request', 'post_status' => 'private', 'post_title' => barad_t('پیش‌فاکتور · ') . $name], true);
                if (is_wp_error($request) || !$request) $error = barad_t('ثبت سند انجام نشد؛ دوباره تلاش کنید.');
                else {
                    $doc['number'] = 'BR-' . wp_date('Ymd') . '-' . $request;
                    update_post_meta($request, '_barad_document', $doc);
                    wp_update_post(['ID' => $request, 'post_content' => wp_slash(wp_json_encode($doc, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))]);
                    $token = bin2hex(random_bytes(32));
                    set_transient('barad_doc_' . hash('sha256', $token), $doc, DAY_IN_SECONDS);
                    $redirect = barad_doc_url($token);
                }
            }
        } else {
            $subject = sanitize_textarea_field(barad_value($_POST, 'subject'));
            if (mb_strlen($subject) > 1000) $error = barad_t('موضوع درخواست باید کمتر از ۱۰۰۰ نویسه باشد.');
            else {
                $result = wp_insert_post(['post_type' => 'barad_request', 'post_status' => 'private', 'post_title' => barad_t('تماس · ') . $name, 'post_content' => $phone . "\n" . $subject], true);
                if (is_wp_error($result) || !$result) $error = barad_t('ثبت انجام نشد؛ دوباره تلاش کنید.');
                else $redirect = add_query_arg('sent', $key, barad_url('contact'));
            }
        }
    }
    if ($error) $GLOBALS['barad_form_error'] = $error;
    else {
        $state['redirect'] = $redirect;
        set_transient($state_key, $state, DAY_IN_SECONDS);
        wp_safe_redirect($redirect, 303); exit;
    }
}, 5);

function barad_quote_document($doc) {
    ob_start(); ?>
    <article class="w info-box barad-document">
        <span class="eyebrow">BARAD / QUOTATION</span>
        <h1><?php echo $doc['demo'] ? barad_t('پیش‌فاکتور آزمایشی · برای خرید معتبر نیست') : barad_t('پیش‌فاکتور'); ?></h1>
        <p><?php echo esc_html(barad_t('شماره: ')); ?><bdi><?php echo esc_html($doc['number']); ?></bdi> · <?php echo esc_html(barad_t('تاریخ:')); ?> <?php echo esc_html($doc['date']); ?></p>
        <p><?php echo esc_html(barad_t('خریدار:')); ?> <?php echo esc_html($doc['name']); ?> · <?php echo esc_html(barad_t('تماس:')); ?> <bdi><?php echo esc_html($doc['phone']); ?></bdi></p>
        <p><?php echo esc_html(barad_t('صادرکننده:')); ?> <?php echo esc_html($doc['issuer']['name'] ?? barad_t('ایده‌آفرینان باراد')); ?> · <bdi><?php echo esc_html($doc['issuer']['phone'] ?? barad_phone()); ?></bdi></p>
        <div class="barad-table-scroll"><table class="specs"><thead><tr><th><?php echo esc_html(barad_t('مدل')); ?></th><th><?php echo esc_html(barad_t('مقدار')); ?></th><th><?php echo esc_html(barad_t('قیمت واحد')); ?></th><th><?php echo esc_html(barad_t('جمع')); ?></th></tr></thead><tbody><tr><td><?php echo esc_html($doc['product']); ?><br><bdi><?php echo esc_html($doc['sku']); ?></bdi></td><td><?php echo esc_html(number_format_i18n($doc['quantity'])); ?> <?php echo esc_html(barad_t('متر')); ?></td><td><?php echo barad_document_price($doc, 'price'); ?></td><td><?php echo barad_document_price($doc, 'total'); ?></td></tr></tbody></table></div>
        <div class="quote-note"><?php echo esc_html(barad_t('مالیات، حمل، شرایط پرداخت و اعتبار قیمت هنوز تعیین نشده‌اند. صدور سند، موجودی را رزرو نمی‌کند؛ تأیید فروش لازم است.')); ?><?php if ($doc['demo']) echo barad_t(' قیمت و محصول این سند صرفاً نمونه آزمایشی‌اند.'); ?></div>
        <div class="actions"><button type="button" class="btn primary" id="barad-print"><?php echo esc_html(barad_t('چاپ / ذخیره PDF')); ?></button><a class="btn" href="<?php echo esc_url(barad_url('catalog')); ?>"><?php echo esc_html(barad_t('بازگشت به کالاها')); ?></a></div>
        <p class="barad-document-status"><?php echo esc_html(barad_t('درخواست در پنل فروش ثبت شد. ارسال ایمیل و پیام‌رسان هنوز متصل نشده است.')); ?></p>
        <?php if (isset($_GET['document'])) { ?><p class="barad-document-link"><a rel="nofollow" href="<?php echo esc_url(barad_doc_url(sanitize_text_field(barad_value($_GET, 'document')))); ?>"><?php echo esc_html(barad_t('باز کردن مجدد سند (اعتبار دسترسی: ۲۴ ساعت)')); ?></a></p><?php } ?>
    </article>
    <?php return ob_get_clean();
}

add_shortcode('barad_quote', function () {
    if (isset($_GET['document'])) {
        $token = sanitize_text_field(barad_value($_GET, 'document'));
        $doc = preg_match('/^[a-f0-9]{64}$/D', $token) ? get_transient('barad_doc_' . hash('sha256', $token)) : false;
        return $doc ? barad_quote_document($doc) : barad_t('<div class="w info-box"><h1>سند در دسترس نیست</h1><p>لینک نامعتبر است یا اعتبار دسترسی به پایان رسیده است.</p></div>');
    }
    $id = absint(barad_value($_POST, 'product_id', barad_value($_GET, 'product_id')));
    $p = $id ? wc_get_product(barad_current_product_id($id)) : false;
    $qty = filter_var(barad_digits(barad_value($_POST, 'quantity', barad_value($_GET, 'quantity', '100'))), FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 100000]]);
    if ($qty === false) $qty = 100;
    $error = $GLOBALS['barad_form_error'] ?? '';
    ob_start(); ?>
    <div class="subhero w"><h1><?php echo esc_html(barad_t('پیش‌فاکتور، بدون ساخت حساب')); ?></h1><p><?php echo esc_html(barad_t('مدل و مقدار را انتخاب کنید؛ قیمت لحظه صدور، مبنای سند است.')); ?></p></div>
    <?php if ($error) echo '<p class="w quote-note" role="alert">' . esc_html($error) . '</p>'; ?>
    <?php if (!barad_can_quote($p)) { ?>
        <div class="w info-box"><h2><?php echo esc_html(barad_t('برای دریافت پیش‌فاکتور با فروش هماهنگ کنید')); ?></h2><p><?php echo esc_html(barad_t('قیمت کالاها فعلاً با استعلام از فروش اعلام می‌شود. برای دریافت پیش‌فاکتور، مدل، مقدار و شرایط سفارش را با فروش هماهنگ کنید.')); ?></p><a class="btn primary" href="<?php echo esc_url(barad_url('catalog')); ?>"><?php echo esc_html(barad_t('انتخاب از کالاها')); ?></a></div>
    <?php } else { ?>
        <div class="w quote-layout">
            <article class="info-box"><h2><?php echo esc_html($p->get_name()); ?></h2><div class="product-price"><?php echo barad_price($p); ?></div><p><?php echo esc_html(barad_t('جمع فعلی: ')); ?><output id="barad-live-total" for="barad-quantity" aria-live="polite" data-price="<?php echo esc_attr($p->get_price()); ?>" data-decimals="<?php echo esc_attr(wc_get_price_decimals()); ?>" data-currency="<?php echo esc_attr(get_woocommerce_currency_symbol()); ?>"><?php echo wc_price((float)$p->get_price() * $qty); ?></output></p><div class="quote-note"><?php echo esc_html(barad_t('مالیات، حمل و شرایط پرداخت هنوز محاسبه نشده‌اند.')); ?> <?php echo $p->get_meta('_barad_demo') ? barad_t('این سند آزمایشی برای خرید معتبر نیست.') : barad_t('قیمت و امکان تأمین هنگام صدور دوباره بررسی می‌شوند.'); ?></div></article>
            <article class="info-box"><form class="form-fields" method="post">
                <?php wp_nonce_field('barad_quote'); ?>
                <input type="hidden" name="submission_key" value="<?php echo esc_attr(barad_form_key('quote')); ?>">
                <input type="hidden" name="product_id" value="<?php echo esc_attr($p->get_id()); ?>">
                <div class="barad-honeypot" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>
                <label for="barad-quantity"><?php echo esc_html(barad_t('مقدار (متر)')); ?></label><input id="barad-quantity" name="quantity" type="number" inputmode="numeric" min="1" max="100000" step="1" value="<?php echo esc_attr($qty); ?>" required>
                <label for="barad-name"><?php echo esc_html(barad_t('نام یا شرکت')); ?></label><input id="barad-name" name="customer_name" maxlength="100" autocomplete="organization" value="<?php echo esc_attr(sanitize_text_field(barad_value($_POST, 'customer_name'))); ?>" required>
                <label for="barad-phone"><?php echo esc_html(barad_t('شماره تماس')); ?></label><input id="barad-phone" name="customer_phone" type="tel" inputmode="tel" dir="ltr" maxlength="20" autocomplete="tel" value="<?php echo esc_attr(sanitize_text_field(barad_value($_POST, 'customer_phone'))); ?>" required>
                <label for="barad-email"><?php echo esc_html(barad_t('ایمیل')); ?></label><input id="barad-email" name="customer_email" type="email" dir="ltr" maxlength="150" autocomplete="email" value="<?php echo esc_attr(sanitize_text_field(barad_value($_POST, 'customer_email'))); ?>" required>
                <button name="barad_quote_submit" value="1" class="btn primary"> <?php echo $p->get_meta('_barad_demo') ? barad_t('صدور پیش‌فاکتور آزمایشی') : barad_t('صدور پیش‌فاکتور'); ?></button><p class="form-note"><?php echo esc_html(barad_t('درخواست شما در پنل فروش باراد ثبت می‌شود.')); ?></p>
            </form></article>
        </div>
    <?php } return ob_get_clean();
});

add_shortcode('barad_contact', function () {
    $message = $GLOBALS['barad_form_error'] ?? '';
    $sent = barad_value($_GET, 'sent');
    $receipt = preg_match('/^[a-f0-9]{48}$/D', $sent) ? get_transient('barad_form_' . hash('sha256', $sent)) : false;
    if ($receipt && $receipt['scope'] === 'contact' && !empty($receipt['redirect'])) $message = barad_t('درخواست شما در پنل فروش باراد ثبت شد.');
    ob_start(); ?>
    <div class="subhero w"><span class="eyebrow"><?php echo esc_html(barad_t('تهران · دفتر نیاوران')); ?></span><h1><?php echo esc_html(barad_t('تماس با باراد در تهران')); ?></h1><p><?php echo esc_html(barad_t('انتخاب مدل، استعلام قیمت و هماهنگی تأمین سیم و کابل در تهران و شمال تهران.')); ?></p></div>
    <section class="w contact-layout">
        <article class="contact-card"><h2><?php echo esc_html(barad_t('راه‌های ارتباط')); ?></h2><dl>
            <dt><?php echo esc_html(barad_t('تلفن / فکس')); ?></dt><dd><a dir="ltr" href="tel:<?php echo esc_attr(barad_phone()); ?>"><?php echo esc_html(barad_phone()); ?></a></dd>
            <dt><?php echo esc_html(barad_t('پیام‌رسان')); ?></dt><dd><a dir="ltr" href="tel:<?php echo esc_attr(get_option('barad_mobile')); ?>"><?php echo esc_html(get_option('barad_mobile')); ?></a></dd>
            <dt><?php echo esc_html(barad_t('ایمیل')); ?></dt><dd><a dir="ltr" href="mailto:<?php echo esc_attr(get_option('barad_email')); ?>"><?php echo esc_html(get_option('barad_email')); ?></a></dd>
            <dt><?php echo esc_html(barad_t('نشانی')); ?></dt><dd><?php echo esc_html(barad_t(get_option('barad_address'))); ?></dd>
            <dt><?php echo esc_html(barad_t('ساعت کاری')); ?></dt><dd><?php echo barad_local_hours_html(); ?></dd>
        </dl><p class="barad-visit-note"><?php echo esc_html(barad_visit_note()); ?></p><?php $local=get_option('wpseo_local',[]);if(!empty($local['location_zipcode']))echo '<p>'.esc_html(barad_t('کدپستی: ')).'<bdi>'.esc_html($local['location_zipcode']).'</bdi></p>'; ?><?php if($local_url=barad_local_page_url()){ ?><p><a href="<?php echo esc_url($local_url); ?>"><?php echo esc_html(barad_t('راهنمای خرید سیم و کابل در تهران و شمال تهران')); ?></a></p><?php } ?><div class="actions"><a class="btn primary" href="tel:<?php echo esc_attr(barad_phone()); ?>"><?php echo esc_html(barad_t('تماس با فروش')); ?></a><?php if (get_option('barad_map_url')) { ?><a class="btn" href="<?php echo esc_url(get_option('barad_map_url')); ?>" target="_blank" rel="noopener"><?php echo esc_html(barad_t('مسیر دفتر در نقشه ↗')); ?></a><?php } ?></div><a class="source-link" href="https://baradinn.com/Home/Contact" target="_blank" rel="noopener"><?php echo esc_html(barad_t('اطلاعات از صفحه تماس سایت باراد ↗')); ?></a></article>
        <article class="contact-card"><h2><?php echo esc_html(barad_t('درخواست تماس')); ?></h2>
            <form class="form-fields" method="post"><?php wp_nonce_field('barad_contact'); ?>
                <input type="hidden" name="submission_key" value="<?php echo esc_attr(barad_form_key('contact')); ?>">
                <div class="barad-honeypot" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>
                <label for="contact-name"><?php echo esc_html(barad_t('نام')); ?></label><input id="contact-name" name="customer_name" maxlength="100" autocomplete="name" value="<?php echo esc_attr(sanitize_text_field(barad_value($_POST, 'customer_name'))); ?>" required>
                <label for="contact-phone"><?php echo esc_html(barad_t('تلفن')); ?></label><input id="contact-phone" name="customer_phone" type="tel" inputmode="tel" dir="ltr" maxlength="20" autocomplete="tel" value="<?php echo esc_attr(sanitize_text_field(barad_value($_POST, 'customer_phone'))); ?>" required>
                <label for="contact-subject"><?php echo esc_html(barad_t('موضوع')); ?></label><textarea id="contact-subject" name="subject" maxlength="1000" rows="3"><?php echo esc_textarea(sanitize_textarea_field(barad_value($_POST, 'subject'))); ?></textarea>
                <button class="btn primary" name="barad_contact_submit" value="1"><?php echo esc_html(barad_t('ثبت درخواست تماس')); ?></button>
            </form><p role="status" class="form-note"><?php echo esc_html($message ?: barad_t('درخواست شما در پنل فروش باراد ثبت می‌شود.')); ?></p>
        </article>
    </section>
    <?php return ob_get_clean();
});
