var SkrollrUtilities = (function($) {

	"use strict";

	var module = {};

//===Helper Object to Expose=======

	function getHelper() {

		var helper = {
			_eventHandlers: []
		};

		//suffix units on to an array of values (that may or may not be suffixed with unit already)
		helper.addUnits = function(arr,unit) {
			var suffixed_arr = [];
			for(var i in arr) {
				var elem = arr[i],
					regex = "^.*unit$";
				regex.replace("unit", unit);
				regex = new RegExp(regex, "i");

				if(!regex.test(elem))
					elem += unit;
				suffixed_arr.push(elem);
			}
			return suffixed_arr;
		};

		//convert hex code to rgb. skrollr requires rgb (or hsl) for interpolation
		helper.convertHex = function(hex, alpha) {
			var hex_split = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
			if(!alpha) {
				return "rgb(" + parseInt(hex_split[1],16) +"," + parseInt(hex_split[2],16) +"," + parseInt(hex_split[3],16) + ")";
			}
			return "rgba(" + parseInt(hex_split[1],16) +"," + parseInt(hex_split[2],16) +"," + parseInt(hex_split[3],16) +"," + alpha + ")";
		};

		//basically get the scrollheight of an element (shorthand jquery)
		helper.getPos = function(selector) {
			if($(selector).length === 1)
				return Math.floor($(selector).offset().top);
			else {
				console.error("Failed to locate only one jQuery element")
			}
		}

		//create a keyframe event handler for one keyframe.
		helper.onKeyframeEvent = function (element,marker, callback) {
			//if you pass in a jquery element
			if(element.length === 1) {
				element = element[0];
			}
			$(element).attr('data-emit-events',"true");
			var eventHandler = {
				element: element,
				marker: marker,
				callback: callback
			};
			helper._eventHandlers.push(eventHandler);
		};

		//iterates through all event handlers created by onKeyframeEvent and combines in to one handler for skrollr
		helper.keyframeHandlerFn = function(element, name, direction){
			name = "data-" + name.substring(4);
			helper._eventHandlers.forEach(function(eventHandler, index) {
				if(eventHandler.element === element && eventHandler.marker === name) {
					eventHandler.callback(element,name,direction);
				}
			});
		};

		return helper;
	};


//===Internal String Builders

	//object to build the transform string
	function TransformBuilder() {
		this.transformations = [];
		this.easing = false;
	}

	TransformBuilder.prototype = {
		rotate: function(rotate_val) {
			this.transformations.push("rotate(" + rotate_val + "deg)");
		},
		scale: function(scalars) {
			this.transformations.push("scale(" + scalars[0] + "," + scalars[1] + ")");
		},
		scale3D: function(scalars) {
			if(!$('body').hasClass('no-csstransforms3d')) {
				this.transformations.push("scale3d(" + scalars[0] + "," + scalars[1] + "," + scalars[2] + ")");
			}
		},
		translate: function(vector) {
			this.transformations.push("translate(" + vector[0] + "px," + vector[1] + "px)");
		},
		translate3D: function(vector) {
			if(!$('body').hasClass('no-csstransforms3d')) {
				this.transformations.push(" translate3d(" + vector[0] + "px," + vector[1] + "px," + vector[2]+"px)");
			}
		},
		skew: function(skew_vals) {
			this.transformations.push(" skew(" + skew_vals[0] + "deg," + skew_vals[1] + "deg)");
		},
		rotateX: function(rotate_val) {
			if(!$('body').hasClass('no-csstransforms3d')) {
				this.transformations.push("rotateX(" + rotate_val + "deg)");
			}
		},
		rotateY: function(rotate_val) {
			if(!$('body').hasClass('no-csstransforms3d')) {
				this.transformations.push(" rotateY(" + rotate_val + "deg)");
			}
		},
		rotateZ: function(rotate_val) {
			if(!$('body').hasClass('no-csstransforms3d')) {
				this.transformations.push(" rotateZ(" + rotate_val + "deg)");
			}
		},
		ease: function(easing) {
			//easing is applied to transform, not individual elements
			this.easing = easing;
		},
		finish: function() {
			//check to see if there were any transformations
			if(this.transformations.length < 1) {
				return "";
			}

			//always has to be the same order (translate has to be first too)
			//uncommented - might be better just to let the user decide.
			// this.transformations.sort().reverse();
			this.trans_string = this.transformations.join(" ");

			if(this.easing) {
				this.trans_string = "transform[" + this.easing + "]:" + this.trans_string;
			} else {
				this.trans_string = "transform:" + this.trans_string;
			}

			this.trans_string += ";";
			return this.trans_string;
		}
	};

	function css(attribute,value) {
		return attribute + ":" + value + ";";
	}


//=======JQUERY FUNCTIONS=========

	function addKeyframe(marker, animation) {

		//check the marker is valid (allow non data-tagged input)
		if(/^(([\d]*||top||bottom||center)\-?){1,3}$/.test(marker)) {
			marker = "data-" + marker;
		}
		if(!(/^data\-(([\d]*||top||bottom||center)\-?){1,3}$/.test(marker))) {
			console.log(marker);
			console.error("not valid marker");
			return;
		}
		var transform = new TransformBuilder(),
			anim_string = "";
		for(var prop in animation) {
			switch(prop.toLowerCase()) {
				case "translate":
					transform.translate(animation[prop]);
					break;
				case "scale":
					transform.scale(animation[prop]);
					break;
				case "rotate":
					transform.rotate(animation[prop]);
					break;
				case "rotatex":
					transform.rotateX(animation[prop]);
					break;
				case "rotatey":
					transform.rotateY(animation[prop]);
					break;
				case "rotatez":
					transform.rotateZ(animation[prop]);
					break;
				case "skew":
					transform.skew(animation[prop]);
					break;
				case "translate3d":
					transform.translate3D(animation[prop]);
					break;
				case "scale3d":
					transform.scale3D(animation[prop]);
					break;
				case "easing":
					transform.ease(animation[prop]);
					break;
				default:
					//all other cases eg 'background-color', 'width' etc.
					anim_string += css(prop, animation[prop]);
					break;
			}
		}
		anim_string += transform.finish();
		$(this).attr(marker, anim_string);
	}

	//break down the list of keyframes in to individual keyframe. Needs everything to be aligned
	function addKeyframes(markers, animations) {
		var num_keyframes = markers.length;
		for(var i = 0; i < num_keyframes; i++)
		{
			var marker = markers[i],
				animation = {};
			for(var prop in animations) {
				animation[prop] = animations[prop][i];
			}
			$(this).addKeyframe(marker,animation);
		}
	}

//=========EXPORT AS JQUERY FUN==========

	$.fn.addKeyframe = addKeyframe;
	$.fn.addKeyframes = addKeyframes;

	module.getHelper = getHelper;

	return module;

})(jQuery);
