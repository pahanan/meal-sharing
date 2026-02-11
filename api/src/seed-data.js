import knex from "./database_client.js";

const sampleMeals = [
  {
    title: 'Pizza Night',
    description: 'Homemade pizza with various toppings including margherita, pepperoni, and vegetarian options',
    when: '2026-02-15 19:00:00',
    max_reservations: 10,
    price: 12.50
  },
  {
    title: 'Pasta Workshop',
    description: 'Learn to make fresh pasta from scratch with Italian chef. Includes fettuccine, ravioli, and tiramisu dessert',
    when: '2026-02-20 18:30:00',
    max_reservations: 8,
    price: 25.00
  },
  {
    title: 'BBQ Party',
    description: 'Grilled meats and vegetables with homemade sauces, sides, and drinks. Perfect summer evening',
    when: '2026-02-25 17:00:00',
    max_reservations: 15,
    price: 18.75
  },
  {
    title: 'Sushi Making Class',
    description: 'Master the art of sushi making with fresh fish and traditional techniques',
    when: '2026-03-01 16:00:00',
    max_reservations: 6,
    price: 35.00
  },
  {
    title: 'Taco Tuesday',
    description: 'Authentic Mexican tacos with various fillings, salsa bar, and margaritas',
    when: '2026-03-05 19:30:00',
    max_reservations: 12,
    price: 15.00
  },
  {
    title: 'Indian Curry Night',
    description: 'Explore different Indian curries with naan bread, rice, and chutneys',
    when: '2026-03-10 18:00:00',
    max_reservations: 10,
    price: 22.00
  },
  {
    title: 'French Bistro Evening',
    description: 'Classic French cuisine including coq au vin, ratatouille, and crème brûlée',
    when: '2026-03-15 19:00:00',
    max_reservations: 8,
    price: 45.00
  },
  {
    title: 'Mediterranean Feast',
    description: 'Greek and Mediterranean dishes including hummus, falafel, grilled lamb, and baklava',
    when: '2026-03-20 18:30:00',
    max_reservations: 14,
    price: 28.00
  }
];

async function seedDatabase() {
  console.log("Seeding database with sample meals...");
  
  try {
    // Clear existing data
    await knex('Meal').del();
    console.log("Cleared existing meals");
    
    // Insert new data
    await knex('Meal').insert(sampleMeals);
    console.log(`Added ${sampleMeals.length} sample meals`);
    
    // Verify data
    const count = await knex('Meal').count('* as count');
    console.log(`Total meals in database: ${count[0].count}`);
    
    // Show sample data
    const meals = await knex('Meal').select('*').limit(3);
    console.log("Sample meals:");
    meals.forEach(meal => {
      console.log(`- ${meal.title}: ${meal.description.substring(0, 50)}...`);
    });
    
    console.log("Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
