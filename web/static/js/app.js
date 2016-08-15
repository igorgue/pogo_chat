// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

function teamResize() {
  $(".teams div").each(function( index, data ) {
    var class_name = $(this).attr("class");
    var holder = $('.'+class_name).height();
    var img = $('.'+class_name+' img').height();
    var hHeight = (holder - img) / 2;
    $('.'+class_name+' img').css("padding-top", hHeight+"px");
  });
}

teamResize();

$( window ).resize(function() {
  teamResize();
});

// Handle team selection
$(".teams div").click(function() {
  var team = $(this).data("team");
  $(".chat-thing").attr('data-team', team);

  // brand the chat view
  $(".top_menu").addClass(team+"-background");

  $('.select-team').hide();
  $('.chat').show();
});
