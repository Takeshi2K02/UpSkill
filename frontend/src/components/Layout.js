import React from 'react';
import Navbar from './Navbar';
import SidePanel from './SidePanel';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Navbar />  {/* ✅ Navbar is always at the top */}
            
            <div className="page-content">  {/* ✅ Renamed to avoid conflict */}
                <SidePanel />  {/* ✅ Sidebar always on the left */}
                <div className="main-content">{children}</div>  {/* ✅ Only one "main-content" exists now */}
            </div>
        </div>
    );
};

export default Layout;
