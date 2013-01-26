/* GAME MANAGER *
Very simple manager to handle input and updating everything
*/
function GameManager() {
	this.timeline_p1 = new Timeline(32, 32);
	this.timeline_p2 = new Timeline(32, 96);
	//this.timeline_p2.autoplay = false;

	this.sounds = [
		"CHU22",
		"CLICK91",
		"SHIME65",
		"SHIME95"
	];

	this.timeline_p1.sounds = this.sounds;
	this.timeline_p1.addMeasures([
		"BASIC_1",
		"BASIC_2",
		"BASIC_1",
		"BASIC_3"
	]);
}

GameManager.prototype.generateTileWorld = function(sizeX, sizeY, seed) {
}

GameManager.prototype.startGame = function() {
}

GameManager.prototype.update = function() {
	//handle keyboard and mouse input
	this.updateInput();

	this.timeline_p1.update();
	this.timeline_p2.update();
}

GameManager.prototype.updateInput = function() {
	//mostly input for debug and testing
	var keysP1 = { A: KEYS.Q, B: KEYS.W };
	var keysP2 = { A: KEYS.O, B: KEYS.P };

	if (g_KEYSTATES.justPressed( KEYS.SPACE )) {
		this.timeline_p1.toggleAutoplay();
	}

	if (g_KEYSTATES.justPressed(keysP1.A)) {
		//if (this.timeline_p1.getBeatAtCurrentTimeWithError(0.125) > 0)
		g_SOUNDMANAGER.playSound("CHU22");
	}
	if (g_KEYSTATES.justPressed(keysP1.B)) {
		g_SOUNDMANAGER.playSound("CLICK91");
	}

	if (g_KEYSTATES.justPressed(keysP2.A)) {
		g_SOUNDMANAGER.playSound("SHIME95");
	}
	if (g_KEYSTATES.justPressed(keysP2.B)) {
		g_SOUNDMANAGER.playSound("SHIME65");		
	}

	if (g_KEYSTATES.justPressed( KEYS.M )) {
		this.timeline_p1.tempo += 0.125;
	}
	if (g_KEYSTATES.justPressed( KEYS.N )) {
		this.timeline_p1.tempo -= 0.125;
	}
}

	var keysP1 = { A: KEYS.Q, B: KEYS.W };
GameManager.prototype.draw = function(ctx, xofs, yofs) {
}

GameManager.prototype.drawDebug = function(ctx, xofs, yofs) {
	 //anything not on layer 0 needs to be drawn in here for debug to work
}

GameManager.prototype.addDrawCall = function() {
	this.timeline_p1.addDrawCall();
	this.timeline_p2.addDrawCall();


	//to support debug drawing for non layer 0 objects, this needs adding
	g_RENDERLIST.addObject(this, 0, 0, false);
}
