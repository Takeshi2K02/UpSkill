import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LearningPlan from "./pages/LearningPlan";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/learning-plans" element={<LearningPlan />} />
            </Routes>
        </Router>
    );
};

export default App;
