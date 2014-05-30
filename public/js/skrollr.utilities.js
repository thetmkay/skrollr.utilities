(function($) {

	"use strict";

	function Transform() {
		this.trans_string = "transform:";
	}

	Transform.prototype = {
		rotate: function(rotate_val) {
			this.trans_string += " rotate(" + rotate_val + "deg)";
		},
		scale: function(scalars) {
			this.trans_string += " scale(" + scalars[0] + "," + scalars[1] + ")";
		},
		translate: function(vector) {
			this.trans_string += " translate(" + vector[0] + "px," + vector[1] + "px)";
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

	function hex_to_rgba(hex, alpha) {
		var hex_split = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

		return "rgba(" + parseInt(hex_split[1]) +"," + parseInt(hex_split[2]) +"," + parseInt(hex_split[3]) +"," + alpha + ")";
	}

	function css(attribute,value) {
		return attribute + ":" + value + ";";
	}

	function addKeyframe(marker, animation) {

		//check the marker is valid (allow non data-tagged input)
		if(/^\d*$/.test(marker)) {
			marker = "data-" + marker;
		}
		if(!(/^data\-\d*$/.test(marker))) {
			console.log(marker);
			console.error("not valid marker");
			return;
		}
		var transform = new Transform(),
			anim_string = "";

		for(var prop in animation) {

			switch(prop) {
				case "translate":
					transform.translate(animation[prop]);
					break;
				case "scale":
					transform.scale(animation[prop]);
					break;
				case "rotate":
					transform.rotate(animation[prop]);
					break;
				default:
					anim_string += css(prop, animation[prop]);
					break;
			}
		}
		anim_string += transform.finish();
		$(this).attr(marker, anim_string);
	}

	$.fn.addKeyframe = addKeyframe;

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

	$.fn.addKeyframes = addKeyframes;
})(jQuery);
