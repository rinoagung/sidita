"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Provider from "@components/provider";
import Nav from "@components/nav";

const projects = () => {
    const { alert, showAlert, alertClass } = useAlert();

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchProject = async () => {

            if (id) {
                const response = await fetch(`/api/projects/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setName(data.name);
                    setLocation(data.location);
                    setDescription(data.description);
                } else {
                    console.error('Error fetching project data:', response.statusText);
                }
            }
        };

        fetchProject();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, name, location, description }),
        });

        const data = await response.json();
        if (response.ok) {
            showAlert('Data berhasil diupdate!', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            console.log('Project updated:', data);
        } else {
            console.error('Error updating project:', data);
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
                <a
                    href="/projects"
                    className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700"
                >
                    Back
                </a>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Update Project</h1>
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
                            Update Project
                        </button>
                    </form>
                </div>
            </div>

        </Provider>
    );
};

export default projects;
