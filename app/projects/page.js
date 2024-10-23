"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import Provider from "@components/provider";
import Nav from "@components/nav";

const projects = () => {

    const { alert, showAlert, alertClass } = useAlert();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const [project, setProject] = useState([]);

    const fetchProject = async () => {
        const response = await fetch('/api/projects/get');

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching projects:', errorData.error);
            return;
        }

        const data = await response.json();
        setProject(data);
    };
    useEffect(() => {

        fetchProject();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/projects/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, location, description }),
        });

        if (response.ok) {

            showAlert('Data berhasil ditambahkan!', 'success');

            fetchProject();
        } else {
            const errorData = await response.json();
            console.error('Error adding project:', errorData.error);
        }
    };


    const deleteProject = async (id) => {
        const confirmed = window.confirm("Apakah Anda yakin ingin menghapus project ini?");
        if (confirmed) {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (response.ok) {
                showAlert('Data berhasil dihapus!', 'error');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                fetchProject();
                console.log(data.message);
            } else {
                showAlert(data.message, 'error');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                console.error('Error deleting project:', data);
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
                    <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Project Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded p-2">
                            Add Project
                        </button>
                    </form>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Project Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
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
                            {project.map((p, i) => (

                                <tr key={i} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {p.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {p.location}
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(p.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={`/projects/${p.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                        <button type='button' onClick={() => deleteProject(p.id)} className="font-medium ms-5 text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

export default projects;
