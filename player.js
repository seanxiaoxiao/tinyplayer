var drivePlayer = drivePlayer || {};

(function(){
  drivePlayer = {
    playerInstance : chrome.extension.getBackgroundPage().playerInstance,
    googleAuthInstance : {},

    initialize : function(){
      this.googleAuth();
      this.eventBinding();
      this.createPlaylist();
    },
    googleAuth : function(callback){
      this.googleAuthInstance = new OAuth2('google', {
        client_id: '359878478762.apps.googleusercontent.com',
        client_secret: '8mTXIIQD9zXgVAHfAESOzfh8',
        api_scope: 'https://www.googleapis.com/auth/drive'
      });
      this.googleAuthInstance.authorize(callback);
    },

    // A sample function...
    /*loadFirstSong : function(){
      var that = this;
      $.get("https://www.googleapis.com/drive/v2/files?access_token="+this.googleAuthInstance.getAccessToken(), function(data){
        // iterate and find the first mp3 file
        var fileLink;
        for(var i=0; i<data.items.length; ++i){
          if(data.items[i].fileExtension === "mp3"){
            fileLink = data.items[i].webContentLink;
            break;
          }
        }
        // load the mp3 file into the background audio element
        that.playerInstance.setSrc(fileLink);
        that.playerInstance.play();
      });
    },*/

    createPlaylist : function(){
      $.get("https://www.googleapis.com/drive/v2/files?access_token="+this.googleAuthInstance.getAccessToken(), function(data){
        var playlistContainer = $("#playlist tbody");
        console.log(data);
        // iterate and find the mp3 files
        for(var i=0, count=1; i<data.items.length; ++i){
          if(data.items[i].fileExtension === "mp3"){
            var rowHtml = 
              "<tr data-link='"+data.items[i].webContentLink+"'>"+
              "<td>"+String(count++)+"</td>"+
              "<td>"+data.items[i].title+"</td>"+
              "<td><button>share</button></td>";
            playlistContainer.append(rowHtml);
          }
        }
      });
    },

    eventBinding : function(){
      var that = this;
      $('#playlist tbody').on('click', 'tr td:first', function(){
        var fileLink = $(this).parent().attr('data-link');
        that.playerInstance.setSrc(fileLink);
        that.playerInstance.play();
      });
    }

  };
})();


$(document).ready(function(){
  drivePlayer.initialize();
});


/* Information Backup
var CLIENT_ID = '359878478762.apps.googleusercontent.com';
var SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
*/
