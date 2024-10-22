export async function GET() {
    const workingHoursData = await prisma.workinghours.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true } // Ambil data user yang diperlukan
            },
            project: {
                select: { id: true, name: true } // Ambil data project yang diperlukan
            }
        }
    });

    return new Response(JSON.stringify(workingHoursData), {
        headers: { 'Content-Type': 'application/json' }
    });
}