skrollr.utilities
=================

A small JS file to help use Skrollr. Removes the need to put inline HTML in order to use Skrollr, as well as helping with other features and quirks of Skrollr.

## Dependencies

* JQuery (find, height, attr, fn, offset)

## Usage

```html
<script src='path_to_directory/skrollr.utilities.js'></script>
```

skrollr.utilities is a IIFE (Immediately Invoking Function Expression) that does three things:

1. adds the ability to call addKeyframe() to a JQuery element
2. adds the ability to call addKeyframes() to a JQuery element
3. exposes an object called SkrollrUtilities

### addKeyframe(marker,animation)

Add a skrollr keyframe at the specified marker to an element with the specified CSS animation properties.

*returns* undefined

##### marker - *number* | *string*

The scroll height that marks the key frame. **skrollr.utilities currently only supports absolute positioning in pixels**. Can be the pixel value, or optionally prefixed by `data-`

##### animation - *object*

An object containing the CSS properties that will hold true at this keyframe. Transformations can be defined individually and have special markup, whereas any other property will simply be added as `property`:`value` and accepts strings. *Remember that skrollr only accepts values that can be interpolated, eg all colors have to be defined in `rgb()` or `hsl()` syntax.*

For example:

```javascript
$('#example').addKeyframes(500, {
    translate: [0,0],
    scale:[1,1],
    rotate:0,
		'background-color': 'rgb(0,0,0)',
		width: '100%'
	});
```

For the transformations, please only add *unit-less* values, and for translate and scale, the values should *array xy-pairs*, as in [x,y]. The unit for `rotate` is `deg` and the unit for `translate` is `px`.

####

### addKeyframes(markers,animations)

Add a series of skrollr keyframes to an element.

*returns* undefined

##### markers - *array* (of *number* | *string*)

A list of the markers for each keyframe. Although it does not have to be in a specific order, the order of this array has to match the order in which you define the animation properties. **skrollr.utilities currently only supports absolute positioning in pixels**. Can be the pixel value, or optionally prefixed by `data-`.

##### animations - *object*

An object containing the CSS properties and their values at each keyframe. Each property should be given an array of their value at each keyframe. *Please do not leave out any keyframe values, even if the value of the property does not change at that keyframe.* The array for each property has to match, in order and magnitude, the order of the `markers` parameter.

Transformations can be defined individually and have special markup, whereas any other property will simply be added as `property`:`value` and accepts strings. *Remember that skrollr only accepts values that can be interpolated, eg all colors have to be defined in `rgb()` or `hsl()` syntax.*

For example:

```javascript
$('#example').addKeyframes([500, 'data-800'], {
    translate: [[0,0],[10,10]],
    scale:[[1,1],[2,2]],
    rotate:[0,90],
		'background-color': ['rgb(0,0,0)','rgb(255,255,255)',
		width: ['100%','50%']
	});
```

For the transformations, please only add *unit-less* values, and for translate and scale, the values should *array xy-pairs*, as in [x,y].

#### SkrollrUtilities

SkrollrUtilities is a global object exposed by skrollr.utilities that only has one function, `getHelper`, which returns a helper object.

The SkrollrUtilities helper has the following useful functions:

#### addUnits(array,unit)

Suffix every value in an array with a unit, if the value doesn't already have one

*returns* array

##### array

An array of values to suffix

##### unit

The string to suffix

Example:

```javascript
var helper = SkrollrUtilities.getHelper();
console.log(helper.addUnits(["100px",200],"px"));
//prints out: [100px,200px]
```

#### convertHex(hex, alpha)

Converts a hex color string and optionally opacity in to rgb or rgba() form.

*returns* string

##### hex

A hex color string in the form "#AAAAAA" or "AAAAAA" (case insensitive).

##### alpha

Optional value. If defined, will return rgba with this value appropriately included

Example:

```javascript
var helper = SkrollrUtilities.getHelper();
console.log(helper.convertHex("#FF0000", 1);
//prints out: rgba(255,0,0,1)
```

#### getPos(selector)

Gets the truncated offset (using JQuery) of the selected element.

*returns* number

##### selector

A CSS selector string, as seen in JQuery. Note that if the element doesn't exist, or multiple elements exist, it will not return `undefined`.

Example:

```javascript
var helper = SkrollrUtilities.getHelper();
console.log(helper.getPos('#element'));
//prints out: 304
```

###Keyframe Event Handling

Currently, Skrollr has an *experimental* feature which allows users to bind handlers to keyframe events. To support this feature, the helper function has two additional methods. In order to use it properly, you **must** initialize skrollr with the keyframe property defined in the `keyframeHandlerFn` documentation (see below).

#### onKeyframeEvent(element, marker, handler)

Adds the handler to the keyframe event (when a keyframe is activated) as administered by skrollr. Will add the correct HTML markup if not already defined (ie add the `data-emit-events` attribute to the element).

*returns* number

##### element

The DOM or JQuery element the event handler is to be binded to.

##### marker

The string marker. Has to be in the form `data-pos` where pos is the number of pixels from the top of the document (eg `data-500`). Should align with an existing keyframe marker defined on the element.

##### handler

The function to call every time the event is triggered. The function will be passed in the values (`element`,`name`,`direction`), where element is the DOM element, name is the marker, and direction is `up` or `down`, the direction the user was scrolling when the event triggered.

Example:

```javascript
var helper = SkrollrUtilities.getHelper();
helper.onKeyframeEvent($('#example'), 'data-500', function(element, name, direction) {
  console.log(direction);
});
//prints out when triggered: down
```

##### keyframeHandlerFn

The handler function that SkrollrUtilities builds for you to attach to skrollr. In order for this to work properly, you must initialize skrollr using this function and the `keyframe` property, *after* you have added all of your keyframe event bindings using `onKeyframeEvent`.

```javascript
var helper = SkrollrUtilities.getHelper();
helper.onKeyframeEvent($('#example'), 'data-500', function(element, name, direction) {
  console.log(direction);
});

skrollr.init({
//optionally add other properties
keyframe: helper.keyframeHandlerFn
});
```

## Testing

Nothing yet!!!

## Version History

* 30/05/14 - 0.0.0 (untagged) - initial alpha release 

## Contributors

* thetmkay
