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

var database = new localStorageDB("chat", localStorage)

// Handle team selection
$(".teams div").click(function() {
  var team = $(this).data("team");

  database.insertOrUpdate("user", {id: '1'}, {team: team});
  database.commit();

  // brand the chat view
  $(".top_menu").addClass(team+"-background");

  $('.select-team').hide();
  $('.chat').show();
});

// Handle main menu
$(".close-button").click(function() {
  $('.main-menu').css("display", "none");
});

$(".poke-button").click(function() {
  $('.main-menu').css("display", "flex");
});

// Handle lay-over
$(".close-lay-over").click(function() {
  $('.lay-over').hide();

  // clear everything
  $('.lay-over .content .title').html(" ");
  $('.lay-over .content .the-lay-content').html(" ");
});

// handle options
$('.open-settings').click(function() {
  $('.lay-over .content .title').html("settings");
  $('.lay-over .content .the-lay-content').html("<div class='settings-holder'><ul class='options'><li><div class='action-name'><h2>Clear Local Database</h2></div><div class='clear-database-button'>Clear</div></li></ul></div>");

  $('.lay-over').show();

  $(".clear-database-button").on('click', function() {
    database.drop("chat")
    database.commit()
    location.reload()

    $('.main-menu').hide()
    $('.lay-over').hide()
    $('.lay-over .content .title').html(" ");
    $('.lay-over .content .the-lay-content').html(" ");
  });
});

// Close keyboard
$('.chat-box').on({ 'touchstart' : function(){ $('.message_input').blur() } });
