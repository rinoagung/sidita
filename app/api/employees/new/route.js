import prisma from "@utils/connection";

export async function POST(request) {
    const { name } = await request.json();

    // Validasi data
    if (!name) {
        return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    try {
        const newEmployees = await prisma.employees.create({
            data: {
                name,
            },
        });

        return new Response(JSON.stringify(newEmployees), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create project' }), { status: 500 });
    }
}
