import React from 'react';
import Navbar from './Navbar';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import '../styles/Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Navbar />
            
            <div className="page-content">
                <LeftPanel />
                <div className="main-content">{children}</div>
                <RightPanel />
            </div>
        </div>
    );
};

export default Layout;