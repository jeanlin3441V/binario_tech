exports.up = async function(knex) {
    await knex.schema.createTable('veiculos', function(table) {
        table.increments('id').primary();
        table.string('placa').notNullable().unique();
        table.string('montadora').notNullable();
        table.string('modelo').notNullable();
    });

    await knex.schema.createTable('telemetria', function(table) {
        table.increments('id').primary();
        table.integer('veiculo_id').unsigned().notNullable();
        table.float('velocidade').notNullable();
        table.float('temperatura_motor').notNullable();
        table.timestamp('capturado_em').defaultTo(knex.fn.now()); // Corrigido de 'capturadi_em' para 'capturado_em'

        table.foreign('veiculo_id').references('id').inTable('veiculos').onDelete('CASCADE');
    });
};

// O Knex exige obrigatoriamente a função down para desfazer a migração:
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('telemetria');
    await knex.schema.dropTableIfExists('veiculos');
};
