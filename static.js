/**
 * chrisw@soe.ucsc.edu
 * April 10, 2014
 * Finally decided to keep static methods in a separate js file.
 */

/**
 * Turn serializedJson string into a JSON object.
 */
function parseJson(serializedJson) {
    var deserializedJson = JSON && JSON.parse(serializedJson) || $.parseJSON(serializedJson);
    return deserializedJson;
}

/**
 * Get a pretty JSON.
 */
function prettyJson(object) {
    return JSON.stringify(object, null, '\t');
}

/**
 * From https://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
 * @param {Object} arr
 */
function eliminateDuplicates(arr) {
    var i, len = arr.length, out = [], obj = {};

    for ( i = 0; i < len; i++) {
        obj[arr[i]] = 0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}

/**
 * Get an object with UrlQueryString data.
 */
function getQueryObj() {
    var result = {};
    var keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = decodeURIComponent(keyValuePair[1]) || '';
    });

    return result;
}

/**
 * Get the value of a parameter from the query string.  If parameter has not value or does not exist, return <code>null</code>.
 * From <a href='http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values'>here</a>.
 * @param {Object} name
 */
function getQueryStringParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * querySettings is an object to be stringified into the query string.
 * @param {Object} querySettings
 */
function loadNewSettings(querySettings) {
    var url = window.location.pathname + "?query=" + JSON.stringify(querySettings);
    window.open(url, "_self");
}

/**
 * Create an unattached div element
 */
function createDivElement(divId, divClass) {
    var divTag = document.createElement("div");
    if (divId != null) {
        divTag.id = divId;
    }
    if (divClass != null) {
        divTag.className = divClass;
    }
    return divTag;
}

/**
 * Assumes the parents are divs.
 */
function swapContainingDivs(nodeA, nodeB) {
    var parentA = nodeA.parentNode;
    var parentB = nodeB.parentNode;
    $("#" + nodeA.id).appendTo(parentB);
    $("#" + nodeB.id).appendTo(parentA);
}

function lengthOfLongestString(arrayOfStrings) {
    var lengths = new Array();
    for (var i in arrayOfStrings) {
        lengths.push(arrayOfStrings[i].length);
    }
    var maxLength = Math.max.apply(null, lengths);
    return maxLength;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isNumerical(val) {
    var result = true;
    if (val == null || val === "") {
        return false;
    }

    // As per IEEE-754 spec, a nan checked for equality against itself will be unequal (in other words, nan != nan)
    // ref: http://kineme.net/Discussion/DevelopingCompositions/CheckifnumberNaNjavascriptpatch
    if (isNaN(val)) {
        return false;
    }
    return result;
}

/**
 * get the selected values of a list box control.
 */
function getListBoxSelectedValues(listboxElement) {
    var selectedValues = new Array();
    for (var i = 0; i < listboxElement.length; i++) {
        var option = listboxElement[i];
        if (option.selected) {
            selectedValues.push(option.value);
        }
    }
    return selectedValues;
}

/**
 * Returns SVG path data for a rectangle with rounded bottom corners.
 * The top-left corner is (x,y).
 * @param {Object} x
 * @param {Object} y
 * @param {Object} width
 * @param {Object} height
 * @param {Object} radius
 */
function bottomRoundedRectSvgPath(x, y, width, height, radius) {
    var pathString = '';
    pathString += "M" + x + "," + y;
    pathString += "h" + (width);
    pathString += "v" + (height - radius);
    pathString += "a" + radius + "," + radius + " 0 0 1 " + (-1 * radius) + "," + (radius);
    pathString += "h" + (-1 * (width - 2 * radius));
    pathString += "a" + radius + "," + radius + " 0 0 1 " + (-1 * radius) + "," + (-1 * radius);
    pathString += "v" + (-1 * (height - radius));
    pathString += 'z';
    return pathString;
}

/**
 * Returns SVG path data for a rectangle with all rounded corners.
 * The top-left corner is (x,y).
 * @param {Object} x
 * @param {Object} y
 * @param {Object} width
 * @param {Object} height
 * @param {Object} radius
 */
function allRoundedRectSvgPath(x, y, width, height, radius) {
    var pathString = '';
    pathString += "M" + (x) + "," + (y + radius);
    pathString += "a" + (radius) + "," + (radius) + " 0 0 1 " + (radius) + "," + (-1 * radius);
    pathString += "h" + (width - 2 * radius);
    pathString += "a" + radius + "," + radius + " 0 0 1 " + (radius) + "," + (radius);
    pathString += "v" + (height - 2 * radius);
    pathString += "a" + radius + "," + radius + " 0 0 1 " + (-1 * radius) + "," + (radius);
    pathString += "h" + (-1 * (width - 2 * radius));
    pathString += "a" + radius + "," + radius + " 0 0 1 " + (-1 * radius) + "," + (-1 * radius);
    pathString += "v" + (-1 * (height - 2 * radius));
    pathString += 'z';
    return pathString;
}

/**
 * Returns SVG path data for a rectangle with angled corners.
 * The top-left corner is (x,y).
 * @param {Object} x
 * @param {Object} y
 * @param {Object} width
 * @param {Object} height
 */
function allAngledRectSvgPath(x, y, width, height) {
    // calculated from longer side
    var pad = (width > height) ? width / 8 : height / 8;
    var pathString = '';
    pathString += "M" + (x + pad) + "," + (y);
    pathString += "h" + (width - 2 * pad);
    pathString += 'l' + pad + ',' + pad;
    pathString += "v" + (height - 2 * pad);
    pathString += 'l' + (-1 * pad) + ',' + (pad);
    pathString += "h" + (-1 * (width - 2 * pad));
    pathString += 'l' + (-1 * pad) + ',' + (-1 * pad);
    pathString += "v" + (-1 * (height - 2 * pad));
    pathString += 'z';
    return pathString;
}