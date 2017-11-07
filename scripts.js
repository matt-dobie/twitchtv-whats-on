/*
  Author: Matthew Dobie
  Author URL: mattdobie.com
  Description: Script for TwitchTV project
*/

// Twitch channels to track
var channels = ["freecodecamp", "kindafunnygames", "brownman", "jacksepticeye", "ESL_SC2", "OgamingSC2", "cretetion", "habathcx", "RobotCaleb", "noobs2ninjas"];

// Function to update count on badges
function updateCount(status) {
  var allCount = parseInt($("#all-bdg").html());
  var count = parseInt($("#" + status + "-bdg").html());
  allCount++;
  count++;
  $("#all-bdg").html(allCount);
  $("#" + status + "-bdg").html(count);
}

// Get info from API
function getInfo() {
  channels.forEach(function(channel) {
    var url = "https://wind-bow.gomix.me/twitch-api/streams/" + channel + "?callback=?";
    $.getJSON(url, function(data) {
      var status, game;
      if (data.stream === undefined) {
        status = "off";
        game = "Closed";
      }
      else if (data.stream === null) {
        status = "off";
        game = "Offline";
      }
      else {
        status = "on";
        game = data.stream.game;
      }
      url = "https://wind-bow.gomix.me/twitch-api/channels/" + channel + "?callback=?";
      $.getJSON(url, function(data) {
        var logo = data.logo;
        logo = logo != null ? logo : "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F";
        var name = data.display_name;
        name = name != null ? name : channel;
        var description = ": " + data.status;
        description = status === "on" ? description : "";
        var label = status === "on" ? "badge-success" : "badge-danger";
        var html = '<div class="row ' + status + '"><div class="col-4 col-sm-3 col-md-2 icon">' +
        '<span class="led led-' + status + '"></span><img src="' + logo +
        '"></div><div class="col-5 col-sm-4 name"><a href="' + data.url +
        '" target="_blank">' + name + '</a></div><div class="col-3 col-sm-4 col-md-6 info"' +
        'data-toggle="tooltip" data-placement="bottom" title="' + game + description + '">' + game +
        '<span class="hidden-xs-down">' + description + '</span></div></div>';
        status === "on" ? $(".content").prepend(html) : $(".content").append(html);
        updateCount(status);
      });
    });
  });
}

// Main function
$(document).ready(function() {

  // Initialise tooltips
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  // Get info from API
  getInfo();

  // Filter buttons
  $(".btn-filter").on("click", function() {
    var button = $(this);
    var status = button.attr("id");
    if (!button.hasClass("active")) {
      $(".active").removeClass("active");
      if (status === "on") {
        $(".on").show();
        $(".off").hide();
      }
      else if (status === "off") {
        $(".off").show();
        $(".on").hide();
      }
      else {
        $(".on").show();
        $(".off").show();
      }
      button.addClass("active");
    }
  });

});
