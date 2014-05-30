(function($) {

	'use strict';

	var util = SkrollrUtilities.getHelper(),
		one = util.getPos(".page-three"),
		two = util.getPos(".page-four");

	$('#test').addKeyframes([one, two], {
		'background-color': [util.convertHex("FF0000"),util.convertHex("0000FF")]
	});

	util.onKeyframeEvent($("#test"), "data-" + one, function() {
		console.log("Red");
	});

	util.onKeyframeEvent($("#test"), "data-" + two, function() {
		console.log("Blue");
	});

	var s = skrollr.init({
		forceHeight: false,
		keyframe: util.keyframeHandlerFn
	});

})(jQuery, skrollr, SkrollrUtilities);
