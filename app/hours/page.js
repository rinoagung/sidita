// DashboardClient.js (Client Component)
"use client"; // Menandakan ini adalah komponen client

import { useEffect, useState } from 'react';
import { signOut } from "next-auth/react";
import Provider from "@components/provider";
import Nav from "@components/nav";

const DashboardClient = () => {
    const [dashboard, setDashboard] = useState([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            const response = await fetch('/api/dashboard');
            if (!response.ok) {
                console.error('Error fetching data:', response.statusText); // Log status error
                return; // Keluar dari fungsi jika ada kesalahan
            }
            const data = await response.json();
            setDashboard(data);
        };

        fetchDashboard();
    }, []);

    return (
        <Provider>
            <Nav />

        </Provider>
    );
};

export default DashboardClient;
