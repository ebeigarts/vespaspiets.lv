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
    var url = "/blog" + $(this).attr("href").substr(32);
    // console.log(url);
    $.get(url, function(data) {
      $(document.body).css({ overflow: "hidden" });
      $("#news_modal").show();
      $("#news_modal .modal-body").html(data);
    })
  });

  // YouTube Videos
  var videoUploadsURL = 'http://gdata.youtube.com/feeds/base/users/Vespaspiets/uploads?alt=json&v=2&callback=?';

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

  // Facebook photo albums
  var facebookAlbumsURL = "http://graph.facebook.com/107178829336751/albums?callback=?";
  $.getJSON(facebookAlbumsURL, function(data) {
    $.each(data.data, function(i, album) {
      var facebookPhotosUrl = "http://graph.facebook.com/" + album.id + "/photos?callback=?";
      if (album.name != "Cover Photos" &&
          album.name != "Profile Pictures" &&
          album.name != "Wall Photos")
      {
        $.getJSON(facebookPhotosUrl, function(data) {
          if (data.data.length > 1) {
            $.each(data.data, function(i, photo) {
              // if (photo.id == album.cover_photo) {
              if (i == 0) {
                $("#albums_container").append(
                  "<div class='album'>" +
                    "<a href='"+ album.link +"' target='_blank'>" +
                      "<img src='"+ photo.picture +"' />" +
                      "<span class='album_title''>"+ album.name +"</span>" +
                    "</a>" +
                  "</div>"
                );
              }
            });
          }
        });
      }
    });
  });
});