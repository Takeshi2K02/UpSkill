import React from 'react';
import Navbar from './Navbar';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Navbar />  {/* ✅ Navbar is always at the top */}
            
            <div className="page-content">
                <LeftPanel />  {/* ✅ Sidebar on the left */}
                <div className="main-content">{children}</div>  {/* ✅ Center Content */}
                <RightPanel />  {/* ✅ New Right Sidebar */}
            </div>
        </div>
    );
};

export default Layout;