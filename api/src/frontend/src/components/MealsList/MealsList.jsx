import React, { useEffect, useState } from "react";
import Meal from "./Meal";
import "./Meal.css";

const MealsList = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/all-meals");
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="meals-container">
    <h2>Available Meals</h2>
    {meals.length === 0 ? (
      <p>Loading meals...</p>
    ) : (
      <div className="meals-grid">
        {meals.map((meal) => (
          <Meal key={meal.id} meal={meal} />
        ))}
      </div>
    )}
  </div>
  );
};

export default MealsList;
