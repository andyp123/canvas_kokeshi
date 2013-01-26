/* SOUND MANAGER (WEB AUDIO VERSION) ******************************************

*/


//SOUND MANAGER
function SoundManager() {
	this.context = new webkitAudioContext();
	
	this.sounds = {}; //hash of AudioBuffer data of all loaded sounds
	this.channels = []; //channels on which to play sounds
	this.music = this.context.createBufferSource(); //buffer for music
	
	for (var i = 0; i < max_channels; ++i) {
		this.channels.[i] = this.context.createBufferSource();
	}
}

SoundManager.VERSION = "Web Audio API";
SoundManager.LOW_PRIORITY_CHANNEL = 0; //sounds playing in this channel might be stopped by other sounds playing over the top
SoundManager.MAX_CHANNELS = 8;

SoundManager.prototype.playMusic = function (name) {

}

SoundManager.prototype.stopMusic = function (name) {

}

//get a channel that a sound is not currently playing on
SoundManager.prototype.getFreeChannel = function () {

}

SoundManager.prototype.playSound = function (name, channel) {
}


//load a list of sounds and add an optional prefix
SoundManager.prototype.loadSounds = function (paths, prefix, callback) {

}