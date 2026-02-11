import knex from "./database_client.js";

async function createAllTables() {
  console.log("Creating all database tables...");
  
  try {
    // Create meals table (if not exists)
    await knex.schema.createTableIfNotExists('Meal', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.text('description');
      table.string('location');
      table.datetime('when');
      table.integer('max_reservations');
      table.decimal('price', 10, 2);
      table.timestamp('created_date').defaultTo(knex.fn.now());
    });
    console.log("✅ Meals table created");
    
    // Create reservations table
    await knex.schema.createTableIfNotExists('Reservation', (table) => {
      table.increments('id').primary();
      table.integer('meal_id').references('id').inTable('Meal').onDelete('CASCADE');
      table.string('name');
      table.string('email');
      table.string('phone');
      table.integer('number_of_guests');
      table.datetime('created_date').defaultTo(knex.fn.now());
    });
    console.log("✅ Reservations table created");
    
    // Create reviews table
    await knex.schema.createTableIfNotExists('Review', (table) => {
      table.increments('id').primary();
      table.integer('meal_id').references('id').inTable('Meal').onDelete('CASCADE');
      table.string('title');
      table.text('description');
      table.integer('stars');
      table.datetime('created_date').defaultTo(knex.fn.now());
    });
    console.log("✅ Reviews table created");
    
    console.log("All tables created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
}

createAllTables();
