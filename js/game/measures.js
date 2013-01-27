/* MEASURES *******************************************************************
*/

var MEASURES = {};

MEASURES.defineMeasures = function() {
	var X = 0; //rest for padding

	MEASURES["EMPTY"] = [ X ];

	//general patterns
	MEASURES["BASIC_1"] = [ 1 ];
	MEASURES["BASIC_2"] = [ 1,1 ];
	MEASURES["BASIC_3"] = [ 1,X,1,1 ];
	MEASURES["BASIC_4"] = [ 1,X,1,1,1,X,1,X ];
	MEASURES["BASIC_5"] = [ 1,1,1,X ];
	MEASURES["BASIC_6"] = [ 1,X,1,1,1,X,X,X ];

	//koto patterns
	MEASURES["KOTO_EASY_1"] = [ 1,X,2,2 ];

	//metronome patterns
	MEASURES["BACKING_1"] = [ 1,1,1,1 ];
	MEASURES["BACKING_2"] = [ 1,1,1,1,1,1,1,1 ];
}();

var BARS = {};

BARS.defineBars = function() {
	BARS["KOTO_1"] = [
		"KOTO_EASY_1",
		"KOTO_EASY_1",
		"BASIC_2",
		"BASIC_1",
	];
	BARS["TAIKO_1"] = [
		"BASIC_1",
		"BASIC_2",
		"BASIC_1",
		"BASIC_3",
	];
}();