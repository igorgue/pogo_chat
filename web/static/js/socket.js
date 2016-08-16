// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "phoenix"
import {DB} from "web/static/js/db";


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

function buildLayover(lay) {
  var title = $('.lay-over .content .title')
  var content = $('.lay-over .content .the-lay-content')
  switch (lay) {
    case 'PERMISSION_DENIED':
      title.html('User denied Geolocation')
      content.html('In order for PoGoChat to work, it needs your location, and it seems like you have yours turned off or you declined it from being access.')
      break;
    case 'POSITION_UNAVAILABLE':
      title.html('Location Unavailable')
      content.html('Could not detect your current location.')
      break;
    case 'UNKNOWN_ERROR':
      title.html('Geolocation Error')
      content.html('Seems like we are having problems getting your location, try moving around and reload the app.')
      break;
    case 'REPORT_SIGNTING':
      title.html('report sighting')
      content.html("<select class='what-pokemon' style='width: 100%;'><option value='bulbasaur'>#001 - Bulbasaur</option><option value='ivysaur'>#002 - Ivysaur</option><option value='venusaur'>#003 - Venusaur</option><option value='charmander'>#004 - Charmander</option><option value='charmeleon'>#005 - Charmeleon</option><option value='charizard'>#006 - Charizard</option><option value='squirtle'>#007 - Squirtle</option><option value='wartortle'>#008 - Wartortle</option><option value='blastoise'>#009 - Blastoise</option><option value='caterpie'>#010 - Caterpie</option><option value='metapod'>#011 - Metapod</option><option value='butterfree'>#012 - Butterfree</option><option value='weedle'>#013 - Weedle</option><option value='kakuna'>#014 - Kakuna</option><option value='beedrill'>#015 - Beedrill</option><option value='pidgey'>#016 - Pidgey</option><option value='pidgeotto'>#017 - Pidgeotto</option><option value='pidgeot'>#018 - Pidgeot</option><option value='rattata'>#019 - Rattata</option><option value='raticate'>#020 - Raticate</option><option value='spearow'>#021 - Spearow</option><option value='fearow'>#022 - Fearow</option><option value='ekans'>#023 - Ekans</option><option value='arbok'>#024 - Arbok</option><option value='pikachu'>#025 - Pikachu</option><option value='raichu'>#026 - Raichu</option><option value='sandshrew'>#027 - Sandshrew</option><option value='sandslash'>#028 - Sandslash</option><option value='nidoran-f'>#029 - Nidoran &#9792;</option><option value='nidorina'>#030 - Nidorina</option><option value='nidoqueen'>#031 - Nidoqueen</option><option value='nidoran-m'>#032 - Nidoran &#9794;</option><option value='nidorino'>#033 - Nidorino</option><option value='nidoking'>#034 - Nidoking</option><option value='clefairy'>#035 - Clefairy</option><option value='clefable'>#036 - Clefable</option><option value='vulpix'>#037 - Vulpix</option><option value='ninetales'>#038 - Ninetales</option><option value='jigglypuff'>#039 - Jigglypuff</option><option value='wigglytuff'>#040 - Wigglytuff</option><option value='zubat'>#041 - Zubat</option><option value='golbat'>#042 - Golbat</option><option value='oddish'>#043 - Oddish</option><option value='gloom'>#044 - Gloom</option><option value='vileplume'>#045 - Vileplume</option><option value='paras'>#046 - Paras</option><option value='parasect'>#047 - Parasect</option><option value='venonat'>#048 - Venonat</option><option value='venomoth'>#049 - Venomoth</option><option value='diglett'>#050 - Diglett</option><option value='dugtrio'>#051 - Dugtrio</option><option value='meowth'>#052 - Meowth</option><option value='persian'>#053 - Persian</option><option value='psyduck'>#054 - Psyduck</option><option value='golduck'>#055 - Golduck</option><option value='mankey'>#056 - Mankey</option><option value='primeape'>#057 - Primeape</option><option value='growlithe'>#058 - Growlithe</option><option value='arcanine'>#059 - Arcanine</option><option value='poliwag'>#060 - Poliwag</option><option value='poliwhirl'>#061 - Poliwhirl</option><option value='poliwrath'>#062 - Poliwrath</option><option value='abra'>#063 - Abra</option><option value='kadabra'>#064 - Kadabra</option><option value='alakazam'>#065 - Alakazam</option><option value='machop'>#066 - Machop</option><option value='machoke'>#067 - Machoke</option><option value='machamp'>#068 - Machamp</option><option value='bellsprout'>#069 - Bellsprout</option><option value='weepinbell'>#070 - Weepinbell</option><option value='victreebel'>#071 - Victreebel</option><option value='tentacool'>#072 - Tentacool</option><option value='tentacruel'>#073 - Tentacruel</option><option value='geodude'>#074 - Geodude</option><option value='graveler'>#075 - Graveler</option><option value='golem'>#076 - Golem</option><option value='ponyta'>#077 - Ponyta</option><option value='rapidash'>#078 - Rapidash</option><option value='slowpoke'>#079 - Slowpoke</option><option value='slowbro'>#080 - Slowbro</option><option value='magnemite'>#081 - Magnemite</option><option value='magneton'>#082 - Magneton</option><option value='farfetchd'>#083 - Farfetchd</option><option value='doduo'>#084 - Doduo</option><option value='dodrio'>#085 - Dodrio</option><option value='seel'>#086 - Seel</option><option value='dewgong'>#087 - Dewgong</option><option value='grimer'>#088 - Grimer</option><option value='muk'>#089 - Muk</option><option value='shellder'>#090 - Shellder</option><option value='cloyster'>#091 - Cloyster</option><option value='gastly'>#092 - Gastly</option><option value='haunter'>#093 - Haunter</option><option value='gengar'>#094 - Gengar</option><option value='onix'>#095 - Onix</option><option value='drowzee'>#096 - Drowzee</option><option value='hypno'>#097 - Hypno</option><option value='krabby'>#098 - Krabby</option><option value='kingler'>#099 - Kingler</option><option value='voltorb'>#100 - Voltorb</option><option value='electrode'>#101 - Electrode</option><option value='exeggcute'>#102 - Exeggcute</option><option value='exeggutor'>#103 - Exeggutor</option><option value='cubone'>#104 - Cubone</option><option value='marowak'>#105 - Marowak</option><option value='hitmonlee'>#106 - Hitmonlee</option><option value='hitmonchan'>#107 - Hitmonchan</option><option value='lickitung'>#108 - Lickitung</option><option value='koffing'>#109 - Koffing</option><option value='weezing'>#110 - Weezing</option><option value='rhyhorn'>#111 - Rhyhorn</option><option value='rhydon'>#112 - Rhydon</option><option value='chansey'>#113 - Chansey</option><option value='tangela'>#114 - Tangela</option><option value='kangaskhan'>#115 - Kangaskhan</option><option value='horsea'>#116 - Horsea</option><option value='seadra'>#117 - Seadra</option><option value='goldeen'>#118 - Goldeen</option><option value='seaking'>#119 - Seaking</option><option value='staryu'>#120 - Staryu</option><option value='starmie'>#121 - Starmie</option><option value='mr-mime'>#122 - Mr. Mime</option><option value='scyther'>#123 - Scyther</option><option value='jynx'>#124 - Jynx</option><option value='electabuzz'>#125 - Electabuzz</option><option value='magmar'>#126 - Magmar</option><option value='pinsir'>#127 - Pinsir</option><option value='yauros'>#128 - Tauros</option><option value='magikarp'>#129 - Magikarp</option><option value='gyarados'>#130 - Gyarados</option><option value='lapras'>#131 - Lapras</option><option value='ditto'>#132 - Ditto</option><option value='eevee'>#133 - Eevee</option><option value='vaporeon'>#134 - Vaporeon</option><option value='jolteon'>#135 - Jolteon</option><option value='flareon'>#136 - Flareon</option><option value='porygon'>#137 - Porygon</option><option value='omanyte'>#138 - Omanyte</option><option value='omastar'>#139 - Omastar</option><option value='kabuto'>#140 - Kabuto</option><option value='kabutops'>#141 - Kabutops</option><option value='aerodactyl'>#142 - Aerodactyl</option><option value='snorlax'>#143 - Snorlax</option><option value='articuno'>#144 - Articuno</option><option value='zapdos'>#145 - Zapdos</option><option value='moltres'>#146 - Moltres</option><option value='dratini'>#147 - Dratini</option><option value='dragonair'>#148 - Dragonair</option><option value='dragonite'>#149 - Dragonite</option><option value='mewtwo'>#150 - Mewtwo</option><option value='mew'>#151 - Mew</option></select>")
      $('select').selectize()
      break;
  }

  $('.lay-over').show()
}

let geolocationService = navigator.geolocation

function geoError(error) {
  console.log(error);
  switch(error.code) {
    case error.PERMISSION_DENIED:
      buildLayover('PERMISSION_DENIED')
      break;
    case error.POSITION_UNAVAILABLE:
      buildLayover('POSITION_UNAVAILABLE')
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      buildLayover('UNKNOWN_ERROR')
      break;
  }
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

  $(".send-reply").click(function() {
    console.log('send-reply:')
    console.log(data)
    var data = {
      body: chatInput.val(),
      coords: coords,
      username: chatName,
      uuid: uuid
    }

    channel.push("new_msg", data)
  });

  // Handle lay-over
  $(".report-signting").click(function() {
    buildLayover('REPORT_SIGNTING')
  });

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
