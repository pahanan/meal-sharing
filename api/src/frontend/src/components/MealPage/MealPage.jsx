import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function MealPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [reservation, setReservation] = useState({ name: '', email: '', phonenumber: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    
    async function fetchMeal() {
        
      try {
        const res = await fetch(`/api/meals/${id}`);
        if (!res.ok) {
          throw new Error('Meal not found');
        }
        const data = await res.json();
        setMeal(data);
      } catch (error) {
        console.error('Failed to fetch meal:', error);
      }
    }
    fetchMeal();
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
      if (res.ok) {
        setSuccess('Reservation successful!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        throw new Error('Failed to reserve.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!meal) {
    return <p>Loading meal...</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{meal.title}</h2>
      <p>{meal.description}</p>
      <p>Location: {meal.location}</p>
      <p>Price: {meal.price} DKK</p>

      <h3>Reserve a Seat</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={reservation.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={reservation.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="phonenumber"
          placeholder="Your Phone Number"
          value={reservation.phonenumber}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Book Seat</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
