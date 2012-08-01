// Generated by CoffeeScript 1.3.3

$(function() {
  var $navLinks, activateArea;
  $navLinks = $('nav li a');
  activateArea = function(area) {
    var $area;
    $area = $(area).closest('.area');
    $area.switchPosition('recall').siblings('.area').switchPosition('send');
    return $navLinks.closest('li').removeClass('active').end().filter("a[href=#" + ($area.prop('id')) + "]").closest('li').addClass('active');
  };
  $(document).on('click', 'a[href^=#area-]', function(e) {
    activateArea(this.hash);
    if (Modernizr.mq('only screen and (min-width: 980px)')) {
      return e.preventDefault();
    }
  });
  $('.area').addClass('enable-animations');
  $navLinks.first().click();
  return $('.area footer').prepend("<p>		<img src=\"http://chart.apis.google.com/chart?cht=qr&amp;chl=" + (encodeURIComponent(location.href.replace(/^([^#]+)(#.*)?/i, '$1'))) + "&amp;chs=240x240\" alt=\"QRCode\">		</p>");
});
