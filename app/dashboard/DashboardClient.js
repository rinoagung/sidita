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

            <div className="w-10/12 mx-auto mt-48">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Project
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Duration
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.map((entry) => (
                                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {entry.user.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {entry.project.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {entry.hours}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>

        </Provider>
    );
};

export default DashboardClient;
