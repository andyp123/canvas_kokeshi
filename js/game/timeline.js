/* BEAT INFO ******************************************************************
*/
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


/* TIMELINE *******************************************************************
*/
function Timeline(posX, posY, beatSprite) {
	this.beats = [];
	this.measureCount = 0; //this is equal to the end time. 1 measure = 1 second
	this.hitBeats = 0; //how many beats the player hit
	this.bumNotes = 0;
	this.bumNoteLimit = 3; //if the player hits this many bum notes, they fail and the bar resets
	this.barClear = Timeline.BARCLEAR_NOT; //set to true if all beats hit has been detected already
	this.firstBeatEarly = false; //set to true when player hits first beat before the bar has finished playing

	//if this is set to true, the timeline will play the measure
	this.autoplay = false;
	this.paused = true;

	//timing
	this.time = 0.0;
	this.timePrev = 0.0;
	this.tempo = 0.5;
	this.errorTolerance = 0.33;

	//renderable stuff
	this.beatSprite = beatSprite;
	posX = posX || 0;
	posY = posY || 0;
	this.pos = new Vector2(posX, posY);
	this.measureScale = 1.0;
	this.measureWidth = 96;
	this.measureShift = 8;
	this.barHeight = 32;

	this.sounds = []; //set this to have autoplay use these sounds
	this.controls = []; //controls for the player
}

//full clear and empty data
Timeline.prototype.clear = function() {
	this.hitBeats = 0;
	this.bumNotes = 0;
	this.barClear = Timeline.BARCLEAR_NOT;
	this.firstBeatEarly = false;

	this.beats = [];
	this.measureCount = 0;

	this.time = 0;
	this.timePrev = 0.0;
	this.tempo = 0.5;

	this.autoplay = false;
	this.paused = true;
}

Timeline.BARCLEAR_NOT = 0;
Timeline.BARCLEAR_UNDETECTED = 1;
Timeline.BARCLEAR_DETECTED = 2;

Timeline.prototype.isClear = function() {
	return this.barClear == Timeline.BARCLEAR_UNDETECTED;
}

Timeline.prototype.detectClear = function() {
	this.barClear = Timeline.BARCLEAR_DETECTED;
}

Timeline.prototype.reset = function() {
	for (var i = 0; i < this.beats.length; ++i) {
		this.beats[i].status = BeatInfo.STATUS_READY;
	}
	this.hitBeats = 0;
	this.barClear =  Timeline.BARCLEAR_NOT;
	this.bumNotes = 0;
}

Timeline.prototype.invalidateBeatInfos = function() {
	for (var i = 0; i < this.beats.length; ++i) {
		this.beats[i].status = BeatInfo.STATUS_MISSED;
	}
	this.hitBeats = 0;
}

//when adding a measure, converts it into more useable BeatInfo form
Timeline.prototype.addMeasure = function(measureName) {
	var measure = MEASURES[measureName];
	if (measure !== undefined) {
		var i, j;
		for (i = 0, j = this.beats.length; i < measure.length; ++i) {
			if (measure[i] > 0) {
				var beatInfo = new BeatInfo();
				beatInfo.id = measure[i];
				beatInfo.frame = measure[i] - 1;
				beatInfo.time = this.measureCount + i / measure.length;
				beatInfo.beatIndex = j;
				beatInfo.measureIndex = this.measureCount;
				this.beats[j] = beatInfo;
				j += 1;
			}
		}
		this.measureCount += 1;
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
	if (!this.paused && this.beats.length > 0) {
		this.timePrev = this.time;
		this.time += g_FRAMETIME_S * this.tempo;

		if (this.time > this.measureCount) {
			//loop time and reset the beat infos
			this.time = this.time % this.measureCount;
			this.reset();
		}

		//update the nearestBeatInfo and check we haven't missed the beat
		var nearestBeatPrev = this.nearestBeat;
		this.nearestBeat = this.getNearestBeatToCurrentTime();

		//check to see if we hit the current beat
		if (this.nearestBeat) {
			//first check that the player is not trying to hit the first beat from the end of the bar
			if (this.nearestBeat.beatIndex == 0
			 && this.time > this.measureCount - this.errorTolerance * this.tempo
			 && g_KEYSTATES.justPressed(this.controls[this.nearestBeat.id - 1])) {
				this.firstBeatEarly = true;
				//alert("early!");
			} else if (this.nearestBeat.status == BeatInfo.STATUS_READY) {
				//we hit the first beat from the end of the bar
				if (this.firstBeatEarly) {
					this.nearestBeat.status = BeatInfo.STATUS_HIT;
					this.hitBeats += 1;
					this.firstBeatEarly = false;
				} else {
					//loop through controls and check if we hit a beat
					for (var i = 0; i < this.controls.length; ++i) {
						if (g_KEYSTATES.justPressed(this.controls[i])) {
							if (this.beatAtApproximateTime(i + 1)) {
								this.nearestBeat.status = BeatInfo.STATUS_HIT;
								this.hitBeats += 1;
							} else {
								//the player messed up (should count bum notes and invalidate if it exceeds a certain limit)
								this.bumNotes += 1;
								if (this.bumNotes >= this.bumNoteLimit) {
									this.invalidateBeatInfos();
									//play fuckup sound
								}
								
							}
						}
					}

					if (this.autoplay) {
						if (this.beatAtCurrentTime()) {
							this.nearestBeat.status = BeatInfo.STATUS_HIT;
							g_SOUNDMANAGER.playSound(this.sounds[this.nearestBeat.id - 1]);
						}
					} else if (nearestBeatPrev) {
						//this code is a little bit buggy. needs to be fixed
						if (nearestBeatPrev !== this.nearestBeat && nearestBeatPrev.status == BeatInfo.STATUS_READY) {
							nearestBeatPrev.status = BeatInfo.STATUS_MISSED;
						}
					}
				}
			}
		}

		//do something if the player hit all the beats
		if (this.hitBeats == this.beats.length && this.barClear == Timeline.BARCLEAR_NOT) {
			this.barClear = true;
		}
	}
}

Timeline.prototype.checkInput = function(controls) {
	var keyid = controls[this.nearestBeat.id - 1]
	if (this.nearestBeat && keyid !== undefined && g_KEYSTATES.justPressed(keyid)) {
		return
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
	if (this.beats.length < 1) return null;

	var nearest = this.beats[0];
	for (var i = 1; i < this.beats.length; ++i) {
		var beat = this.beats[i];
		var nTime = (this.time - nearest.time > this.measureCount * 0.5) ? nearest.time + this.measureCount : nearest.time;
		var bTime = (this.time - beat.time > this.measureCount * 0.5) ? beat.time + this.measureCount : beat.time;

		if (Math.abs(this.time - bTime) < Math.abs(this.time - nTime)) {
			nearest = beat;
		}
	}
	return nearest;
}

//checks for a beat at the approximate time
Timeline.prototype.beatAtApproximateTime = function(id) {
	if (this.nearestBeat) {
		var t0 = this.time - this.errorTolerance * this.tempo;
		var t1 = this.time + this.errorTolerance * this.tempo;
		if ((t0 <= this.nearestBeat.time && t1 > this.nearestBeat.time)
		 || (this.nearestBeat.time < t1 && this.timePrev > this.time)) { //time wrapped
			return (id === undefined || this.nearestBeat.id == id);
		}
	}
}

//checks exactly the current time using timePrev-time
Timeline.prototype.beatAtCurrentTime = function(id) {
	if (this.nearestBeat) {
		if ((this.timePrev <= this.nearestBeat.time && this.time > this.nearestBeat.time)
		 || (this.nearestBeat.time < this.time && this.timePrev > this.time)) { //time wrapped
			return (id === undefined || this.nearestBeat.id == id);
		}
	}

	return false;
}

Timeline.prototype.toggleAutoplay = function() {
	this.autoplay = !this.autoplay;
}

Timeline.prototype.togglePause = function() {
	this.paused = !this.paused;
}

//----------------//
// DRAW FUNCTIONS //
//----------------//
Timeline.prototype.draw = function(ctx, xofs, yofs) {
	if (this.beats.length < 1) return;

	//draw bars
	ctx.strokeStyle = "rgb(64,64,64)";
	for (i = 0; i <= this.measureCount; ++i) {
		x = this.pos.x + xofs + i * this.measureWidth;
		y = this.pos.y + yofs
		Util.drawLine(ctx, x, y, x, y + this.barHeight);
	}

	//draw current time
	ctx.strokeStyle = "rgb(255,255,255)";
	x = this.pos.x + xofs + this.time * this.measureWidth;
	y = this.pos.y + yofs;
	Util.drawLine(ctx, x, y, x, y + this.barHeight);

	//draw beats
	var i, j;
	var y = this.pos.y + this.barHeight * 0.5 + yofs;
	for (i = 0; i < this.beats.length; ++i) {
		var beat = this.beats[i];
		if (beat.id > 0) {
			var frame = beat.frame;
			var x = this.pos.x + xofs + beat.time * this.measureWidth;
			this.beatSprite.draw(ctx, x, y, frame + beat.status);
		}
	}
}

Timeline.prototype.drawDebug = function(ctx, xofs, yofs) {
	if (this.beats.length < 1) return;

	var i, x, y, err;

	//draw current time with error
	x = this.pos.x + xofs + this.time * this.measureWidth;
	y = this.pos.y + yofs;
	err = this.errorTolerance * this.tempo * this.measureWidth;
	Util.drawLine(ctx, x, y, x, y + this.barHeight);
	Util.drawLine(ctx, x - err, y, x - err, y + this.barHeight);
	Util.drawLine(ctx, x + err, y, x + err, y + this.barHeight);

	//draw outline
	Util.drawRectangle(ctx, this.pos.x + xofs, this.pos.y + yofs, this.measureWidth * this.measureCount, this.barHeight);
}

Timeline.prototype.addDrawCall = function() {
	g_RENDERLIST.addObject(this, 0, 0, false);
}