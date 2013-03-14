/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 3/13/13
 * Time: 11:05 PM
 * To change this template use File | Settings | File Templates.
 */


var tinyPlayer = tinyPlayer || {};

(function($) {

  $("#more-action").click(function() {
    $("#more-action").fadeOut("slow");
    $("#more").fadeIn("slow");
  });

  $("#playlist li a").click(function(e) {
    e.stopPropagation();
  });

  $("#playlist li").click(function() {
    $("#playlist li").removeClass("selected");
    $(this).addClass("selected");
  });

  $("#new-list").click(function() {
    if ($(".new-list").length > 0) {
      return;
    }
    var newLi = $("<li class='new-list'/>");
    var input = $("<input type='text' placeholder='Input new list name'>");

    $("#playlist").animate({ scrollTop: $("#playlist-ul").height() }, "slow");

    newLi.append(input);

    input.blur(function() {
      if (input.val() == "") {
        newLi.remove();
      }
      else {
        newLi.removeClass("new-list");
        var shareBtn = $("<a href='#' class='share-btn'>Share</a>");
        newLi.text(input.val());
        newLi.append(shareBtn);
        input.remove();
        drivePlayer.createList(input.val());
      }
    });
    $("#playlist ul").append(newLi);
    input.focus();
  });

  tinyPlayer.reloadCurrentList = function() {
    if (!drivePlayer.playerInstance.currentList) {
      $($("#playlist-ul li")[0]).addClass("selected");
    }
    $("#playlist-ul li").each(function() {
      $(this).removeClass("selected");
      if($(this).attr("data-id") == drivePlayer.playerInstance.currentList) {
        $(this).addClass("selected");
      }
    });
  };

  tinyPlayer.updatePlayList = function(plists) {
    $("#playlist-ul").empty();
    var allList = $("<li class='selected'>All</li>");
    $("#playlist-ul").append(allList);
    allList.click(function() {
      drivePlayer.getAllMp3();
      $("#playlist li").removeClass("selected");
      $(this).addClass("selected");
      drivePlayer.playerInstance.currentList = null;
    });

    for (var i = 0; i < plists.length; i++) {
      var plistLi = $("<li>");
      plistLi.text(plists[i].title.substr(0, plists[i].title.indexOf("-plist")));
      plistLi.attr("data-id", plists[i].id);
      plistLi.droppable( {
        drop: function(e) {
          drivePlayer.copyFileToDir(tinyPlayer.draggedFileId, $(e.target).attr("data-id"));
        }
      });
      $("#playlist-ul").append(plistLi);
      plistLi.click(function() {
        drivePlayer.getFilesFromList($(this).attr("data-id"));
        $("#playlist li").removeClass("selected");
        $(this).addClass("selected");
        drivePlayer.playerInstance.currentList = $(this).attr("data-id");
      });
      var shareButton = $("<a></a>");
      shareButton.text("share").addClass("share-btn").attr("href", "#");
      shareButton.click(function() {
        var shareBox = $("<li></li>");
        var shareInput = $("<input type='text' size='35' maxlength='35' length='50' width='100%' placeholder='share to'>");
        shareBox.append(shareInput);
        shareBox.insertAfter($(this).parent());
        var fileId = $(this).parent().attr("data-id");
        shareInput.blur(function() {
          $(this).parent().remove();
          var userVal = $(this).val();
          sharing.shareFile(fileId, userVal);
          $(this).remove();
        })
      });
      plistLi.append(shareButton);
    }

    tinyPlayer.reloadCurrentList();
  };

  tinyPlayer.updateCurrentList = function(songs) {
    var listElement = $("#current-list-table");
    listElement.empty();

    for (var i = 0; i < songs.length; i++) {
      var song = songs[i];
      var songRow = $("<div/>");
      songRow.attr("data-link", song.url);
      songRow.attr("data-id", song.id);
      songRow.text(song.title);
      songRow.click(function(index) {
        return function() {
          console.log('index', index);
          drivePlayer.playerInstance.play(index);
          drivePlayer.refreshUI();
          //drivePlayer.refreshDancer();
          //drivePlayer.dancerInstance.play();
          //tinyPlayer.updateSongTitle();
          $('#toggleButton').removeClass('paused');
        }
      }(i));
      var shareButton = $("<a href='#' class='share-btn'>Share</a>");
      songRow.append(shareButton);
      listElement.append(songRow);

      shareButton.click(function() {
        var shareBox = $("<div></div>");
        var shareInput = $("<input type='text' size='70' maxlength='70' length='200' width='100%' placeholder='share to'>");
        shareBox.append(shareInput);
        shareBox.insertAfter($(this).parent());
        var fileId = $(this).parent().attr("data-id");
        shareInput.blur(function(e) {
          e.stopPropagation();
          $(this).parent().remove();
          var userVal = $(this).val();
          sharing.shareFile(fileId, userVal);
          $(this).remove();
        })
      });
    }

    listElement.find("div").draggable({
      cursor: 'move',
      containment: 'document',
      helper: tinyPlayer.dragLayer
    });

  };

  tinyPlayer.updateSongTitle = function() {
    var currentPlay = drivePlayer.playerInstance.playList[drivePlayer.playerInstance.currentPlay];
    if (currentPlay) {
      $("#song-title").text(currentPlay.title);
      return currentPlay.title;
    }
  };


  tinyPlayer.dragLayer = function(event) {
    tinyPlayer.draggedFileId = $(event.target).attr("data-id");
    return '<div id="draggableHelper">Help! I am dragged.</div>';
  }


  $(document).on("current-list-updated", function(e, data) {
    var songs = data.songs;
    tinyPlayer.updateCurrentList(songs);

    drivePlayer.playerInstance.importList(songs);
    //drivePlayer.playerInstance.play();
  });

  $(document).on("play-list-updated", function(e, data) {
    var plists = data.plists;
    console.log(plists);
    tinyPlayer.updatePlayList(plists);
  });

})(jQuery);