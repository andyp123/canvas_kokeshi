/* BACKGROUND *****************************************************************
*/

function Title() {
	this.ko = new Sprite(g_ASSETMANAGER.getAsset("TITLE_KO"));
	this.keshi = new Sprite(g_ASSETMANAGER.getAsset("TITLE_KESHI"));
	this.moon = new Sprite(g_ASSETMANAGER.getAsset("TITLE_MOON"));

	//timing (ms only)
	this.startTime = -1;
	this.fadeStartTime = 1000;
	this.fadeTime = 5000;
}

Title.prototype.start = function() {
	if (this.startTime == -1) {
		this.startTime = g_GAMETIME_MS;
		g_SOUNDMANAGER.playSound("INTRO");
	}
}

Title.prototype.draw = function(ctx, xofs, yofs) {
	//always draw the moon!
	this.moon.draw(ctx, xofs, yofs, 0);

	if (this.startTime != -1) {
		var alpha = Util.clamp((g_GAMETIME_MS - (this.startTime + this.fadeStartTime)) / this.fadeTime, 0.0, 1.0);
		//alpha = Util.smoothStep(alpha);

		this.ko.draw(ctx, xofs, yofs, 0);

		ctx.globalAlpha = alpha;
		this.keshi.draw(ctx, xofs, yofs + 64, 0);
		ctx.globalAlpha = 1.0;
	}
}

function Background() {
	this.sprites = {
		BG_FAR: new Sprite(g_ASSETMANAGER.getAsset("BG_FAR")),
		BG_FAR_CLOUDS: new Sprite(g_ASSETMANAGER.getAsset("BG_FAR_CLOUDS")),
		BG_MID_TREES: new Sprite(g_ASSETMANAGER.getAsset("BG_MID_TREES")),
		BG_MID_CLOUDS: new Sprite(g_ASSETMANAGER.getAsset("BG_MID_CLOUDS")),
		BG_NEAR_TREES: new Sprite(g_ASSETMANAGER.getAsset("BG_NEAR_TREES")),
		BG_PLATFORM: new Sprite(g_ASSETMANAGER.getAsset("BG_PLATFORM")),
	};

	for (name in this.sprites) {
		this.sprites[name].setOffset(Sprite.ALIGN_TOP_LEFT);
	}

	this.title = new Title();
}

Background.prototype.update = function() {
}

Background.prototype.draw = function(ctx, xofs, yofs) {
	this.sprites['BG_FAR'].draw(ctx, xofs, yofs, 0);
	this.sprites['BG_FAR_CLOUDS'].draw(ctx, xofs, yofs + 220, 0);
	this.sprites['BG_MID_TREES'].draw(ctx, xofs, yofs + 200, 0);
	this.sprites['BG_MID_CLOUDS'].draw(ctx, xofs, yofs + 420, 0);
	this.sprites['BG_PLATFORM'].draw(ctx, xofs, yofs + 400, 0);
	this.sprites['BG_NEAR_TREES'].draw(ctx, xofs, yofs + 400, 0);

	this.title.draw(ctx, xofs + 350, yofs + 48);
}

Background.prototype.drawDebug = function(ctx, xofs, yofs) {
}

Background.prototype.addDrawCall = function() {
	g_RENDERLIST.addObject(this, -1, 0, false);
}