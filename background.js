var playerInstance = playerInstance || {};

(function(){
	playerInstance = {
		audioElement : document.createElement('audio'),
		notificationElement : {},

		initialize : function(){
			this.audioElement.setAttribute('src', '');
			this.audioElement.setAttribute('controls', '');
			this.audioElement.setAttribute('type', 'audio/mpeg');
		},
		setSrc : function(src){
			this.audioElement.setAttribute('src', src);
			this.audioElement.load();
		},
		play : function(){ this.audioElement.play(); },
		pause : function(){	this.audioElement.pause(); }
	};
})();

playerInstance.initialize();

/*chrome.browserAction.onClicked.addListener(function() {
	//drivePlayerInstance = webkitNotifications.createHTMLNotification('player.html');
	//drivePlayerInstance.show();
});*/