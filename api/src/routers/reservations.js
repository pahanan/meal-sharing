import express from "express";
import knex from "../database_client.js";

const reservationRouter = express.Router();

reservationRouter.get("/reservation", async (req, res) => {
    try {
        const reservation = await knex
            .select("*")
            .from("Reservation")

        res.json(reservation);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

reservationRouter.get("/reservation/:id", async (req, res) => {
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

reservationRouter.post("/reservation", async (req, res) => {
    try {
        const reservation = {
            ...req.body,
            number_of_guests: Number(req.body.number_of_guests),
            meal_id: Number(req.body.meal_id),
            created_date: new Date(req.body.created_date).toISOString().slice(0, 19).replace("T", " "),
        };
        const id = await knex("Reservation")
            .insert(reservation);
        res.status(201).json({ message: "Reservation added with id " + id });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

reservationRouter.put("/reservation/:id", async (req, res) => {
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
            return res.status(404).json({message: "No reservation found" });
        }
        res.status(200).json(reservation);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

reservationRouter.delete("/reservation/:id", async (req, res) => {
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
