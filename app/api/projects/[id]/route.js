import prisma from "@utils/connection";

export async function PUT(req) {
    const { id } = req.query; // Ambil ID dari URL
    const { name } = await req.json();

    if (!id) {
        return new Response('Project ID is required', { status: 400 });
    }

    const updatedProject = await prisma.project.update({
        where: { id },
        data: { name }, // Tambahkan data lain yang ingin diupdate
    });

    return new Response(JSON.stringify(updatedProject), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(req) {
    const { id } = req.query; // Ambil ID dari URL

    if (!id) {
        return new Response('Project ID is required', { status: 400 });
    }

    await prisma.project.delete({
        where: { id },
    });

    return new Response(JSON.stringify({ message: 'Project deleted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
