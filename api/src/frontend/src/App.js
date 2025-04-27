import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import MealsList from './components/MealsList/MealsList';
import MealPage from './components/MealPage/MealPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/meals" element={<MealsList />} />
        <Route path="/meals/:id" element={<MealPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;