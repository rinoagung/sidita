"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Provider from "@components/provider";
import Nav from "@components/nav";

const workinghours = () => {
    const { alert, showAlert, alertClass } = useAlert();
    const [employee, setEmployee] = useState([]);
    const [project, setProject] = useState([]);

    const [hours, setHours] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedProject, setSelectedProject] = useState('');

    const { id } = useParams();


    useEffect(() => {
        const fetchWorkingHours = async () => {

            if (id) {
                const response = await fetch(`/api/workinghours/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSelectedEmployee(data.workinghours.employeeId)
                    setSelectedProject(data.workinghours.projectId)
                    setHours(data.workinghours.hours)
                    setEmployee(data.employees || []);
                    setProject(data.projects || []);
                } else {
                    console.error('Error fetching project data:', response.statusText);
                }
            }
        };

        fetchWorkingHours();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/workinghours/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedEmployee, hours, selectedProject }),
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
                    href="/hours"
                    className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700"
                >
                    Back
                </a>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Update New Working Hours</h1>
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
                            Update Working Hours
                        </button>
                    </form>
                </div>
            </div>

        </Provider>
    );
};

export default workinghours;
