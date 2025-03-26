import React from 'react';
import '../styles/RightPanel.css';

const RightPanel = () => {
    return (
        <div className="right-panel">
            <div className="section">
                <h3>Following List</h3>
                <ul>
                    <li>John Doe</li>
                    <li>Jane Smith</li>
                    <li>Michael Brown</li>
                </ul>
            </div>

            <div className="section">
                <h3>Community Groups</h3>
                <ul>
                    <li>React Developers</li>
                    <li>Data Science Enthusiasts</li>
                    <li>AI & ML Community</li>
                </ul>
            </div>
        </div>
    );
};

export default RightPanel;
