// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/league_leader',
    migrations: {
      directory: './db/migrations',
    },
    useNullAsDefault: true,
  },
};
