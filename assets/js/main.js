
$(function() {
  var $areas, $navLinks, $navListItems, link, selectors;
  $navListItems = $('nav li');
  $navLinks = $navListItems.find('a');
  $areas = $('.area');
  selectors = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = $navLinks.length; _i < _len; _i++) {
      link = $navLinks[_i];
      _results.push("a[href^=\"#" + link.id + "\"]");
    }
    return _results;
  })();
  $(document).on('click', selectors.join(','), function(e, areasState, areaState) {
    var $area;
    if (areasState == null) {
      areasState = 'back';
    }
    if (areaState == null) {
      areaState = 'front';
    }
    $area = $(this.hash).closest('.area');
    $areas.switchPosition(areasState);
    $area.switchPosition(areaState);
    $navListItems.removeClass('active');
    $navLinks.filter("a[href='#" + ($area.prop('id')) + "']").closest('li').addClass('active');
    if (Modernizr.mq('only screen and (min-width: 980px)')) {
      return e.preventDefault();
    }
  });
  return $navLinks.first().trigger('click', ['back-flash', 'front-flash']);
});
