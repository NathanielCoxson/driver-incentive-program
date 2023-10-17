import React from 'react';
import './DashboardLayout.css';
import { Outlet } from "react-router-dom";
import DriverSidebar from "../Sidebar/Driver_Sidebar";

function DashboardLayout() {
    return (
        <div className="dashboard-container" style={{displah: "inline-flex"}}>
            <DriverSidebar />
            <Outlet />
        </div>
    );
}

export default DashboardLayout;