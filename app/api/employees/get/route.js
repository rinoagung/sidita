import prisma from "@utils/connection";

export const dynamic = 'force-dynamic';
export async function GET() {
    const employees = await prisma.employees.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return new Response(JSON.stringify(employees), {
        headers: { 'Content-Type': 'application/json' }
    });
}