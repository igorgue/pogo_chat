defmodule PogoChat.ChatChannel do
  require Logger

  use Phoenix.Channel

  @close_by_distance 500

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
    socket = assign(socket, :nearby_users_ids, [])

    socket
  end

  defp geocalc_distance(point_a, point_b) do
    Geocalc.distance_between(
      [point_a["lat"], point_a["long"]],
      [point_b["lat"], point_b["long"]]
    )
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

    broadcast! socket, "announce_location", %{uuid: socket.assigns.uuid, coords: socket.assigns.coords}

    {:noreply, socket}
  end

  intercept ["new_msg", "announce_location"]

  def handle_out("new_msg", payload, socket) do
    # Calculate distance from message
    distance = geocalc_distance(payload["coords"], socket.assigns.coords)
    payload = put_in payload["distance_from_message"], distance

    Logger.debug "Distance: #{distance}"

    # Send or not send the message
    socket = if distance <= @close_by_distance do
      Logger.debug "Distance in reach"

      socket = assign(socket, :nearby_users_ids, Enum.uniq(socket.assigns.nearby_users_ids ++ [payload["uuid"]]))

      payload = put_in payload["distance_from_message"], distance

      broadcast! socket, "nearby_users_count", %{nearby_users_count: Enum.count(Enum.uniq(socket.assigns.nearby_users_ids))}
      push socket, "new_msg", payload

      socket
    else
      socket
    end

    {:noreply, socket}
  end

  def handle_out("announce_location", payload, socket) do
    Logger.debug "handle_out:announce_location"

    if Map.has_key?(socket, :coords) do
      distance = geocalc_distance(payload["coords"], socket.assigns.coords)

      # Send or not send the message
      socket = if distance <= @close_by_distance and payload["uuid"] != socket.assigns.uuid do
        assign(socket, :nearby_users_ids, Enum.uniq(socket.assigns.nearby_users_ids ++ [payload["uuid"]]))
      else
        socket
      end

      broadcast! socket, "nearby_users_count", %{nearby_users_count: Enum.count(Enum.uniq(socket.assigns.nearby_users_ids))}

      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end
end
