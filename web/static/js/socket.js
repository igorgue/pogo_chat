// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

// Initialise. If the database doesn't exist, it is created
var database = new localStorageDB("chat", localStorage);
if(! database.tableExists("reply")) {
  database.createTable("reply", ["username", "content", "self"]);
  database.commit();
}
// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("pogochat", {})
let chatInput = $(".chat-thing")
let messagesContainer = $(".chat-box")
let geolocationService = navigator.geolocation
let coords = {lat: null, long: null}
let chatName = null
let latHardcoded = $("#lat-input")
let longHardcoded = $("#long-input")
let uuid = null
let nearbyUsersCount = 0
let userCount = $(".count")
let geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
}

var reply = database.queryAll("reply");

reply.forEach(function(item) {
  if (item['self'] == 'true') {
    messagesContainer.append(`<li class="reply push-message"><div class="username"><img src="images/pokemons/${item['username']}.png" alt="" /><h1>${item['username']}</h1></div><div class="the-reply">${item['content']}</div></li>`)
  } else {
    messagesContainer.append(`<li class="reply"><div class="username"><img src="images/pokemons/${item['username']}.png" alt="" /><h1>${item['username']}</h1></div><div class="the-reply">${item['content']}</div></li>`)
  }
})

chatInput.on("keypress", event => {
  if(event.keyCode === 13) {
    if(latHardcoded.val() !== '' || longHardcoded.val() !== '') {
      coords.lat = parseFloat(latHardcoded.val())
      coords.long = parseFloat(longHardcoded.val())
    }

    var data = {
      body: chatInput.val(),
      coords: coords,
      username: chatName,
      uuid: uuid
    }

    channel.push("new_msg", data)
    chatInput.val("")
  }
})

channel.on("new_msg", payload => {
  let is_yours = payload.uuid === uuid

  console.log(`Distance from message ${payload.distance_from_message}`)

  if (is_yours) {
    var self = "true";
    messagesContainer.append(`<li data-time="${Date()}" class="reply  push-message"><div class="username"><img src="images/pokemons/${payload.username}.png" alt="" /><h1>${payload.username}</h1></div><div class="the-reply">${payload.body}</div></li>`)
  } else {
    var self = "false";
    messagesContainer.append(`<li data-time="${Date()}" class="reply"><div class="username"><img src="images/pokemons/${payload.username}.png" alt="" /><h1>${payload.username}</h1></div><div class="the-reply">${payload.body}</div></li>`)
  }

  // Save the reply
  database.insert("reply", {username: payload.username, content: payload.body, self: self});
  database.commit();

  messagesContainer.animate({scrollTop: messagesContainer.prop("scrollHeight")}, 500);
})

channel.on("random_pokemon", payload => {
  chatName = payload.random_pokemon
  chatInput.attr("placeholder", `Hi ${chatName}`).attr('data-username', chatName)
})

channel.on("wild_pokemon_appeared", payload => {
  console.log(`a wild ${payload.wild_pokemon} appeared`)
})

channel.on("uuid", payload => {
  console.log(`Your uuid is ${payload.uuid}`)

  uuid = payload.uuid
  chatInput.attr('data-uuid', payload.uuid)
})

channel.on("nearby_users_count", payload => {
  nearbyUsersCount = payload["nearby_users_count"]
  userCount.html(nearbyUsersCount)
})

channel.join()
  .receive("ok", resp => {
    console.log("Joined successfully", resp)
  })
  .receive("error", resp => {
    console.log("Unable to join", resp)
  })

  messagesContainer.animate({scrollTop: messagesContainer.prop("scrollHeight")}, 500)
  messagesContainer.append(`<div class="reply"><div class="username"><img src="images/pokemons/pikachu.png" alt="" /><h1>pikachu</h1></div><div class="the-reply">Welcome to POGOChat, :)</div></div>`)

function geoError() {
  console.error("Sorry, no position available.");
}

geolocationService.watchPosition(position => {
  if(latHardcoded.val() !== '' || longHardcoded.val() !== '') {
    coords.lat = parseFloat(latHardcoded.val())
    coords.long = parseFloat(longHardcoded.val())
  } else {
    coords.lat = position.coords.latitude
    coords.long = position.coords.longitude
  }

  if(coords !== {lat: null, long: null}){
    channel.push("announce_location", {uuid: uuid, coords: coords})
  }
}, geoError, geoOptions)

geolocationService.getCurrentPosition(position => {
  if(latHardcoded.val() !== '' || longHardcoded.val() !== '') {
    coords.lat = parseFloat(latHardcoded.val())
    coords.long = parseFloat(longHardcoded.val())
  } else {
    coords.lat = position.coords.latitude
    coords.long = position.coords.longitude
  }

  if(coords !== {lat: null, long: null}){
    channel.push("announce_location", {uuid: uuid, coords: coords})
  }
}, geoError, geoOptions)

export default socket
