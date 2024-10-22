import prisma from "@utils/connection";

export async function POST(request) {
    const { selectedEmployee, hours, selectedProject } = await request.json();

    // Validasi data
    if (!selectedEmployee) {
        return new Response(JSON.stringify({ error: 'Employee is required' }), { status: 400 });
    }

    try {
        const newWorkingHours = await prisma.workinghours.create({
            data: {
                hours: parseInt(hours),
                employeeId: selectedEmployee,
                projectId: selectedProject,
                date: new Date(),
            },
        });

        return new Response(JSON.stringify(newWorkingHours), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create workinghours' }), { status: 500 });
    }
}
