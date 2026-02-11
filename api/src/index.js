import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// Initialize database on startup
async function initializeDatabase() {
  try {
    // Check if meals exist, if not, run the initialization
    const mealCount = await knex('Meal').count('* as count');
    if (mealCount[0].count === 0) {
      console.log("🔧 Initializing database...");
      
      // Create tables (they should already exist, but just in case)
      await knex.schema.hasTable('Meal').then(exists => {
        if (!exists) {
          return knex.schema.createTable('Meal', table => {
            table.increments('id').primary();
            table.string('title', 255).notNullable();
            table.text('description').notNullable();
            table.string('location', 255).notNullable();
            table.datetime('when').notNullable();
            table.integer('max_reservations').notNullable();
            table.decimal('price', 8, 2).notNullable();
            table.datetime('created_date').defaultTo(knex.fn.now());
          });
        }
      });

      await knex.schema.hasTable('Reservation').then(exists => {
        if (!exists) {
          return knex.schema.createTable('Reservation', table => {
            table.increments('id').primary();
            table.integer('meal_id').unsigned().references('id').inTable('Meal').onDelete('CASCADE');
            table.string('name', 255).notNullable();
            table.string('email', 255).notNullable();
            table.string('phone', 255).notNullable();
            table.integer('number_of_guests').notNullable();
            table.datetime('created_date').defaultTo(knex.fn.now());
          });
        }
      });

      await knex.schema.hasTable('Review').then(exists => {
        if (!exists) {
          return knex.schema.createTable('Review', table => {
            table.increments('id').primary();
            table.integer('meal_id').unsigned().references('id').inTable('Meal').onDelete('CASCADE');
            table.integer('stars').notNullable();
            table.string('title', 255).notNullable();
            table.text('description').notNullable();
            table.datetime('created_date').defaultTo(knex.fn.now());
          });
        }
      });

      // Add initial meals
      const meals = [
        {
          title: 'Pizza Night',
          description: 'Homemade pizza with various toppings including margherita, pepperoni, and vegetarian options',
          location: 'Restaurant',
          when: '2026-02-15 19:00:00',
          max_reservations: 10,
          price: 12.50
        },
        {
          title: 'Pasta Workshop',
          description: 'Learn to make fresh pasta from scratch with Italian chef. Includes fettuccine, ravioli, and tiramisu dessert',
          location: 'Restaurant',
          when: '2026-02-20 18:30:00',
          max_reservations: 8,
          price: 25.00
        },
        {
          title: 'BBQ Party',
          description: 'Grilled meats and vegetables with homemade sauces, sides, and drinks. Perfect summer evening',
          location: 'Restaurant',
          when: '2026-02-25 17:00:00',
          max_reservations: 15,
          price: 18.75
        },
        {
          title: 'Sushi Making Class',
          description: 'Master the art of sushi making with fresh fish and traditional techniques',
          location: 'Restaurant',
          when: '2026-03-01 16:00:00',
          max_reservations: 6,
          price: 35.00
        },
        {
          title: 'Taco Tuesday',
          description: 'Authentic Mexican tacos with various fillings, salsa bar, and margaritas',
          location: 'Restaurant',
          when: '2026-03-05 19:30:00',
          max_reservations: 12,
          price: 15.00
        },
        {
          title: 'Indian Curry Night',
          description: 'Explore different Indian curries with naan bread, rice, and chutneys',
          location: 'Restaurant',
          when: '2026-03-10 18:00:00',
          max_reservations: 10,
          price: 22.00
        },
        {
          title: 'French Bistro Evening',
          description: 'Classic French cuisine including coq au vin, ratatouille, and crème brûlée',
          location: 'Restaurant',
          when: '2026-03-15 19:00:00',
          max_reservations: 8,
          price: 45.00
        },
        {
          title: 'Mediterranean Feast',
          description: 'Greek and Mediterranean dishes including hummus, falafel, grilled lamb, and baklava',
          location: 'Restaurant',
          when: '2026-03-20 18:30:00',
          max_reservations: 14,
          price: 28.00
        }
      ];

      await knex('Meal').insert(meals);
      
      // Add more meals
      const additionalMeals = [
        {
          title: 'Brunch Bonanza',
          description: 'Weekend brunch with pancakes, eggs, bacon, fresh fruit, and mimosas',
          location: 'Café Morning',
          when: '2026-03-25 10:00:00',
          max_reservations: 20,
          price: 22.00
        },
        {
          title: 'Seafood Special',
          description: 'Fresh catch of the day with grilled fish, shrimp, and lobster',
          location: 'Ocean View Restaurant',
          when: '2026-03-27 19:30:00',
          max_reservations: 12,
          price: 45.00
        },
        {
          title: 'Vegan Delight',
          description: 'Plant-based feast with creative vegan dishes and desserts',
          location: 'Green Garden',
          when: '2026-03-30 18:00:00',
          max_reservations: 16,
          price: 28.00
        },
        {
          title: 'Steakhouse Night',
          description: 'Premium cuts of steak with sides and wine pairing',
          location: 'The Grill House',
          when: '2026-04-01 20:00:00',
          max_reservations: 10,
          price: 65.00
        },
        {
          title: 'Dessert Workshop',
          description: 'Learn to make professional desserts - cakes, pastries, and chocolates',
          location: 'Sweet Dreams Bakery',
          when: '2026-04-03 15:00:00',
          max_reservations: 8,
          price: 35.00
        },
        {
          title: 'Wine Tasting Evening',
          description: 'Sample wines from around the world with cheese pairings',
          location: 'Vineyard Cellar',
          when: '2026-04-05 17:30:00',
          max_reservations: 25,
          price: 40.00
        },
        {
          title: 'Comfort Food Classics',
          description: 'Hearty homemade dishes like mac & cheese, meatloaf, and apple pie',
          location: 'Home Kitchen',
          when: '2026-04-08 19:00:00',
          max_reservations: 18,
          price: 24.00
        },
        {
          title: 'Asian Fusion',
          description: 'Blend of Asian cuisines - Thai, Chinese, and Japanese dishes',
          location: 'East Meets West',
          when: '2026-04-10 18:30:00',
          max_reservations: 14,
          price: 32.00
        },
        {
          title: 'Farm to Table',
          description: 'Fresh organic ingredients straight from local farms',
          location: 'Country Farm',
          when: '2026-04-12 12:00:00',
          max_reservations: 22,
          price: 38.00
        },
        {
          title: 'Cocktail Party',
          description: 'Mixology class with signature cocktails and appetizers',
          location: 'The Lounge',
          when: '2026-04-15 18:00:00',
          max_reservations: 30,
          price: 30.00
        }
      ];

      await knex('Meal').insert(additionalMeals);
      
      // Add sample reservations and reviews
      const reservations = [
        { meal_id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', number_of_guests: 2 },
        { meal_id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', number_of_guests: 3 },
        { meal_id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-123-4567', number_of_guests: 1 }
      ];
      await knex('Reservation').insert(reservations);

      const reviews = [
        { meal_id: 3, stars: 5, title: 'Amazing BBQ!', description: 'Best BBQ I\'ve ever had!' },
        { meal_id: 1, stars: 4, title: 'Great Pizza', description: 'Delicious pizza and good service' }
      ];
      await knex('Review').insert(reviews);

      console.log("✅ Database initialized with 18 meals!");
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  }
}

// Run initialization before starting server
initializeDatabase().then(() => {
  console.log("🗄️ Database ready!");
}).catch(error => {
  console.error("❌ Database setup error:", error);
});

apiRouter.get("/all-meals", async (req, res) => {
  try {
    const meals = await knex("Meal")
      .select("*")
      .leftJoin("Reservation", "Meal.id", "Reservation.meal_id")
      .leftJoin("Review", "Meal.id", "Review.meal_id")
      .select(
        "Meal.id",
        "Meal.title", 
        "Meal.description",
        "Meal.location",
        "Meal.when",
        "Meal.max_reservations",
        "Meal.price",
        "Meal.created_date",
        knex.raw("COALESCE(SUM(Reservation.number_of_guests), 0) as total_reservations"),
        knex.raw("(Meal.max_reservations - COALESCE(SUM(Reservation.number_of_guests), 0)) as available_seats"),
        knex.raw("ROUND(AVG(Review.stars), 1) as avg_rating")
      )
      .groupBy("Meal.id", "Meal.title", "Meal.description", "Meal.location", "Meal.when", "Meal.max_reservations", "Meal.price", "Meal.created_date")
      .orderBy("Meal.when");
    
    res.json(meals);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

apiRouter.get("/first-meal", async (req, res) => {
  try {
    const meal = await knex("Meal").select("*").orderBy("id").first();
    if (!meal) {
      return res.status(404).json({ message: "No meals found" });
    }
    res.json(meal);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

apiRouter.get("/last-meal", async (req, res) => {
  try {
    const meal = await knex("Meal").select("*").orderBy("id", "desc").first();
    if (!meal) {
      return res.status(404).json({ message: "No meals found" });
    }
    res.json(meal);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

apiRouter.get("/future-meals", async (req, res) => {
  try {
    const meals = await knex("Meal").select("*").where("when", ">", knex.fn.now());
    res.json(meals);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

apiRouter.get("/past-meals", async (req, res) => {
  try {
    const meals = await knex("Meal").select("*").where("when", "<", knex.fn.now());
    res.json(meals);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.use("/api", apiRouter); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});