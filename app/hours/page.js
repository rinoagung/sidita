"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import Provider from "@components/provider";
import Nav from "@components/nav";
import { useRouter } from 'next/navigation';


const workinghours = () => {
    const { alert, showAlert, alertClass } = useAlert();

    const [employee, setEmployee] = useState([]);
    const [project, setProject] = useState([]);
    const [workinghours, setWorkinghours] = useState([]);

    const [hours, setHours] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const router = useRouter();

    const fetchworkinghours = async () => {
        const response = await fetch('/api/workinghours/get');
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return;
        }
        const data = await response.json();
        console.log(data)
        setWorkinghours(data.workingHours || []);
        setEmployee(data.employees || []);
        setProject(data.projects || []);
    };
    useEffect(() => {

        fetchworkinghours();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/workinghours/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedEmployee, hours, selectedProject }),
        });

        if (response.ok) {

            showAlert('Data berhasil ditambahkan!', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchworkinghours()
        } else {
            const errorData = await response.json();
            console.error('Error adding project:', errorData.error);
        }
    };

    const deleteWorkingHours = async (id) => {
        const confirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
        if (confirmed) {
            const response = await fetch(`/api/workinghours/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (response.ok) {
                fetchworkinghours()
                console.log(data.message);
            } else {
                console.error('Error deleting employee:', data);
            }
        }
    };

    return (
        <Provider>
            <Nav />
            <div className="w-10/12 mx-auto my-48">
                {alert.visible && (
                    <div className={`p-4 mb-4 text-sm ${alertClass()} bg-${alert.type == 'success' ? 'green' : alert.type == 'error' ? 'red' : 'blue'}-100 rounded`} role="alert">
                        {alert.message}
                    </div>
                )}
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Add New Working Hours</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Select Employee</label>
                            <select
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                className="border rounded w-full p-2"
                            >
                                <option value="">-</option>
                                {employee.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700">Select Project</label>
                            <select
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="border rounded w-full p-2"
                            >
                                <option value="">-</option>
                                {project.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Total Hours</label>
                            <input
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                required
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded p-2">
                            Add Working Hours
                        </button>
                    </form>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                <th scope="col" className="px-6 py-3">
                                    Action
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
                                        {entry.hours} jam
                                    </td>
                                    <td className="px-6 py-4">
                                        {entry.dayValue}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={`/hours/${entry.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                        <button type='button' onClick={() => deleteWorkingHours(p.id)} className="font-medium ms-5 text-red-600 dark:text-red-500 hover:underline">Delete</button>

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

export default workinghours;
