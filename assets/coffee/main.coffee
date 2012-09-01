$ ->

	$navListItems = $('nav li')
	$navLinks = $navListItems.find('a')

	selectors = ("a[href^=\"##{link.id}\"]" for link in $navLinks)

	activateArea = (area) ->
		$area = $(area).closest '.area'

		$area.switchPosition('recall')
			.siblings('.area').switchPosition 'send'

		$navListItems.removeClass 'active'
		$navLinks.filter("a[href='##{$area.prop('id')}']")
			.closest('li').addClass 'active'

	$(document).on 'click', selectors.join(','), (e) ->
		activateArea @hash

		if Modernizr.mq 'only screen and (min-width: 980px)'
			e.preventDefault()

	$('.area').addClass 'enable-animations'

	$navLinks.first().trigger 'click'