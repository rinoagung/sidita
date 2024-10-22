import prisma from "@utils/connection";

export async function PUT(req) {
    const { id } = req.query; // Ambil ID dari URL
    const { name } = await req.json();

    if (!id) {
        return new Response('Workinghours ID is required', { status: 400 });
    }

    const updatedWorkinghours = await prisma.workinghours.update({
        where: { id },
        data: { name }, // Tambahkan data lain yang ingin diupdate
    });

    return new Response(JSON.stringify(updatedWorkinghours), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(req) {
    const { id } = req.query; // Ambil ID dari URL

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
