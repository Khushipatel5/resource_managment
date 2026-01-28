"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function submitFeedback(message: string, resourceId?: number) {
    try {
        const cookieStore = await cookies();
        const userIdStr = cookieStore.get("userId")?.value;

        if (!userIdStr) {
            return { error: "User not authenticated" };
        }

        const userId = parseInt(userIdStr);

        await prisma.feedback.create({
            data: {
                message,
                user_id: userId,
                resource_id: resourceId || null,
                status: "PENDING",
            },
        });

        revalidatePath("/student");
        return { success: "Feedback submitted successfully" };
    } catch (e) {
        console.error(e);
        return { error: "Failed to submit feedback" };
    }
}

export async function getFeedbacks() {
    try {
        const feedbacks = await prisma.feedback.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                resource: {
                    select: {
                        resource_name: true,
                    },
                },
                maintenance: {
                    include: {
                        assigned_to: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: "desc",
            },
        });
        return { success: true, feedbacks };
    } catch (e) {
        console.error(e);
        return { error: "Failed to fetch feedbacks" };
    }
}

export async function assignStaffToFeedback(
    feedbackId: number,
    staffId: number,
    maintenanceType: string,
    scheduledDate: Date,
) {
    try {
        const feedback = await prisma.feedback.findUnique({
            where: { feedback_id: feedbackId },
        });

        if (!feedback) {
            return { error: "Feedback not found" };
        }

        if (!feedback.resource_id) {
            return { error: "This feedback is not associated with any resource. Please select a resource first." };
        }

        // Create a maintenance task
        await prisma.maintenance.create({
            data: {
                maintenance_type: maintenanceType,
                scheduled_date: scheduledDate,
                status: "PENDING",
                resource_id: feedback.resource_id,
                assigned_to_id: staffId,
                feedback_id: feedbackId,
                notes: `Assigned from feedback: ${feedback.message}`,
            },
        });

        // Update feedback status
        await prisma.feedback.update({
            where: { feedback_id: feedbackId },
            data: { status: "ASSIGNED" },
        });

        revalidatePath("/admin/feedbacks");
        revalidatePath("/staff");
        return { success: "Staff assigned successfully" };
    } catch (e) {
        console.error(e);
        return { error: "Failed to assign staff" };
    }
}

export async function getStaffMembers() {
    try {
        const staff = await prisma.users.findMany({
            where: {
                role: { in: ["STAFF", "MAINTENANCE"] },
            },
            select: {
                user_id: true,
                name: true,
                role: true,
            },
        });
        return { success: true, staff };
    } catch (e) {
        console.error(e);
        return { error: "Failed to fetch staff members" };
    }
}
