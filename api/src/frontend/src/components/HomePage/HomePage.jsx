import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const res = await fetch('/api/meals');
        const data = await res.json();
        const shuffled = data.sort(() => 0.5 - Math.random());
        setMeals(shuffled.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch meals:', error);
      }
    }

    fetchMeals();
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Meal Sharing!</h1>
      <p className="home-subtitle">Find delicious meals and share unforgettable moments!</p>

      <Link to="/meals" className="meals-link-button">Browse Meals</Link>

      <div className="meal-cards">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <h3>{meal.title}</h3>
            <p>{meal.description.slice(0, 60)}...</p>
            <p className="meal-price">{meal.price} DKK</p>
            <Link to={`/meals/${meal.id}`} className="meal-link-button">View Meal</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
