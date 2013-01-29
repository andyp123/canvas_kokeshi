function BeatInfo() {
	this.status = BeatInfo.STATUS_READY;
	this.id = 0;			//beat id (0 is rest)
	this.frame = 0;			//frame to draw
	this.time = 0.0;		//time on timeline
	this.measureIndex = 0;	//index of measure it's in
	this.beatIndex = 0;		//index of beat in measure
}

BeatInfo.STATUS_READY = 0;
BeatInfo.STATUS_MISSED = 4;
BeatInfo.STATUS_HIT = 8;

function Timeline(posX, posY, beatSprite) {
	this.measures = []; //TODO: REMOVE THIS
	this.beatInfos = []; //same dimensions as measures, but stores detailed info about the beats
	this.measureIndex = 0;
	this.nearestBeat = null;

	//if this is set to true, the timeline will play the measure
	this.autoplay = false;

	//timing
	this.time = 0.0;
	this.timePrev = 0.0;
	this.tempo = 0.5;
	this.errorTolerance = 0.2;

	//renderable stuff
	this.beatSprite = beatSprite;
	posX = posX || 0;
	posY = posY || 0;
	this.pos = new Vector2(posX, posY);
	this.measureScale = 1.0;
	this.measureWidth = 96;
	this.measureShift = 8;
	this.barHeight = 32;

	//set this to have autoplay use these sounds
	this.sounds = null;
	//controls for the player
	this.controls = [];
}

Timeline.prototype.clearMeasures = function() {
	this.measures = [];
	this.beatInfos = [];
}

Timeline.prototype.resetBeatInfos = function() {
	var i, j;
	for (i = 0; i < this.beatInfos.length; ++i) {
		var beatInfos = this.beatInfos[i];
		for (j = 0; j < beatInfos.length; ++j) {
			beatInfos[j].status = BeatInfo.STATUS_READY;
		}
	}
}

Timeline.prototype.addMeasure = function(measureName) {
	var measure = MEASURES[measureName];
	if (measure !== undefined) {
		//extract the measure into more useable BeatInfo form
		var beatInfos = [];
		var measureStartTime = this.measures.length;
		for (var i = 0; i < measure.length; ++i) {
			if (measure[i] > 0) {
				var beatInfo = new BeatInfo();
				beatInfo.id = measure[i];
				beatInfo.frame = measure[i] - 1;
				beatInfo.time = measureStartTime + i / measure.length;
				beatInfo.measureIndex = this.measures.length;
				beatInfo.beatIndex = i;
				beatInfos[i] = beatInfo;
			}
		}

		this.measures.push(measure);
		this.beatInfos.push(beatInfos);

		this.getNearestBeatToCurrentTime();
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
			this.resetBeatInfos();
		}
		this.measureIndex = Math.floor(this.time);

		//update the nearestBeatInfo and check we haven't missed the beat
		var nearestBeatPrev = this.nearestBeat;
		this.nearestBeat = this.getNearestBeatToCurrentTime();

		//check to see if we hit the current beat
		if (this.nearestBeat) {
			if (this.nearestBeat.status == BeatInfo.STATUS_READY) {
				if (this.autoplay && this.beatAtCurrentTime()) {
					this.nearestBeat.status = BeatInfo.STATUS_HIT;
					g_SOUNDMANAGER.playSound(this.sounds[this.nearestBeat.id - 1]);
				} else if (this.checkInput(this.controls)) {
					this.nearestBeat.status = BeatInfo.STATUS_HIT;
				} else if (nearestBeatPrev) {
					if (nearestBeatPrev !== this.nearestBeat && nearestBeatPrev.status == BeatInfo.STATUS_READY) {
						nearestBeatPrev.status = BeatInfo.STATUS_MISSED;
					}
				}
			}
		}
	}
}

Timeline.prototype.checkInput = function(controls) {
	var keyid = controls[this.nearestBeat.id - 1]
	if (this.nearestBeat && keyid !== undefined && g_KEYSTATES.justPressed(keyid)) {
		if (Math.abs(this.time - this.nearestBeat.time) <= this.errorTolerance * this.tempo) {
			return true;
		}
	}

	return false;
}

//-------------------------//
// TIME CHECKING FUNCTIONS //
//-------------------------//
Timeline.prototype.getNearestBeatToCurrentTime = function() {
	var i, j;
	var nearest = null;
	for (i = 0; i < this.beatInfos.length; ++i) {
		var beatInfos = this.beatInfos[i];
		for (j = 0; j < beatInfos.length; ++j) {
			var beat = beatInfos[j];
			if (nearest && Math.abs(this.time - beat.time) > Math.abs(this.time - nearest.time)) {
				break;
			}
			nearest = beat;
		}
	}

	return nearest;
}

//get the id of the nearest beat to the start of this time range
//returns -1 if no beats are found. 0 is a rest
Timeline.prototype.getBeatInTimeRange = function(start, end) {
	var measure = this.measures[this.measureIndex];
	var measureTime = end % this.measures.length - Math.floor(end);
	var measureTimePrev = start % this.measures.length - Math.floor(start);

	var nearestBeatIndex = Math.floor(measureTime * measure.length);
	var nearestBeatTime = nearestBeatIndex / measure.length;
	var beatType = measure[nearestBeatIndex];

	if ((nearestBeatIndex == 0 && measureTimePrev > measureTime )
	 || (measureTimePrev <= nearestBeatTime && measureTime > nearestBeatTime)) {
		return beatType;
	}

	return -1;
}

//gets the beat id at the current time, with allowance for error
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

Timeline.prototype.beatAtCurrentTime = function() {
	if (this.nearestBeat) {
		if ((this.timePrev <= this.nearestBeat.time && this.time > this.nearestBeat.time)
		 || (this.nearestBeat.time < this.time && this.timePrev > this.time)) { //time wrapped
			return true;
		}
	}

	return false;
}

Timeline.prototype.toggleAutoplay = function() {
	this.autoplay = !this.autoplay;
}

//----------------//
// DRAW FUNCTIONS //
//----------------//
Timeline.prototype.draw = function(ctx, xofs, yofs) {
	//draw bars
	ctx.strokeStyle = "rgb(64,64,64)";
	for (i = 0; i < this.measures.length; ++i) {
		x = this.pos.x + xofs + i * this.measureWidth;
		y = this.pos.y + yofs
		Util.drawLine(ctx, x, y, x, y + this.barHeight);
	}

	//draw current time
	ctx.strokeStyle = "rgb(255,255,255)";
	x = this.pos.x + xofs + Math.floor(this.time / this.measures.length * (this.measureWidth * this.measures.length));
	y = this.pos.y + yofs;
	Util.drawLine(ctx, x, y, x, y + this.barHeight);

	var i, j;
	var y = this.pos.y + this.barHeight * 0.5 + yofs;
	for (i = 0; i < this.measures.length; ++i) {
		var beatInfos = this.beatInfos[i];
		for (j = 0; j < beatInfos.length; ++j) {
			var beat = beatInfos[j];
			var frame = beat.frame;
			var x = this.pos.x + xofs + beat.time * this.measureWidth;
			this.beatSprite.draw(ctx, x, y, frame + beat.status);
		}
	}
}

Timeline.prototype.drawDebugMeasure = function(ctx, xofs, yofs, measure) {
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

Timeline.prototype.drawDebug = function(ctx, xofs, yofs) {
	if (this.measures.length < 1) return;

	var i, x, y;

	//draw bars
	for (i = 0; i < this.measures.length; ++i) {
		x = this.pos.x + xofs + i * this.measureWidth;
		y = this.pos.y + yofs
		Util.drawLine(ctx, x, y, x, y + this.barHeight);
	}

	//draw current time
	x = this.pos.x + xofs + Math.floor(this.time / this.measures.length * (this.measureWidth * this.measures.length));
	y = this.pos.y + yofs;
	Util.drawLine(ctx, x, y, x, y + this.barHeight);

	//draw measures
	for (i = 0; i < this.measures.length; ++i) {
		measureOffset = i * this.measureWidth;
		this.drawDebugMeasure(ctx, measureOffset + this.pos.x + xofs, this.pos.y + yofs, this.measures[i]);
	}

	//draw outline
	Util.drawRectangle(ctx, this.pos.x + xofs, this.pos.y + yofs, this.measureWidth * this.measures.length, this.barHeight);
}

Timeline.prototype.addDrawCall = function() {
	g_RENDERLIST.addObject(this, 0, 0, false);
}