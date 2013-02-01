/* MEASURES *******************************************************************
*/

//measures are like molecules of the music in the game
//(I guess the beats are the atoms!)
var MEASURES = {};
MEASURES.defineMeasures = function() {
	var X = 0; //rest for padding

	MEASURES["EMPTY"] = [ X ];

	//general patterns
	MEASURES["BASIC_1"] = [ 1 ];
	MEASURES["BASIC_2"] = [ 1,1 ];
	MEASURES["BASIC_3"] = [ 1,X,1,1 ];
	MEASURES["BASIC_4"] = [ 1,X,X,1 ];
	MEASURES["BASIC_5"] = [ 1,1,1,X ];
	MEASURES["BASIC_6"] = [ 1,X,1,1,1,X,1,X ];
	MEASURES["BASIC_7"] = [ 1,X,1,1,1,X,X,X ];

	//koto patterns
	MEASURES["KOTO_EASY_1"] = [ 1,X,2,2 ];
	MEASURES["KOTO_EASY_2"] = [ 1,2 ];
	MEASURES["KOTO_EASY_3"] = [ 1,1,2,X ];

	MEASURES["KOTO_MEDIUM_1"] = [ 2,1,3,1 ];
	MEASURES["KOTO_MEDIUM_2"] = [ 4,2,3,2 ];
	MEASURES["KOTO_MEDIUM_3"] = [ 1,2,1,2 ];
	MEASURES["KOTO_MEDIUM_4"] = [ 4,2 ];
	MEASURES["KOTO_MEDIUM_5"] = [ 4,3,2,X ];
	MEASURES["KOTO_MEDIUM_6"] = [ 1,1,3,2 ];

	MEASURES["KOTO_HARD_1"] = [ 1,X,3,2 ];
	MEASURES["KOTO_HARD_2"] = [ 1,X,4,2 ];
	MEASURES["KOTO_HARD_3"] = [ 1,X,X,2,3,X,4,X,3,X,X,X, ];
	MEASURES["KOTO_HARD_4"] = [ 2,X,1,X ];

	MEASURES["KOTO_HARD_5"] = [ 1,X,4,3,2,X,1,X ];
	MEASURES["KOTO_HARD_6"] = [ 1,X,3,2,2,X,1,X ];
	MEASURES["KOTO_HARD_7"] = [ 1,X,2,3,4,X,1,X ];
	MEASURES["KOTO_HARD_8"] = [ 1,2,3,2,2,X,1,X ];

	//taiko patterns
	MEASURES["TAIKO_MEDIUM_1"] = [ 1,X,4,1,1,X,4,X ];
	MEASURES["TAIKO_MEDIUM_2"] = [ 1,X,4,1,1,X,4,4 ];
	MEASURES["TAIKO_MEDIUM_3"] = [ 1,X,1,1,4,X,1,X ];
	MEASURES["TAIKO_MEDIUM_4"] = [ 2,X,3,2,4,X,1,X ];

	MEASURES["TAIKO_HARD_1"] = [ 1,X,2,3,3,X,3,X ];
	MEASURES["TAIKO_HARD_2"] = [ 1,X,2,3,1,X,2,3 ];
	MEASURES["TAIKO_HARD_3"] = [ 1,X,2,3,3,X,X,4 ];

	MEASURES["TAIKO_HARD_4"] = [ 1,X,2,1,3,X,4,X ];
	MEASURES["TAIKO_HARD_5"] = [ 1,X,2,1,3,X,4,4 ];
	MEASURES["TAIKO_HARD_6"] = [ 1,X,2,1,1,X,2,1 ];


	MEASURES["TAIKO_HARD_7"] = [ 1,X,1,1,4,X,1,X ];
	MEASURES["TAIKO_HARD_8"] = [ 2,X,3,2,4,X,1,X ];


	//metronome patterns
	MEASURES["BACKING_1"] = [ 1,1,1,1 ];
	MEASURES["BACKING_2"] = [ 1,1,1,1,1,1,1,1 ];
}();

//series of measures to make an entire bar
var BARS = {};
BARS.defineBars = function() {
	BARS["EMPTY"] = [
		"EMPTY",
	];

	BARS["KOTO_EASY_1"] = [
		"KOTO_EASY_2",
		"KOTO_EASY_3",
		"KOTO_EASY_2",
		"BASIC_1",
	];
	BARS["TAIKO_EASY_1"] = [
		"BASIC_1",
		"BASIC_4",
		"BASIC_1",
		"BASIC_3",
	];

	BARS["KOTO_EASY_2"] = [
		"KOTO_EASY_1",
		"KOTO_EASY_1",
		"BASIC_2",
		"BASIC_1",
	];
	BARS["TAIKO_EASY_2"] = [
		"BASIC_1",
		"BASIC_2",
		"BASIC_1",
		"BASIC_3",
	];

	BARS["KOTO_MEDIUM_1"] = [
		"KOTO_MEDIUM_1",
		"KOTO_MEDIUM_2",
		"KOTO_MEDIUM_3",
		"KOTO_EASY_1",
	];
	BARS["TAIKO_MEDIUM_1"] = [
		"TAIKO_MEDIUM_1",
		"TAIKO_MEDIUM_1",
		"TAIKO_MEDIUM_1",
		"TAIKO_MEDIUM_2",
	];

	BARS["KOTO_MEDIUM_2"] = [
		"KOTO_MEDIUM_4",
		"KOTO_MEDIUM_5",
		"KOTO_MEDIUM_6",
		"KOTO_EASY_1",
	];
	BARS["TAIKO_MEDIUM_2"] = [
		"TAIKO_MEDIUM_3",
		"TAIKO_MEDIUM_4",
		"TAIKO_MEDIUM_3",
		"TAIKO_MEDIUM_4",
	];

	BARS["KOTO_HARD_1"] = [
		"KOTO_HARD_1",
		"KOTO_HARD_2",
		"KOTO_HARD_3",
		"KOTO_HARD_4",
	];
	BARS["TAIKO_HARD_1"] = [
		"TAIKO_HARD_1",
		"TAIKO_HARD_1",
		"TAIKO_HARD_2",
		"TAIKO_HARD_3",
	];

	BARS["KOTO_HARD_2"] = [
		"KOTO_HARD_5",
		"KOTO_HARD_6",
		"KOTO_HARD_7",
		"KOTO_HARD_8",
	];
	BARS["TAIKO_HARD_2"] = [
		"TAIKO_HARD_4",
		"TAIKO_HARD_5",
		"TAIKO_HARD_6",
		"TAIKO_HARD_5",
	];

	BARS["TAIKO_HARD_3"] = [
		"TAIKO_HARD_7",
		"TAIKO_HARD_8",
		"TAIKO_HARD_7",
		"TAIKO_HARD_8",
	];
}();

//koto and taiko together
//in an array for sequential iteration of difficulty
var DUETS = [
//	{ koto: BARS["KOTO_HARD_1"], taiko: BARS["TAIKO_HARD_1"] },
//	{ koto: BARS["KOTO_EASY_1"], taiko: BARS["TAIKO_EASY_1"] },
	{ koto: BARS["KOTO_EASY_2"], taiko: BARS["TAIKO_EASY_2"] },
	{ koto: BARS["KOTO_MEDIUM_1"], taiko: BARS["TAIKO_MEDIUM_1"] },
	{ koto: BARS["KOTO_MEDIUM_2"], taiko: BARS["TAIKO_MEDIUM_2"] },
	{ koto: BARS["KOTO_HARD_1"], taiko: BARS["TAIKO_HARD_1"] },
	{ koto: BARS["KOTO_HARD_2"], taiko: BARS["TAIKO_HARD_2"] },
];