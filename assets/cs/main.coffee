$ ->
	$('.area').each ->
		$this = $ @

		$this.height $this.height()
		$this.width $this.width()
		$this.addClass 'enable-animations'

	effects =
		rPosition: /.*(position-\d+).*/i
		sendBack: ($area, pos) ->
			pos = pos.replace @rPosition, '$1'

			if pos?
				$area.addClass(pos).one 'transitionend', ->
					$.data $area[0], 'contents', $area.contents().detach()
					$area.addClass 'in-background'

		recall: ($area) ->
			pos = $area.attr('class').replace @rPosition, '$1'

			if pos?
				$area.removeClass("#{pos} in-background").append $.data($area[0], 'contents')

	$('.area').on 'click', 'a[href^=#position]', (e) ->
		$area = $(this).closest '.area'

		log $area

		$area.switchPosition 'send', @hash

		$area.one 'click', ->
			$area.switchPosition 'recall'

		e.preventDefault()
