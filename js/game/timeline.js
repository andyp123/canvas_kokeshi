var MEASURES = {};

MEASURES.defineMeasures = function() {
	var X = 0; //rest for padding

	MEASURES["EMPTY"] = [ X ];
	MEASURES["BASIC_1"] = [ 1 ];
	MEASURES["BASIC_2"] = [ 1,1 ];
	MEASURES["BASIC_3"] = [ 1,X,1,1 ];
	MEASURES["BASIC_4"] = [ 1,X,1,1,1,X,1,X ];
	MEASURES["BASIC_5"] = [ 1,1,1,X ];
	MEASURES["BASIC_6"] = [ 1,X,1,1,1,X,X,X ];

	MEASURES["BACKING"] = [ 2,2,2,2 ];
}();


function BeatInfo() {
	this.type = 0;
	this.time = 0.0;
	this.index = 0;
	this.measureIndex = 0;
}

function Timeline(posX, posY) {
	var m = MEASURES;
	this.measures = [];
	this.measureIndex = 0;

	//if this is set to true, the timeline will play the measure
	this.autoplay = false;

	//timing
	this.time = 0.0;
	this.timePrev = 0.0;
	this.tempo = 0.5;

	//information about current beat
	this.beatInfo = new BeatInfo();

	//renderable stuff
	posX = posX || 0;
	posY = posY || 0;
	this.pos = new Vector2(posX, posY);
	this.measureScale = 1.0;
	this.measureWidth = 96;
	this.measureShift = 8;
	this.barHeight = 32;

	//set this to have autoplay use these sounds
	this.sounds = null;
}

Timeline.prototype.clearMeasures = function() {
	this.measures = [];
}

Timeline.prototype.addMeasure = function(measureName) {
	var measure = MEASURES[measureName];
	if (measure !== undefined) {
		this.measures.push(measure);
	} else {
		console.log("ERROR: measure with name " + measureName + " does not exist.");
	}
}

Timeline.prototype.addMeasures = function(measureNames) {
	for (var i = 0; i < measureNames.length; ++i) {
		this.addMeasure(measureNames[i]);
	}
}

Timeline.prototype.update = function() {
	if (this.measures.length > 0) {
		this.timePrev = this.time;
		this.time += g_FRAMETIME_S * this.tempo;
		if (this.time > this.measures.length) { 
			this.time = this.time % this.measures.length;
		}
		this.measureIndex = Math.floor(this.time);

		if (this.autoplay) {
			this.playAtCurrentTime();
		}
	}
}

//get the id of the nearest beat to the start of this time range
//returns -1 if no beats are found. 0 is a rest
Timeline.prototype.getBeatInTimeRange = function(start, end, beatInfo) {
	var measure = this.measures[this.measureIndex];
	var measureTime = end % this.measures.length - Math.floor(end);
	var measureTimePrev = start % this.measures.length - Math.floor(start);

	var nearestBeatIndex = Math.floor(measureTime * measure.length);
	var nearestBeatTime = nearestBeatIndex / measure.length;
	var beatType = measure[nearestBeatIndex];

	if (beatInfo !== undefined) {
		beatInfo.type = beat;
		beatInfo.time = nearestBeatTime;
		beatInfo.measureIndex = this.measureIndex;
		beatInfo.beatIndex = nearestBeatIndex;
	}

	if ((nearestBeatIndex == 0 && measureTimePrev > measureTime )
	 || (measureTimePrev <= nearestBeatTime && measureTime > nearestBeatTime)) {
		return beatType;
	}

	if (beatInfo !== undefined) {
		beatInfo.type = -1;
	}

	return -1;
}

//geets the beat id at the current time, with allowance for error
//error is in seconds and scaled by the tempo
Timeline.prototype.getBeatAtCurrentTimeWithError = function(error) {
	error = error || 0;
	error *= this.tempo;
	var time1 = Math.abs((this.timePrev - error) % this.measures.length);
	var time2 = Math.abs((this.time + error) % this.measures.length);
	return this.getBeatInTimeRange(time1, time2);
}

Timeline.prototype.getBeatAtCurrentTime = function() {
	return this.getBeatInTimeRange(this.timePrev, this.time);
}

Timeline.prototype.playAtCurrentTime = function() {
	var beat = this.getBeatInTimeRange(this.timePrev, this.time);
	if (this.sounds && beat > 0 && beat <= this.sounds.length) {
		g_SOUNDMANAGER.playSound(this.sounds[beat - 1]);
	}
}

Timeline.prototype.toggleAutoplay = function() {
	this.autoplay = !this.autoplay;
}

//----------------//
// DRAW FUNCTIONS //
//----------------//
Timeline.prototype.drawMeasure = function(ctx, xofs, yofs, measure) {
	if (measure.length > 0) {
		var beatWidth = this.measureWidth / measure.length;

		var x, y, i;
		x = xofs;
		y = yofs + Math.floor(this.barHeight * 0.5);
		for (i = 0; i < measure.length; ++i) {
			if (measure[i] > 0) {
				Util.drawRectangleCentered(ctx, x, y, 8, 8);
			}
			x += beatWidth;
		}
	}
}

Timeline.prototype.draw = function(ctx, xofs, yofs) {
	this.drawDebug(ctx, xofs, yofs);
}

Timeline.prototype.drawDebug = function(ctx, xofs, yofs) {
	if (this.measures.length < 1) return;

	var i, x, y;

	//draw current time
	ctx.strokeStyle = "rgb(0,255,0)";
	x = this.pos.x + xofs + Math.floor(this.time / this.measures.length * (this.measureWidth * this.measures.length));
	y = this.pos.y + yofs;
	//console.log("time: " + x + "," + y);
	Util.drawLine(ctx, x, y, x, y + this.barHeight);

	//draw current measure
	var measureOffset = this.measureIndex * this.measureWidth;
	this.drawMeasure(ctx, measureOffset + this.pos.x + xofs, this.pos.y + yofs, this.measures[this.measureIndex]);

	//draw other measures
	ctx.strokeStyle = "rgb(192,192,192)";
	for (i = 0; i < this.measures.length; ++i) {
		if (i != this.measureIndex) {
			measureOffset = i * this.measureWidth;
			this.drawMeasure(ctx, measureOffset + this.pos.x + xofs, this.pos.y + yofs, this.measures[i]);
		}
	}

	//draw bars
	ctx.strokeStyle = "rgb(64,128,64)";
	for (i = 0; i < this.measures.length; ++i) {
		x = this.pos.x + xofs + (i + 1) * this.measureWidth;
		y = this.pos.y + yofs
		Util.drawLine(ctx, x, y, x, y + this.barHeight);
	}

	//draw outline
	ctx.strokeStyle = "rgb(255,255,255)";
	//Util.drawRectangle(ctx, this.pos.x, this.pos.y, this.measureWidth * this.measures.length, this.barHeight);
}

Timeline.prototype.addDrawCall = function() {
	g_RENDERLIST.addObject(this, 0, 0, false);
}