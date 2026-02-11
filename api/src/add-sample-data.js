import knex from "./database_client.js";

async function addSampleData() {
  console.log("Adding sample reservations and reviews...");
  
  try {
    // Add location to existing meals
    await knex('Meal').update({ location: 'Restaurant' });
    console.log("✅ Added location to meals");
    
    // Add sample reservations
    const reservations = [
      { meal_id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', number_of_guests: 2 },
      { meal_id: 1, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', number_of_guests: 3 },
      { meal_id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-123-4567', number_of_guests: 1 },
      { meal_id: 3, name: 'Alice Brown', email: 'alice@example.com', phone: '777-888-9999', number_of_guests: 4 },
    ];
    
    await knex('Reservation').insert(reservations);
    console.log(`✅ Added ${reservations.length} sample reservations`);
    
    // Add sample reviews
    const reviews = [
      { meal_id: 1, title: 'Amazing Pizza!', description: 'Best pizza I ever had, great atmosphere!', stars: 5 },
      { meal_id: 1, title: 'Good but crowded', description: 'Food was excellent but place was too busy', stars: 4 },
      { meal_id: 2, title: 'Learned a lot!', description: 'Great pasta making workshop, very educational', stars: 5 },
      { meal_id: 3, title: 'Perfect BBQ', description: 'Amazing grilled food and great company', stars: 5 },
    ];
    
    await knex('Review').insert(reviews);
    console.log(`✅ Added ${reviews.length} sample reviews`);
    
    // Show summary
    const mealCount = await knex('Meal').count('* as count');
    const reservationCount = await knex('Reservation').count('* as count');
    const reviewCount = await knex('Review').count('* as count');
    
    console.log(`\n📊 Database Summary:`);
    console.log(`   Meals: ${mealCount[0].count}`);
    console.log(`   Reservations: ${reservationCount[0].count}`);
    console.log(`   Reviews: ${reviewCount[0].count}`);
    
    console.log("\n✅ Sample data added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding sample data:", error);
    process.exit(1);
  }
}

addSampleData();
