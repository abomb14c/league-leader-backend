
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('league', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('bet');
      table.string('league_type');
      table.json('teams');
      table.integer('admin').unsigned();
      table.foreign('admin')
        .references('id')

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('league')
  ])
};
