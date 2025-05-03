import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

// GET /api/meals
mealsRouter.get("/", async (req, res) => {
  try {
    let query = knex("Meal")
      .leftJoin("Reservation", "Meal.id", "Reservation.meal_id")
      .leftJoin("Review", "Meal.id", "Review.meal_id") 
      .groupBy(
        "Meal.id",
        "Meal.title",
        "Meal.description",
        "Meal.location",
        "Meal.when",
        "Meal.max_reservations",
        "Meal.price",
        "Meal.created_date"
      )
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
      );

    if ("maxPrice" in req.query) {
      query = query.where("Meal.price", "<=", req.query.maxPrice);
    }

    if ("availableReservations" in req.query) {
      const isAvailable = req.query.availableReservations.toLowerCase() === "true";
      const operator = isAvailable ? "<" : ">=";
      query = query.havingRaw(`total_reservations ${operator} Meal.max_reservations`);
    }

    if ("title" in req.query) {
      query = query.where("Meal.title", "like", `%${req.query.title}%`);
    }

    if ("dateAfter" in req.query) {
      query = query.where("Meal.created_date", ">", req.query.dateAfter);
    }

    if ("dateBefore" in req.query) {
      query = query.where("Meal.created_date", "<", req.query.dateBefore);
    }

    if ("limit" in req.query) {
      query = query.limit(Number(req.query.limit));
    }

    const allowedColumns = ["when", "max_reservations", "price", "available_seats", "avg_rating"];
    if ("sortKey" in req.query && allowedColumns.includes(req.query.sortKey)) {
      const direction = req.query.sortDir === "desc" ? "desc" : "asc";
      query = query.orderBy(req.query.sortKey, direction);
    }

    const meals = await query;
    res.json(meals);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/meals/:id
mealsRouter.get("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;

    const meal = await knex("Meal").where({ id: mealId }).first();
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const reservationSum = await knex("Reservation")
      .where({ meal_id: mealId })
      .sum('number_of_guests as total_guests')
      .first();

    const totalGuests = reservationSum.total_guests || 0;
    const availableSeats = meal.max_reservations - totalGuests;

    res.json({
      ...meal,
      availableSeats: availableSeats
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/meals
mealsRouter.post("/", async (req, res) => {
  try {
    const meal = {
      ...req.body,
      max_reservations: Number(req.body.max_reservations),
      when: new Date(req.body.when).toISOString().slice(0, 19).replace("T", " "),
      created_date: new Date(req.body.created_date).toISOString().slice(0, 19).replace("T", " "),
    };
    const [id] = await knex("Meal").insert(meal);
    res.status(201).json({ message: "Meal added with id " + id });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT /api/meals/:id
mealsRouter.put("/:id", async (req, res) => {
  try {
    const meal = {
      ...req.body,
      max_reservations: Number(req.body.max_reservations),
      when: new Date(req.body.when).toISOString().slice(0, 19).replace("T", " "),
      created_date: new Date(req.body.created_date).toISOString().slice(0, 19).replace("T", " "),
    };
    const updated = await knex("Meal")
      .where({ id: req.params.id })
      .update(meal);

    if (!updated) {
      return res.status(404).json({ message: "No meal found" });
    }
    res.status(200).json(meal);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /api/meals/:id
mealsRouter.delete("/:id", async (req, res) => {
  try {
    const meal = await knex("Meal")
      .where({ id: req.params.id })
      .del();

    if (!meal) {
      return res.status(404).json({ message: "No meal found" });
    }
    res.status(200).json({ message: "Meal deleted" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/meals/:meal_id/reviews
mealsRouter.get("/:meal_id/reviews", async (req, res) => {
  try {
    const reviews = await knex("Review")
      .select("*")
      .where("meal_id", req.params.meal_id);

    res.json(reviews);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

export default mealsRouter;
