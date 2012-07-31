$ ->

	$navLinks = $('nav li a')
	activateArea = (area) ->
		$area = $(area).closest '.area'

		$area.switchPosition('recall')
			.siblings('.area').switchPosition 'send'

		$navLinks.closest('li').removeClass('active').end()
			.filter("a[href=##{$area.prop('id')}]")
				.closest('li').addClass 'active'

	$(document).on 'click', 'a[href^=#area-]', (e) ->
		activateArea @hash

		if Modernizr.mq('only screen and (min-width: 980px)')
			e.preventDefault()

	$('.area').addClass('enable-animations')

	$navLinks.first().click()

	# QRCode

	$('.area footer').prepend "<p>
		<img src=\"http://chart.apis.google.com/chart?cht=qr&amp;chl=#{encodeURIComponent(location.href)}&amp;chs=240x240\" alt=\"QRCode\">
		</p>";