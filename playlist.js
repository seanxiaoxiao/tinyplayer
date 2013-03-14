var playlist = playlist || {};
var playlistHash;

(function () {

    playlist = {

        initialize:function () {
            this.googleAuth();
            this.getPlaylistsFromFolder();
        },

        googleAuth:function (callback) {
            this.googleAuthInstance = new OAuth2('google', {
                client_id:'359878478762.apps.googleusercontent.com',
                client_secret:'8mTXIIQD9zXgVAHfAESOzfh8',
                api_scope:'https://www.googleapis.com/auth/drive'
            });
            this.googleAuthInstance.authorize(callback);
        },

        getPlaylistsFromFolder:function () {

//            var folder_id = "0B0HMC2KvkVnkb2FTT28yWlFGWVk"; //id of root folder
//            $.get("https://www.googleapis.com/drive/v2/files/" + folder_id + "/children?access_token=" + this.googleAuthInstance.getAccessToken(), function (data) {

            $.get("https://www.googleapis.com/drive/v2/files?access_token=" + this.googleAuthInstance.getAccessToken(), function (data) {

                //populate the playlist, get all folder "mimeType": "application/vnd.google-apps.folder
                playlistHash = new Object();
                for (var i = 0, count = 1; i < data.items.length; ++i) {
                    if (data.items[i].mimeType === "application/vnd.google-apps.folder") {

                        playlist = new Object();
                        playlist.id = data.items[i].id;
                        playlist.name = data.items[i].title;
                        playlist.songs = new Object();

                        playlistHash[playlist.id] = playlist;
                    }
                }

                // iterate and find the mp3 files
                var songs = [];
                // iterate and find the mp3 files
                for (var i = 0, count = 1; i < data.items.length; ++i) {
                    if (data.items[i].fileExtension === "mp3") {

                        //also add to the songs collection
                        var song = new Object();
                        song.id = data.items[i].id;
                        song.title = data.items[i].title;
                        song.url = data.items[i].webContentLink;
                        song.playlistId = data.items[i].parents[0].id
                        song.playlist = playlistHash[song.playlistId].name

                        songs.push(song);
                    }
                }

                //remove empty folders
                for (var k in playlistHash) {
                    // use hasOwnProperty to filter out keys from the Object.prototype
                    if (playlistHash[k].songs.count < 1) {
                        delete playlistHash[k]
                    }
                }

                // only for debug
                for (var i = 0, count = 1; i < songs.length; ++i) {
                    song = songs[i];
                    console.log(song.title + " : " + song.playlist)
                }
            });

        },


        addSongToPlaylist:function (playlistId, song) {
            song.playlistId = playlistId;
            song.playlist = playlistHash[song.playlistId].name
            console.log("song " + song + " added to playlist " + song.playlist )
        },

        addNewPlaylist:function(playlistName){
            playlist = new Object();
            playlist.id = 0;
            playlist.name = playlistName;
            playlist.songs = new Object();

            playlistHash[playlist.id] = playlist;
        },


        getPlaylists:function () {
            var playlists = [];

            //https://docs.google.com/folder/d/0B0HMC2KvkVnkbFZFRXNYLXpOVXM/edit?usp=sharing
//                +"&mimeType='audio/mpeg'"
            var folder_id = "0B0HMC2KvkVnkb2FTT28yWlFGWVk";

            $.get("https://www.googleapis.com/drive/v2/files/" + folder_id + "/children?access_token=" + drivePlayer.googleAuthInstance.getAccessToken(), function (data) {

                for (var i = 0, count = 1; i < data.items.length; ++i) {

                    playlist = new Object();
                    playlist.id = data.items[i].id;
                }

                playlists.push(playlist);

                var text = JSON.stringify(playlists);
                console.log(text);
            });

        },

        uploadPlaylist:function (playlistName, data) {
            //First, POST the new file metadata to the Drive endpoint.
            //The response body will be a JSON representation of the newly created File resource.

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
                contentType:"multipart",
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