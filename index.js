/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 3/13/13
 * Time: 11:05 PM
 * To change this template use File | Settings | File Templates.
 */


(function($) {

  $("#more-action").click(function() {
    $("#more").fadeIn("slow", function() {
      $("#more-action").fadeOut("fast");
    });
  });

  $("#playlist li").mouseover(function() {
    $(this).addClass("hover");
  });

  $("#playlist li").mouseout(function() {
    $(this).removeClass("hover");
  });

})(jQuery);