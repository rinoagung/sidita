import prisma from "@utils/connection";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const day = searchParams.get('day');

    const whereClause = {};

    if (year || month || day) {
        whereClause.date = {};

        if (year) {
            whereClause.date.gte = new Date(`${year}-${month || '01'}-${day || '01'}`);
            whereClause.date.lt = new Date(`${year}-${month || '12'}-${day ? `${Number(day) + 1}` : '31'}`);
        }
    }

    const workingHoursData = await prisma.workinghours.findMany({
        where: whereClause,
        include: {
            employees: {
                select: { id: true, name: true }
            },
            project: {
                select: { id: true, name: true }
            }
        }
    });

    const employees = await prisma.employees.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    const projects = await prisma.project.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    const projectHours = {};

    workingHoursData.forEach(entry => {
        const dateKey = entry.date.toISOString().split('T')[0];
        const projectId = entry.projectId;

        if (!projectHours[projectId]) {
            projectHours[projectId] = {};
        }
        if (!projectHours[projectId][dateKey]) {
            projectHours[projectId][dateKey] = 0;
        }
        projectHours[projectId][dateKey] += entry.hours;

    });

    const enhancedWorkingHoursData = workingHoursData.map(entry => {
        const dateKey = entry.date.toISOString().split('T')[0];
        const projectId = entry.projectId;

        const totalHours = projectHours[projectId][dateKey] || 0;
        const dayValue = totalHours >= 8 ? 1 : '-';

        return {
            ...entry,
            dayValue
        };
    });

    return new Response(JSON.stringify({
        workingHours: enhancedWorkingHoursData,
        projectHours, employees, projects
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
