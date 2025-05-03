import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import MealsList from "./components/MealsList/MealsList";
import MealPage from "./components/MealPage/MealPage";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <Router>
      <div >
        <NavBar />
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/meals" element={<MealsList />} />
            <Route path="/meals/:id" element={<MealPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;