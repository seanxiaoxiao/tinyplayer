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
        newLi.text(input.val());
        input.remove();
      }
    });
    $("#playlist ul").append(newLi);
  });

  tinyPlayer.updatePlayList = function() {

  };

  tinyPlayer.updateCurrentList = function() {

  };



})(jQuery);