(function($) {

	'use strict';

	var util = SkrollrUtilities.getHelper(),
		one = util.getPos(".page-three"),
		two = util.getPos(".page-four");

	$('#test').addKeyframes(["data-10p-top", "data-1p-center"], {
		'background-color[quadratic]': [util.convertHex("FF0000"),util.convertHex("0000FF")],
		'rotateY':[0,90],
		'scale3d':[[1,1,1],[2,2,2]],
		'translate3d':[[0,0,0],[50,50,50]],
		'easing': ['quadratic','quadratic']
	});

	util.onKeyframeEvent($("#test"), "data-10p-top", function() {
		console.log("Red");
	});

	util.onKeyframeEvent($("#test"), "data-center-center", function() {
		console.log("Blue");
	});

	var s = skrollr.init({
		forceHeight: false,
		keyframe: util.keyframeHandlerFn
	});

})(jQuery, skrollr, SkrollrUtilities);
