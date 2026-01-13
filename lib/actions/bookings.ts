'use server'

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
        return { error: "You must be logged in to make a booking." };
    }

    const resourceId = parseInt(formData.get("resourceId") as string);
    const startString = formData.get("startDate") as string;
    const endString = formData.get("endDate") as string;

    if (!resourceId || !startString || !endString) {
        return { error: "Missing required fields." };
    }

    const start = new Date(startString);
    const end = new Date(endString);

    if (start >= end) {
        return { error: "End time must be after start time." };
    }

    if (start < new Date()) {
        return { error: "Cannot book in the past." };
    }

    // Check for overlapping bookings
    // We look for any booking for this resource that overlaps with the requested range
    // and is NOT Rejected (so Approved or Pending blocks it? Usually Pending blocks it to prevent double booking race conditions, or maybe we allow overbooking until approved. Let's block if 'APPROVED' or 'PENDING' to be safe, or just 'APPROVED' if we want queueing.
    // The user prompt "check for bookings" suggests we should prevent conflicts.
    // Let's assume 'APPROVED' blocks. 'PENDING' might just be a request.
    // However, for a user "checking availability", if someone else has a pending request, they might get priority.
    // Let's stick to blocking only 'APPROVED' for strict conflicts, but maybe warn about PENDING?
    // For simplicity: overlapping 'APPROVED' bookings make it unavailable.

    const formattedStart = start.toISOString();
    const formattedEnd = end.toISOString();

    const query = {
        resource_id: resourceId,
        status: "APPROVED",
        OR: [
            {
                start_datetime: {
                    lte: formattedEnd,
                },
                end_datetime: {
                    gte: formattedStart,
                },
            },
        ],
    };

    // Checking overlap:
    // (StartA <= EndB) and (EndA >= StartB)
    const conflicts = await prisma.bookings.findMany({
        where: {
            resource_id: resourceId,
            status: "APPROVED",
            start_datetime: { lt: end },
            end_datetime: { gt: start },
        },
    });

    if (conflicts.length > 0) {
        return { error: "Resource is not available during this time slot." };
    }

    try {
        await prisma.bookings.create({
            data: {
                resource_id: resourceId,
                user_id: user.user_id,
                start_datetime: start,
                end_datetime: end,
                status: "PENDING",
            },
        });

        revalidatePath("/student");
        return { success: "Booking requested successfully!" };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create booking." };
    }
}
