jQuery(function ($) {
  $('#barad-pick-logo').on('click', function () {
    const picker = wp.media({ title: 'انتخاب لوگوی باراد', library: { type: 'image' }, multiple: false });
    picker.on('select', function () {
      const item = picker.state().get('selection').first().toJSON();
      $('#barad-logo-id').val(item.id);
      $('#barad-logo-preview').empty().append($('<img>', { src: item.url, alt: 'لوگوی شرکت' }).css({ maxWidth: '120px', height: 'auto', background: 'transparent', padding: '0' }));
    });
    picker.open();
  });
});
