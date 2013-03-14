/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 3/14/13
 * Time: 4:25 AM
 * To change this template use File | Settings | File Templates.
 */


var drivePlayer = drivePlayer || {};

drivePlayer.createList = function(name) {
  $.get("https://www.googleapis.com/drive/v2/files?access_token=" + drivePlayer.googleAuthInstance.getAccessToken(), function(data){
    for (var i = 0, count = 1; i < data.items.length; ++i) {
      if (data.items[i].title == "mp3") {
        var postData = {
          "title": name,
          "parents": [{"id":data.items[i].id}],
          "mimeType": "application/vnd.google-apps.folder"
        }
        $.ajax({
          url:"https://www.googleapis.com/drive/v2/files?access_token=" + drivePlayer.googleAuthInstance.getAccessToken(),
          type:"POST",
          data: JSON.stringify(postData),
          contentType:"application/json; charset=utf-8",
          dataType:"json"
        });
      }
    }
  });
};



