import prisma from "@utils/connection";
export const dynamic = 'force-dynamic';
export async function GET(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Employee ID is required', { status: 400 });
    }

    const employee = await prisma.employees.findUnique({
        where: { id: id },
    });

    if (!employee) {
        return new Response('Employee not found', { status: 404 });
    }

    return new Response(JSON.stringify(employee), {
        headers: { 'Content-Type': 'application/json' },
    });
}
export async function PUT(req, { params }) {
    const id = params.id;
    const { name } = await req.json();

    if (!id) {
        return new Response('Employee ID is required', { status: 400 });
    }

    const updatedEmployee = await prisma.employees.update({
        where: { id },
        data: { name },
    });

    return new Response(JSON.stringify(updatedEmployee), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Employee ID is required', { status: 400 });
    }

    const checkWorkingHours = await prisma.workinghours.findMany({
        where: { employeeId: id },
    });

    if (checkWorkingHours.length > 0) {
        return new Response(JSON.stringify({ message: 'Karyawan masih memiliki jam kerja.' }), {
            status: 400, // Status error
            headers: { 'Content-Type': 'application/json' }
        });
    }

    await prisma.employees.delete({
        where: { id },
    });

    return new Response(JSON.stringify({ message: 'Employee deleted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
