// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/

window.log = function f() {
	log.history = log.history || [];
	log.history.push(arguments);
	if (this.console) {
		var args = arguments;
		var newarr;

		try {
			args.callee = f.caller;
		} catch(e) {

		}

		newarr = [].slice.call(args);

		if (typeof console.log === 'object') {
			log.apply.call(console.log, console, newarr);
		} else {
			console.log.apply(console, newarr);
		}
	}
};

// make it safe to use console.log always

(function(a) {
	function b() {}
	var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn";
	var d;
	for (c = c.split(","); !!(d = c.pop());) {
		a[d] = a[d] || b;
	}
})(function() {
	try {
		console.log();
		return window.console;
	} catch(a) {
		return (window.console = {});
	}
}());

// place any jQuery/helper plugins in here, instead of separate, slower script files.

jQuery(document).on("webkitTransitionEnd msTransitionEnd oTransitionEnd", "*", function (e) {
	$(this).trigger('transitionend');

	e.stopPropagation();
});

// position switcher

jQuery.fn.switchPosition = function(action, position) {

	var rPosition = /.*(position-\d+).*/i;

	if (action && action == "send") {
		position = position.replace(rPosition, '$1');

		if (position == null)
		{
			throw "jQuery#switchPosition error: argument 'position' must not be empty and must contain valid position";
		}

		return this.each(function() {
			var $this = $(this),
			    self = this;

			$this.addClass(position).one("transitionend", function() {
				$.data(self, "contents", $this.contents().detach());
				$this.addClass("in-background");
			});
		});
	}

	if (action && action == "recall") {
		return this.each(function() {
			var $this = $(this);

			position = $this.attr("class").replace(rPosition, "$1");
			if (position != null) {
				$this.removeClass(position + " in-background").append($.data(this, "contents"));
			}
		});
	}
};