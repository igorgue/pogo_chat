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
import {DB} from "web/static/js/db";

var database = new localStorageDB("chat", localStorage)

// Handle team selection
$(".teams div").click(function() {
  var selectedTeam = $(this).data("team");

  console.log(selectedTeam);

  database.insertOrUpdate("user", {id: '1'}, {team: selectedTeam});
  database.commit();

  // brand the chat view
  $(".top_menu").addClass(selectedTeam+"-background");

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

    trackEvent("Settings", "clear_database");

    $('.main-menu').hide()
    $('.lay-over').hide()
    $('.lay-over .content .title').html(" ");
    $('.lay-over .content .the-lay-content').html(" ");
  });
});

$('.open-tips').click(function() {
  $('.lay-over .content .title').html("tips");
  $('.lay-over .content .the-lay-content').html(`
    <div class='tips-holder'>
      <ul class='tips'>
        <li>
          <div class='tip-name'>
            <h2>What is PoGoConnect?</h2>
          </div>
          <div class='answer'>
            PoGoConnect is the best way to connect with other Pokemon GO players in your area. And discover Pokemon reported by the community!
          </div>
        </li>
        <li>
          <div class='tip-name'>
            <h2>How does it work?</h2>
          </div>
          <div class='answer'>
            PoGoConnect uses your phone's location to let you connect with other trainers in a 1 mile radius from where your standing.
          </div>
        </li>
      </ul>
    </div>`);

  $('.lay-over').show();
});

// Close keyboard
$('.chat-box').on({ 'touchstart' : function(){ $('.message_input').blur() } });
