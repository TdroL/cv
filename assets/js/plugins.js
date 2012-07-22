// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/

if (!(window.console && console.log)) {
	(function() {
		var noop = function() {};
		var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
		var length = methods.length;
		var console = window.console = {};
		while (length--) {
			console[methods[length]] = noop;
		}
	}());
}

// place any jQuery/helper plugins in here, instead of separate, slower script files.

jQuery(document).on('webkitTransitionEnd msTransitionEnd oTransitionEnd', '*', function (e) {
	$(this).trigger('transitionend');
});

// position switcher

jQuery.fn.switchPosition = function(action, position) {

	var rPosition = /^.*(position-\d+).*$/i, positionId, max_width, max_height;

	position = position || '';
	max_width = 960;
	max_height = 2400;

	if (action && (action == 'send' || action == 'send-flash')) {
		return this.trigger('transitionend.switchPosition').each(function() {
			var $this = $(this),
			    self = this;

			positionId = position || ('position-' + $this.data('position'));
			positionId = positionId.replace(rPosition, '$1');

			if (positionId == null) {
				throw 'jQuery#switchPosition error: argument or data \'position\' must not be empty and must contain valid position';
			}

			$.data(self, 'dimentions', { width: $this.width(), height: $this.height() });

			$this.width(Math.min($this.width(), max_width));
			$this.height(Math.min($this.height(), max_height));

			$this.addClass(positionId);

			if ( ! $this.is('.in-background')) {
				$this.one('transitionend.switchPosition', function() {
					$.data(self, 'contents', $this.contents().detach());
					$this.addClass('in-background');
				});

				if (action == 'send-flash') {
					$this.trigger('transitionend.switchPosition');
				}
			}
		});
	}

	if (action && action == 'recall') {
		return this.trigger('transitionend.switchPosition').each(function() {
			var $this = $(this),
			    classes = $this.attr('class');

			positionId = classes.replace(rPosition, '$1');

			if (rPosition.test(classes) && positionId != null) {
				dimentions = $.data(this, 'dimentions');

				if (dimentions != null) {
					$this.width(dimentions.width);
					$this.height(dimentions.height);
				}

				$this.removeClass(positionId + ' in-background').append($.data(this, 'contents'));
			}
		});
	}
};