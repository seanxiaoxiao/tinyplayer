var sharing = sharing || {};

(function () {

    sharing = {

        /**
         * Start the file sharing.
         *
         * @param {string} fileId the ID of the file to share.
         */
        shareFile : function (fileId, userValue) {

            var data = {
                'type':'user',
                'role':'reader',
                // 'value':'aristide.niyungeko@gmail.com'
                'value':userValue
            };

            $.ajax({
                type:"POST",
                url:"https://www.googleapis.com/drive/v2/files/" + fileId + "/permissions?access_token=" + drivePlayer.googleAuthInstance.getAccessToken(),
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
         * Start the playlist sharing.
         *
         * @param {string} playlistId the ID of the playlist to share.
         */
        sharePlaylist : function (playlistId) {
            var playList;

            // Get the playlist by ID
            for (var i = 0; i < allPlaylists.length && !playList; i++) {
                if (allPlaylists[i].id === playlistId)
                    playlist = allPlaylists[i];
            }
            
            // Get the songs in the playlist
            var songs = playlist.songs;

            // Share each song
            for (var i = 0; i < songs.length; i++) {
                shareFile(songs[i].id);
            }
        },

        /**
         * Event handler for playlist sharing.
         *
         * @param {Object} evt Arguments from the share button.
         */
        sharePlaylistHandler : function (evt) {
            sharing.sharePlaylist(evt.target.id);
        }
    }
})();