export default function MealReservationForm({ reservation, handleChange, handleSubmit, error, success }) {
  return (
    <div className="container">
    <form onSubmit={handleSubmit} className="reservation-form">
      <h3 className="form-title">Reserve a Seat</h3>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={reservation.name}
        onChange={handleChange}
        required
        className="form-input"
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={reservation.email}
        onChange={handleChange}
        required
        className="form-input"
      />

      <input
        type="text"
        name="phone"
        placeholder="Your Phone Number"
        value={reservation.phone}
        onChange={handleChange}
        required
        className="form-input"
      />

      <input
        type="number"
        name="number_of_guests"
        placeholder="Number of Guests"
        value={reservation.number_of_guests}
        onChange={handleChange}
        min="1"
        max="10"
        required
        className="form-input"
      />

      <button type="submit" className="meal-reservation-button">Book Seat</button>

      <div className="reservation-feedback-wrapper">
        {error && <p className="error-style">{error}</p>}
        {success && <p className="success-style">{success}</p>}
      </div>

    </form>
    </div>
  );
}
