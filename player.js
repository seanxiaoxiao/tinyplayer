var drivePlayer = drivePlayer || {};
var allSongs;

(function () {
    drivePlayer = {
        playerInstance:chrome.extension.getBackgroundPage().playerInstance,
        googleAuthInstance:{},

        initialize:function () {
            this.googleAuth();
            this.eventBinding();
            this.createPlaylist();
            this.getPlaylists();
            $('#controlUI').append(this.playerInstance.audioElement);
        },

        googleAuth:function (callback) {
            this.googleAuthInstance = new OAuth2('google', {
                client_id:'359878478762.apps.googleusercontent.com',
                client_secret:'8mTXIIQD9zXgVAHfAESOzfh8',
                api_scope:'https://www.googleapis.com/auth/drive'
            });
            this.googleAuthInstance.authorize(callback);
        },

        createPlaylist:function () {
            var uploadFunc = this.uploadPlaylist;
            $.get("https://www.googleapis.com/drive/v2/files?access_token=" + this.googleAuthInstance.getAccessToken(), function (data) {
                console.log(data);
                var playlistContainer = $("#current-list tbody");
                // iterate and find the mp3 files
                var songs = [];
                // iterate and find the mp3 files
                for (var i = 0, count = 1; i < data.items.length; ++i) {
                    if (data.items[i].fileExtension === "mp3") {
                        var rowHtml =
                            "<tr data-link='" + data.items[i].webContentLink + "'>" +
                                "<td>" + String(count++) + "</td>" +
                                "<td>" + data.items[i].title + "</td>" +
                                "<td><button id=" + data.items[i].id + ">share</button></td>";
                        playlistContainer.append(rowHtml);


                        //also add to the songs collection
                        var song = new Object();
                        song.id = data.items[i].id;
                        song.title = data.items[i].title;
                        song.url = data.items[i].webContentLink;

                        songs.push(song);
                    }
                }

                // Declare the sharing handler
                var shareButtons = $("#current-list tbody button");

                for (var i = 0; i < shareButtons.length; i++) {
                    shareButtons[i].addEventListener('click', shareHandler);
                }

                allSongs = songs;

                console.log(allSongs);

                uploadFunc("newplaylist", JSON.stringify(allSongs));
            });
        },

        getPlaylists:function () {
            q = "title contains playlist";
            $.get("https://www.googleapis.com/drive/v2/files?access_token=" + this.googleAuthInstance.getAccessToken() + "&q=" + q, function (data) {
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
            });

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

        },

        /**
         * Start the file sharing.
         *
         * @param {string} fileId the ID of the file to share.
         */
        shareFile:function (fileId) {

            var data = {
                'type':'user',
                'role':'reader',
                'value':'aristide.niyungeko@gmail.com'
            };

            $.ajax({
                type:"POST",
                url:"https://www.googleapis.com/drive/v2/files/" + fileId + "/permissions?access_token=" + this.googleAuthInstance.getAccessToken(),
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
        },

        /**
         * Insert a new permission.
         *
         * @param {String} fileId ID of the file to insert permission for.
         * @param {String} value User or group e-mail address, domain name or
         *                       {@code null} "default" type.
         * @param {String} type The value "user", "group", "domain" or "default".
         * @param {String} role The value "owner", "writer" or "reader".
         */
        insertPermission:function (fileId, type, role, callback) {
            var body = {
                'value':value,
                'type':type,
                'role':role
            };
            var request = gapi.client.drive.permissions.insert({
                'fileId':fileId,
                'resource':body
            });
            if (!callback) {
                callback = function (resp) {
                    console.log(resp)
                };
            }
            request.execute(callback);
        },

        eventBinding:function () {
            var that = this;
            $('#playlist tbody').on('click', 'tr td:first', function () {
                var fileLink = $(this).parent().attr('data-link');
                that.playerInstance.setSrc(fileLink);
                that.playerInstance.play();
            });
        }

    };
})();


$(document).ready(function () {
    drivePlayer.initialize();
});

/**
 * Event handler for file sharing.
 *
 * @param {Object} evt Arguments from the share button.
 */
function shareHandler(evt) {
    drivePlayer.shareFile(evt.target.id);
}




