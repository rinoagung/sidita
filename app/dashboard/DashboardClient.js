"use client";

import { useEffect, useState } from 'react';
import { signOut } from "next-auth/react";
import Provider from "@components/provider";
import Nav from "@components/nav";

const DashboardClient = () => {
    const today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [workinghours, setWorkinghours] = useState([]);
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1); // Bulan dimulai dari 0
    const [day, setDay] = useState("");

    const fetchworkinghours = async () => {
        const response = await fetch(`/api/workinghours/get?year=${year}&month=${month}&day=${day}`);
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return;
        }
        const data = await response.json();
        setWorkinghours(data.workingHours || []);
    };
    useEffect(() => {
        fetchworkinghours();
    }, [month, day, year]);

    const handleFilter = (e) => {
        e.preventDefault();
        fetchworkinghours();
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    return (
        <Provider>
            <Nav />

            <div className="w-10/12 mx-auto my-48">
                <form onSubmit={handleFilter} className="mb-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="year" className="block mb-1">Year:</label>
                            <select
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            >
                                <option value="">-</option>
                                {Array.from({ length: 10 }, (_, i) => {
                                    const currentYear = new Date().getFullYear();
                                    return (
                                        <option key={i} value={currentYear - i}>
                                            {currentYear - i}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="month" className="block mb-1">Month:</label>
                            <select
                                id="month"
                                value={month}
                                onChange={(e) => {
                                    setMonth(e.target.value);
                                    setDay(''); // Reset hari saat bulan diubah
                                }}
                                className="border border-gray-300 rounded p-2 w-full"
                            >
                                <option value="">-</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i + 1}>
                                        {monthNames[i]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="day" className="block mb-1">Day:</label>
                            <select
                                id="day"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            >
                                <option value="">-</option>
                                {month && year && Array.from({ length: getDaysInMonth(year, month) }, (_, i) => (
                                    <option key={i} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                </form>
                <div className="relative mt-14 overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Employee
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Project
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Duration
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    8 hours of daily <br />
                                    project time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {workinghours.map((entry, i) => (
                                <tr key={i} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {entry.employees.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {entry.project.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {entry.hours}
                                    </td>
                                    <td className="px-6 py-4">
                                        {entry.dayValue}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(entry.date).toLocaleDateString()}
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
