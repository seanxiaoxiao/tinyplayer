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

  $("#playlist li").mouseover(function() {
    $(this).addClass("hover");
  });

  $("#playlist li").mouseout(function() {
    $(this).removeClass("hover");
  });

  $("#playlist li a").click(function() {
    console.log("clicked");
  });

  tinyPlayer.updatePlayList = function() {

  };

  tinyPlayer.updateCurrentList = function() {

  };

})(jQuery);