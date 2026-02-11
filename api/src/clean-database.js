import knex from "./database_client.js";

async function cleanDatabase() {
  console.log("Cleaning up database...");
  
  try {
    // Get all valid meal IDs
    const meals = await knex('Meal').select('id');
    const validMealIds = meals.map(m => m.id);
    console.log("Valid meal IDs:", validMealIds);
    
    // Delete reservations for non-existent meals
    const deletedReservations = await knex('Reservation')
      .whereNotIn('meal_id', validMealIds)
      .del();
    console.log(`✅ Deleted ${deletedReservations} invalid reservations`);
    
    // Delete reviews for non-existent meals
    const deletedReviews = await knex('Review')
      .whereNotIn('meal_id', validMealIds)
      .del();
    console.log(`✅ Deleted ${deletedReviews} invalid reviews`);
    
    // Show current status
    const reservationCount = await knex('Reservation').count('* as count');
    const reviewCount = await knex('Review').count('* as count');
    
    console.log(`\n📊 Clean Database Status:`);
    console.log(`   Meals: ${validMealIds.length}`);
    console.log(`   Reservations: ${reservationCount[0].count}`);
    console.log(`   Reviews: ${reviewCount[0].count}`);
    
    console.log("\n✅ Database cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error cleaning database:", error);
    process.exit(1);
  }
}

cleanDatabase();
