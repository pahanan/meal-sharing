import express from "express";
import knex from "../database_client.js";

const reviewsRouter = express.Router();

// GET /api/reviews
reviewsRouter.get("/", async (req, res) => {
  try {
    const reviews = await knex
      .select("*")
      .from("Review");

    res.json(reviews);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/reviews/:id
reviewsRouter.get("/:id", async (req, res) => {
  try {
    const review = await knex
      .select("*")
      .from("Review")
      .where("id", req.params.id);

    if (!review.length) {
      return res.status(404).json({ message: "No review found" });
    }
    res.status(200).json(review[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/reviews/meals/:meal_id
reviewsRouter.get("/meals/:meal_id", async (req, res) => {
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

// POST /api/reviews
reviewsRouter.post("/", async (req, res) => {
  try {
    const review = {
      ...req.body,
      meal_id: Number(req.body.meal_id),
      stars: Number(req.body.stars),
      created_date: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    const [id] = await knex("Review").insert(review);
    res.status(201).json({ message: "Review added with id " + id });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// PUT /api/reviews/:id
reviewsRouter.put("/:id", async (req, res) => {
  try {
    const review = {
      ...req.body,
      meal_id: Number(req.body.meal_id),
      stars: Number(req.body.stars),
      created_date: new Date(req.body.created_date).toISOString().slice(0, 19).replace("T", " "),
    };
    const updated = await knex("Review")
      .where({ id: req.params.id })
      .update(review);

    if (!updated) {
      return res.status(404).json({ message: "No review found" });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /api/reviews/:id
reviewsRouter.delete("/:id", async (req, res) => {
  try {
    const deleted = await knex("Review")
      .where({ id: req.params.id })
      .del();

    if (!deleted) {
      return res.status(404).json({ message: "No review found" });
    }
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

export default reviewsRouter;