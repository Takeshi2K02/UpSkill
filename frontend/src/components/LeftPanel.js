import React from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ Import navigation hook
import { FaHome, FaUser, FaHistory, FaClipboardList, FaRobot, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import '../styles/LeftPanel.css';

const LeftPanel = () => {
    const navigate = useNavigate();  // ✅ Create navigation function

    return (
        <div className="left-panel">
            <ul>
                <li onClick={() => navigate("/")}> <FaHome /> Home</li>
                <li><FaUser /> Profile</li>
                <li><FaHistory /> Recent Activity</li>
                <li onClick={() => navigate("/learning-plans")}> <FaClipboardList /> Learning Plans</li>  {/* ✅ Redirects to Learning Plans */}
                <li><FaRobot /> Chatbot</li>
                <li><FaUsers /> Community</li>
                <li className="logout"><FaSignOutAlt /> Logout</li>
            </ul>
        </div>
    );
};

export default LeftPanel;