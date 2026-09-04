/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Insere os novos veículos diretamente sem usar .del() para preservar os dados existentes
  await knex('veiculos').insert([
    {
      placa: 'MBZ-9876',
      montadora: 'Mercedes-Benz',
      modelo: 'Actros 2651'
    },
    {
      placa: 'DAF-5432',
      montadora: 'DAF',
      modelo: 'XF 530'
    }
  ]);
};
