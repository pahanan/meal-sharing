const knex = require("knex");

const connection = knex({
  client: "sqlite3",
  connection: {
    filename: "./database.sqlite"
  },
  useNullAsDefault: true
});

module.exports = connection;
