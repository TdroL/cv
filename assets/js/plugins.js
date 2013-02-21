(function(){var noop=function noop(){};var methods=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"];var length=methods.length;var console=window.console||{};while(length--){if(!console[methods[length]]){console[methods[length]]=noop}}})();(function($,doc){"use strict";var transEndEventNames={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},transitionName=transEndEventNames[Modernizr.prefixed("transition")];var transition={isActive:function($el){var transform=$el.css("transform");return transform&&transform!="none"},transitionCheckTimeOut:12,on:function($el,callback){$el.on(transitionName+".switchPosition",function(){callback()});var timer=setTimeout(function(){if(!transition.isActive($el)){callback()}},transition.transitionCheckTimeOut);$el.data("timer.switchPosition",timer)},off:function($el){$el.off(transitionName+".switchPosition");var timer=$el.data("timer.switchPosition");if(timer){clearTimeout(timer);$el.removeData("timer.switchPosition")}}};var machine={request:function($el,newState){var el=$el[0];var curState=$.data(el,"state")||"front";if(curState&&this.states.hasOwnProperty(curState)){this.states[curState].release.call($el)}if(newState&&this.states.hasOwnProperty(newState)){this.states[newState].init.call($el)}$.data(el,"state",newState)},states:{}};machine.states["front"]={init:function(){this.closest(".outer-wrapper").removeClass("blurred")},release:function(){}};machine.states["back"]={init:function(){var position="position-"+this.data("position");this.addClass(position+" in-background");this.closest(".outer-wrapper").addClass("blurred")},release:function(){var position="position-"+this.data("position");this.removeClass(position+" in-background")}};machine.states["move-to-front"]={init:function(){var self=this;this.closest(".outer-wrapper").removeClass("blurred");transition.on(this,function(){machine.request(self,"front")})},release:function(){transition.off(this)}};machine.states["move-to-back"]={init:function(){var position="position-"+this.data("position");var self=this;this.addClass(position);this.closest(".outer-wrapper").addClass("blurred");transition.on(this,function(){machine.request(self,"back")})},release:function(){var position="position-"+this.data("position");this.removeClass(position);transition.off(this)}};$.fn.switchPosition=function(reqState){var rstate=/^(front|back)(-flash)?$/i;if(!rstate.test(reqState)){console.error('$#switchPosition: Invalid target position "%s", avaible: front, back, front-flash, back-flash',reqState);return this}return this.each(function(){var $this=$(this);var curState=$.data(this,"state");if(reqState.indexOf("flash")!=-1){machine.request($this,reqState.replace(rstate,"$1"))}else if(reqState!==curState){machine.request($this,"move-to-"+reqState)}})}})($,document);