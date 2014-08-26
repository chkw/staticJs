/**
 * chrisw@soe.ucsc.edu
 * April 10, 2014
 * Finally decided to keep static methods in a separate js file.
 */

/**
 * Get an object's attribute keys.
 * @param {Object} obj
 */
function getKeys(obj) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys;
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
 * Keep items that appear multiple times.  Original order of items is lost.
 */
function keepReplicates(arr, threshold) {
    var counts = {};
    // tally counts
    for (var i = 0; i < arr.length; i++) {
        var value = arr[i];
        if ( value in counts) {
        } else {
            counts[value] = 0;
        }
        counts[value]++;
    }
    // apply threshold
    threshold = (threshold == null) ? 2 : threshold;
    var outList = [];
    for (var value in counts) {
        if (counts[value] >= threshold) {
            outList.push(value);
        }
    }
    return outList;
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

// TODO date & time

/**
 * MySQL style date
 */
function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        var month = '0' + month;
    }
    if (day.toString().length == 1) {
        var day = '0' + day;
    }
    if (hour.toString().length == 1) {
        var hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        var minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        var second = '0' + second;
    }
    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
}

/**
 * Date in written style.
 */
function todaysDate() {
    var months = new Array();
    months[1] = "January";
    months[2] = "February";
    months[3] = "March";
    months[4] = "April";
    months[5] = "May";
    months[6] = "June";
    months[7] = "July";
    months[8] = "August";
    months[9] = "September";
    months[10] = "October";
    months[11] = "November";
    months[12] = "December";
    var todaysdate = new Date();
    var date = todaysdate.getDate();
    var day = todaysdate.getDay() + 1;
    var month = todaysdate.getMonth() + 1;
    var yy = todaysdate.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;
    var year2 = year - (2000 * 1);
    year2 = (year2 < 10) ? "0" + year2 : year2;
    return (months[month] + " " + date + ", " + year);
}

// TODO DOM

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

// TODO URL and query strings

/*
 * Synchronous GET
 */
function getResponse(url) {
    var status = null;
    var xhr = null;
    xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function() {
        status = xhr.status;
        if (status != 200) {
            console.log("xhr status: " + status + " for " + url);
        }
    };
    xhr.send(null);
    var response = null;
    if (status == 200) {
        response = xhr.responseText;
    }
    return response;
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

// TODO JSON

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

// TODO SVG paths

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

// TODO SVG elements

function createSvgRingElement(cx, cy, r, attributes) {
    // https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    // (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x : centerX + (radius * Math.cos(angleInRadians)),
            y : centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);
        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
        var d = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y].join(" ");
        return d;
    }

    // TODO somehow the circle becomes invisible if using 0 to 360 degrees
    var arcPath = describeArc(cx, cy, r, 0, 359.9);

    var e = document.createElementNS(svgNamespaceUri, "path");
    e.setAttributeNS(null, "d", arcPath);
    if (attributes != null) {
        for (var attribute in attributes) {
            e.setAttributeNS(null, attribute, attributes[attribute]);
        }
    }
    return e;
}

function createSvgCircleElement(cx, cy, r, attributes) {
    var e = document.createElementNS(svgNamespaceUri, "circle");
    e.setAttributeNS(null, "cx", cx);
    e.setAttributeNS(null, "cy", cy);
    e.setAttributeNS(null, 'r', r);
    if (attributes != null) {
        for (var attribute in attributes) {
            e.setAttributeNS(null, attribute, attributes[attribute]);
        }
    }
    return e;
}

function createSvgRectElement(x, y, rx, ry, width, height, attributes) {
    var e = document.createElementNS(svgNamespaceUri, "rect");
    e.setAttributeNS(null, "x", x);
    e.setAttributeNS(null, "y", y);
    e.setAttributeNS(null, "rx", rx);
    e.setAttributeNS(null, "ry", ry);
    e.setAttributeNS(null, "width", width);
    e.setAttributeNS(null, "height", height);
    if (attributes != null) {
        for (var attribute in attributes) {
            e.setAttributeNS(null, attribute, attributes[attribute]);
        }
    }
    return e;
}

function createSvgImageElement(imageUrl, x, y, width, height, attributes) {
    var e = document.createElementNS(svgNamespaceUri, "image");
    e.setAttributeNS(xlinkUri, "href", imageUrl);
    e.setAttributeNS(null, "x", x);
    e.setAttributeNS(null, "y", y);
    e.setAttributeNS(null, "width", width);
    e.setAttributeNS(null, "height", height);
    if (attributes != null) {
        for (var attribute in attributes) {
            e.setAttributeNS(null, attribute, attributes[attribute]);
        }
    }
    return e;
}

// TODO cookies

/**
 * Cookie methods taken from:
 * <ul>
 * <li>http://jquery-howto.blogspot.com/2010/09/jquery-cookies-getsetdelete-plugin.html
 * </li>
 * <li>http://www.quirksmode.org/js/cookies.html
 * </li>
 * </ul>
 * @param {Object} name
 * @param {Object} value
 * @param {Object} days
 */
function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else
        var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
        c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name, "", -1);
}