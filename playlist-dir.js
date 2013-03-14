/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 3/14/13
 * Time: 4:25 AM
 * To change this template use File | Settings | File Templates.
 */


var drivePlayer = drivePlayer || {};

(function ($) {

  drivePlayer.copyFileToDir = function(fileId, dirId) {
    var data = {
      'id': dirId
    };

    $.ajax({
      type:"POST",
      url:"https://www.googleapis.com/drive/v2/files/" + fileId + "/parents?access_token=" + drivePlayer.googleAuthInstance.getAccessToken(),
      type:"POST",
      data:JSON.stringify(data),
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success:function (msg) {
        console.log(msg)
      },
      error:function (errormessage) {

        console.log(errormessage)

      }
    });
  };

  drivePlayer.getFilesFromList = function(plistId) {
    $.get("https://www.googleapis.com/drive/v2/files?access_token=" + this.googleAuthInstance.getAccessToken(), function(data){
      var songs = [];
      for (var i = 0, count = 1; i < data.items.length; ++i) {
        for (var j = 0; j < data.items[i].parents.length; j++) {
          if (data.items[i].parents[j].id == plistId) {
            var song = {id: data.items[i].id, title: data.items[i].title, url: data.items[i].webContentLink};
            songs.push(song);
            break;
          }
        }
      }
      $(document).trigger("current-list-updated", {songs: songs});

    });
  },

  drivePlayer.createList = function (name) {
    $.get("https://www.googleapis.com/drive/v2/files?access_token=" + drivePlayer.googleAuthInstance.getAccessToken(), function (data) {
      for (var i = 0, count = 1; i < data.items.length; ++i) {
        if (data.items[i].title == "tiny-player") {
          var postData = {
            "title":name + "-plist",
            "parents":[
              {"id":data.items[i].id}
            ],
            "mimeType":"application/vnd.google-apps.folder"
          }
          $.ajax({
            url:"https://www.googleapis.com/drive/v2/files?access_token=" + drivePlayer.googleAuthInstance.getAccessToken(),
            type:"POST",
            data:JSON.stringify(postData),
            contentType:"application/json; charset=utf-8",
            dataType:"json"
          });
        }
      }
    });
  };

  drivePlayer.getPlaylist = function () {
    $.get("https://www.googleapis.com/drive/v2/files?access_token=" + drivePlayer.googleAuthInstance.getAccessToken(), function (data) {
      var plists = [];
      for (var i = 0, count = 1; i < data.items.length; ++i) {
        if (data.items[i].title.indexOf("-plist") >= 0) {
          plists.push(data.items[i]);
        }
      }
      $(document).trigger("play-list-updated", {plists: plists});
    });
  };

})(jQuery);

$(document).ready(function() {
  drivePlayer.getPlaylist();
});
