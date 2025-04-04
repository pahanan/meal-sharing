import React, { useEffect, useState } from "react";

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
    <div>
      <h2>Available Meals</h2>
      {meals.length === 0 ? (
        <p>Loading meals...</p>
      ) : (
        meals.map((meal) => (
          <div key={meal.id}>
            <p><strong>Title:</strong> {meal.title}</p>
            <p><strong>Description:</strong> {meal.description}</p>
            <p><strong>Price:</strong> {meal.price} DKK</p>
            <br></br>
          </div>
        ))
      )}
    </div>
  );
};

export default MealsList;
