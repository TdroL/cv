// Generated by CoffeeScript 1.3.3

$(function() {
  var $navLinks, $navListItems, activateArea, link, selectors;
  $navListItems = $('nav li');
  $navLinks = $navListItems.find('a');
  selectors = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = $navLinks.length; _i < _len; _i++) {
      link = $navLinks[_i];
      _results.push("a[href^=\"#" + link.id + "\"]");
    }
    return _results;
  })();
  activateArea = function(area) {
    var $area;
    $area = $(area).closest('.area');
    $area.switchPosition('recall').siblings('.area').switchPosition('send');
    $navListItems.removeClass('active');
    return $navLinks.filter("a[href='#" + ($area.prop('id')) + "']").closest('li').addClass('active');
  };
  $(document).on('click', selectors.join(','), function(e) {
    activateArea(this.hash);
    if (Modernizr.mq('only screen and (min-width: 980px)')) {
      return e.preventDefault();
    }
  });
  $('.area').addClass('enable-animations');
  return $navLinks.first().trigger('click');
});
