import React from 'react';
import SidePanel from '../components/SidePanel';
import Navbar from '../components/Navbar';
import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <SidePanel />
            <div className="main-content">
                <Navbar />
                <h1>Welcome to UpSkill</h1>
            </div>
        </div>
    );
};

export default Home;
