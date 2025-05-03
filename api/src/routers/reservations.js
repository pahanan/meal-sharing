import express from "express";
import knex from "../database_client.js";

const reservationRouter = express.Router();

// GET /api/reservations
reservationRouter.get("/", async (req, res) => {
  try {
    const reservations = await knex
      .select("*")
      .from("Reservation");

    res.json(reservations);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/reservations/:id
reservationRouter.get("/:id", async (req, res) => {
  try {
    const reservation = await knex
      .select("*")
      .from('Reservation')
      .where("id", req.params.id);

    if (!reservation.length) {
      return res.status(404).json({ message: "No reservation found" });
    }
    res.status(200).json(reservation[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/reservations
reservationRouter.post("/", async (req, res) => {
    try {
      const { meal_id } = req.body;

      const meal = await knex("Meal").where({ id: meal_id }).first();
      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      const reservationSum = await knex("Reservation")
        .where({ meal_id })
        .sum('number_of_guests as total_guests')
        .first();

      const totalGuests = reservationSum.total_guests || 0;
      const availableSeats = meal.max_reservations - totalGuests;

      if (availableSeats <= 0) {
        return res.status(400).json({ error: "No available seats for this meal" });
      }

      const reservation = {
        contact_name: req.body.name,
        contact_email: req.body.email,
        contact_phonenumber: req.body.phonenumber,
        number_of_guests: Number(req.body.number_of_guests || 1),
        meal_id: Number(req.body.meal_id),
        created_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
  
      const [id] = await knex("Reservation").insert(reservation);
      res.status(201).json({ message: "Reservation added with id " + id });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Database error" });
    }
  });

// PUT /api/reservations/:id
reservationRouter.put("/:id", async (req, res) => {
  try {
    const reservation = {
      ...req.body,
      number_of_guests: Number(req.body.number_of_guests),
      meal_id: Number(req.body.meal_id),
      created_date: new Date(req.body.created_date).toISOString().slice(0, 19).replace("T", " "),
    };
    const updated = await knex("Reservation")
      .where({ id: req.params.id })
      .update(reservation);

    if (!updated) {
      return res.status(404).json({ message: "No reservation found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /api/reservations/:id
reservationRouter.delete("/:id", async (req, res) => {
  try {
    const reservation = await knex("Reservation")
      .where({ id: req.params.id })
      .del();

    if (!reservation) {
      return res.status(404).json({ message: "No reservation found" });
    }
    res.status(200).json({ message: "Reservation deleted" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

export default reservationRouter;