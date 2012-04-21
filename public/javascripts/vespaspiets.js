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
});