$ ->

	$navListItems = $('nav li')
	$navLinks = $navListItems.find('a')
	$areas = $('.area')

	selectors = ("a[href^=\"##{link.id}\"]" for link in $navLinks).join(',')

	clickCallback = (e, areasState = 'back', areaState = 'front') ->
		$area = $(@hash).closest('.area')

		$areas.switchPosition(areasState)
		$area.switchPosition(areaState)

		$navListItems.removeClass('active')
		$navLinks.filter("a[href='##{$area.prop('id')}']")
			.closest('li').addClass('active')

		if Modernizr.mq('(min-width: 980px)')
			e.preventDefault()

	$(document).on('click', selectors, clickCallback)

	$navLinks.first().trigger('click', ['back-flash', 'front-flash'])