$ ->

	$navListItems = $('nav li')
	$navLinks = $navListItems.find('a')
	$areas = $('.area')

	selectors = ("a[href^=\"##{link.id}\"]" for link in $navLinks).join(',')

	positionSwitchCallback = (e, areasState = 'back', areaState = 'front') ->
		$area = $(@hash).closest('.area')

		$areas.switchPosition(areasState)
		$area.switchPosition(areaState)

		$navListItems.removeClass('active')
		$navLinks.filter("a[href='##{$area.prop('id')}']")
			.closest('li').addClass('active')

		if Modernizr.mq('(min-width: 980px)')
			e.preventDefault()

	collapseCallback = () ->
		console.log('toggle class', $(this))
		$(this).toggleClass('collapse')

	$(document).on('click', selectors, positionSwitchCallback)

	$(document).on('click', '.collapsable', collapseCallback)

	$navLinks.first().trigger('click', ['back-flash', 'front-flash'])