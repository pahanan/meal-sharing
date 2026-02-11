import knex from "./database_client.js";

async function addMoreMeals() {
  console.log("Adding more meals to the database...");
  
  try {
    const newMeals = [
      {
        title: 'Brunch Bonanza',
        description: 'Weekend brunch with pancakes, eggs, bacon, fresh fruit, and mimosas',
        when: '2026-03-25 10:00:00',
        max_reservations: 20,
        price: 22.00,
        location: 'Café Morning'
      },
      {
        title: 'Seafood Special',
        description: 'Fresh catch of the day with grilled fish, shrimp, and lobster',
        when: '2026-03-27 19:30:00',
        max_reservations: 12,
        price: 45.00,
        location: 'Ocean View Restaurant'
      },
      {
        title: 'Vegan Delight',
        description: 'Plant-based feast with creative vegan dishes and desserts',
        when: '2026-03-30 18:00:00',
        max_reservations: 16,
        price: 28.00,
        location: 'Green Garden'
      },
      {
        title: 'Steakhouse Night',
        description: 'Premium cuts of steak with sides and wine pairing',
        when: '2026-04-01 20:00:00',
        max_reservations: 10,
        price: 65.00,
        location: 'The Grill House'
      },
      {
        title: 'Dessert Workshop',
        description: 'Learn to make professional desserts - cakes, pastries, and chocolates',
        when: '2026-04-03 15:00:00',
        max_reservations: 8,
        price: 35.00,
        location: 'Sweet Dreams Bakery'
      },
      {
        title: 'Wine Tasting Evening',
        description: 'Sample wines from around the world with cheese pairings',
        when: '2026-04-05 17:30:00',
        max_reservations: 25,
        price: 40.00,
        location: 'Vineyard Cellar'
      },
      {
        title: 'Comfort Food Classics',
        description: 'Hearty homemade dishes like mac & cheese, meatloaf, and apple pie',
        when: '2026-04-08 19:00:00',
        max_reservations: 18,
        price: 24.00,
        location: 'Home Kitchen'
      },
      {
        title: 'Asian Fusion',
        description: 'Blend of Asian cuisines - Thai, Chinese, and Japanese dishes',
        when: '2026-04-10 18:30:00',
        max_reservations: 14,
        price: 32.00,
        location: 'East Meets West'
      },
      {
        title: 'Farm to Table',
        description: 'Fresh organic ingredients straight from local farms',
        when: '2026-04-12 12:00:00',
        max_reservations: 22,
        price: 38.00,
        location: 'Country Farm'
      },
      {
        title: 'Cocktail Party',
        description: 'Mixology class with signature cocktails and appetizers',
        when: '2026-04-15 18:00:00',
        max_reservations: 30,
        price: 30.00,
        location: 'The Lounge'
      }
    ];

    await knex('Meal').insert(newMeals);
    console.log(`✅ Added ${newMeals.length} new meals!`);
    
    // Show updated count
    const totalMeals = await knex('Meal').count('* as count');
    console.log(`📊 Total meals in database: ${totalMeals[0].count}`);
    
    // Show sample of new meals
    console.log("\n🍽️  New meals added:");
    newMeals.forEach((meal, index) => {
      console.log(`${index + 1}. ${meal.title} - ${meal.location} - ${meal.price} DKK`);
    });
    
    console.log("\n✅ More meals added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding meals:", error);
    process.exit(1);
  }
}

addMoreMeals();
