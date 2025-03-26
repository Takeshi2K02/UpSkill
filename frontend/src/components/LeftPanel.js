import React from 'react';
import { FaHome, FaUser, FaHistory, FaClipboardList, FaRobot, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import '../styles/LeftPanel.css';

const LeftPanel = () => {
    return (
        <div className="left-panel">
            <ul>
                <li><FaHome /> Home</li>
                <li><FaUser /> Profile</li>
                <li><FaHistory /> Recent Activity</li>
                <li><FaClipboardList /> Learning Plans</li>
                <li><FaRobot /> Chatbot</li>
                <li><FaUsers /> Community</li>
                <li className="logout"><FaSignOutAlt /> Logout</li>
            </ul>
        </div>
    );
};

export default LeftPanel;