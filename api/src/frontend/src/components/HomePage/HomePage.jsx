import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    async function fetchMeals() {
      const res = await fetch('/api/meals');
      const data = await res.json();
      setMeals(data.slice(0, 3)); 
    }
    fetchMeals();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Welcome to Meal Sharing</h1>
      <h2>Featured Meals</h2>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            <Link to={`/meals/${meal.id}`}>{meal.title}</Link>
          </li>
        ))}
      </ul>
      <br />
      <Link to="/meals">
        <button>See All Meals</button>
      </Link>
    </div>
  );
}