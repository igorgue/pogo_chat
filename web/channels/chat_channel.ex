require Logger

defmodule PogoChat.ChatChannel do
  use Phoenix.Channel

  import Phoenix.HTML, only: [html_escape: 1]
  alias PogoChat.Pokemon, as: Pokemon

  @close_by_distance 1000
  @max_message_size 255

  defp initialize_socket(socket, payload) do
    socket = assign socket, :coords, payload["coords"]
    socket = assign socket, :uuid, UUID.uuid1
    socket = assign socket, :pokemon, Enum.random Pokemon.all
    socket = assign socket, :nearby_users_ids, []
    socket = assign socket, :announced_ids, []

    socket
  end

  defp geocalc_distance(point_a, point_b) do
    Geocalc.distance_between [point_a["lat"] , point_a["long"]], [point_b["lat"], point_b["long"]]
  end

  def join(_, payload, socket) do
    socket = initialize_socket socket, payload

    send self, :after_join

    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    push socket, "uuid", %{"uuid": socket.assigns.uuid}
    push socket, "random_pokemon", %{"random_pokemon": socket.assigns.pokemon}

    # XXX DO NOT SEND ANY MESSAGE HERE, IOS MOBILE IS AWEFUL

    {:noreply, socket}
  end

  def handle_in("new_msg", payload, socket) do
    # Sanitize the data
    {_, safe_body} = html_escape payload["body"]

    payload = put_in payload["body"], safe_body

    socket = assign socket, :coords, payload["coords"]

    if String.length(payload["body"]) != 0 and String.length(payload["body"]) <= @max_message_size do
      broadcast! socket, "new_msg", payload

      {:noreply, socket}
    else
      payload = put_in payload["error"], "Error trying to send a message, that's too long or empty"
      push socket, "pogochat_errors", payload

      {:noreply, socket}
    end
  end

  def handle_in("wild_pokemon_appeared", _, socket) do
    broadcast! socket, "wild_pokemon_appeared", %{
      "wild_pokemon": socket.assigns.pokemon,
      "coords": socket.assigns.coords,
      "uuid": socket.assigns.uuid
    }

    {:noreply, socket}
  end

  def handle_in("announce_location", payload, socket) do
    socket = assign socket, :coords, payload["coords"]
    payload = put_in payload["uuid"], socket.assigns.uuid
    payload = put_in payload["pokemon"], socket.assigns.pokemon

    broadcast! socket, "announce_location", payload

    {:noreply, socket}
  end

  def handle_in("seen", payload, socket) do
    broadcast! socket, "seen", %{
      "seen_by_uuid": socket.assigns.uuid,
      "seen_by_pokemon": socket.assigns.pokemon,
      "coords": payload["coords"],
      "pokemon": payload["pokemon"]
    }

    {:noreply, socket}
  end

  intercept ["new_msg", "announce_location", "seen", "wild_pokemon_appeared"]

  def handle_out("new_msg", payload, socket) do
    # Calculate distance from message
    distance = geocalc_distance payload["coords"], socket.assigns.coords
    payload = put_in payload["distance_from_message"], distance

    # Send or not send the message
    socket = if distance <= @close_by_distance do
      socket = assign socket, :nearby_users_ids, Enum.uniq socket.assigns.nearby_users_ids ++ [payload["uuid"]]

      payload = put_in payload["distance_from_message"], distance

      push socket, "nearby_users_count", %{"nearby_users_count": Enum.count socket.assigns.nearby_users_ids}
      push socket, "new_msg", payload

      socket
    else
      socket
    end

    {:noreply, socket}
  end

  def handle_out("announce_location", payload, socket) do
    # If the socket doens't have coords *yet* it wouldn't get the message
    distance = geocalc_distance payload["coords"], socket.assigns.coords

    # Send or not send the message
    socket = if distance <= @close_by_distance and payload["uuid"] != socket.assigns.uuid do
      socket = assign socket, :nearby_users_ids, Enum.uniq socket.assigns.nearby_users_ids ++ [payload["uuid"]]

      push socket, "nearby_users_count", %{"nearby_users_count": Enum.count socket.assigns.nearby_users_ids}

      socket
    else
      socket
    end

    {:noreply, socket}
  end

  def handle_out("wild_pokemon_appeared", payload, socket) do
    if payload.uuid == socket.assigns.uuid do
      # We the same homie

      {:noreply, socket}
    else
      # We not the same homie
      distance = geocalc_distance payload.coords, socket.assigns.coords

      # Send or not send the message
      socket = if distance <= @close_by_distance do
        if payload.uuid in socket.assigns.announced_ids do
          socket
        else
          push socket, "wild_pokemon_appeared_report", %{"wild_pokemon": payload.wild_pokemon, "new_uuid": payload.uuid, "distance": distance}

          socket = assign socket, :announced_ids, Enum.uniq socket.assigns.announced_ids ++ [payload.uuid]

          socket
        end
      else
        socket
      end

      {:noreply, socket}
    end
  end

  def handle_out("seen", payload, socket) do
    distance = geocalc_distance payload.coords, socket.assigns.coords

    # Send or not send the message
    if distance <= @close_by_distance and payload.seen_by_uuid != socket.assigns.uuid do
      push socket, "seen_report", payload
    else
      socket
    end

    {:noreply, socket}
  end
end
