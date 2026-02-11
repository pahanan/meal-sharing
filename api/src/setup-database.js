import knex from "./database_client.js";

async function setupDatabase() {
  console.log("Setting up database...");
  
  try {
    // Create meals table
    await knex.schema.createTableIfNotExists('Meal', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.text('description');
      table.datetime('when');
      table.integer('max_reservations');
      table.decimal('price', 10, 2);
      table.timestamp('created_date').defaultTo(knex.fn.now());
    });
    
    console.log("Meals table created");
    
    // Check if we have data
    const count = await knex('Meal').count('* as count');
    if (count[0].count === 0) {
      // Add sample data
      await knex('Meal').insert([
        {
          title: 'Pizza Night',
          description: 'Homemade pizza with various toppings',
          when: '2026-02-15 19:00:00',
          max_reservations: 10,
          price: 12.50
        },
        {
          title: 'Pasta Workshop',
          description: 'Learn to make fresh pasta',
          when: '2026-02-20 18:30:00',
          max_reservations: 8,
          price: 25.00
        },
        {
          title: 'BBQ Party',
          description: 'Grilled meats and vegetables',
          when: '2026-02-25 17:00:00',
          max_reservations: 15,
          price: 18.75
        }
      ]);
      console.log("Sample data added");
    } else {
      console.log("Database already has data");
    }
    
    console.log("Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
