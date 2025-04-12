import React from "react";

const Meal = ({ meal }) => {
  return (
    <div className="meal-card">
      <h3>{meal.title}</h3>
      <p>{meal.description}</p>
      <p><strong>{meal.price} DKK</strong></p>
    </div>
  );
};

export default Meal;