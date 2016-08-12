defmodule PogoChat.ChatChannel do
  require Logger

  use Phoenix.Channel

  alias PogoChat.Presence

  defp pokemon() do
    [
      "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie",
      "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate",
      "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoran♀", "nidorina",
      "nidoqueen", "nidoran♂", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff", "wigglytuff",
      "zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat", "venomoth", "diglett",
      "dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag",
      "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout", "weepinbell",
      "victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro",
      "magnemite", "magneton", "farfetch'd", "doduo", "dodrio", "seel", "dewgong", "grimer", "muk", "shellder",
      "cloyster", "gastly", "haunter", "gengar", "onix", "drowzee", "hypno", "krabby", "kingler", "voltorb",
      "electrode", "exeggcute", "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung", "koffing", "weezing",
      "rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu",
      "starmie", "mr. Mime", "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros", "magikarp", "gyarados",
      "lapras", "ditto", "eevee", "vaporeon", "jolteon", "flareon", "porygon", "omanyte", "omastar", "kabuto",
      "kabutops", "aerodactyl", "snorlax", "articuno", "zapdos", "moltres", "dratini", "dragonair", "dragonite", "mewtwo",
      "mew"
    ]
  end

  defp initialize_socket(socket) do
    socket = assign(socket, :uuid, UUID.uuid1())
    socket = assign(socket, :pokemon, Enum.random(pokemon()))

    socket
  end
  
  def join(_, _message, socket) do
    send(self, :after_join)

    {:ok, initialize_socket(socket)}
  end

  def handle_info(:after_join, socket) do
    push socket, "uuid", %{uuid: socket.assigns.uuid}
    push socket, "random_pokemon", %{random_pokemon: socket.assigns.pokemon}

    broadcast! socket, "wild_pokemon_appeared", %{wild_pokemon: socket.assigns.pokemon}

    {:noreply, socket}
  end

  def handle_in("new_msg", payload, socket) do
    Logger.debug "handle_in #{inspect payload}"

    socket = assign(socket, :coords, payload["coords"])

    broadcast! socket, "new_msg", payload

    {:noreply, socket}
  end

  def handle_in("announce_location", payload, socket) do
    Logger.debug "handle_in:announce_location #{inspect payload}"

    socket = assign(socket, :coords, payload["coords"])

    {:noreply, socket}
  end

  intercept ["new_msg"]

  def handle_out("new_msg", payload, socket) do
    # Calculate distance from message
    close_by_distance = 500.00

    distance = Geocalc.distance_between(
      [payload["coords"]["lat"], payload["coords"]["long"]],
      [socket.assigns.coords["lat"], socket.assigns.coords["long"]]
    )

    payload = put_in payload["distance_from_message"], distance

    Logger.debug "Distance: #{distance}"

    # Send or not send the message
    if distance <= close_by_distance do
      Logger.debug "Distance in reach"

      push socket, "new_msg", payload
    else
      Logger.debug "Distance not in reach"
    end

    {:noreply, socket}
  end
end
