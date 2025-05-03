import { Link } from 'react-router-dom';
import './NavBar.css'; 

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">MealShare</div>

      <ul className="navbar-links">
        <li>
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li>
          <Link to="/meals" className="navbar-link">Meals</Link>
        </li>
      </ul>
    </nav>
  );
}
