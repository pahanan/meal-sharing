import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MealPage.css';

export default function MealReviewForm() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [review, setReview] = useState({ title: '', description: '', stars: 5 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

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
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (starValue) => {
    setReview((prev) => ({ ...prev, stars: starValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review, meal_id: id }),
      });
      if (res.ok) {
        setSuccess('Review submitted!');
        setReview({ title: '', description: '', stars: 5 });
      } else {
        throw new Error('Failed to submit review.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!meal) return <p>Loading meal...</p>;

  return (
    <div className="container">
    <form onSubmit={handleSubmit} className="review-form">
      <h2 className="form-title">Leave a Review for {meal.title}</h2>

      <input
        type="text"
        name="title"
        placeholder="Review Title"
        value={review.title}
        onChange={handleChange}
        required
        className="form-input"
      />

      <textarea
        name="description"
        placeholder="Write your review"
        value={review.description}
        onChange={handleChange}
        required
        className="form-textarea"
      />

      <div className="star-rating">
        <label className="rating-label">Rating:</label>
        {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          style={{
            fontSize: '24px',
            cursor: 'pointer',
            color: (hoveredStar || review.stars) >= star ? '#FFD700' : '#ccc',
            transition: 'color 0.2s ease'
          }}
        >
          ★
        </span>
      ))}
      </div>

      <button type="submit" className="meal-review-button">Submit Review</button>
      
      <div className="reservation-feedback-wrapper">
        {error && <p className="error-style">{error}</p>}
        {success && <p className="success-style">{success}</p>}
      </div>
      
    </form>
    </div>
  );
}
