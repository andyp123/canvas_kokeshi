/* GAME MANAGER ***************************************************************
Simple manager to handle input and updating everything
*/
function GameManager() {
	this.timeline_p1 = new Timeline(8, 560, new Sprite(g_ASSETMANAGER.getAsset("BEATS_P1"), 12, 1) );
	this.timeline_p2 = new Timeline(8, 592, new Sprite(g_ASSETMANAGER.getAsset("BEATS_P2"), 12, 1) );
	this.metronome = new Timeline(8, 16);
	this.metronome.sounds = [ "CLICK91" ];
	this.metronome.addMeasures([ "BACKING_1" ]);
	this.metronome.autoplay = true;

	this.sounds_p1 = [
		"KOTO_A",
		"KOTO_B",
		"KOTO_C",
		"KOTO_D",
	];
	this.sounds_p2 = [
		"CHU22",
		"SHIME95",
		"SHIME65",
		"STICK1",
	];


	this.keysP1 = [ KEYS.Q, KEYS.W, KEYS.E, KEYS.R ];
	this.keysP2 = [ KEYS.U, KEYS.I, KEYS.O, KEYS.P ];

	//index into DUETS, which is an array of objects containing a koto and a taiko part
	this.duetIndex = 0;

	//initialise instruments and first track
	var duet = DUETS[this.duetIndex];
	this.timeline_p1.sounds = this.sounds_p1;
	this.timeline_p1.controls = this.keysP1;
	this.timeline_p1.addMeasures(duet.koto);

	this.timeline_p2.sounds = this.sounds_p2;
	this.timeline_p2.controls = this.keysP2;
	this.timeline_p2.addMeasures(duet.taiko);

	//kokeshi and bg
	this.kokeshi = new Kokeshi();
	this.background = new Background();

	//this is either null or a function to change the main update for non-interactive sections of the game
	this.sub = null;
	this.sub_end = false;
	this.sub_state = 0;
	this.sub_resumeTime = 0; //use this to add delays

	this.setSub(GameManager.SUB_intro);
}

// SUBROUTINES //

//game intro (KOKESHI logo appears)
//press ENTER to play game (flashes)
//start level
//	level intro (metronome for a single measure, then play entire bar once
//	pass control to player
//main update (player in control)
//level up!
//	stop timelines and launch some effects
//	level up kokeshi
//	clear timelines
//	load new pattern
//	switch to level start




GameManager.SUB_intro = function() {
	console.log("SUB_intro");
	switch (this.sub_state) {
		case 0:
			this.background.title.start();
			this.sub_sleep(3000);
			break;
		case 1:
			if (g_KEYSTATES.justPressed( KEYS.ENTER )) {
				this.setSub(GameManager.SUB_levelIntro);
			}
			break;
		default:
			this.sub_end = true;
	}
}

GameManager.SUB_levelIntro = function() {
	console.log("SUB_levelIntro" + " (state is " + this.sub_state + ")");
	switch (this.sub_state) {
		case 0:
			this.metronome.play(1, Timeline.AUTOPLAY_ON);
			this.sub_state += 1;
			break;
		case 1:
			if (this.metronome.paused) {
				this.metronome.play(0, Timeline.AUTOPLAY_ON);
				this.timeline_p1.play(1, Timeline.AUTOPLAY_ON);
				this.timeline_p2.play(1, Timeline.AUTOPLAY_ON);
				this.sub_state += 1;
			}
			break;
		case 2:
			if (this.timeline_p1.paused) {
				this.metronome.play(0, Timeline.AUTOPLAY_ON);
				this.timeline_p1.play();
				this.timeline_p2.play();
				this.setSub(GameManager.SUB_main);
			}
			break;
		default:
			this.sub_end = true;
	}
}

GameManager.SUB_main = function() {
	console.log("SUB_main");
	switch (this.sub_state) {
		case 0:
			if (this.timeline_p1.isClear() && this.timeline_p2.isClear()) {
				this.timeline_p1.detectClear();
				this.timeline_p2.detectClear();
				this.setSub(GameManager.SUB_levelUp);
			}
			break;
		default:
			this.sub_end = true;
	}
}

GameManager.SUB_levelUp = function() {
	console.log("SUB_levelUp");
	switch (this.sub_state) {
		case 0:
			this.timeline_p1.pause();
			this.timeline_p2.pause();
			this.metronome.pause();
			//launch fireworks or something!
			this.sub_sleep(3000);
			break;
		case 1:
			this.kokeshi.levelUp();
			this.duetIndex += (this.duetIndex < DUETS.length - 1) ? 1 : 0;
			this.sub_sleep(1000);
			break;
		case 2:
			this.timeline_p1.clear();
			this.timeline_p2.clear();
			var duet = DUETS[this.duetIndex];
			this.timeline_p1.addMeasures(duet.koto);
			this.timeline_p2.addMeasures(duet.taiko);
			this.sub_sleep(500);
			break;
		case 3:
			this.setSub(GameManager.SUB_levelIntro);
			break;
		default:
			this.sub_end = true;
	}

}

//main update
GameManager.prototype.update = function() {
	//handle keyboard and mouse input
	this.updateInput();

	//updates the current sub routine
	this.updateSub();

	//always call everything here
	this.metronome.update();
	this.timeline_p1.update();
	this.timeline_p2.update();
	this.background.update();
	this.kokeshi.update();
}

GameManager.prototype.updateSub = function() {
	if (this.sub !== null) {
		//don't call the sub if it is asleep
		if (g_GAMETIME_MS - this.sub_resumeTime < 0) {
			return;
		}

		//check the state
		if (this.sub_end) {
			this.sub = null;
		} else {
			this.sub.call(this);
		}
	}
}

GameManager.prototype.setSub = function(sub) {
	this.sub = sub;
	this.sub_state = 0;
	this.sub_end = false;
}

// sleep for time ms and increment the state for when the sleep is over
GameManager.prototype.sub_sleep = function(time) {
	this.sub_resumeTime = g_GAMETIME_MS + Math.abs(time);
	this.sub_state += 1;
}

//END OF SUBROUTINES //


GameManager.prototype.updateInput = function() {
	//mostly input for debug and testing
	var keysP1 = this.keysP1;
	var keysP2 = this.keysP2;

	var timeline_p1 = this.timeline_p1;
	var timeline_p2 = this.timeline_p2;
	var metronome = this.metronome;

	if (g_KEYSTATES.justPressed( KEYS.SPACE )) {
		timeline_p1.toggleAutoplay();
		timeline_p2.toggleAutoplay();
	}
	if (g_KEYSTATES.justPressed( KEYS.M )) {
		metronome.toggleAutoplay();
	}
	if (g_KEYSTATES.justPressed( KEYS.C )) {
		timeline_p1.togglePause();
		timeline_p2.togglePause();
		metronome.togglePause();
	}

	//TODO: move player input entirely into timeline!
	//handle player 1 input
	var i;
	for (i = 0; i < keysP1.length; ++i) {
		if (g_KEYSTATES.justPressed(keysP1[i])) {
			g_SOUNDMANAGER.playSound(this.sounds_p1[i]);
		}
	}
	//handle player 2 input
	for (i = 0; i < keysP2.length; ++i) {
		if (g_KEYSTATES.justPressed(keysP2[i])) {
			g_SOUNDMANAGER.playSound(this.sounds_p2[i]);
		}
	}

	//change tempo
	if (g_KEYSTATES.justPressed( KEYS.X )) {
		timeline_p1.tempo = 0.5;
		timeline_p2.tempo = 0.5;
		metronome.tempo = 0.5;

	}
	if (g_KEYSTATES.justPressed( KEYS.Z )) {
		timeline_p1.tempo += 0.25;
		timeline_p2.tempo += 0.25;
		metronome.tempo += 0.25;
	}
}

GameManager.prototype.draw = function(ctx, xofs, yofs) {
}

GameManager.prototype.drawDebug = function(ctx, xofs, yofs) {
	 //anything not on layer 0 needs to be drawn in here for debug to work
}

GameManager.prototype.addDrawCall = function() {
	this.background.addDrawCall();
	this.kokeshi.addDrawCall();

	this.timeline_p1.addDrawCall();
	this.timeline_p2.addDrawCall();

	//to support debug drawing for non layer 0 objects, this needs adding
	g_RENDERLIST.addObject(this, 0, 0, false);
}
