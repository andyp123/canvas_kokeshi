/* KOKESHI ********************************************************************
*/

function Kokeshi() {
	this.baseSprite = new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_BASE"));
	this.headSprite = new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_HEAD"));
	//sprites are the data stored to be used with parts
	this.sprites = [
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_0")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_1")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_2")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_3")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_4")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_5")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_6")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_7")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_8")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_9")),
		new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_10")),
	];

	//set the sprite offsets so that the draw function is greatly simplified
	this.sprites[0].offsetY = 440;
	this.sprites[1].offsetY = 440;
	this.sprites[2].offsetY = 242;
	this.sprites[3].offsetY = 242;
	this.sprites[4].offsetY = 242;
	this.sprites[5].offsetY = 242;
	this.sprites[6].offsetY = 242;
	this.sprites[7].offsetY = 202;
	this.sprites[8].offsetY = 202;
	this.sprites[9].offsetY = 170;
	this.sprites[10].offsetY = 170;

	this.baseSprite.setOffset(Sprite.ALIGN_BOTTOM);
	//head sprite and face parts need unified pivots for rotation!
	this.headSprite.setOffset(Sprite.ALIGN_BOTTOM, 0, -8);

	this.level = 0;
}

Kokeshi.prototype.levelUp = function() {
	if (this.level < this.sprites.length) {
		this.level += 1;
	} else {
		this.level = this.sprites.length;
	}
}

Kokeshi.prototype.update = function() {
}

Kokeshi.prototype.draw = function(ctx, xofs, yofs) {
	var xpos = g_SCREEN.width * 0.5 + xofs;
	var progressIndex = this.level;

	//draw head parts
	ctx.save();
	ctx.translate(xpos, yofs + 208);
	ctx.rotate(Math.sin(g_GAMETIME_MS * 0.005) * 0.125);
	this.headSprite.draw(ctx, 0, 0, 0);
	ctx.restore();

	//draw body parts
	this.baseSprite.draw(ctx, xpos, yofs + 512, 0);
	for (var i = 0; i < progressIndex; ++i) {
		this.sprites[i].draw(ctx, xpos, yofs, 0);
	}
}

Kokeshi.prototype.drawDebug = function(ctx, xofs, yofs) {
}

Kokeshi.prototype.addDrawCall = function() {
	g_RENDERLIST.addObject(this, 0, 0, false);
}