import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./MealList.css"; 

export default function MealsList() {
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("when");  
  const [sortDir, setSortDir] = useState("asc");  

  useEffect(() => {
    async function fetchMeals() {
      let query = `/api/meals?`;

      if (searchTerm) {
        query += `title=${encodeURIComponent(searchTerm)}&`;
      }

      if (sortKey) {
        query += `sortKey=${sortKey}&sortDir=${sortDir}`;
      }

      const res = await fetch(query);
      const data = await res.json();
      setMeals(data);
    }
  
    fetchMeals();
  }, [searchTerm, sortKey, sortDir]);

  return (
    <div className="meals-page">
      <div className="meals-content">
        <h1 className="meals-title">All Meals</h1>

        <div className="meals-filters">
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="filter-select"
          >
            <option value="">None</option>
            <option value="price">Price</option>
            <option value="when">Date</option>
            <option value="available_seats">Available Seats</option>
          </select>

          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            className="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="meals-grid">
          {meals.length === 0 ? (
            <p className="no-meals">No meals found</p>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="meal-card">
                <h3>{meal.title}</h3>

                {meal.avg_rating && !isNaN(meal.avg_rating) && (
                  <div className="meal-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= Math.round(Number(meal.avg_rating)) ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="rating-number">{Number(meal.avg_rating).toFixed(1)}</span>
                  </div>
                )}

                <p className="meal-description">
                  {meal.description?.slice(0, 60)}...
                </p>
                <p className="meal-price">
                  {meal.price} DKK
                </p>
                <Link to={`/meals/${meal.id}`}>
                  <button className="meal-button">View Meal</button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
