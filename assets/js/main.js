// Generated by CoffeeScript 1.3.3

$(function() {
  var $navLinks, activateArea;
  $navLinks = $('nav li a');
  activateArea = function(area) {
    var $area;
    $area = $(area).closest('.area');
    $area.switchPosition('recall').siblings('.area').switchPosition('send');
    return $navLinks.removeClass('active').filter("[href=#" + ($area.attr('id')) + "]").addClass('active');
  };
  $(document).on('click', 'a[href^=#area-]', function(e) {
    activateArea(this.hash);
    return e.preventDefault();
  });
  return $('.area').addClass('enable-animations').not(':first').switchPosition('send-flash').one('click', function() {
    return $(this).switchPosition('recall');
  });
});
