/* GLOBAL VARIABLES AND DATA QUEUEING ******************************************
*/
//queue all the texture data in the system
function game_queueData() {
		var data = [
			"gfx/title_ko.png",
			"gfx/title_keshi.png",
			"gfx/title_moon.png",
			//bg parts
			"gfx/bg_far.png",
			"gfx/bg_far_clouds.png",
			"gfx/bg_mid_trees.png",
			"gfx/bg_mid_clouds.png",
			"gfx/bg_near_trees.png",
			"gfx/bg_platform.png",
			//kokeshi parts
			"gfx/kokeshi_base.png",
			"gfx/kokeshi_head.png",
			"gfx/kokeshi_0.png",
			"gfx/kokeshi_1.png",
			"gfx/kokeshi_2.png",
			"gfx/kokeshi_3.png",
			"gfx/kokeshi_4.png",
			"gfx/kokeshi_5.png",
			"gfx/kokeshi_6.png",
			"gfx/kokeshi_7.png",
			"gfx/kokeshi_8.png",
			"gfx/kokeshi_9.png",
			"gfx/kokeshi_10.png",
			//ui parts
			"gfx/beats_p1.png",
			"gfx/beats_p2.png",
		];
		g_ASSETMANAGER.queueAssets(data);
		data = [
			"sfx/intro.wav",
			//taiko
			"sfx/click91.wav",
			"sfx/chu22.wav",
			"sfx/stick1.wav",
			"sfx/shime65.wav",
			"sfx/shime95.wav",
			"sfx/bell1.wav",
			//koto
			"sfx/koto_a.mp3",
			"sfx/koto_b.mp3",
			"sfx/koto_c.mp3",
			"sfx/koto_d.mp3",
		];
		g_SOUNDMANAGER.loadSounds(data);
}
game_queueData();

//objects
g_CAMERA = null;
g_GAMEMANAGER = null;
g_VECTORSCRATCH = null;

//variables
g_DEBUG = false;



/* MAIN FUNCTIONS **************************************************************
*/
function game_update() {
	g_GAMEMANAGER.update();
}

function game_draw(ctx, xofs, yofs) {
	g_SCREEN.clear();

	//add stuff to the renderlist
	g_GAMEMANAGER.addDrawCall();
	//sort and draw everything
	g_RENDERLIST.sort();
	g_RENDERLIST.draw(ctx, g_CAMERA.pos.x, g_CAMERA.pos.y);
	//do any debug drawing etc.
	if (g_DEBUG) {
		g_SCREEN.context.strokeStyle = "rgb(0,255,0)";
		g_SCREEN.context.fillStyle = "rgba(0,255,0,0.5)";
		g_RENDERLIST.drawDebug(ctx, g_CAMERA.pos.x, g_CAMERA.pos.y, 0);
	} else {
		g_SCREEN.context.strokeStyle = "rgb(0,0,0)";
		g_SCREEN.context.fillStyle = "rgb(0,0,0)";	
	}
	
	//make sure the renderlist is clear for the next frame
	g_RENDERLIST.clear();
}

function game_main() {
	document.getElementById('keystates').innerHTML = g_MOUSE.toString() + "<br>" + g_KEYSTATES.toString() + "<br><b>Camera</b><br>" + g_CAMERA.toString();
	
	if (g_KEYSTATES.isPressed( KEYS.SHIFT ) && g_KEYSTATES.justPressed( KEYS.D ) ) { //d for debug
		g_DEBUG = !g_DEBUG;
	}
	if (g_DEBUG) {
		if (g_MOUSE.left.isPressed()) {
			g_CAMERA.pos.addXY(g_MOUSE.dx, g_MOUSE.dy);
		}
	}

	game_update();
	game_draw(g_SCREEN.context, 0, 0);
}



function g_addEventListeners() {
	//var pobj, func;
	//pobj = document.getElementById('button_id');
	//func = function() {
	//}
	//pobj.addEventListener("click", func, false);	
}

function game_init() {
	if(g_SCREEN.init('screen', 400, 640)) {
		g_CAMERA = new Camera(0, 0);	
		g_GAMEMANAGER = new GameManager();
		g_VECTORSCRATCH = new ScratchPool(function() { return new Vector2(0, 0); }, 16);

		g_addEventListeners();
	}
}


