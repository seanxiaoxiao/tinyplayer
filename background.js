var playerInstance = playerInstance || {};

(function(){
	playerInstance = {
		audioElement : document.createElement('audio'),
		currentPlay : 0,
		playList : [],
    currentList : null,
		//notificationElement : {},

		initialize : function(){
			var that = this;
			this.audioElement.setAttribute('src', '');
			this.audioElement.setAttribute('controls', '');
			this.audioElement.setAttribute('type', 'audio/mpeg');
			this.audioElement.addEventListener('ended', function(e){
			 	that.next();
			 	var popupView = chrome.extension.getViews({type:'popup'})[0];
			 	popupView.refreshUI();
			 	//popupView.drivePlayer.refreshDancer();
			 	//popupView.drivePlayer.dancerInstance.play();
			 	//popupView.tinyPlayer.updateSongTitle();
			});
		},
		setSrc : function(src){
			this.audioElement.setAttribute('src', src);
			this.audioElement.load();
		},
		play : function(num){
			if(num !== undefined){
				this.currentPlay = num;
				this.setSrc(this.playList[num].url);
			}
			this.audioElement.play();
		},
		pause : function(){	this.audioElement.pause(); },
		toggle : function(){
			if(this.audioElement.paused) { this.audioElement.play(); }
			else { this.audioElement.pause(); }
		},
		next : function(){
			if(this.currentPlay === this.playList.length-1){ return false; }
			this.setSrc(this.playList[++this.currentPlay].url);
			this.play();
			return true;
		},
		prev : function(){
			if(this.currentPlay === 0){ return false; }
			this.setSrc(this.playList[--this.currentPlay].url);
			this.play();
			return true;
		},
		reset : function(){
			this.setSrc(this.playList[this.currentPlay].url);
		},

		importList : function(list){
			this.playList = list;
			this.currentPlay = 0;
			this.reset();
		},
		addToList : function(src){
			this.playList.push(list);
		},
		getCurrentPlay : function(){
			return this.currentPlay;
		},
		getList : function(){
			return this.playList;
		}

	};
})();

playerInstance.initialize();

/*chrome.browserAction.onClicked.addListener(function() {
	//drivePlayerInstance = webkitNotifications.createHTMLNotification('player.html');
	//drivePlayerInstance.show();
});*/