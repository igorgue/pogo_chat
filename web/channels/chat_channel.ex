defmodule PogoChat.ChatChannel do
  require Logger

  use Phoenix.Channel

  import Phoenix.HTML, only: [html_escape: 1]

  @close_by_distance 1000

  defp pokemon() do
    [
      "abomasnow","abra","absol","accelgor","aegislash-blade","aegislash","aerodactyl","aggron","aipom","alakazam","alomomola","altaria","amaura","ambipom","amoonguss","ampharos","anorith","arbok","arcanine","arceus","archen","archeops","ariados","armaldo","aromatisse","aron","articuno","audino","aurorus","avalugg","axew","azelf","azumarill","azurill","bagon","baltoy","banette","barbaracle","barboach","basculin-blue-striped","basculin","bastiodon","bayleef","beartic","beautifly","beedrill","beheeyem","beldum","bellossom","bellsprout","bergmite","bibarel","bidoof","binacle","bisharp","blastoise","blaziken","blissey","blitzle","boldore","bonsly","bouffalant","braixen","braviary","breloom","bronzong","bronzor","budew","buizel","bulbasaur","buneary","bunnelby","burmy-sandy","burmy-trash","burmy","butterfree","cacnea","cacturne","camerupt","carbink","carnivine","carracosta","carvanha","cascoon","castform-rainy","castform-snowy","castform-sunny","castform","caterpie","celebi","chandelure","chansey","charizard-mega-x","charizard-mega-y","charizard","charmander","charmeleon","chatot","cherrim-sunshine","cherrim","cherubi","chesnaught","chespin","chikorita","chimchar","chimecho","chinchou","chingling","cinccino","clamperl","clauncher","clawitzer","claydol","clefable","clefairy","cleffa","cloyster","cobalion","cofagrigus","combee","combusken","conkeldurr","corphish","corsola","cottonee","cradily","cranidos","crawdaunt","cresselia","croagunk","crobat","croconaw","crustle","cryogonal","cubchoo","cubone","cyndaquil","darkrai","darmanitan-zen","darmanitan","darumaka","dedenne","deerling-autumn","deerling-summer","deerling-winter","deerling","deino","delcatty","delibird","delphox","deoxys-attack","deoxys-defense","deoxys-speed","deoxys","dewgong","dewott","dialga","diancie","diggersby","diglett","ditto","dodrio","doduo","donphan","doublade","dragalge","dragonair","dragonite","drapion","dratini","drifblim","drifloon","drilbur","drowzee","druddigon","ducklett","dugtrio","dunsparce","duosion","durant","dusclops","dusknoir","duskull","dustox","dwebble","eelektrik","eelektross","eevee","ekans","electabuzz","electivire","electrike","electrode","elekid","elgyem","emboar","emolga","empoleon","entei","escavalier","espeon","espurr","excadrill","exeggcute","exeggutor","exploud","farfetchd","fearow","feebas","fennekin","feraligatr","ferroseed","ferrothorn","finneon","flaaffy","flabebe-blue","flabebe-orange","flabebe-white","flabebe-yellow","flabebe","flareon","fletchinder","fletchling","floatzel","floette-blue","floette-eternal","floette-orange","floette-white","floette-yellow","floette","florges-blue","florges-orange","florges-white","florges-yellow","florges","flygon","foongus","forretress","fraxure","frillish","froakie","frogadier","froslass","furfrou-dandy","furfrou-debutante","furfrou-diamond","furfrou-heart","furfrou-kabuki","furfrou-la-reine","furfrou-matron","furfrou-pharaoh","furfrou-star","furfrou","furret","gabite","gallade","galvantula","garbodor","garchomp","gardevoir","gastly","gastrodon-east","gastrodon","genesect","gengar","geodude","gible","gigalith","girafarig","giratina-origin","giratina","glaceon","glalie","glameow","gligar","gliscor","gloom","gogoat","golbat","goldeen","golduck","golem","golett","golurk","goodra","goomy","gorebyss","gothita","gothitelle","gothorita","gourgeist","granbull","graveler","greninja","grimer","grotle","groudon-primal","groudon","grovyle","growlithe","grumpig","gulpin","gurdurr","gyarados","happiny","hariyama","haunter","hawlucha","haxorus","heatmor","heatran","heliolisk","helioptile","heracross","herdier","hippopotas","hippowdon","hitmonchan","hitmonlee","hitmontop","ho-oh","honchkrow","honedge","hoopa-unbound","hoopa","hoothoot","hoppip","horsea","houndoom","houndour","huntail","hydreigon","hypno","igglybuff","illumise","infernape","inkay","ivysaur","jellicent","jigglypuff","jirachi","jolteon","joltik","jumpluff","jynx","kabuto","kabutops","kadabra","kakuna","kangaskhan","karrablast","kecleon","keldeo-resolute","keldeo","kingdra","kingler","kirlia","klang","klefki","klink","klinklang","koffing","krabby","kricketot","kricketune","krokorok","krookodile","kyogre-primal","kyogre","kyurem-black","kyurem-white","kyurem","lairon","lampent","landorus-therian","landorus","lanturn","lapras","larvesta","larvitar","latias","latios","leafeon","leavanny","ledian","ledyba","lickilicky","lickitung","liepard","lileep","lilligant","lillipup","linoone","litleo","litwick","lombre","lopunny","lotad","loudred","lucario","ludicolo","lugia","lumineon","lunatone","luvdisc","luxio","luxray","machamp","machoke","machop","magby","magcargo","magikarp","magmar","magmortar","magnemite","magneton","magnezone","makuhita","malamar","mamoswine","manaphy","mandibuzz","manectric","mankey","mantine","mantyke","maractus","mareep","marill","marowak","marshtomp","masquerain","mawile","medicham","meditite","meganium","meloetta-pirouette","meloetta","meowstic","meowth","mesprit","metagross","metang","metapod","mew","mewtwo-mega-x","mewtwo-mega-y","mewtwo","mienfoo","mienshao","mightyena","milotic","miltank","mime-jr","minccino","minun","misdreavus","mismagius","moltres","monferno","mothim","mr-mime","mudkip","muk","munchlax","munna","murkrow","musharna","natu","nidoking","nidoqueen","nidoran-f","nidoran-m","nidorina","nidorino","nincada","ninetales","ninjask","noctowl","noibat","noivern","nosepass","numel","nuzleaf","octillery","oddish","omanyte","omastar","onix","oshawott","pachirisu","palkia","palpitoad","pancham","pangoro","panpour","pansage","pansear","paras","parasect","patrat","pawniard","pelipper","persian","petilil","phanpy","phantump","phione","pichu","pidgeot","pidgeotto","pidgey","pidove","pignite","pikachu-beautiful","pikachu-clever","pikachu-cool","pikachu-cosplay","pikachu-cute","pikachu-tough","pikachu","piloswine","pineco","pinsir","piplup","plusle","politoed","poliwag","poliwhirl","poliwrath","ponyta","poochyena","porygon-z","porygon","porygon2","primeape","prinplup","probopass","psyduck","pumpkaboo","pupitar","purrloin","purugly","pyroar","quagsire","quilava","quilladin","qwilfish","raichu","raikou","ralts","rampardos","rapidash","raticate","rattata","rayquaza","regice","regigigas","regirock","registeel","relicanth","remoraid","reshiram","reuniclus","rhydon","rhyhorn","rhyperior","riolu","roggenrola","roselia","roserade","rotom-fan","rotom-frost","rotom-heat","rotom-mow","rotom-wash","rotom","rufflet","sableye","salamence","samurott","sandile","sandshrew","sandslash","sawk","sawsbuck-autumn","sawsbuck-summer","sawsbuck-winter","sawsbuck","scatterbug","sceptile","scizor","scolipede","scrafty","scraggy","scyther","seadra","seaking","sealeo","seedot","seel","seismitoad","sentret","serperior","servine","seviper","sewaddle","sharpedo","shaymin-sky","shaymin","shedinja","shelgon","shellder","shellos-east","shellos","shelmet","shieldon","shiftry","shinx","shroomish","shuckle","shuppet","sigilyph","silcoon","simipour","simisage","simisear","skarmory","skiddo","skiploom","skitty","skorupi","skrelp","skuntank","slaking","slakoth","sliggoo","slowbro","slowking","slowpoke","slugma","slurpuff","smeargle","smoochum","sneasel","snivy","snorlax","snorunt","snover","snubbull","solosis","solrock","spearow","spewpa","spheal","spinarak","spinda","spiritomb","spoink","spritzee","squirtle","stantler","staraptor","staravia","starly","starmie","staryu","steelix","stoutland","stunfisk","stunky","sudowoodo","suicune","sunflora","sunkern","surskit","swablu","swadloon","swalot","swampert","swanna","swellow","swinub","swirlix","swoobat","sylveon","taillow","talonflame","tangela","tangrowth","tauros","teddiursa","tentacool","tentacruel","tepig","terrakion","throh","thundurus-therian","thundurus","timburr","tirtouga","togekiss","togepi","togetic","torchic","torkoal","tornadus-therian","tornadus","torterra","totodile","toxicroak","tranquill","trapinch","treecko","trevenant","tropius","trubbish","turtwig","tympole","tynamo","typhlosion","tyranitar","tyrantrum","tyrogue","tyrunt","umbreon","unfezant","unown-b","unown-c","unown-d","unown-e","unown-exclamation","unown-f","unown-g","unown-h","unown-i","unown-j","unown-k","unown-l","unown-m","unown-n","unown-o","unown-p","unown-q","unown-question","unown-r","unown-s","unown-t","unown-u","unown-v","unown-w","unown-x","unown-y","unown-z","unown","ursaring","uxie","vanillish","vanillite","vanilluxe","vaporeon","venipede","venomoth","venonat","venusaur","vespiquen","vibrava","victini","victreebel","vigoroth","vileplume","virizion","vivillon-archipelago","vivillon-continental","vivillon-elegant","vivillon-fancy","vivillon-garden","vivillon-high-plains","vivillon-icy-snow","vivillon-jungle","vivillon-marine","vivillon-modern","vivillon-monsoon","vivillon-ocean","vivillon-poke-ball","vivillon-polar","vivillon-river","vivillon-sandstorm","vivillon-savanna","vivillon-sun","vivillon-tundra","vivillon","volbeat","volcanion","volcarona","voltorb","vullaby","vulpix","wailmer","wailord","walrein","wartortle","watchog","weavile","weedle","weepinbell","weezing","whimsicott","whirlipede","whiscash","whismur","wigglytuff","wingull","wobbuffet","woobat","wooper","wormadam-sandy","wormadam-trash","wormadam","wurmple","wynaut","xatu","xerneas-neutral","xerneas","yamask","yanma","yanmega","yveltal","zangoose","zapdos","zebstrika","zekrom","zigzagoon","zoroark","zorua","zubat","zweilous","zygarde"
    ]
  end

  defp initialize_socket(socket, message) do
    socket = assign(socket, :coords, %{"lat": message["coords"]["lat"], "long": message["coords"]["long"]})
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

  def join(_, message, socket) do
    send(self, :after_join)

    {:ok, initialize_socket(socket, message)}
  end

  def handle_info(:after_join, socket) do
    push socket, "uuid", %{"uuid": socket.assigns.uuid}
    push socket, "random_pokemon", %{"random_pokemon": socket.assigns.pokemon}

    broadcast! socket, "wild_pokemon_appeared", %{"wild_pokemon": socket.assigns.pokemon}

    {:noreply, socket}
  end

  def handle_in("new_msg", payload, socket) do
    Logger.debug "handle_in #{inspect payload}"

    # Sanitize the data
    {_, safe_body} = html_escape(payload["body"])

    payload = put_in payload["body"], safe_body

    socket = assign(socket, :coords, payload["coords"])

    broadcast! socket, "new_msg", payload

    {:noreply, socket}
  end

  def handle_in("announce_location", payload, socket) do
    socket = assign(socket, :coords, payload["coords"])
    payload = put_in payload["uuid"], socket.assigns.uuid

    broadcast! socket, "announce_location", payload

    {:noreply, socket}
  end

  def handle_in("seen", payload, socket) do
    broadcast! socket, "seen", %{"seen_by_uuid": socket.assigns.uuid, "seen_by_pokemon": socket.assigns.pokemon, "coords": payload["coords"], "pokemon": payload["pokemon"]}

    {:noreply, socket}
  end

  intercept ["new_msg", "announce_location", "seen"]

  def handle_out("new_msg", payload, socket) do
    # Calculate distance from message
    Logger.debug "COORDS: #{inspect payload["coords"]}"
    distance = geocalc_distance(payload["coords"], socket.assigns.coords)
    payload = put_in payload["distance_from_message"], distance

    Logger.debug "Distance: #{distance}"

    # Send or not send the message
    socket = if distance <= @close_by_distance do
      Logger.debug "Distance in reach"

      socket = assign(socket, :nearby_users_ids, Enum.uniq(socket.assigns.nearby_users_ids ++ [payload["uuid"]]))

      payload = put_in payload["distance_from_message"], distance

      push socket, "nearby_users_count", %{"nearby_users_count": Enum.count(socket.assigns.nearby_users_ids)}
      push socket, "new_msg", payload

      socket
    else
      socket
    end

    {:noreply, socket}
  end

  def handle_out("announce_location", payload, socket) do
    Logger.debug "announce_location:out"
    #Logger.debug "handle_out:announce_location PAYLOAD: #{inspect payload} SOCKET: #{inspect socket.assigns}"

    if Map.has_key?(socket.assigns, :coords) do
      # If the socket doens't have coords *yet* it wouldn't get the message
      Logger.debug "Coords #{inspect payload["coords"]}"
      Logger.debug "assigns #{inspect socket.assigns.coords}"
      distance = geocalc_distance(payload["coords"], socket.assigns.coords)

      # Send or not send the message
      socket = if distance <= @close_by_distance and payload["uuid"] != socket.assigns.uuid do
        push socket, "nearby_users_count", %{"nearby_users_count": Enum.count(socket.assigns.nearby_users_ids)}

        assign(socket, :nearby_users_ids, Enum.uniq(socket.assigns.nearby_users_ids ++ [payload["uuid"]]))
      else
        socket
      end

      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end

  def handle_out("seen", payload, socket) do
    distance = geocalc_distance(payload.coords, socket.assigns.coords)

    # Send or not send the message
    if distance <= @close_by_distance and payload.seen_by_uuid != socket.assigns.uuid do
      push socket, "seen_report", payload
    else
      socket
    end

    {:noreply, socket}
  end
end
