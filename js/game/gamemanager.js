/* GAME MANAGER ***************************************************************
Simple manager to handle input and updating everything
*/
function GameManager() {
	this.timeline_p1 = new Timeline(16, 560, new Sprite(g_ASSETMANAGER.getAsset("BEATS_P1"), 12, 1) );
	this.timeline_p2 = new Timeline(16, 592, new Sprite(g_ASSETMANAGER.getAsset("BEATS_P2"), 12, 1) );
	this.metronome = new Timeline(16, 16);
	this.metronome.sounds = [ "CLICK91" ];
	//this.metronome.addMeasures([ "BACKING_1" ]);
	//this.metronome.autoplay = true;

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
	//this.timeline_p2.addMeasures(duet.taiko);

	//kokeshi and bg
	this.kokeshi = new Kokeshi();
	this.background = new Background();
}

GameManager.prototype.startGame = function() {
}

//start game
//load new duet
//play duet once
//play one bar of metronome
//check player input as player performs duet
//repeat the pattern until they make no mistakes
//if no mistakes made
//add a level to the kokeshi
//load next duet
//repeat


GameManager.prototype.update = function() {
	if (g_GAMETIME_MS > 1000) {
		this.background.title.start();
	}

	//handle keyboard and mouse input
	this.updateInput();

	this.metronome.update();
	this.timeline_p1.update();
	this.timeline_p2.update();

	this.background.update();
	this.kokeshi.update();
}

GameManager.prototype.updateInput = function() {
	var i;

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

	//handle player 1 input
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
