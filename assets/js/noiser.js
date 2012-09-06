var __slice = [].slice;

$(function() {
  var $canvas, bulletDblClick, colors, cv, dragMove, dragStart, drawBullets, drawCross, drawLines, elements, generatePoints, getLinesPath, height, info, lineClick, max_dist, min_dist, mouseOut, mouseOver, num, p, points, printCoords, width, x, y;
  points = [];
  num = 5;
  min_dist = 10;
  max_dist = 100;
  $canvas = $('#canvas');
  width = $canvas.data('width');
  height = $canvas.data('height');
  cv = Raphael($canvas[0], width, height);
  elements = {};
  colors = {
    start: {
      out: {
        stroke: '#00f',
        fill: 'rgba(0, 0, 255, 0.5)'
      },
      over: {
        stroke: '#00e',
        fill: 'rgba(0, 0, 244, 0.3)'
      }
    },
    "default": {
      out: {
        stroke: '#f00',
        fill: 'rgba(255, 0, 0, 0.5)'
      },
      over: {
        stroke: '#e00',
        fill: 'rgba(244, 0, 0, 0.3)'
      }
    }
  };
  info = "How to use:\n1. Click and drag to move points\n2. Click on lines to create new points\n3. Double-click on points to remove them\n4. The blue one is starting point and is immovable and unremovable\n\nFor optimal results keep all points within the big circle.";
  generatePoints = function(num, max_dist, min_dist) {
    var arc, curr, d, dist, i, point, prev, x, y;
    num++;
    points = [];
    while (num -= 1) {
      arc = 2 * Math.PI * Math.random();
      dist = (max_dist - min_dist) * Math.random() + min_dist;
      x = dist * Math.cos(arc) + Math.sin(arc);
      y = Math.cos(arc) - dist * Math.sin(arc);
      point = [Math.round(x), Math.round(y)];
      if (points.length > 1) {
        i = points.length - 2;
        curr = {
          x: point[0],
          y: point[1]
        };
        prev = {
          x: points[i][0],
          y: points[i][1]
        };
        d = (curr.x - prev.x) * (curr.x - prev.x) + (curr.y - prev.y) * (curr.y - prev.y);
        if (d < min_dist * min_dist * 4) {
          num++;
          continue;
        }
      }
      points.push(point);
    }
    return points.splice(0, 0, [0, 0]);
  };
  drawCross = function() {
    var cross_dist, x, y, _ref, _ref1, _ref2, _ref3;
    x = width / 2;
    y = height / 2;
    cross_dist = max_dist * 1.25;
    if ((_ref = elements['background']) != null) {
      _ref.remove();
    }
    elements['background'] = cv.rect(0, 0, width, height).attr({
      fill: 'rgba(255, 255, 255, 0.8)',
      'stroke-width': 0
    });
    if ((_ref1 = elements['cross-lines']) != null) {
      _ref1.remove();
    }
    elements['cross-lines'] = cv.path("M" + (x - cross_dist) + "," + y + "L" + (x + cross_dist) + "," + y + "M" + x + "," + (y - cross_dist) + "L" + x + "," + (y + cross_dist)).attr({
      stroke: '#333'
    });
    if ((_ref2 = elements['cross-circle']) != null) {
      _ref2.remove();
    }
    elements['cross-circle'] = cv.circle(x, y, max_dist).attr({
      stroke: '#333'
    });
    if ((_ref3 = elements['info']) != null) {
      _ref3.remove();
    }
    return elements['info'] = cv.text(20, 70, info).attr({
      color: '#333',
      'font-size': 16,
      'text-anchor': 'start'
    });
  };
  getLinesPath = function() {
    var p, path, px, py, _i, _len, _ref;
    _ref = points[points.length - 1], px = _ref[0], py = _ref[1];
    path = "M" + px + "," + py;
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      p = points[_i];
      px = p[0], py = p[1];
      path += "L" + px + "," + py;
    }
    return path;
  };
  drawLines = function() {
    var _ref, _ref1;
    if ((_ref = elements['points-lines']) != null) {
      _ref.remove();
    }
    elements['points-lines'] = cv.path(getLinesPath()).attr({
      stroke: '#e00'
    });
    if ((_ref1 = elements['points-lines-clickable']) != null) {
      _ref1.remove();
    }
    return elements['points-lines-clickable'] = cv.path(getLinesPath()).click(lineClick).attr({
      stroke: 'rgba(0,0,0,0.0)',
      'stroke-width': 8
    });
  };
  lineClick = function(coords, x3, y3) {
    var dist, dists, i, id, mag_2, offset, u, vx, vy, x, x1, x2, y, y1, y2, _i, _points, _ref;
    dists = [];
    offset = $canvas.offset();
    x3 = Math.round(x3 - offset.left);
    y3 = Math.round(y3 - offset.top);
    _points = points.slice(0);
    _points.push(_points[0]);
    min_dist = null;
    id = null;
    for (i = _i = 0, _ref = points.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      x1 = _points[i + 0][0];
      y1 = _points[i + 0][1];
      x2 = _points[i + 1][0];
      y2 = _points[i + 1][1];
      if ((Math.min(x2, x1) <= x3 && x3 <= Math.max(x2, x1)) && (Math.min(y2, y1) <= y3 && y3 <= Math.max(y2, y1))) {
        vx = x2 - x1;
        vy = y2 - y1;
        mag_2 = vx * vx + vy * vy;
        u = ((x3 - x1) * vx + (y3 - y1) * vy) / mag_2;
        if ((0 <= u && u <= 1)) {
          x = x1 + u * (x2 - x1);
          y = y1 + u * (y2 - y1);
          dist = (x3 - x) * (x3 - x) + (y3 - y) * (y3 - y);
          if (min_dist === null || dist < min_dist) {
            min_dist = dist;
            id = i;
          }
        }
      }
    }
    points.splice(id + 1, 0, [x3, y3]);
    drawLines();
    return drawBullets();
  };
  drawBullets = function() {
    var c, i, p, px, py, _i, _len, _ref;
    if ((_ref = elements['points-bullets']) != null) {
      _ref.forEach(function(bullet) {
        return bullet.remove();
      });
    }
    elements['points-bullets'] = [];
    for (i = _i = 0, _len = points.length; _i < _len; i = ++_i) {
      p = points[i];
      px = p[0], py = p[1];
      c = cv.circle(px, py, 5);
      if (i !== 0) {
        c.attr(colors["default"].out).mouseover(mouseOver).mouseout(mouseOut).dblclick(bulletDblClick).drag(dragMove, dragStart);
      } else {
        c.attr(colors.start.out);
      }
      c.data('isMouseOver', false);
      c.data('i', i);
      c.data('timestamp', +(new Date));
      elements['points-bullets'].push(c);
    }
    return printCoords();
  };
  dragStart = function() {
    this.data('cx', this.attr('cx'));
    return this.data('cy', this.attr('cy'));
  };
  dragMove = function(dx, dy) {
    var bullet;
    this.attr({
      cx: this.data('cx') + dx,
      cy: this.data('cy') + dy
    });
    points = (function() {
      var _i, _len, _ref, _results;
      _ref = elements['points-bullets'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bullet = _ref[_i];
        _results.push([bullet.attr('cx'), bullet.attr('cy')]);
      }
      return _results;
    })();
    elements['points-lines'].attr({
      path: getLinesPath()
    });
    elements['points-lines-clickable'].attr({
      path: getLinesPath()
    });
    printCoords();
    return this.data('timestamp', +(new Date));
  };
  mouseOver = function() {
    if (this.data('isMouseOver') === false) {
      this.attr(colors["default"].over);
      return this.data('isMouseOver', true);
    }
  };
  mouseOut = function() {
    if (this.data('isMouseOver') === true) {
      this.attr(colors["default"].out);
      return this.data('isMouseOver', false);
    }
  };
  bulletDblClick = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (new Date - this.data('timestamp') > 500) {
      points.splice(this.data('i'), 1);
      this.remove();
      drawLines();
      return drawBullets();
    }
  };
  printCoords = function() {
    var coords, p, x, y;
    x = width / 2;
    y = height / 2;
    coords = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        p = points[_i];
        _results.push("" + (Math.round(p[0] - x)) + " " + (Math.round(p[1] - y)));
      }
      return _results;
    })();
    return $('#coords').val(coords.join(', '));
  };
  generatePoints(num, max_dist, min_dist);
  x = width / 2;
  y = height / 2;
  points = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      p = points[_i];
      _results.push([p[0] + x, p[1] + y]);
    }
    return _results;
  })();
  drawCross();
  drawLines();
  drawBullets();
  return $('#coords').keyup(function() {
    var $this, i, pair, pairs, point, _i, _len;
    $this = $(this);
    pairs = $this.val().trim().replace(/\s*,\s*/g, ',').split(',');
    if (!pairs.length) {
      return;
    }
    if (!/^0\s+0$/.test(pairs[0])) {
      pairs.splice(0, 0, '0 0');
    }
    points.splice(0);
    x = width / 2;
    y = height / 2;
    for (i = _i = 0, _len = pairs.length; _i < _len; i = ++_i) {
      pair = pairs[i];
      point = pair.split(/\s+/);
      if (point.length === 2) {
        points.push([+point[0] + x, +point[1] + y]);
      }
    }
    drawLines();
    return drawBullets();
  });
});
