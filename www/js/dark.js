var bridge = require("./bridge");
var constant = require("./constant");
var loader = require("./loader");
var utilities = require("./utilities");

function setImageBackgroundsForDarkMode( content ) {
	var img, allImgs = content.querySelectorAll( 'img' );
	for ( var i = 0; i < allImgs.length; i++ ) {
		img = allImgs[i];
		if ( likelyExpectsLightBackground( img ) ) {
			img.style.background = '#fff';
		}
	}
	// and now, look for Math formula images, and invert them
	var mathImgs = content.querySelectorAll( "[class*='math-fallback']" );
	for ( i = 0; i < mathImgs.length; i++ ) {
		var mathImg = mathImgs[i];
		// KitKat and higher can use webkit to invert colors
		if (window.apiLevel >= 19) {
			mathImg.style.cssText = mathImg.style.cssText + ";-webkit-filter: invert(100%);";
		} else {
			// otherwise, just give it a mild background color
			mathImg.style.backgroundColor = "#ccc";
			// and give it a little padding, since the text is right up against the edge.
			mathImg.style.padding = "2px";
		}
	}
}

/**
/ An heuristic for determining whether an element tagged 'img' is likely to need a white background applied
/ (provided a predefined background color is not supplied).
/
/ Based on trial, error and observation, this is likely to be the case when a background color is not
/ explicitly supplied, and:
/
/ (1) The element is in the infobox; or
/ (2) The element is not in a table.  ('img' elements in tables are frequently generated by random
/ 		templates and should not be altered; see, e.g., T85646).
*/
function likelyExpectsLightBackground( element ) {
	return !hasPredefinedBackgroundColor( element ) && ( isInfoboxImage( element ) || isNotInTable( element ) );
}

function hasPredefinedBackgroundColor( element ) {
	return utilities.ancestorHasStyleProperty( element, 'background-color' );
}

function isInfoboxImage( element ) {
	return utilities.ancestorContainsClass( element, 'image' ) && utilities.ancestorContainsClass( element, 'infobox' );
}

function isNotInTable( element ) {
	return !utilities.isNestedInTable( element );
}

function toggle( darkCSSURL, hasPageLoaded ) {
	window.isDarkMode = !window.isDarkMode;

	// Remove the <style> tag if it exists, add it otherwise
	var darkStyle = document.querySelector( "link[href='" + darkCSSURL + "']" );
	if ( darkStyle ) {
		darkStyle.parentElement.removeChild( darkStyle );
	} else {
		loader.addStyleLink( darkCSSURL );
	}

	if ( hasPageLoaded ) {
		// If we are doing this before the page has loaded, no need to swap colors ourselves
		// If we are doing this after, that means the transforms in transformers.js won't run
		// And we have to do this ourselves
		setImageBackgroundsForDarkMode( document.querySelector( '.content' ) );
	}
}

bridge.registerListener( 'toggleDarkMode', function( payload ) {
	toggle( constant.DARK_STYLE_FILENAME, payload.hasPageLoaded );
} );

module.exports = {
	setImageBackgroundsForDarkMode: setImageBackgroundsForDarkMode
};