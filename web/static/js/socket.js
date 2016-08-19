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
  let announced = false

  // Get the messages from local database
  function getAllReplies() {
    var reply = DB.query(database, "reply");

    reply.forEach(function(item) {
      if (item['self'] == 'true') {
        var direction = "right"
      } else {
        var direction = "left"
      }
      messagesContainer.append(`<li class="message ${direction} appeared"><div class="avatar" style="background: url('images/pokemons/${item['username']}.png') no-repeat center;"></div><div class="text_wrapper"><div class="pokemon">${item['username']}</div><div class="text">${item['content']}</div></div></li>`)
    })
  }

  // Main input, when return is pressed
  chatInput.on("keypress", event => {
    if(event.keyCode === 13) {
      if(!announced) {
        channel.push("wild_pokemon_appeared", {})

        announced = true
      }

      var data = {
        body: chatInput.val(),
        coords: coords,
        username: chatName,
        uuid: uuid
      }

      // console.log('keypress:')
      // console.log(data)

      channel.push("new_msg", data)
      // chatInput.blur()

      // chatInput.val("")
    }
  })

  // CLick to send reply
  $(".send-reply").click(function() {
    var data = {
      body: chatInput.val(),
      coords: coords,
      username: chatName,
      uuid: uuid
    }

    channel.push("new_msg", data)
  });

  // Handle report sighting
  $(".report-signting").click(function() {
    $('.lay-over .content .title').html('report sighting')
    $('.lay-over .content .the-lay-content').html('<div class="report-signting-data"><p>Select the pokemon you wish to report.</p><select class="what-pokemon" style="width: 100%;"></select><div class="show-pokemon"><h2></h2><hr><img src=""><div class="report-button">Report Sighting</div></div></div>')

    var pokemons = [{"pokedex":"#001","name":"#001 - Bulbasaur","slug":"bulbasaur"},{"pokedex":"#002","name":"#002 - Ivysaur","slug":"ivysaur"},{"pokedex":"#003","name":"#003 - Venusaur","slug":"venusaur"},{"pokedex":"#004","name":"#004 - Charmander","slug":"charmander"},{"pokedex":"#005","name":"#005 - Charmeleon","slug":"charmeleon"},{"pokedex":"#006","name":"#006 - Charizard","slug":"charizard"},{"pokedex":"#007","name":"#007 - Squirtle","slug":"squirtle"},{"pokedex":"#008","name":"#008 - Wartortle","slug":"wartortle"},{"pokedex":"#009","name":"#009 - Blastoise","slug":"blastoise"},{"pokedex":"#010","name":"#010 - Caterpie","slug":"caterpie"},{"pokedex":"#011","name":"#011 - Metapod","slug":"metapod"},{"pokedex":"#012","name":"#012 - Butterfree","slug":"butterfree"},{"pokedex":"#013","name":"#013 - Weedle","slug":"weedle"},{"pokedex":"#014","name":"#014 - Kakuna","slug":"kakuna"},{"pokedex":"#015","name":"#015 - Beedrill","slug":"beedrill"},{"pokedex":"#016","name":"#016 - Pidgey","slug":"pidgey"},{"pokedex":"#017","name":"#017 - Pidgeotto","slug":"pidgeotto"},{"pokedex":"#018","name":"#018 - Pidgeot","slug":"pidgeot"},{"pokedex":"#019","name":"#019 - Rattata","slug":"rattata"},{"pokedex":"#020","name":"#020 - Raticate","slug":"raticate"},{"pokedex":"#021","name":"#021 - Spearow","slug":"spearow"},{"pokedex":"#022","name":"#022 - Fearow","slug":"fearow"},{"pokedex":"#023","name":"#023 - Ekans","slug":"ekans"},{"pokedex":"#024","name":"#024 - Arbok","slug":"arbok"},{"pokedex":"#025","name":"#025 - Pikachu","slug":"pikachu"},{"pokedex":"#026","name":"#026 - Raichu","slug":"raichu"},{"pokedex":"#027","name":"#027 - Sandshrew","slug":"sandshrew"},{"pokedex":"#028","name":"#028 - Sandslash","slug":"sandslash"},{"pokedex":"#029","name":"#029 - Nidoran &#9792;","slug":"nidoran-f"},{"pokedex":"#030","name":"#030 - Nidorina","slug":"nidorina"},{"pokedex":"#031","name":"#031 - Nidoqueen","slug":"nidoqueen"},{"pokedex":"#032","name":"#032 - Nidoran &#9794;","slug":"nidoran-m"},{"pokedex":"#033","name":"#033 - Nidorino","slug":"nidorino"},{"pokedex":"#034","name":"#034 - Nidoking","slug":"nidoking"},{"pokedex":"#035","name":"#035 - Clefairy","slug":"clefairy"},{"pokedex":"#036","name":"#036 - Clefable","slug":"clefable"},{"pokedex":"#037","name":"#037 - Vulpix","slug":"vulpix"},{"pokedex":"#038","name":"#038 - Ninetales","slug":"ninetales"},{"pokedex":"#039","name":"#039 - Jigglypuff","slug":"jigglypuff"},{"pokedex":"#040","name":"#040 - Wigglytuff","slug":"wigglytuff"},{"pokedex":"#041","name":"#041 - Zubat","slug":"zubat"},{"pokedex":"#042","name":"#042 - Golbat","slug":"golbat"},{"pokedex":"#043","name":"#043 - Oddish","slug":"oddish"},{"pokedex":"#044","name":"#044 - Gloom","slug":"gloom"},{"pokedex":"#045","name":"#045 - Vileplume","slug":"vileplume"},{"pokedex":"#046","name":"#046 - Paras","slug":"paras"},{"pokedex":"#047","name":"#047 - Parasect","slug":"parasect"},{"pokedex":"#048","name":"#048 - Venonat","slug":"venonat"},{"pokedex":"#049","name":"#049 - Venomoth","slug":"venomoth"},{"pokedex":"#050","name":"#050 - Diglett","slug":"diglett"},{"pokedex":"#051","name":"#051 - Dugtrio","slug":"dugtrio"},{"pokedex":"#052","name":"#052 - Meowth","slug":"meowth"},{"pokedex":"#053","name":"#053 - Persian","slug":"persian"},{"pokedex":"#054","name":"#054 - Psyduck","slug":"psyduck"},{"pokedex":"#055","name":"#055 - Golduck","slug":"golduck"},{"pokedex":"#056","name":"#056 - Mankey","slug":"mankey"},{"pokedex":"#057","name":"#057 - Primeape","slug":"primeape"},{"pokedex":"#058","name":"#058 - Growlithe","slug":"growlithe"},{"pokedex":"#059","name":"#059 - Arcanine","slug":"arcanine"},{"pokedex":"#060","name":"#060 - Poliwag","slug":"poliwag"},{"pokedex":"#061","name":"#061 - Poliwhirl","slug":"poliwhirl"},{"pokedex":"#062","name":"#062 - Poliwrath","slug":"poliwrath"},{"pokedex":"#063","name":"#063 - Abra","slug":"abra"},{"pokedex":"#064","name":"#064 - Kadabra","slug":"kadabra"},{"pokedex":"#065","name":"#065 - Alakazam","slug":"alakazam"},{"pokedex":"#066","name":"#066 - Machop","slug":"machop"},{"pokedex":"#067","name":"#067 - Machoke","slug":"machoke"},{"pokedex":"#068","name":"#068 - Machamp","slug":"machamp"},{"pokedex":"#069","name":"#069 - Bellsprout","slug":"bellsprout"},{"pokedex":"#070","name":"#070 - Weepinbell","slug":"weepinbell"},{"pokedex":"#071","name":"#071 - Victreebel","slug":"victreebel"},{"pokedex":"#072","name":"#072 - Tentacool","slug":"tentacool"},{"pokedex":"#073","name":"#073 - Tentacruel","slug":"tentacruel"},{"pokedex":"#074","name":"#074 - Geodude","slug":"geodude"},{"pokedex":"#075","name":"#075 - Graveler","slug":"graveler"},{"pokedex":"#076","name":"#076 - Golem","slug":"golem"},{"pokedex":"#077","name":"#077 - Ponyta","slug":"ponyta"},{"pokedex":"#078","name":"#078 - Rapidash","slug":"rapidash"},{"pokedex":"#079","name":"#079 - Slowpoke","slug":"slowpoke"},{"pokedex":"#080","name":"#080 - Slowbro","slug":"slowbro"},{"pokedex":"#081","name":"#081 - Magnemite","slug":"magnemite"},{"pokedex":"#082","name":"#082 - Magneton","slug":"magneton"},{"pokedex":"#083","name":"#083 - Farfetch'd","slug":"farfetchd"},{"pokedex":"#084","name":"#084 - Doduo","slug":"doduo"},{"pokedex":"#085","name":"#085 - Dodrio","slug":"dodrio"},{"pokedex":"#086","name":"#086 - Seel","slug":"seel"},{"pokedex":"#087","name":"#087 - Dewgong","slug":"dewgong"},{"pokedex":"#088","name":"#088 - Grimer","slug":"grimer"},{"pokedex":"#089","name":"#089 - Muk","slug":"muk"},{"pokedex":"#090","name":"#090 - Shellder","slug":"shellder"},{"pokedex":"#091","name":"#091 - Cloyster","slug":"cloyster"},{"pokedex":"#092","name":"#092 - Gastly","slug":"gastly"},{"pokedex":"#093","name":"#093 - Haunter","slug":"haunter"},{"pokedex":"#094","name":"#094 - Gengar","slug":"gengar"},{"pokedex":"#095","name":"#095 - Onix","slug":"onix"},{"pokedex":"#096","name":"#096 - Drowzee","slug":"drowzee"},{"pokedex":"#097","name":"#097 - Hypno","slug":"hypno"},{"pokedex":"#098","name":"#098 - Krabby","slug":"krabby"},{"pokedex":"#099","name":"#099 - Kingler","slug":"kingler"},{"pokedex":"#100","name":"#100 - Voltorb","slug":"voltorb"},{"pokedex":"#101","name":"#101 - Electrode","slug":"electrode"},{"pokedex":"#102","name":"#102 - Exeggcute","slug":"exeggcute"},{"pokedex":"#103","name":"#103 - Exeggutor","slug":"exeggutor"},{"pokedex":"#104","name":"#104 - Cubone","slug":"cubone"},{"pokedex":"#105","name":"#105 - Marowak","slug":"marowak"},{"pokedex":"#106","name":"#106 - Hitmonlee","slug":"hitmonlee"},{"pokedex":"#107","name":"#107 - Hitmonchan","slug":"hitmonchan"},{"pokedex":"#108","name":"#108 - Lickitung","slug":"lickitung"},{"pokedex":"#109","name":"#109 - Koffing","slug":"koffing"},{"pokedex":"#110","name":"#110 - Weezing","slug":"weezing"},{"pokedex":"#111","name":"#111 - Rhyhorn","slug":"rhyhorn"},{"pokedex":"#112","name":"#112 - Rhydon","slug":"rhydon"},{"pokedex":"#113","name":"#113 - Chansey","slug":"chansey"},{"pokedex":"#114","name":"#114 - Tangela","slug":"tangela"},{"pokedex":"#115","name":"#115 - Kangaskhan","slug":"kangaskhan"},{"pokedex":"#116","name":"#116 - Horsea","slug":"horsea"},{"pokedex":"#117","name":"#117 - Seadra","slug":"seadra"},{"pokedex":"#118","name":"#118 - Goldeen","slug":"goldeen"},{"pokedex":"#119","name":"#119 - Seaking","slug":"seaking"},{"pokedex":"#120","name":"#120 - Staryu","slug":"staryu"},{"pokedex":"#121","name":"#121 - Starmie","slug":"starmie"},{"pokedex":"#122","name":"#122 - Mr. Mime","slug":"mr-mime"},{"pokedex":"#123","name":"#123 - Scyther","slug":"scyther"},{"pokedex":"#124","name":"#124 - Jynx","slug":"jynx"},{"pokedex":"#125","name":"#125 - Electabuzz","slug":"electabuzz"},{"pokedex":"#126","name":"#126 - Magmar","slug":"magmar"},{"pokedex":"#127","name":"#127 - Pinsir","slug":"pinsir"},{"pokedex":"#128","name":"#128 - Tauros","slug":"tauros"},{"pokedex":"#129","name":"#129 - Magikarp","slug":"magikarp"},{"pokedex":"#130","name":"#130 - Gyarados","slug":"gyarados"},{"pokedex":"#131","name":"#131 - Lapras","slug":"lapras"},{"pokedex":"#132","name":"#132 - Ditto","slug":"ditto"},{"pokedex":"#133","name":"#133 - Eevee","slug":"eevee"},{"pokedex":"#134","name":"#134 - Vaporeon","slug":"vaporeon"},{"pokedex":"#135","name":"#135 - Jolteon","slug":"jolteon"},{"pokedex":"#136","name":"#136 - Flareon","slug":"flareon"},{"pokedex":"#137","name":"#137 - Porygon","slug":"porygon"},{"pokedex":"#138","name":"#138 - Omanyte","slug":"omanyte"},{"pokedex":"#139","name":"#139 - Omastar","slug":"omastar"},{"pokedex":"#140","name":"#140 - Kabuto","slug":"kabuto"},{"pokedex":"#141","name":"#141 - Kabutops","slug":"kabutops"},{"pokedex":"#142","name":"#142 - Aerodactyl","slug":"aerodactyl"},{"pokedex":"#143","name":"#143 - Snorlax","slug":"snorlax"},{"pokedex":"#144","name":"#144 - Articuno","slug":"articuno"},{"pokedex":"#145","name":"#145 - Zapdos","slug":"zapdos"},{"pokedex":"#146","name":"#146 - Moltres","slug":"moltres"},{"pokedex":"#147","name":"#147 - Dratini","slug":"dratini"},{"pokedex":"#148","name":"#148 - Dragonair","slug":"dragonair"},{"pokedex":"#149","name":"#149 - Dragonite","slug":"dragonite"},{"pokedex":"#150","name":"#150 - Mewtwo","slug":"mewtwo"},{"pokedex":"#151","name":"#151 - Mew","slug":"mew"}];
    $('.what-pokemon').selectize({
      reate: false,
      render: {
        option: function(item, escape) {
          return '<div class="what-pokemon-is-it">'
          + '<img src="images/pokemons/'+item.slug+'.png">'
          + '<span>'+item.name+'</span>'
          + '</div>';
        }
      },
      sortField: 'pokedex',
      labelField: "name",
      valueField: "slug",
      searchField: "name",
      placeholder: "Select Pokemon",
      persist: false,
      maxItems: 1,
      options: pokemons,
      onItemAdd(value, $item) {
        $('.show-pokemon h2').html($item.text())
        $('.show-pokemon img').attr("src", "images/pokemons-hi/"+value+".jpg")
        $(".report-button").attr("data-reporting", value)

        $('.show-pokemon').show()
        $('.selectize-input input').blur()

        $(".report-button").on( "click", function() {
          // console.log(coords)
          if(!announced) {
            channel.push("wild_pokemon_appeared", {})

            announced = true
          }
          channel.push("seen", {coords: coords, pokemon: $(".report-button").data("reporting")})
          $('.main-menu').hide()
          $('.lay-over').hide()
          $('.lay-over .content .title').html(" ");
          $('.lay-over .content .the-lay-content').html(" ");
        });
      }
    });

    $('.lay-over').show()
  });

  // When a new message is received
  channel.on("new_msg", payload => {
    let is_yours = payload.uuid === uuid

    console.log(`Distance from message ${payload.distance_from_message}`)

    var theMessage = payload.body
    var firstWord = theMessage.split(/\s+/).slice(0,1).join(" ")
    if (firstWord.match("^:") && firstWord.match(":$")) {
      var body = `<img src="images/pokemons/${firstWord.replace(':', '').slice(0,-1)}.png"> ${theMessage.replace(firstWord, '')}`
    } else {
      var body = payload.body
    }

    if(is_yours) {
      chatInput.val("")
      var self = "true";
      messagesContainer.append(`<li class="message right appeared" data-time="${Date()}"><div class="avatar" data-username="${payload.username}" style="background: url('images/pokemons/${payload.username}.png') no-repeat center;"></div><div class="text_wrapper"><div class="pokemon">${payload.username}</div><div class="text">${body}</div></div></li>`)
    } else {
      var self = "false";
      messagesContainer.append(`<li class="message left appeared" data-time="${Date()}"><div class="avatar" data-username="${payload.username}" style="background: url('images/pokemons/${payload.username}.png') no-repeat center;"></div><div class="text_wrapper"><div class="pokemon">${payload.username}</div><div class="text">${body}</div></div></li>`)
    }

    $('.message .avatar').on('click', function() {
      chatInput.val(`:${$(this).data("username")}: `)
      chatInput.focus()
    })

    // Save the reply
    DB.insert(database, "reply", {username: payload.username, content: payload.body, self: self})

    messagesContainer.animate({scrollTop: messagesContainer.prop("scrollHeight")}, 500);
  })

  // When we receive a new pokemon seen
  channel.on("seen_report", payload => {
    messagesContainer.append(`
    <li class="pokemon-reported message left appeared">
      <a href="http://maps.google.com/maps?q=${payload.coords.lat},${payload.coords.long}" target="_blank">
        <div class="map"><img src="images/map.png"></div>
        <div class="poke-info">
          <div class="name">A wild ${payload.pokemon} reported nearby.</div>
          <div class="location">Open In Google Maps</div>
        </div>
      </a>
    </li>`)
    messagesContainer.animate({scrollTop: messagesContainer.prop("scrollHeight")}, 500);
  })

  // When we receive our username
  channel.on("random_pokemon", payload => {
    chatName = payload.random_pokemon
    chatInput.attr("placeholder", `Hi ${chatName}`).attr('data-username', chatName)
    messagesContainer.append(`<li class="message left appeared"><div class="avatar" style="background: url('images/pokemons/pikachu.png') no-repeat center;"></div><div class="text_wrapper"><div class="pokemon">Pikachu</div><div class="text">Welcome to POGOChat, ${chatName.charAt(0).toUpperCase() + chatName.slice(1)} :)</div></div></li>`)
  })

  // When a new user appears
  channel.on("wild_pokemon_appeared_report", payload => {
    console.log(payload)
    messagesContainer.append(`<li class="wild"><h3>Wild <span class="pp">${payload.wild_pokemon}</span> appeared!</h3><hr></li>`)
    messagesContainer.animate({scrollTop: messagesContainer.prop("scrollHeight")}, 500);
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

  // When we get errors from the server
  channel.on("pogochat_errors", payload => {
    console.error(`Error: ${payload.error}`)
  })

  channel.join()
    .receive("ok", resp => {
      console.log("Joined successfully", resp)

      messagesContainer.animate({scrollTop: messagesContainer.prop("scrollHeight")}, 500)
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
