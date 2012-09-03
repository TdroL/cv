$ ->

	$navListItems = $('nav li')
	$navLinks = $navListItems.find('a')
	$areas = $('.area')

	selectors = ("a[href^=\"##{link.id}\"]" for link in $navLinks)

	$(document).on 'click', selectors.join(','), (e, areasState = 'back', areaState = 'front') ->
		$area = $(@hash).closest '.area'

		$areas.switchPosition areasState
		$area.switchPosition areaState

		console.log 'click'

		$navListItems.removeClass 'active'
		$navLinks.filter("a[href='##{$area.prop('id')}']")
			.closest('li').addClass 'active'

		if Modernizr.mq 'only screen and (min-width: 980px)'
			e.preventDefault()

	$navLinks.first().trigger 'click', ['back-flash', 'front-flash']