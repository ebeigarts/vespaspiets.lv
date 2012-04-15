$(function() {
  $.stellar({
    horizontalScrolling: false,
    verticalOffset: 0,
    horizontalOffset: 0
  });

  $(window).scroll(function() {
    var offset = ($(document.body).scrollTop() - 1230) * 1.5;
    $("#flying_vespa").css("background-position", offset + 13 + "px 0");
  });

  $("#nav a").click(function(event) {
    event.preventDefault();
    $($(this).attr("href")).ScrollTo({ duration: 800 });
  });
});