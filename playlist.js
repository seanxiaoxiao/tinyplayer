var playlist = playlist || {};
var allPlaylists;

(function () {

    playlist = {
    getPlaylists:function() {
        q = "title contains playlist";
        $.get("https://www.googleapis.com/drive/v2/files?access_token=" + drivePlayer.googleAuthInstance.getAccessToken() + "&q=" + q, function (data) {
            console.log(data);

        });
    },

    uploadPlaylist:function (playlistName, data) {
        var boundary = '-------314159265358979323846';
        var body = '--' + boundary + '\r\n'
            // Parameter name is "file" and local filename is "temp.txt"
            + 'Content-Disposition: form-data; name="file";'
            + 'title=playlistName\r\n'
            // Add the file's mime-type
            + 'Content-type: plain/text\r\n\r\n'
            // Add your data:
            + data + '\r\n'
            + boundary + '--';

        $.ajax({
            contentType:"multipart/related",
            data:body,
            type:"POST",
            dataType:"json",
            url:"https://www.googleapis.com/upload/drive/v2/files?access_token=" + drivePlayer.googleAuthInstance.getAccessToken() +
                "&uploadType=multipart",

            success:function (data, status) {
                console.log("success");
            },

            error:function () {
                console.log('Failed!');
            }
        })
    }
    }
})();

/*var data = {
 'type': 'user',
 'role': 'reader',
 'value': 'sean.xiao@west.cmu.edu'
 };
 $.ajax({
 url:"https://www.googleapis.com/drive/v2/files/1SiGLL_GoOZypHQd-M3bf4Y-AVCZCMFwzUwLgEjzNbgQ/permissions?access_token="+this.googleAuthInstance.getAccessToken(),
 type:"POST",
 data: JSON.stringify(data),
 contentType:"application/json; charset=utf-8",
 dataType:"json",
 error: function(data){console.log(data); }
 });*/
