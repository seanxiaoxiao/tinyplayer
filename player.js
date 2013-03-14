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
            playlist.getPlaylists();
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
            var uploadFunc = playlist.uploadPlaylist;
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




