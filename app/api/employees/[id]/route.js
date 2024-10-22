import prisma from "@utils/connection";

export async function PUT(req) {
    const { id } = req.query; // Ambil ID dari URL
    const { name } = await req.json();

    if (!id) {
        return new Response('Employee ID is required', { status: 400 });
    }

    const updatedEmployee = await prisma.employees.update({
        where: { id },
        data: { name }, // Tambahkan data lain yang ingin diupdate
    });

    return new Response(JSON.stringify(updatedEmployee), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(req) {
    const { id } = req.query; // Ambil ID dari URL

    if (!id) {
        return new Response('Employee ID is required', { status: 400 });
    }

    await prisma.employees.delete({
        where: { id },
    });

    return new Response(JSON.stringify({ message: 'Employee deleted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
