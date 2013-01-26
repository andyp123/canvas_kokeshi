/* KOKESHI ********************************************************************
*/

function Kokeshi() {
	this.sprites = {
		BASE: new Sprite(g_ASSETMANAGER.getAsset("KOKESHI_BASE")),
	};

	this.sprites['BASE'].setOffset(Sprite.ALIGN_BOTTOM);
}

Kokeshi.prototype.update = function() {
}

Kokeshi.prototype.draw = function(ctx, xofs, yofs) {
	this.sprites['BASE'].draw(ctx, xofs + g_SCREEN.width * 0.5, yofs + 512, 0);
}

Kokeshi.prototype.drawDebug = function(ctx, xofs, yofs) {
}

Kokeshi.prototype.addDrawCall = function() {
	g_RENDERLIST.addObject(this, 0, 0, false);
}