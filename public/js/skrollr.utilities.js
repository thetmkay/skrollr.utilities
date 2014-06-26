var SkrollrUtilities = (function($) {

	"use strict";

	var module = {};

//===Helper Object to Expose=======

	function getHelper() {

		var helper = {
			_eventHandlers: []
		};

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

		helper.convertHex = function(hex, alpha) {
			var hex_split = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
			if(!alpha) {
				return "rgb(" + parseInt(hex_split[1],16) +"," + parseInt(hex_split[2],16) +"," + parseInt(hex_split[3],16) + ")";
			}
			return "rgba(" + parseInt(hex_split[1],16) +"," + parseInt(hex_split[2],16) +"," + parseInt(hex_split[3],16) +"," + alpha + ")";
		};

		helper.getPos = function(selector) {
			if($(selector).length === 1)
				return Math.floor($(selector).offset().top);
		}

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

	function TransformBuilder() {
		this.trans_string = "transform:";
	}

	TransformBuilder.prototype = {
		rotate: function(rotate_val) {
			this.trans_string += " rotate(" + rotate_val + "deg)";
		},
		scale: function(scalars) {
			this.trans_string += " scale(" + scalars[0] + "," + scalars[1] + ")";
		},
		translate: function(vector) {
			this.trans_string += " translate(" + vector[0] + "px," + vector[1] + "px)";
		},
		"rotateX": function(rotate_val) {
			this.trans_string += " rotateX(" + rotate_val + "deg)";
		},
		finish: function() {

			//check to see if there were any transformations
			if(this.trans_string === "transform:") {
				return "";
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
			if(/^\w+\[\w+\]$/.test(prop)) {
				console.log("easing is true for " + prop);
			}
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
				default:
					anim_string += css(prop, animation[prop]);
					break;
			}
		}
		anim_string += transform.finish();
		$(this).attr(marker, anim_string);
	}


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

//=========EXPORT==========

	$.fn.addKeyframe = addKeyframe;
	$.fn.addKeyframes = addKeyframes;

	module.getHelper = getHelper;

	return module;

})(jQuery);
