function addPlaylist(fileData, callback) {

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function (e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
            'title':"playlist",
            'mimeType':contentType
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim;


        $.post(
            "https://www.googleapis.com/upload/drive/v2/files?access_token=" + this.googleAuthInstance.getAccessToken() +
                "&uploadType=multipart", function (multipartRequestBody) {

            })
            .done(function () {
                console.log("second success");
            })
            .fail(function () {
                console.log("error");
            })
            .always(function () {
                console.log("finished");
            });
        ;
    }
}
;
function addSong(playlistName, song) {
    var song;
}
;

function uploadPlaylist(playlistName, data) {
    var boundary = '-------314159265358979323846';
    var body = '--' + boundary + '\r\n'
        // Parameter name is "file" and local filename is "temp.txt"
        + 'Content-Disposition: form-data; name="file";'
        + 'title=playlistName\r\n'
        // Add the file's mime-type
        + 'Content-type: plain/text\r\n\r\n'
        // Add your data:
        +  data + '\r\n'
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

        error: function() { console.log('Failed!'); }
    });
}



