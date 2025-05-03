import MealReservation from './MealReservation.jsx';
import MealReviewForm from './MealReviewForm.jsx';
import MealReview from './MealReviews.jsx';
import './MealPage.css';

export default function MealPage() {
  
  return (
    <div className="meal-page-background">
    <div className="meal-page-container">
      <MealReservation />
      <MealReviewForm />
      <MealReview />
    </div>
    </div>
  );
}
