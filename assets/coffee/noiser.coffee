$ ->
	points = []
	num = 5
	min_dist = 10
	max_dist = 100

	$canvas = $('#canvas')
	width = $canvas.data 'width'
	height = $canvas.data 'height'

	cv = Raphael $canvas[0], width, height

	elements = {}

	colors =
		start:
			out:  { stroke: '#00f', fill: 'rgba(0, 0, 255, 0.5)' }
			over: { stroke: '#00e', fill: 'rgba(0, 0, 244, 0.3)' }
		default:
			out:  { stroke: '#f00', fill: 'rgba(255, 0, 0, 0.5)' }
			over: { stroke: '#e00', fill: 'rgba(244, 0, 0, 0.3)' }

	info = """How to use:
	1. Click and drag to move points
	2. Click on lines to create new points
	3. Double-click on points to remove them
	4. The blue one is starting point and is immovable and unremovable

	For optimal results keep all points within the big circle."""

	generatePoints = (num, max_dist, min_dist) ->
		num++
		points = []
		while num -= 1
			arc = 2 * Math.PI * Math.random()
			dist = (max_dist - min_dist) * Math.random() + min_dist

			x = dist * Math.cos(arc) + Math.sin(arc)
			y = Math.cos(arc) - dist * Math.sin(arc)
			point = [Math.round(x), Math.round(y)]

			if points.length > 1
				i = points.length - 2
				curr =
					x: point[0]
					y: point[1]
				prev =
					x: points[i][0]
					y: points[i][1]

				d = (curr.x - prev.x)*(curr.x - prev.x) + (curr.y - prev.y)*(curr.y - prev.y)

				if d < min_dist*min_dist*4
					num++
					continue

			points.push point

		points.splice 0, 0, [0, 0]

	drawCross = ->
		x = width / 2
		y = height / 2
		cross_dist = max_dist * 1.25

		elements['background']?.remove()
		elements['background'] = cv.rect(0, 0, width, height)
			.attr { fill: 'rgba(255, 255, 255, 0.8)' }

		elements['cross-lines']?.remove()
		elements['cross-lines'] = cv.path("M#{x-cross_dist},#{y}L#{x+cross_dist},#{y}M#{x},#{y-cross_dist}L#{x},#{y+cross_dist}")
			.attr { stroke: '#333' }

		elements['cross-circle']?.remove()
		elements['cross-circle'] = cv.circle(x, y, max_dist)
			.attr { stroke: '#333' }

		elements['info']?.remove()
		elements['info'] = cv.text(20, 70, info)
			.attr { color: '#333', 'font-size': 16, 'text-anchor': 'start' }

	getLinesPath = ->
		[px, py] = points[points.length-1]
		path = "M#{px},#{py}"

		for p in points
			[px, py] = p
			path += "L#{px},#{py}"

		path

	drawLines = ->
		elements['points-lines']?.remove()
		elements['points-lines'] = cv.path(getLinesPath())
			.attr { stroke: '#e00' }

		elements['points-lines-clickable']?.remove()
		elements['points-lines-clickable'] = cv.path(getLinesPath())
			.click(lineClick)
			.attr { stroke: 'rgba(0,0,0,0.0)', 'stroke-width': 8 }

	lineClick = (coords, x3, y3) ->
		dists = []

		offset = $canvas.offset()

		x3 = Math.round x3 - offset.left
		y3 = Math.round y3 - offset.top

		_points = points[..]
		_points.push _points[0]

		min_dist = null
		id = null

		for i in [0...points.length]
			# http://local.wasp.uwa.edu.au/~pbourke/geometry/pointline/
			x1 = _points[i+0][0]
			y1 = _points[i+0][1]
			x2 = _points[i+1][0]
			y2 = _points[i+1][1]

			if Math.min(x2, x1) <= x3 <= Math.max(x2, x1) and Math.min(y2, y1) <= y3 <= Math.max(y2, y1)
				vx = x2 - x1
				vy = y2 - y1
				mag_2 = vx*vx + vy*vy

				u = ((x3 - x1)*vx + (y3 - y1)*vy) / mag_2

				if 0 <= u <= 1
					x = x1 + u*(x2 - x1)
					y = y1 + u*(y2 - y1)

					dist = (x3 - x)*(x3 - x) + (y3 - y)*(y3 - y)

					if min_dist is null or dist < min_dist
						min_dist = dist
						id = i

		points.splice id + 1, 0, [x3, y3]
		drawLines()
		drawBullets()

	drawBullets = ->
		elements['points-bullets']?.forEach (bullet) -> bullet.remove()
		elements['points-bullets'] = []

		for p, i in points
			[px, py] = p
			c = cv.circle(px, py, 5)

			if i != 0
				c.attr(colors.default.out)
					.mouseover(mouseOver).mouseout(mouseOut).dblclick(bulletDblClick)
					.drag dragMove, dragStart
			else
				c.attr(colors.start.out)

			c.data 'isMouseOver', false
			c.data 'i', i
			c.data 'timestamp', +new Date

			elements['points-bullets'].push c

		printCoords()

	dragStart = ->
		@data 'cx', @attr('cx')
		@data 'cy', @attr('cy')

	dragMove = (dx, dy) ->
		@attr { cx: @data('cx') + dx, cy: @data('cy') + dy }

		points = for bullet in elements['points-bullets']
			[bullet.attr('cx'), bullet.attr('cy')]

		elements['points-lines'].attr { path: getLinesPath() }
		elements['points-lines-clickable'].attr { path: getLinesPath() }
		printCoords()

		@data 'timestamp', +new Date

	mouseOver = ->
		if @data('isMouseOver') is false
			@attr colors.default.over
			@data 'isMouseOver', true

	mouseOut = ->
		if @data('isMouseOver') is true
			@attr colors.default.out
			@data 'isMouseOver', false

	bulletDblClick = (args...)->
		if new Date - @data('timestamp') > 500
			points.splice @data('i'), 1
			@remove()
			drawLines()
			drawBullets()

	printCoords = ->
		x = width / 2
		y = height / 2

		console.log points

		coords = for p in points
			"#{Math.round((p[0]-x))} #{Math.round((p[1]-y))}"

		$('#coords').val coords.join(', ')

	generatePoints num, max_dist, min_dist

	x = width / 2
	y = height / 2
	points = for p in points
		[p[0] + x, p[1] + y]

	drawCross()
	drawLines()
	drawBullets()

	$('#coords').keyup ->
		$this = $ @
		pairs = $this.val().trim().replace(/\s*,\s*/g, ',').split ','

		unless pairs.length
			return

		unless /^0\s+0$/.test pairs[0]
			pairs.splice 0, 0, '0 0'

		points.splice 0
		x = width / 2
		y = height / 2

		for pair, i in pairs
			point = pair.split /\s+/

			if point.length == 2
				points.push [+point[0] + x, +point[1] + y]

		drawLines()
		drawBullets()