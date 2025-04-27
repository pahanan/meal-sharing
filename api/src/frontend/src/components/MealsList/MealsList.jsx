import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./Meal.css";

export default function MealsList() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      const res = await fetch('/api/meals');
      const data = await res.json();
      setMeals(data);
    }
    fetchMeals();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>All Meals</h1>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            <Link to={`/meals/${meal.id}`}>{meal.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}