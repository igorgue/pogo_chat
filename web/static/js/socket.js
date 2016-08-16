// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "phoenix"
import { DB } from "web/static/js/db";


let socket = new Socket("/socket", {params: {token: window.userToken}})

// Initialise. If the database doesn't exist, it is created
var database = DB.setup();

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

let geolocationService = navigator.geolocation

function geoError() {
  // TODO We couldn't get the location, please try to do something
  console.error("Sorry, no position available.");
}

let geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
}

let coords = {lat: null, long: null}

geolocationService.getCurrentPosition(position => {
  // Set position
  coords = {lat: position.coords.latitude, long: position.coords.longitude}

  // Now that you are connected, and we got your location, you can join channels with a topic:
  let channel = socket.channel("pogochat", {coords: coords})
  let chatInput = $(".chat-thing")
  let messagesContainer = $(".chat-box")
  let chatName = null
  let latHardcoded = $("#lat-input")
  let longHardcoded = $("#long-input")
  let uuid = null
  let nearbyUsersCount = 0
  let userCount = $(".count")

  // Get the messages from local database
  function getAllReplies() {
    var reply = DB.query(database, "reply");

    reply.forEach(function(item) {
      if (item['self'] == 'true') {
        messagesContainer.append(`<li class="message right appeared"><div class="avatar" style="background: url('images/pokemons/${item['username']}.png') no-repeat center;"></div><div class="text_wrapper"><div class="pokemon">${item['username']}</div><div class="text">${item['content']}</div></div></li>`)
      } else {
        messagesContainer.append(`<li class="message left appeared"><div class="avatar" style="background: url('images/pokemons/${item['username']}.png') no-repeat center;"></div><div class="text_wrapper"><div class="pokemon">${item['username']}</div><div class="text">${item['content']}</div></div></li>`)
      }
    })
  }

  // Main input, when return is pressed
  chatInput.on("keypress", event => {
    if(event.keyCode === 13) {
      var data = {
        body: chatInput.val(),
        coords: coords,
        username: chatName,
        uuid: uuid
      }

      console.log('keypress:')
      console.log(data)

      channel.push("new_msg", data)

      // To send pokemon
      channel.push("seen", {coords: coords, pokemon: "bulbasaur"})

      // chatInput.val("")
    }
  })

  // When a new message is received
  channel.on("new_msg", payload => {
    let is_yours = payload.uuid === uuid

    console.log('new msg:')
    console.log(payload)

    console.log(`Distance from message ${payload.distance_from_message}`)

    if(is_yours) {
      chatInput.val("")
      var self = "true";
      messagesContainer.append(`<li class="message right appeared" data-time="${Date()}"><div class="avatar" style="background: url('images/pokemons/${payload.username}.png') no-repeat center;"></div><div class="text_wrapper"><div class="pokemon">${payload.username}</div><div class="text">${payload.body}</div></div></li>`)
    } else {
      var self = "false";
      messagesContainer.append(`<li class="message left appeared" data-time="${Date()}"><div class="avatar" style="background: url('images/pokemons/${payload.username}.png') no-repeat center;"></div><div class="text_wrapper"><div class="pokemon">${payload.username}</div><div class="text">${payload.body}</div></div></li>`)
    }

    // Save the reply
    DB.insert(database, "reply", {username: payload.username, content: payload.body, self: self})

    messagesContainer.animate({scrollTop: messagesContainer.prop("scrollHeight")}, 500);
  })

  // When we receive a new pokemon seen
  channel.on("seen_report", payload => {
    console.log("seen report: ")
    console.log(payload)
  })

  // When we receive our username
  channel.on("random_pokemon", payload => {
    chatName = payload.random_pokemon
    chatInput.attr("placeholder", `Hi ${chatName}`).attr('data-username', chatName)
  })

  // When a new user appears
  channel.on("wild_pokemon_appeared", payload => {
    messagesContainer.append(`<li class="wild"><h3>Wild <span class="pp">${payload.wild_pokemon}</span> appeared!</h3><hr></li>`)
  })

  // When we get an user id
  channel.on("uuid", payload => {
    console.log(`Your uuid is ${payload.uuid}`)

    uuid = payload.uuid
    chatInput.attr('data-uuid', payload.uuid)
  })

  // When we need to update our counter
  channel.on("nearby_users_count", payload => {
    nearbyUsersCount = payload["nearby_users_count"]
    userCount.html(nearbyUsersCount)
  })

  channel.join()
    .receive("ok", resp => {
      console.log("Joined successfully", resp)

      messagesContainer.animate({scrollTop: messagesContainer.prop("scrollHeight")}, 500)
      messagesContainer.append(`<li class="message left appeared"><div class="avatar" style="background: url('images/pokemons/pikachu.png') no-repeat center;"></div><div class="text_wrapper"><div class="pokemon">Pikachu</div><div class="text">Welcome to POGOChat, :)</div></div></li>`)
    })
    .receive("error", resp => {
      // TODO there's an error to handle here too
      console.log("Unable to join", resp)
    })

  getAllReplies()

  geolocationService.watchPosition(position => {
    coords = {lat: position.coords.latitude, long: position.coords.longitude}

    channel.push("announce_location", {"uuid": uuid, "coords": {"lat": coords.lat, "long": coords.long}})
  }, geoError, geoOptions)
}, geoError, geoOptions)

export default socket
