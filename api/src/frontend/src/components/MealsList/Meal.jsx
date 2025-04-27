import React from "react";

export default function Meal({ meal }) {
  if (!meal) {
    return <p>Meal not found.</p>;
  }

  return (
    <div>
      <h2>{meal.title}</h2>
      <p>{meal.description}</p>
      <p>Location: {meal.location}</p>
      <p>Price: {meal.price} DKK</p>
    </div>
  );
}