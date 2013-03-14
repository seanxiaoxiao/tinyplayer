var drivePlayer = drivePlayer || {};
var allSongs;
var allPlaylists;

(function(){
  drivePlayer = {
    playerInstance : chrome.extension.getBackgroundPage().playerInstance,
    googleAuthInstance : {},

    initialize : function(){
      this.googleAuth();
      this.eventBinding();
      if (drivePlayer.playerInstance.playList.length == 0) {
        this.getAllMp3();
      }
      else {
        tinyPlayer.updateCurrentList(drivePlayer.playerInstance.playList);
      }
    },

    googleAuth : function(callback){
      this.googleAuthInstance = new OAuth2('google', {
        client_id: '359878478762.apps.googleusercontent.com',
        client_secret: '8mTXIIQD9zXgVAHfAESOzfh8',
        api_scope: 'https://www.googleapis.com/auth/drive'
      });
      this.googleAuthInstance.authorize(callback);
    },

    getAllMp3: function() {
      $.get("https://www.googleapis.com/drive/v2/files?access_token=" + this.googleAuthInstance.getAccessToken(), function(data){
        var songs = [];
        for (var i = 0, count = 1; i < data.items.length; ++i) {
          if (data.items[i].fileExtension === "mp3") {
            var song = {id: data.items[i].id, title: data.items[i].title, url: data.items[i].webContentLink};
            songs.push(song);
          }
        }
        $(document).trigger("current-list-updated", {songs: songs});

      });
    },

    eventBinding : function(){
      var that = this;
      $('#current-list tbody').on('click', 'tr td:first', function(){
        console.log("clicked");
        var fileLink = $(this).parent().attr('data-link');
        that.playerInstance.setSrc(fileLink);
        that.playerInstance.play();
      });

      $('#toggleButton').on('click', function(){
        that.playerInstance.toggle();
        $(this).toggleClass('paused');
      });
    }

  };
})();


$(document).ready(function(){
  drivePlayer.initialize();
});

