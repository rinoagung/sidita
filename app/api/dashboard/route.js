import prisma from "@utils/connection";

export async function GET() {
    const workingHoursData = await prisma.workinghours.findMany({
        include: {
            employees: {
                select: { id: true, name: true }
            },
            project: {
                select: { id: true, name: true }
            }
        }
    });

    return new Response(JSON.stringify(workingHoursData), {
        headers: { 'Content-Type': 'application/json' }
    });
}