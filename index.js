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
    var input = $("<input type='text'>");

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
  });

  tinyPlayer.updatePlayList = function(plists) {
    $("#playlist-ul").empty();
    var allList = $("<li class='selected'>All</li>");
    $("#playlist-ul").append(allList);
    allList.click(function() {
      drivePlayer.getAllMp3();
    });

    for (var i = 0; i < plists.length; i++) {
      var plistLi = $("<li>");
      plistLi.text(plists[i].title.substr(0, plists[i].title.indexOf("-plist")));
      plistLi.attr("data-id", plists[i].id);
      $("#playlist-ul").append(plistLi);
      plistLi.click(function() {
        if (plistLi.text() == "All") {
          drivePlayer.getAllMp3();
        }
        else {
          drivePlayer.getFilesFromList($(this).attr("data-id"));
        }
      });
      var shareButton = $("<a></a>");
      shareButton.text("share").addClass("share-btn").attr("href", "#");
      shareButton.click(function() {
        var shareBox = $("<li></li>");
        var shareInput = $("<input type='text' maxlength='200' length='200' width='100%'>");
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
      var shareButton = $("<a href='#' class='share-btn'>Share</a>");
      songRow.append(shareButton);
      listElement.append(songRow);

      shareButton.click(function() {
        var shareBox = $("<div></div>");
        var shareInput = $("<input type='text' maxlength='200' length='200' width='100%'>");
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
    }
    listElement.find("div").draggable();

  };


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