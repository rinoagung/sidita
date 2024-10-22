import prisma from "@utils/connection";

export async function GET() {
    const workingHoursData = await prisma.workinghours.findMany({
        include: {
            employees: {
                select: { id: true, name: true } // Ambil data employee yang diperlukan
            },
            project: {
                select: { id: true, name: true } // Ambil data project yang diperlukan
            }
        }
    });

    // Menghitung total jam kerja per proyek per hari dan total jam kerja bulanan
    const projectHours = {};

    workingHoursData.forEach(entry => {
        const dateKey = entry.date.toISOString().split('T')[0]; // Mengambil tanggal tanpa waktu
        const projectId = entry.projectId;

        // Inisialisasi proyek jika belum ada
        if (!projectHours[projectId]) {
            projectHours[projectId] = {};
        }
        if (!projectHours[projectId][dateKey]) {
            projectHours[projectId][dateKey] = 0;
        }
        projectHours[projectId][dateKey] += entry.hours; // Menambahkan jam kerja

    });

    // Menambahkan nilai ke setiap entry untuk proyek per hari
    const enhancedWorkingHoursData = workingHoursData.map(entry => {
        const dateKey = entry.date.toISOString().split('T')[0];
        const projectId = entry.projectId;

        const totalHours = projectHours[projectId][dateKey] || 0;
        const dayValue = totalHours >= 8 ? 1 : '-';

        return {
            ...entry,
            dayValue // Menambahkan nilai ke setiap entry
        };
    });

    return new Response(JSON.stringify({
        workingHours: enhancedWorkingHoursData,
        projectHours
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
