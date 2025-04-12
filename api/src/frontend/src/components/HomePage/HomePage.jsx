import React from "react";
import MealsList from "../MealsList/MealsList";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Meal Sharing App</h1>
      <MealsList />
    </div>
  );
};

export default HomePage;