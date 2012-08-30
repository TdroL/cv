$ ->

	$navListItems = $('nav li')
	$navLinks = $navListItems.find('a')
	activateArea = (area) ->
		$area = $(area).closest '.area'

		$area.switchPosition('recall')
			.siblings('.area').switchPosition 'send'

		$navListItems.removeClass 'active'
		$navLinks.filter("a[href='##{$area.attr('id')}']").closest('li').addClass 'active'

	$(document).on 'click', 'a[href^="#area-"]', (e) ->
		activateArea @hash

		if Modernizr.mq 'only screen and (min-width: 980px)'
			e.preventDefault()

	$('.area').addClass 'enable-animations'

	$navLinks.first().trigger 'click'

	# QRCode
	$('.area footer').prepend "<p>
		<img src=\"http://chart.apis.google.com/chart?cht=qr&amp;chl=#{encodeURIComponent(location.href.replace(/^([^#]+)(#.*)?/i, '$1'))}&amp;chs=240x240\" alt=\"QRCode\">
		</p>";