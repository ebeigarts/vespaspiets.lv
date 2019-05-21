$(function() {

  $.stellar({
    horizontalScrolling: false,
    verticalOffset: 0,
    horizontalOffset: 0
  });

  $(window).scroll(function() {
    var top = $(document).scrollTop();
    var pageOffset = $("#news").offset().top + $("#news").height();
    var offset = (top - pageOffset) * 1.5;
    $("#flying_vespa").css(
      "background-position", offset + 13 + "px 0"
    );
    var pageOffset = $("#video").offset().top + $("#video").height();
    var reverseOffset = (pageOffset - top) * 1.5;
    $("#flying_vespa_reverse").css(
      "background-position", reverseOffset + "px 0"
    );
    // Toggle tweets
    if (top > 600) {
      $("#tweets").hide(200);
    } else {
      $("#tweets").show();
    }
  });

  $("#nav a").click(function(event) {
    var href = $(this).attr("href");
    if (href.indexOf("#") == 0) {
      event.preventDefault();
      $(href).ScrollTo({
        duration: 800,
        callback: function() {
          window.location = href;
        }
      });
    }
  });

  // Active section
  $(window).scroll(function() {
    $("#nav a").each(function() {
      var href = $(this).attr("href");
      var $target = $(href);
      var scrollTop = $(document.body).scrollTop();
      if ($target.length > 0) {
        var sectionTop = $target.offset().top;
        if (scrollTop >= sectionTop) {
          $("#nav li").removeClass("active");
          $(this).closest("li").addClass("active");
          $(".page").removeClass("active");
          $target.addClass("active");
        }
      }
    });
  });

  // Modals
  $(".modal .close").click(function() {
    $(this).closest(".modal").hide();
    $(document.body).css({ overflow: "auto" });
  });
  $(".modal").click(function(event) {
    if (this == event.target) {
      $(this).closest(".modal").hide();
      $(document.body).css({ overflow: "auto" });
    }
  })
  $(document.body).keydown(function(event) {
    if (event.which == 27) {
      $(".modal").hide();
      $(document.body).css({ overflow: "auto" });
    }
  })

  // News modal
  $("div.article a").click(function(event) {
    event.preventDefault();
    var parts = $(this).attr("href").split("/")
    var permalink = parts[parts.length - 2];
    var url = "/blog/" + permalink;
    // console.log(url);
    $.get(url, function(data) {
      $(document.body).css({ overflow: "hidden" });
      $("#news_modal").show();
      $("#news_modal .modal-body").html(data);
    })
  });

  // YouTube Videos
  var videoUploadsURL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=UUGIApmoE-9wom126BQJ7-XA&key=AIzaSyDQExlwG6QLs4FN7knNbXT2OvxbHTYjHRQ&callback=?';

  $("[data-video-id]").live("click", function() {
    var videoID = $(this).data("video-id");
    var embedURL= "http://www.youtube.com/embed/"+ videoID +"?wmode=transparent";
    $("#video_playing").empty().append(
      "<iframe width='560' height='315' src='" +
        embedURL +
        "' frameborder='0' allowfullscreen></iframe>"
    );
  });
  $.getJSON(videoUploadsURL, function(data) {
    var items = data.items;
    $.each(items, function(i, item) {
      var item = items[i];
      var title = item.snippet.title;
      var videoID = item.contentDetails.videoId;
      var thumbURL = item.snippet.thumbnails.default.url;
      // console.log(title);
      $("#video_container").append(
        "<div class='video' data-video-id='" + videoID + "'>" +
          "<img src='" + thumbURL + "' width='104' />" +
          "<span class='video_title'>" + title + "</span>" +
        "</div>"
      );
    });
    $("[data-video-id]:first").click();
  });

  // Facebook photo albums
  $.get("/albums.json", function(data) {
    $.each(data, function(j, album) {
      $("#albums_container").append(
        "<div class='album'>" +
          "<a href='"+ album.url +"' target='_blank'>" +
            "<img src='"+ album.image_url +"' />" +
            "<span class='album_title'>"+ album.name +"</span>" +
          "</a>" +
        "</div>"
      );
    });
  });
});