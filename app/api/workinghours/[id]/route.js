import prisma from "@utils/connection";

export const dynamic = 'force-dynamic';
export async function GET(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Workinghours ID is required', { status: 400 });
    }

    const workinghours = await prisma.workinghours.findUnique({
        where: { id: id },
    });

    const employees = await prisma.employees.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    const projects = await prisma.project.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    if (!workinghours) {
        return new Response('Workinghours not found', { status: 404 });
    }

    return new Response(JSON.stringify({ workinghours, employees, projects }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function PUT(req, { params }) {
    const id = params.id;
    const { selectedEmployee, hours, selectedProject } = await req.json();

    if (!id) {
        return new Response('Workinghours ID is required', { status: 400 });
    }

    const updatedWorkinghours = await prisma.workinghours.update({
        where: { id },
        data: {
            hours: parseInt(hours),
            employeeId: selectedEmployee,
            projectId: selectedProject,
        },
    });

    return new Response(JSON.stringify(updatedWorkinghours), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Workinghours ID is required', { status: 400 });
    }

    await prisma.workinghours.delete({
        where: { id },
    });

    return new Response(JSON.stringify({ message: 'Workinghours deleted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
