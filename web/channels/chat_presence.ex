defmodule PogoChat.Presence do
  use Phoenix.Presence, otp_app: :pogo_chat, pubsub_server: PogoChat.PubSub
end
