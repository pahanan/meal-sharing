import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";

import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewsRouter from "./routers/reviews.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

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
app.use("/api/meals", mealsRouter); 
app.use("/api/reservations", reservationsRouter); 
app.use("/api/reviews", reviewsRouter); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});