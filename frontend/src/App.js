import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import SidePanel from "./components/SidePanel";
import Home from "./pages/Home";

const App = () => {
    return (
        <Router>
            <div className="app-layout">
                <SidePanel />
                <div className="main-content">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
