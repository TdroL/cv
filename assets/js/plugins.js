// Avoid `console` errors in browsers that lack a console.
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

$(document).on('webkitTransitionEnd msTransitionEnd oTransitionEnd', '*', function (e) {
	$(this).trigger('transitionend');
});

// position switcher

$.fn.switchPosition = function (action) {

	if (action == 'send' || action == 'send-flash') {
		// if any element is in middle of transition, trigger "transitionend" event to skip animations
		this.trigger('transitionend.switchPosition');

		// send each element to the background
		return this.each(function () {
			var $this = $(this),
			    positionId;

			// get target position for this element
			positionId = 'position-' + $this.data('position');

			// start the "send" animation
			$this.addClass(positionId);

			// skip elements already in the background
			if ( ! $this.is('.in-background')) {
				// attach "transitionend" event for animated element
				$this.one('transitionend.switchPosition', function () {
					// at the end of transition add class "in-background" to prevent from attaching "transitionend" event
					$this.addClass('in-background');
				});

				// if requested "send-flash" method, trigger "transitionend" event immediately
				if (action == 'send-flash') {
					$this.trigger('transitionend.switchPosition');
				}
			}
		});
	}

	if (action == 'recall') {
		// if any element is in middle of transition, trigger "transitionend" event to skip animations
		this.trigger('transitionend.switchPosition');

		// recall each element from the background
		return this.each(function () {
			var $this = $(this),
			    positionId;

			// get target position for this element
			positionId = 'position-' + $this.data('position');

			if ($this.hasClass(positionId)) {
				// remove "position-*" and "in-background" classes from this element - start the "recall" animation
				$this.removeClass(positionId + ' in-background');
			}
		});
	}
};