// Generated by CoffeeScript 1.3.3

$(function() {
  var $navLinks, activateArea;
  $navLinks = $('nav li a');
  activateArea = function(area) {
    var $area;
    $area = $(area).closest('.area');
    $area.switchPosition('recall').siblings('.area').switchPosition('send');
    return $navLinks.closest('li').removeClass('active').end().filter("a[href=#" + ($area.attr('id')) + "]").closest('li').addClass('active');
  };
  $(document).on('click', 'a[href^=#area-]', function(e) {
    activateArea(this.hash);
    return e.preventDefault();
  });
  $('.area').addClass('enable-animations');
  return $navLinks.first().click();
});
