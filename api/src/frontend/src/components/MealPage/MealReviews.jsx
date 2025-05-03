import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function MealReview() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/meals/${id}/reviews`);
        if (!res.ok) throw new Error('Reviews not found');
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load reviews');
      }
    }
    fetchReviews();
  }, [id]);

  return (
    <div className="container">
      <div className="meal-reviews">
        <h3>Reviews</h3>
        {error && <p className="form-error">{error}</p>}
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="review-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <h4>{review.title}</h4>
                <p>{review.description}</p>
                <div className="review-stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`star ${i < review.stars ? getStarColor(review.stars) : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getStarColor(stars) {
  if (stars < 2) return 'star-red';
  if (stars <= 3) return 'star-orange';
  return 'star-green';
}
