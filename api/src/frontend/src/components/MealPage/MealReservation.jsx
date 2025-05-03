import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MealDetails from './MealDetails';
import MealReservationForm from './MealReservationForm';
import './MealPage.css';

export default function MealReservation() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [reservation, setReservation] = useState({ name: '', email: '', phonenumber: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  useEffect(() => {
    async function fetchMeal() {
      try {
        const res = await fetch(`/api/meals/${id}`);
        if (!res.ok) throw new Error('Meal not found');
        const data = await res.json();
        setMeal(data);
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
          <span>Available Reservations:</span>
          <div className={`seat-badge ${getSeatColor(meal.availableSeats)}`}>
            {meal.availableSeats}
          </div>
        </div>

        <div className="reservation-right">
        {meal.availableSeats <= 0 && (
          <div className="form-overlay">No seats available</div>
        )}

        <div className={`reservation-form-wrapper ${meal.availableSeats <= 0 ? 'disabled-form' : ''}`}>
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
