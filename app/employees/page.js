"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Provider from "@components/provider";
import Nav from "@components/nav";

const employees = () => {
    const { alert, showAlert, alertClass } = useAlert();
    const [name, setName] = useState('');
    const router = useRouter();

    const [employee, setEmployee] = useState([]);

    const fetchEmployee = async () => {
        const response = await fetch('/api/employees/get');
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return;
        }
        const data = await response.json();
        setEmployee(data);
    };

    useEffect(() => {
        fetchEmployee();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/employees/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        if (response.ok) {
            showAlert('Data berhasil ditambahkan!', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchEmployee();
        } else {
            const errorData = await response.json();
            console.error('Error adding employee:', errorData.error);
        }
    };

    const deleteEmployee = async (id) => {
        const confirmed = window.confirm("Apakah Anda yakin ingin menghapus karyawan ini?");
        if (confirmed) {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (response.ok) {
                showAlert('Data berhasil dihapus!', 'success');
                fetchEmployee();
            } else {
                showAlert(data.message, 'error');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                console.error('Error deleting employee:', data);
            }
        }
    };


    return (
        <Provider>
            <Nav />
            <div className="w-10/12 mx-auto my-48">
                {alert.visible && (
                    <div className={`p-4 mb-4 ${alertClass()} bg-${alert.type == 'success' ? 'green' : alert.type == 'error' ? 'red' : 'blue'}-100 rounded`} role="alert">
                        {alert.message}
                    </div>
                )}
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Add New Employee</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Employee Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded p-2">
                            Add Employee
                        </button>
                    </form>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Employee Name
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
                            {employee.map((p, i) => (
                                <tr key={i} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {p.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {new Date(p.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={`/employees/${p.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                        <button type='button' onClick={() => deleteEmployee(p.id)} className="font-medium ms-5 text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

export default employees;
