import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

mealsRouter.get("/meals", async (req, res) => {
    try {
        const meals = await knex
            .select("*")
            .from("Meal")

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
