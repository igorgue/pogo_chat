export var DB = {
  setup: function() {
    var database = new localStorageDB("chat", localStorage);
    if(! database.tableExists("reply")) {
      database.createTable("reply", ["username", "content", "self"]);
      database.commit();
    }

    if(database.tableExists("user")) {
      $('.select-team').hide();
      $('.chat').show();
    } else {
      database.createTable("user", ["username", "uuid", "team"]);

      database.insertOrUpdate("user", {id: '1'}, {username: "username", uuid: "uuid", team: "mystic"});
      database.commit();
    }


    return database
    console.log("Database setup done");
  },

  query: function(database, table) {
    return database.queryAll(table)
  },

  insert: function(database, table, payload) {
    database.insert(table, payload);
    database.commit();
  }
}
