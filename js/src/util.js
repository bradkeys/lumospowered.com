// Make it safe to use console.log.
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

function getTimeSince(date1, date2) {
   // 1 day in milliseconds
   var one_day = 1000 * 60 * 60 * 24;

   // Convert both dates to milliseconds
   var date1_ms = date1.getTime();
   var date2_ms = date2.getTime();

   // Calculate the difference in milliseconds
   var difference_ms = date2_ms - date1_ms;

   // Convert to seconds
   difference_ms = difference_ms/1000;

   var seconds = Math.floor(difference_ms % 60);
   difference_ms = difference_ms/60;

   var minutes = Math.floor(difference_ms % 60);
   difference_ms = difference_ms/60;

   var hours = Math.floor(difference_ms % 24);
   var days = Math.floor(difference_ms/24);

   var number;
   var period;

   if (days > 0) {
       number = days;
       period = ' day';
   } else if (hours > 0) {
       number = hours;
       period = ' hour';
   } else if (minutes > 0) {
       number = minutes;
       period = ' minute';
   } else {
       number = seconds;
       period = ' second';
   }

   var formatted_date = number + period + (number == 1 ? '' : 's') + ' ago';
   return formatted_date;
}

function timeSinceNow(date) {
     var now = new Date();
     var diff = getTimeSince(date, now);
     return diff;
}

// Converts an integer UNIX timestamp (e.g. 1371655785) to a relative time.
function unixTimeToRelative(timestamp) {
	if (timestamp == null) {
		return '';
	}

	var date = new Date(timestamp * 1000); // convert to milliseconds
	var diff = timeSinceNow(date);
	return diff;
}

// Create a GET parameter query string.
// From http://stackoverflow.com/questions/111529/create-query-parameters-in-javascript
function encodeQueryData(data) {
	var queryElements = [];

	for (var d in data) {
		queryElements.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
	}

	return queryElements.join('&');
}

// Rounds a float
function round(num) {
    if (num === '' || num === null || num === undefined) {
        return num;
    }

    var rounded = Number(num.toFixed(3));
	return rounded;
}

// Converts a 'YY-MM-DD' date stamp to a Date object.
function isoToDate(str) {
	var date = str.split('-');
	var d = new Date(date[0], date[1] - 1, date[2]);
	return Date.UTC(date[0], date[1] - 1, date[2]);
}

// Retrieves the next page link from a Link HTTP header.
function urlFromLinkHeader(linkHeader) {
	var url = linkHeader.match(/\<(.*?)\>/)[1];
	return url;
}

// Merges a list of arrays into a single array.
function combineArrays(arrays) {
	var combined = [];

	for (var i = 0; i < arrays.length; i++) {
		combined = combined.concat(arrays[i]);
	}

	return combined;
}

// Adds classes to a JSON string so that it can be syntax highlighted.
// http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
