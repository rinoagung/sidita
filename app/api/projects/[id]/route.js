import prisma from "@utils/connection";

export const dynamic = 'force-dynamic';
export async function GET(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Project ID is required', { status: 400 });
    }

    const project = await prisma.project.findUnique({
        where: { id: id },
    });

    if (!project) {
        return new Response('Project not found', { status: 404 });
    }

    return new Response(JSON.stringify(project), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function PUT(req, { params }) {
    const id = params.id;
    const { name, location, description } = await req.json();

    if (!id) {
        return new Response('Project ID is required', { status: 400 });
    }

    const updatedProject = await prisma.project.update({
        where: { id },
        data: { name, location, description },
    });

    return new Response(JSON.stringify(updatedProject), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Project ID is required', { status: 400 });
    }



    const checkWorkingHours = await prisma.workinghours.findMany({
        where: { projectId: id },
    });

    if (checkWorkingHours.length > 0) {
        return new Response(JSON.stringify({ message: 'Project masih memiliki riwayat jam kerja.' }), {
            status: 400, // Status error
            headers: { 'Content-Type': 'application/json' }
        });
    }

    await prisma.project.delete({
        where: { id },
    });

    return new Response(JSON.stringify({ message: 'Project deleted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
