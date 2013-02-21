// Avoid `console` errors in browsers that lack a console.
(function() {
		var noop = function noop() {};
		var methods = [
			'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
			'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
			'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
			'timeStamp', 'trace', 'warn'
		];
		var length = methods.length;
		var console = window.console || {};

		while (length--) {
				// Only stubs undefined methods.
				if (!console[methods[length]]) {
						console[methods[length]] = noop;
				}
		}
}());

// place any jQuery/helper plugins in here, instead of separate, slower script files.

// position switcher
(function ($, doc) {
	"use strict";

	var transEndEventNames = {
				'WebkitTransition' : 'webkitTransitionEnd',
				'MozTransition'    : 'transitionend',
				'OTransition'      : 'oTransitionEnd',
				'msTransition'     : 'MSTransitionEnd',
				'transition'       : 'transitionend'
			},
			transitionName = transEndEventNames[Modernizr.prefixed('transition')];

	// simple transition handler/helper
	var transition = {
		isActive: function ($el) {
			// check if transform changed (isn't "none") - this function return false
			// for browsers without translate3d support or with small screen
			var transform = $el.css('transform');
			return transform && transform != 'none';
		},
		transitionCheckTimeOut: 12,
		on: function ($el, callback) {
			// attach element to transitionend event
			$el.on(transitionName + '.switchPosition', function () {
				// at the end of transition execute the callback
				callback();
			});

			// create delayed check for active transition
			var timer = setTimeout(function () {
						if ( ! transition.isActive($el)) {
							// if no transition is active or browser does not support it, execute
							// the callback manually
							callback();
						}
					}, transition.transitionCheckTimeOut);

			// remember timer id
			$el.data('timer.switchPosition', timer);
		},
		off: function ($el) {
			// detach element from transitionend event
			$el.off(transitionName + '.switchPosition');

			// disable timer if it is still active
			var timer = $el.data('timer.switchPosition');
			if (timer)
			{
				clearTimeout(timer);
				$el.removeData('timer.switchPosition');
			}
		}
	};

	// simple state machine
	var machine = {
				// main function for managing states of provided element
				request: function ($el, newState) {
					var el = $el[0];
					// get name of current or default state
					var curState = $.data(el, 'state') || 'front';
					// validate current state name
					if (curState && this.states.hasOwnProperty(curState))
					{
						// execute method "release" for current state - detach and/or remove
						// any elements and handlers created by method "init" of this state
						this.states[curState].release.call($el);
					}
					// validate new state name
					if (newState  && this.states.hasOwnProperty(newState))
					{
						// initialize new state for element
						this.states[newState].init.call($el);
					}
					// remember new state name
					$.data(el, 'state', newState);
				},
				states: {}
			};

	// state for elements in the foreground
	machine.states['front'] = {
		init: function () {
			// remove blur filter from outer wrapper
			this.closest('.outer-wrapper').removeClass('blurred');
		},
		release: function () {}
	};

	// state for elements in the background
	machine.states['back'] = {
		init: function () {
			// add "position-*" and "in-background" classes to sent the element
			// to proper  place in the background
			var position = 'position-' + this.data('position');
			this.addClass(position + ' in-background');

			// add blur filter to outer wrapper to avoid ugly effect after transformations
			this.closest('.outer-wrapper').addClass('blurred');
		},
		release: function () {
			// remove "position-*" and "in-background" to recall the element from
			// the background, and (depending of the next state) start transitions
			var position = 'position-' + this.data('position');
			this.removeClass(position + ' in-background');
		}
	};

	// state for elements in transition from the background to the foreground
	machine.states['move-to-front'] = {
		init: function () {
			var self = this;

			// remove blur filter from outer wrapper
			this.closest('.outer-wrapper').removeClass('blurred');

			// after end of the transition, switch state of the element to "front"
			// animation and transition is activated in method "release" of state
			// "back"
			transition.on(this, function () {
				machine.request(self, 'front');
			});
		},
		release: function () {
			// detach the element from event transitionend
			transition.off(this);
		}
	};

	// state for elements in transition from the foreground to the background
	machine.states['move-to-back'] = {
		init: function () {
			var position = 'position-' + this.data('position');
			var self = this;

			// start the transition by adding class "position-*" to the element
			this.addClass(position);

			// add blur filter to outer wrapper to avoid ugly effect after transformations
			this.closest('.outer-wrapper').addClass('blurred');

			// after end of the transition, switch state of the element to "back"
			transition.on(this, function () {
				machine.request(self, 'back');
			});
		},
		release: function () {
			var position = 'position-' + this.data('position');

			// remove "position-*" class from the element - this class will be
			// readded in state "back"
			this.removeClass(position);
			// detach the element from event transitionend
			transition.off(this);
		}
	};

	$.fn.switchPosition = function (reqState) {
		var rstate = /^(front|back)(-flash)?$/i;

		// validate requested state name
		if ( ! rstate.test(reqState)) {
			console.error('$#switchPosition: Invalid target position \"%s\", avaible: front, back, front-flash, back-flash', reqState);
			return this;
		}

		return this.each(function () {
			var $this = $(this);
			var curState = $.data(this, 'state');

			// if requested "flash" switch, then skip transitional "move-to-*" states
			if (reqState.indexOf('flash') != -1) {
				machine.request($this, reqState.replace(rstate, '$1'));

			// otherwise request transitional state "move-to-*"
			} else if (reqState !== curState) {
				machine.request($this, 'move-to-' + reqState);
			}
		});
	};

})($, document);
