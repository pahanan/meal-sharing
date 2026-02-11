import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MealDetails from './MealDetails';
import MealReservationForm from './MealReservationForm';
import './MealPage.css';

export default function MealReservation() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [reservation, setReservation] = useState({ name: '', email: '', phone: '', number_of_guests: 1 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  useEffect(() => {
    async function fetchMeal() {
      try {
        // First get all meals, then find the specific one
        const res = await fetch('/api/all-meals');
        if (!res.ok) throw new Error('Meals not found');
        const meals = await res.json();
        const specificMeal = meals.find(m => m.id === parseInt(id));
        if (!specificMeal) throw new Error('Meal not found');
        setMeal(specificMeal);
      } catch (error) {
        console.error('Failed to fetch meal:', error);
      }
    }

    fetchMeal();
    const interval = setInterval(fetchMeal, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reservation, meal_id: id }),
      });
      if (res.ok) setSuccess('Reservation successful!');
      else throw new Error('Failed to reserve.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!meal) return <p>Loading meal...</p>;

  return (
    <div className="reservation-container">
      <div className="reservation-left">
        <MealDetails meal={meal} />
      </div>
      <div className="reservation-right">
        <div className="seat-indicator">
          <span>Available Reservations: </span>
          <span style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'inline-block',
            fontSize: '16px',
            minWidth: '30px',
            textAlign: 'center'
          }}>
            {meal.available_seats || meal.max_reservations}
          </span>
        </div>

        <div className="reservation-right">
        {(meal.available_seats || meal.max_reservations) <= 0 && (
          <div className="form-overlay">No seats available</div>
        )}

        <div className={`reservation-form-wrapper ${(meal.available_seats || meal.max_reservations) <= 0 ? 'disabled-form' : ''}`}>
          <MealReservationForm
            reservation={reservation}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            success={success}
          />
        </div>
      </div>

      </div>
    </div>
  );
}

function getSeatColor(seats) {
  if (seats <= 0) return 'red';
  if (seats <= 5) return 'orange';
  return 'green';
}
