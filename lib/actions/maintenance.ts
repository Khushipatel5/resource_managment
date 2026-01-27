'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateMaintenanceStatus(maintenanceId: number, status: string, notes?: string) {
    try {
        const updatedTask = await prisma.maintenance.update({
            where: { maintenance_id: maintenanceId },
            data: {
                status,
                notes: notes !== undefined ? notes : undefined
            },
            include: {
                resource: true
            }
        });

        // If a task is completed, schedule the next one automatically
        if (status === "COMPLETED" && updatedTask.resource.maintenance_interval_days) {
            await prisma.maintenance.create({
                data: {
                    resource_id: updatedTask.resource_id,
                    maintenance_type: "Regular / Preventive",
                    scheduled_date: new Date(Date.now() + updatedTask.resource.maintenance_interval_days * 24 * 60 * 60 * 1000),
                    status: "SCHEDULED",
                }
            });
        }

        revalidatePath("/maintainence"); // Kept for legacy if redirected
        revalidatePath("/staff");
        revalidatePath("/admin");
        return { success: "Status updated successfully" };
    } catch (e) {
        console.error(e);
        return { error: "Failed to update status" };
    }
}
