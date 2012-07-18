$ ->

	$navLinks = $('nav li a')
	activateArea = (area) ->
		$area = $(area).closest '.area'

		$area.switchPosition('recall')
			.siblings('.area').switchPosition 'send'

		$navLinks.removeClass('active')
			.filter("[href=##{$area.attr('id')}]").addClass 'active'

	$('nav ul').on 'click', 'a[href^=#area]', (e) ->
		activateArea @hash

		e.preventDefault()

	$('.area').addClass('enable-animations')
		.not(':first').switchPosition('send-flash').one 'click', ->
				$(this).switchPosition 'recall'