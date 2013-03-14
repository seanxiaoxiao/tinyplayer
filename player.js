var drivePlayer = drivePlayer || {};

(function(){

  drivePlayer = {
    playerInstance : chrome.extension.getBackgroundPage().playerInstance,
    dancerInstance : new Dancer(),
    googleAuthInstance : {},

    initialize : function(){
      this.googleAuth();
      this.eventBinding();
      this.initDancer();
      tinyPlayer.updateSongTitle();
      if(this.playerInstance.audioElement.paused){ $('#toggleButton').addClass('paused'); }
      else { 
        $('#toggleButton').removeClass('paused');
        this.refreshUI();
        //this.refreshDancer();
        //this.dancerInstance.play();
        //this.dancerInstance.audioAdapter.audio.currentTime = this.playerInstance.audioElement.currentTime;
      }
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

    initDancer : function(){
      var
        fft = document.getElementById( 'fft' ),
        ctx = fft.getContext( '2d' ),
        kick;

      Dancer.setOptions({
        flashSWF : '../../lib/soundmanager2.swf',
        flashJS  : '../../lib/soundmanager2.js'
      });

      kick = this.dancerInstance.createKick({
        onKick: function () { ctx.fillStyle = '#ff0077'; },
        offKick: function () { ctx.fillStyle = '#666'; }
      }).on();

      this.dancerInstance.fft( fft, { fillStyle: '#666' });

    },

    refreshDancer : function(){
      if(this.playerInstance.audioElement.paused){ return false; }
      var currentFile = this.playerInstance.playList[this.playerInstance.currentPlay].url;
      this.dancerInstance.load({ src: currentFile, codecs: [ 'mp3' ]});
      this.dancerInstance.setVolume(0);
    },

    refreshUI : function(){
      this.refreshDancer();
      this.dancerInstance.play();
      var title = tinyPlayer.updateSongTitle().slice(0, -4).split('-');
      $('#controlUI #cover-image').css('background-image', '');
      $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&format=json',
        data: {
          'api_key' : '9bf923f841ec4a5ff44912c2d7980bc8',
          'artist' : (title[0])? title[0].replace(/(^\s*)|(\s*$)/g, ""):'',
          'track' : (title[1])? title[1].replace(/(^\s*)|(\s*$)/g, ""):'' 
        },
        success: function(data){
          var medCover = data.track.album.image[1]['#text'];
          $('#controlUI #cover-image').css('background-image', 'url('+medCover+')');
        },
        dataType: 'json'
      });

    },

    eventBinding : function(){
      var that = this;
      /*$('#current-list tbody').on('click', 'tr td:first', function(){
        var fileLink = $(this).parent().attr('data-link');
        that.playerInstance.setSrc(fileLink);
        that.playerInstance.play();
      });*/

      $('#toggleButton').on('click', function(){
        that.playerInstance.toggle();
        $(this).toggleClass('paused');

        that.refreshDancer();
        tinyPlayer.updateSongTitle();
        if(that.dancerInstance.isPlaying()){ that.dancerInstance.pause(); }
        else { that.refreshUI(); } //that.dancerInstance.play(); }
      });

      $('#prevButton').on('click', function(){
        if(that.playerInstance.prev()){
          that.refreshUI();
          //that.dancerInstance.play();
          //tinyPlayer.updateSongTitle();
        }
      });
      $('#nextButton').on('click', function(){
        if(that.playerInstance.next()){
          that.refreshUI();
          //that.dancerInstance.play();
          //tinyPlayer.updateSongTitle();
        }
      });


    }
  };
})();


$(document).ready(function(){
    drivePlayer.initialize();
});

