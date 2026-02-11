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
      const { meal_id, name, email, phone, number_of_guests } = req.body;

      // Validate required fields
      if (!meal_id || !name || !email || !phone) {
        return res.status(400).json({ error: "Missing required fields: meal_id, name, email, phone" });
      }

      const meal = await knex("Meal").where({ id: meal_id }).first();
      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      const reservationSum = await knex("Reservation")
        .where({ meal_id })
        .sum('number_of_guests as total_guests')
        .first();

      const totalGuests = reservationSum.total_guests || 0;
      const requestedGuests = Number(number_of_guests) || 1;
      const availableSeats = meal.max_reservations - totalGuests;

      if (availableSeats < requestedGuests) {
        return res.status(400).json({ 
          error: "Not enough available seats", 
          available_seats: availableSeats,
          requested_guests: requestedGuests
        });
      }

      const reservation = {
        meal_id: Number(meal_id),
        name: name,
        email: email,
        phone: phone,
        number_of_guests: requestedGuests,
      };
  
      const [id] = await knex("Reservation").insert(reservation);
      
      // Return the created reservation
      const createdReservation = await knex("Reservation").where({ id }).first();
      res.status(201).json(createdReservation);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Database error" });
    }
  });

// PUT /api/reservations/:id
reservationRouter.put("/:id", async (req, res) => {
  try {
    const { meal_id, name, email, phone, number_of_guests } = req.body;
    
    const reservation = {
      meal_id: Number(meal_id),
      name: name,
      email: email,
      phone: phone,
      number_of_guests: Number(number_of_guests),
    };
    
    const updated = await knex("Reservation")
      .where({ id: req.params.id })
      .update(reservation);

    if (!updated) {
      return res.status(404).json({ message: "No reservation found" });
    }
    
    // Return updated reservation
    const updatedReservation = await knex("Reservation").where({ id: req.params.id }).first();
    res.status(200).json(updatedReservation);
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