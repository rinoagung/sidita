import prisma from "@utils/connection";

export async function GET() {
    const projects = await prisma.project.findMany({
        select: {
            id: true,
            name: true,
            location: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return new Response(JSON.stringify(projects), {
        headers: { 'Content-Type': 'application/json' }
    });
}