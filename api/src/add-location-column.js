import knex from "./database_client.js";

async function addLocationColumn() {
  console.log("Adding location column to Meal table...");
  
  try {
    // Add location column to existing meals table
    await knex.schema.table('Meal', (table) => {
      table.string('location').defaultTo('Restaurant');
    });
    console.log("✅ Location column added");
    
    // Update existing meals with locations
    const locations = ['Italian Restaurant', 'Cooking School', 'Backyard BBQ', 'Sushi Bar', 'Mexican Cantina', 'Indian Kitchen', 'French Bistro', 'Mediterranean Grill'];
    const meals = await knex('Meal').select('id');
    
    for (let i = 0; i < meals.length; i++) {
      await knex('Meal').where('id', meals[i].id).update({ location: locations[i] });
    }
    
    console.log(`✅ Updated ${meals.length} meals with locations`);
    console.log("Location column setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding location column:", error);
    process.exit(1);
  }
}

addLocationColumn();
