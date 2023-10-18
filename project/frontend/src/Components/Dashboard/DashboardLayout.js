import React from 'react';
import './DashboardLayout.css';
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

function DashboardLayout() {
    return (
        <div className="dashboard-container" style={{displah: "inline-flex"}}>
            <Sidebar />
            <Outlet />
        </div>
    );
}

export default DashboardLayout;