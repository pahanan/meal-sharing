export default function MealDetails({ meal }) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>{meal.title}</h2>
        <p>{meal.description}</p>
        <p>Location: {meal.location}</p>
        <p>Price: {meal.price} DKK</p>
      </div>
    );
  }
  