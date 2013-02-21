// Generated by CoffeeScript 1.4.0

$(function() {
  var $areas, $navLinks, $navListItems, collapseCallback, link, positionSwitchCallback, selectors;
  $navListItems = $('nav li');
  $navLinks = $navListItems.find('a');
  $areas = $('.area');
  selectors = ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = $navLinks.length; _i < _len; _i++) {
      link = $navLinks[_i];
      _results.push("a[href^=\"#" + link.id + "\"]");
    }
    return _results;
  })()).join(',');
  positionSwitchCallback = function(e, areasState, areaState) {
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
    if (Modernizr.mq('(min-width: 980px)')) {
      return e.preventDefault();
    }
  };
  collapseCallback = function() {
    return $(this).toggleClass('collapse');
  };
  $(document).on('click', selectors, positionSwitchCallback);
  $(document).on('click', '.collapsable', collapseCallback);
  return $navLinks.first().trigger('click', ['back-flash', 'front-flash']);
});
