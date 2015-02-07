/**
 * chrisw@soe.ucsc.edu
 * April 10, 2014
 * Finally decided to keep static utility methods in a separate js file.
 *
 * Full functionality requires:
 * 1) jStat
 * 2) d3js
 */

/**
 * Functions and vars to be added to this global object.
 */
var utils = {};

(function(u) {
    // console.log('self-executing anonymous function');

    u.htmlNamespaceUri = 'http://www.w3.org/1999/xhtml';

    u.svgNamespaceUri = 'http://www.w3.org/2000/svg';

    // use with "xlink:href" for images in svg as in <http://www.w3.org/Graphics/SVG/WG/wiki/Href>
    u.xlinkUri = "http://www.w3.org/1999/xlink";

    /**
     * Check if an object has the specified property.
     */
    u.hasOwnProperty = function(obj, prop) {
        var proto = obj.__proto__ || obj.constructor.prototype;
        return ( prop in obj) && (!( prop in proto) || proto[prop] !== obj[prop]);
    };

    /**
     * Check if an array contains specified object.
     */
    u.isObjInArray = function(array, obj) {
        var result = false;
        var index = array.indexOf(obj);
        if (index >= 0) {
            result = true;
        }
        return result;
    };

    /**
     * remove from array by value (instead of index)
     */
    u.removeA = function(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while (( ax = arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    };

    /**
     * Get an object's attribute keys in an array.
     * @param {Object} obj
     */
    u.getKeys = function(obj) {
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    };

    /**
     * Only unique and first instance of duplicated elements is returned. Ordering is preserved.
     */
    u.eliminateDuplicates = function(array) {
        var result = [];

        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (u.isObjInArray(result, element)) {
                continue;
            } else {
                result.push(element);
            }
        }
        return result;
    };

    /**
     * Keep items that appear multiple times.  Original order of items is lost.
     */
    u.keepReplicates = function(arr, threshold, keepUniques) {
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
            if ((keepUniques != null) && (keepUniques)) {
                if (counts[value] < threshold) {
                    outList.push(value);
                }
            } else {
                if (counts[value] >= threshold) {
                    outList.push(value);
                }
            }
        }
        return outList;
    };

    u.beginsWith = function(str, prefix) {
        return str.indexOf(prefix) === 0;
    };

    u.endsWith = function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    u.lengthOfLongestString = function(arrayOfStrings) {
        var lengths = new Array();
        for (var i in arrayOfStrings) {
            lengths.push(arrayOfStrings[i].length);
        }
        var maxLength = Math.max.apply(null, lengths);
        return maxLength;
    };

    u.isNumerical = function(val) {
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
    };

    /**
     * get the selected values of a list box control.
     */
    u.getListBoxSelectedValues = function(listboxElement) {
        var selectedValues = new Array();
        for (var i = 0; i < listboxElement.length; i++) {
            var option = listboxElement[i];
            if (option.selected) {
                selectedValues.push(option.value);
            }
        }
        return selectedValues;
    };

    /**
     * linear interpolation
     * @param {Object} percent
     * @param {Object} minVal
     * @param {Object} maxVal
     */
    u.linearInterpolation = function(percent, minVal, maxVal) {
        return ((maxVal - minVal) * percent) + minVal;
    };

    // TODO object conversion

    /**
     * Get an obj without its jQuery wrapping.
     */
    u.extractFromJq = function(jqObj) {
        var jsObj = jqObj.get(0);
        return jsObj;
    };

    /**
     * Wrap an object with jQuery.
     */
    u.convertToJq = function(jsObj) {
        var jqObj = $(jsObj);
        return jsObj;
    };

    /**
     * Get the DOM element from a d3.select()'ed object.
     */
    u.extractFromD3 = function(d3Selection) {
        var domElement = d3Selection.node();
        return domElement;
    };

    /**
     * Convert a DOM element to a d3.selected()'ed object.
     */
    u.convertToD3 = function(domElement) {
        var d3Selection = d3.select(domElement);
        return d3Selection;
    };

    // TODO flexible sort
    /**
     *Sort array of objects by some specified field. Primer specifies a pre-processing to perform on compared value.
     * (from https://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects)
     */
    u.sort_by = function(field, reverse, primer) {
        // function to get value to compare
        var key = primer ? function(elementObj) {
            return primer(elementObj[field]);
        } : function(elementObj) {
            return elementObj[field];
        };

        reverse = [-1, 1][+!!reverse];

        // return comparator function
        return function(a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        };
    };

    // TODO comparator functions

    /**
     *Compare as numbers
     */
    u.compareAsNumeric = function(a, b) {
        var valA = a;
        var valB = b;

        // convert to numbers
        var scoreA = parseFloat(valA);
        var scoreB = parseFloat(valB);

        if (utils.isNumerical(scoreA) && (utils.isNumerical(scoreB))) {
            if (scoreA < scoreB) {
                return -1;
            }
            if (scoreA > scoreB) {
                return 1;
            } else {
                return 0;
            }
        } else {
            // handle non-numericals
            if (scoreA != scoreA && scoreB != scoreB) {
                // both non-numerical, may be nulls
                return 0;
            } else if (scoreA != scoreA) {
                return -1;
            } else if (scoreB != scoreB) {
                return 1;
            }
        }
        // default scoring
        return 0;
    };

    /**
     * Compare as string
     */
    u.compareAsString = function(a, b) {
        var valA = new String(a);
        var valB = new String(b);

        if ((valA == 'null') && (valB != 'null')) {
            return 1;
        } else if ((valA != 'null') && (valB == 'null')) {
            return -1;
        }

        return valA.localeCompare(valB);
    };

    /**
     * Compare as date
     */
    u.compareAsDate = function(a, b) {
        var valA = a;
        var valB = b;

        if (valA == null) {
            valA = '1000';
        } else if (valA == '') {
            valA = '1001';
        }

        if (valB == null) {
            valB = '1000';
        } else if (valB == '') {
            valB = '1001';
        }

        var dateA = new Date(valA);
        var dateB = new Date(valB);

        return (dateA - dateB);
    };

    // TODO color mappers

    /**
     * convert an rgb component to hex value
     * @param {Object} c
     */
    u.rgbComponentToHex = function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    /**
     * convert rgb color code to hex
     * @param {Object} r
     * @param {Object} g
     * @param {Object} b
     */
    u.rgbToHex = function(r, g, b) {
        return "#" + this.rgbComponentToHex(r) + this.rgbComponentToHex(g) + this.rgbComponentToHex(b);
    };

    /**
     * centered RGBa color mapper.  Defaults to significant Z-score range.
     */
    u.centeredRgbaColorMapper = function(log, centerVal, minNegVal, maxPosVal) {
        var mapper = null;

        var centerV = (centerVal == null) ? 0 : centerVal;
        var minNegV = (minNegVal == null) ? -1.96 : minNegVal;
        var maxPosV = (maxPosVal == null) ? 1.96 : maxPosVal;

        mapper = function(val) {
            var a = 1;
            var r = 169;
            var g = 169;
            var b = 169;

            var v = parseFloat(val);

            if ((v == null) || (v != v)) {
                // null or NaN values
            } else if (v > centerV) {
                r = 255;
                g = 0;
                b = 0;
                if (v > maxPosV) {
                    a = 1;
                } else {
                    a = (v - centerV) / (maxPosV - centerV);
                    a = Math.abs(a);
                    if (log) {
                        a = Math.log(a);
                    }
                }
            } else if (v < centerV) {
                r = 0;
                g = 0;
                b = 255;
                if (v < minNegV) {
                    a = 1;
                } else {
                    a = (v - centerV) / (minNegV - centerV);
                    a = Math.abs(a);
                    if (log) {
                        a = Math.log(a);
                    }
                }
            } else {
                r = 255;
                g = 255;
                b = 255;
                a = 1;
            }
            return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        };

        return mapper;
    };

    /**
     * requires D3js
     */
    u.setupQuantileColorMapper = function(allDataValues, palette) {
        // color scale
        var colors = palette;
        if (colors == null) {
            // colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];
            colors = ["rgb(255,255,217)", "rgb(237,248,177)", "rgb(199,233,180)", "rgb(127,205,187)", "rgb(65,182,196)", "rgb(29,145,192)", "rgb(34,94,168)", "rgb(37,52,148)", "rgb(8,29,88)"];
        }
        var buckets = colors.length;
        var colorScale = d3.scale.quantile().domain([0, buckets - 1, d3.max(allDataValues, function(d) {
            return parseFloat(d);
        })]).range(colors);

        return colorScale;
    };

    // TODO XML

    /**
     * Get an XML DOM from an XML file.  Information about DOM at <a href="https://developer.mozilla.org/en-US/docs/Web/API/document">https://developer.mozilla.org/en-US/docs/Web/API/document</a>.
     */
    u.getXmlDom_url = function(url) {
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
        xmlDoc = xmlhttp.responseXML;
        return xmlDoc;
    };

    /**
     * Get an XML DOM from a text string.  Information about DOM at <a href="https://developer.mozilla.org/en-US/docs/Web/API/document">https://developer.mozilla.org/en-US/docs/Web/API/document</a>.
     */
    u.getXmlDom_string = function(txt) {
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(txt, "text/xml");
        } else {// Internet Explorer
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(txt);
        }
        return xmlDoc;
    };

    // TODO date & time

    /**
     * MySQL style date
     */
    u.getDateTime = function() {
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
    };

    /**
     * Date in written style.
     */
    u.todaysDate = function() {
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
    };

    // TODO DOM

    /**
     * Remove an element by ID.
     */
    u.removeElemById = function(id) {
        var elem = document.getElementById(id);
        elem.parentNode.removeChild(elem);
    };

    /**
     * Remove all child elements from parentElem.
     */
    u.removeChildElems = function(parentElem) {
        while (parentElem.firstChild) {
            parentElem.removeChild(parentElem.firstChild);
        }
        return parentElem;
    };

    /**
     * Create an unattached div element
     */
    u.createDivElement = function(divId, divClass) {
        var divTag = document.createElement("div");
        if (divId != null) {
            divTag.id = divId;
        }
        if (divClass != null) {
            divTag.className = divClass;
        }
        return divTag;
    };

    /**
     * set the attributes for the specified element
     */
    u.setElemAttributes = function(element, attributes, namespace) {
        var ns = ( typeof namespace === 'undefined') ? null : namespace;
        if (attributes != null) {
            for (var attribute in attributes) {
                element.setAttributeNS(ns, attribute, attributes[attribute]);
            }
        }
        return element;
    };

    /**
     * Assumes the parents are divs.
     */
    u.swapContainingDivs = function(nodeA, nodeB) {
        var parentA = nodeA.parentNode;
        var parentB = nodeB.parentNode;

        document.getElementById(parentA.id).appendChild(nodeB);
        document.getElementById(parentB.id).appendChild(nodeA);
    };

    // TODO URL and query strings

    /**
     * Simple asynchronous GET.  callbackFunc takes the responseText as parameter.
     */
    u.simpleAsyncGet = function(url, callbackFunc) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            var DONE = this.DONE || 4;
            if (this.readyState === DONE) {
                callbackFunc(request.responseText);
            }
        };
        request.open('GET', url, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        // Tells server that this call is made for ajax purposes.
        // Most libraries like jQuery/Prototype/Dojo do this
        request.send(null);
        // No data needs to be sent along with the request.
    };

    /*
     * Synchronous GET
     */
    u.getResponse = function(url) {
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
    };

    /**
     * querySettings is an object to be stringified into the query string.
     * @param {Object} querySettings
     */
    u.loadNewSettings = function(querySettings) {
        var url = window.location.pathname + "?query=" + JSON.stringify(querySettings);
        window.open(url, "_self");
    };

    /**
     * Get an object with UrlQueryString data.
     */
    u.getQueryObj = function() {
        var result = {};
        var keyValuePairs = location.search.slice(1).split('&');

        keyValuePairs.forEach(function(keyValuePair) {
            keyValuePair = keyValuePair.split('=');
            result[keyValuePair[0]] = decodeURIComponent(keyValuePair[1]) || '';
        });

        return result;
    };

    /**
     * Get the value of a parameter from the query string.  If parameter has not value or does not exist, return <code>null</code>.
     * From <a href='http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values'>here</a>.
     * @param {Object} name
     */
    u.getQueryStringParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    // TODO JSON

    /**
     * Turn serializedJson string into a JSON object.
     */
    u.parseJson = function(serializedJson) {
        var deserializedJson = JSON.parse(serializedJson);
        return deserializedJson;
    };

    /**
     *  serialize an object with option for pretty format
     */
    u.serializeJson = function(object, pretty) {
        if (pretty) {
            return JSON.stringify(object, null, '\t');
        } else {
            return JSON.stringify(object);
        }
    };

    /**
     * Get a pretty JSON.
     */
    u.prettyJson = function(object) {
        return this.serializeJson(object, true);
    };

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
    u.bottomRoundedRectSvgPath = function(x, y, width, height, radius) {
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
    };

    /**
     * Returns SVG path data for a rectangle with all rounded corners.
     * The top-left corner is (x,y).
     * @param {Object} x
     * @param {Object} y
     * @param {Object} width
     * @param {Object} height
     * @param {Object} radius
     */
    u.allRoundedRectSvgPath = function(x, y, width, height, radius) {
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
    };

    /**
     * Returns SVG path data for a rectangle with angled corners.
     * The top-left corner is (x,y).
     * @param {Object} x
     * @param {Object} y
     * @param {Object} width
     * @param {Object} height
     */
    u.allAngledRectSvgPath = function(x, y, width, height) {
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
    };

    // TODO SVG elements

    u.createSvgRingElement = function(cx, cy, r, attributes) {
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

        var e = document.createElementNS(this.svgNamespaceUri, "path");
        e.setAttributeNS(null, "d", arcPath);
        if (attributes != null) {
            for (var attribute in attributes) {
                e.setAttributeNS(null, attribute, attributes[attribute]);
            }
        }
        return e;
    };

    u.createSvgCircleElement = function(cx, cy, r, attributes) {
        var e = document.createElementNS(this.svgNamespaceUri, "circle");
        e.setAttributeNS(null, "cx", cx);
        e.setAttributeNS(null, "cy", cy);
        e.setAttributeNS(null, 'r', r);
        if (attributes != null) {
            for (var attribute in attributes) {
                e.setAttributeNS(null, attribute, attributes[attribute]);
            }
        }
        return e;
    };

    u.createSvgRectElement = function(x, y, rx, ry, width, height, attributes) {
        var e = document.createElementNS(this.svgNamespaceUri, "rect");
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
    };

    u.createSvgImageElement = function(imageUrl, x, y, width, height, attributes) {
        var e = document.createElementNS(this.svgNamespaceUri, "image");
        e.setAttributeNS(this.xlinkUri, "href", imageUrl);
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
    };

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
    u.setCookie = function(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else
            var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    };

    u.getCookie = function(name) {
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
    };

    u.deleteCookie = function(name) {
        this.setCookie(name, "", -1);
    };

    // TODO mutual information for 2 vectors of numbers

    /**
     * normalize a vector. assumes positive numerical values with minimum value 0.
     * @param {Object} vector
     */
    u.getNormalizedVector = function(vector) {
        var normalized = [];
        var min = jStat.min(vector);
        var max = jStat.max(vector);

        if ((min < 0) || (max == 0)) {
            console.log('min:' + min + '\tmax:' + max);
            if (min < 0) {
                return null;
            } else if (max == 0) {
                return vector;
            }
        }

        for (var i = 0; i < vector.length; i++) {
            var newVal = vector[i] / max;
            normalized.push(newVal);
        }

        return normalized;
    };

    /**
     * Marginal entropy for finite sample (H(X)).
     */
    u.computeMarginalEntropy = function(vector, d3histFunc) {
        var sum = 0;
        var counts = [];

        var d3histObj = d3histFunc(vector);

        // counts
        for (var i = 0; i < d3histObj.length; i++) {
            var bin = d3histObj[i];
            var binCount = bin.length;
            counts.push({
                'bin' : i,
                'count' : binCount
            });
        }

        // probability
        for (var i = 0; i < counts.length; i++) {
            var data = counts[i];
            data.probability = data.count / vector.length;
            data.prod = (data.probability == 0 ) ? 0 : (data.probability * Math.log2(data.probability));

            sum = sum + data.prod;
        }

        sum = -1 * sum;
        return sum;
    };

    /**
     * Joint entropy of 2 events (H(X,Y)).
     */
    u.computeJointEntropy = function(vector1, vector2, d3histFunc) {
        if (vector1.length != vector2.length) {
            return null;
        }
        /**
         * Get the bin index of a value in the d3histObj.
         */
        var getBinIndex = function(d3histObj, val) {
            var binIndex = null;
            for (var i = 0; i < d3histObj.length; i++) {
                var bin = d3histObj[i];
                if ((val >= bin.x) && (val < (bin.x + bin.dx))) {
                    binIndex = i;
                    continue;
                }
            }
            if (binIndex == null) {
                var bin = d3histObj[d3histObj.length - 1];
                if (val - bin.x - bin.dx < bin.dx) {
                    binIndex = d3histObj.length - 1;
                }
            }
            return binIndex;
        };

        var hist1 = d3histFunc(vector1);
        var hist2 = d3histFunc(vector2);

        // init frequency table
        var freqTable = {};
        for (var i = 0; i < hist1.length; i++) {
            for (var j = 0; j < hist2.length; j++) {
                var key = i + '_' + j;
                freqTable[key] = 0;
            }
        }

        // fill in frequency table
        // iterate over sample index
        for (var i = 0; i < vector1.length; i++) {
            var xi = vector1[i];
            var binXi = getBinIndex(hist1, xi);

            var yi = vector2[i];
            var binYi = getBinIndex(hist2, yi);

            var key = binXi + '_' + binYi;
            freqTable[key]++;
        }

        // compute sum over table
        var sum = 0;
        var keys = u.getKeys(freqTable);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var probability = freqTable[key] / vector1.length;
            var product = (probability == 0 ) ? 0 : (probability * Math.log2(probability));
            sum = sum + product;
        }

        sum = -1 * sum;
        return sum;
    };

    /**
     * Compute mutual information from empirical entropy.  I(X;Y) = H(X) + H(Y) - H(X,Y)
     * @param {Object} vector1  Vector of numerical values.
     * @param {Object} vector2
     * @param {Object} numBins  Optional parameter to specify number of bins for binning step. Defaults to vector length.
     */
    u.mutualInformation = function(vector1, vector2, numBins) {
        var mi = null;
        var numBins = ( typeof numBins === 'undefined') ? vector1.length : numBins;

        var d3Hist = d3.layout.histogram().bins(numBins).frequency(false);

        var Hx = u.computeMarginalEntropy(vector1, d3Hist);
        var Hy = u.computeMarginalEntropy(vector2, d3Hist);
        var Hxy = u.computeJointEntropy(vector1, vector2, d3Hist);

        // console.log('Hx', Hx);
        // console.log('Hy', Hy);
        // console.log('Hxy', Hxy);

        mi = Hx + Hy - Hxy;
        return mi;
    };

})(utils);

// console.log('utils', utils);
