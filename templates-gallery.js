(function () {
  document.querySelectorAll('.premium-template').forEach(function (template) {
    var tabs = Array.prototype.slice.call(template.querySelectorAll('[data-premium-tab]'));
    var views = Array.prototype.slice.call(template.querySelectorAll('[data-premium-page]'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var selected = tab.getAttribute('data-premium-tab');
        tabs.forEach(function (item) { item.setAttribute('aria-pressed', item === tab ? 'true' : 'false'); });
        views.forEach(function (view) { view.hidden = view.getAttribute('data-premium-page') !== selected; });
      });
    });
  });
}());
