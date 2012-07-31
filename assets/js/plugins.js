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

	var rposition = /^.*(position-\d+).*$/i, positionId, $dummy;

	position = position || '';

	if (action && (action == 'send' || action == 'send-flash')) {
		return this.trigger('transitionend.switchPosition').each(function() {
			var $this = $(this),
			    self = this;

			positionId = position || ('position-' + $this.data('position'));
			positionId = positionId.replace(rposition, '$1');

			if (positionId == null) {
				throw 'jQuery#switchPosition error: argument or data \'position\' must not be empty and must contain valid position';
			}

			$this.addClass(positionId);

			if ( ! $this.is('.in-background')) {
				$this.one('transitionend.switchPosition', function() {
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
			    classes = $this.prop('class');

			positionId = classes.replace(rposition, '$1');

			if (rposition.test(classes) && positionId != null) {
				$this.removeClass(positionId + ' in-background');
				// fix chrome's visibility bug (visibility not changing after recall)
				$this.children('.wrapper').addClass('wrapper');
			}
		});
	}
};