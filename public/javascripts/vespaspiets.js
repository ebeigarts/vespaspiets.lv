$(function() {
  $.stellar({
    horizontalScrolling: false,
    verticalOffset: 0,
    horizontalOffset: 0
  });

  $(window).scroll(function() {
    var top = $(document.body).scrollTop();
    var offset = (top - 1230) * 1.5;
    $("#flying_vespa").css("background-position", offset + 13 + "px 0");
  });

  $("#nav a").click(function(event) {
    event.preventDefault();
    $($(this).attr("href")).ScrollTo({ duration: 800 });
  });

  // Active section
  $(window).scroll(function() {
    $("#nav a").each(function() {
      var $target = $($(this).attr("href"));
      var scrollTop = $(document.body).scrollTop();
      var sectionTop = $target.offset().top;
      if (scrollTop >= sectionTop) {
        $("#nav li").removeClass("active");
        $(this).closest("li").addClass("active");
        $(".page").removeClass("active");
        $target.addClass("active");
      }
    });
  });

  $("[data-video-id]").live("click", function() {
    var videoID = $(this).data("video-id");
    var embedURL= "http://www.youtube.com/embed/"+ videoID +"?wmode=transparent";
    $("#video_playing").empty().append(
      "<iframe width='560' height='315' src='" +
        embedURL +
        "' frameborder='0' allowfullscreen></iframe>"
    );
  });

  // YouTube Videos
  var videoUploadsURL = 'http://gdata.youtube.com/feeds/base/users/Vespaspiets/uploads?alt=json&v=2&orderby=published&callback=?';
  $.getJSON(videoUploadsURL, function(data) {
    var items = data.feed.entry;
    $.each(data.feed.entry, function(i, item) {
      var item = items[i];
      var feedTitle = item.title.$t;
      var feedURL = item.link[1].href;
      var fragments = feedURL.split("/");
      var videoID = fragments[fragments.length - 1].replace("?v=2", "");
      var thumbURL = "http://img.youtube.com/vi/"+ videoID +"/default.jpg";
      // console.log(feedTitle);
      $("#video_container").append(
        "<div class='video' data-video-id='" + videoID + "'>" +
          "<img src='" + thumbURL + "' width='104' />" +
          "<span class='video_title'>" + feedTitle + "</span>" +
        "</div>"
      );
    });
    $("[data-video-id]:first").click();
  });
});