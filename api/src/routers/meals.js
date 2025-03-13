import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

mealsRouter.get("/meals", async (req, res) => {
    try {
        let query = knex.select("*").from("Meal");

        if ("maxPrice" in req.query) {
            query = query.
                where("price", "<=", req.query.maxPrice);
        }

        if ("availableReservations" in req.query) {
            const isAvailable = req.query.availableReservations.toLowerCase() === "true";
            const operator = isAvailable ? "<" : ">=";
        
            query = knex
                .select([
                    "Meal.id", "Meal.title", "Meal.description", "Meal.location",
                    "Meal.when", "Meal.max_reservations", "Meal.price", "Meal.created_date"
            ]).from("Meal")
                .leftJoin("Reservation", "Meal.id", "=", "Reservation.meal_id")
                .groupBy([
                    "Meal.id", "Meal.title", "Meal.description", "Meal.location",
                    "Meal.when", "Meal.max_reservations", "Meal.price", "Meal.created_date"
            ])
                .select(knex.raw("COALESCE(SUM(Reservation.number_of_guests), 0) as total_reservations"))
                .havingRaw(`total_reservations ${operator} Meal.max_reservations`);
        }

        if ("title" in req.query) {
            query = query.
                where("title", "like", `%${req.query.title}%`);
        }

        if ("dateAfter" in req.query) {
            query = query.
                where("created_date", ">", req.query.dateAfter);
        }

        if ("dateBefore" in req.query) {
            query = query.
                where("created_date", "<", req.query.dateBefore);
        }

        if ("limit" in req.query) {
            query = query.limit(Number(req.query.limit));
        }

        if ("sortKey" in req.query) {
            const allowedColumns = ["when", "max_reservations", "price"];
            if (allowedColumns.includes(req.query.sortKey)) {
                query = query.orderBy(req.query.sortKey, "asc");
            } else {
                return res.status(400).json({ error: "Invalid sort key" });
            }
        }

        if("sortDir" in req.query){
            if(req.query.sortDir === "desc"){
                query = query.orderBy(req.query.sortKey, "desc");
            }
            
            if(req.query.sortDir === "asc"){
                query = query.orderBy(req.query.sortKey, "asc");
            }

            if(req.query.sortDir !== "asc" && req.query.sortDir !== "desc"){
                return res.status(400).json({ error: "Invalid sort direction" });
            }
        }

        const meals = await query;
        res.json(meals);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

mealsRouter.get("/meals/:id", async (req, res) => {
    try {
        const meal = await knex
            .select("*")
            .from('Meal')   
            .where("id", req.params.id);
        if (!meal.length) {
            return res.status(404).json({ message: "No meal found" });
        }
        res.status(200).json(meal[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

mealsRouter.post("/meals", async (req, res) => {
    try {
        const meal = {
            ...req.body,
            max_reservations: Number(req.body.max_reservations),
            when: new Date(req.body.when).toISOString().slice(0, 19).replace("T", " "),
            created_date: new Date(req.body.created_date).toISOString().slice(0, 19).replace("T", " "),
        };
        const [id] = await knex("Meal")
            .insert(meal);
        res.status(201).json({ message: "Meal added with id " + id });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

mealsRouter.put("/meals/:id", async (req, res) => {
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
            return res.status(404).json({message: "No meal found" });
        }
        res.status(200).json(meal);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

mealsRouter.delete("/meals/:id", async (req, res) => {
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

export default mealsRouter;
