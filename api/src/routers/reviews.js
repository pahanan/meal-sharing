import express from "express";
import knex from "../database_client.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/reviews", async (req, res) => {
    try {
        const reviews = await knex
            .select("*")
            .from("Review")

        res.json(reviews);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

reviewsRouter.get("/reviews/:id", async (req, res) => {
    try {
        const reviews = await knex
            .select("*")
            .from('Review')   
            .where("id", req.params.id);
        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found" });
        }
        res.status(200).json(reviews[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

reviewsRouter.get("/meals/:meal_id/reviews", async (req, res) => {
    try {
        const reviews = await knex
            .select("*")
            .from("Review")
            .where("meal_id", req.params.meal_id);
        res.json(reviews);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});  

reviewsRouter.post("/reviews", async (req, res) => {
    try {
        const reviews = {
            ...req.body,
            meal_id: Number(req.body.meal_id),
            stars: Number(req.body.stars),
            created_date: new Date(req.body.created_date).toISOString().slice(0, 19).replace("T", " "),
        };
        const id = await knex("Review")
            .insert(reviews);
        res.status(201).json({ message: "Reviews added with id " + id });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

reviewsRouter.put("/reviews/:id", async (req, res) => {
    try {
        const reviews = {
            ...req.body,
            meal_id: Number(req.body.meal_id),
            stars: Number(req.body.stars),
            created_date: new Date(req.body.created_date).toISOString().slice(0, 19).replace("T", " "),
        };
        const updated = await knex("Review")
            .where({ id: req.params.id })
            .update(reviews);
        if (!updated) {
            return res.status(404).json({message: "No reviews found" });
        }
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

reviewsRouter.delete("/reviews/:id", async (req, res) => {
    try {
        const reviews = await knex("Review")
            .where({ id: req.params.id })
            .del();
        if (!reviews) {
            return res.status(404).json({ message: "No reviews found" });
        }
        res.status(200).json({ message: "reviews deleted" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});        



export default reviewsRouter;
