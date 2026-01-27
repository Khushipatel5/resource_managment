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

    const start = new Date(startString);
    const end = new Date(endString);

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
        revalidatePath("/staff");
        revalidatePath("/approver");
        return { success: "Booking requested successfully!" };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create booking." };
    }
}

export async function updateBookingStatus(bookingId: number, status: "APPROVED" | "REJECTED") {
    const user = await getCurrentUser();
    // In a real app, verify user role is APPROVER or ADMIN here.
    if (!user) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.bookings.update({
            where: { booking_id: bookingId },
            data: {
                status,
                approver_id: user.user_id // Record who approved/rejected
            },
        });

        revalidatePath("/approver");
        revalidatePath("/student");
        revalidatePath("/staff");
        revalidatePath("/admin");
        return { success: `Booking ${status.toLowerCase()} successfully.` };
    } catch (e) {
        console.error(e);
        return { error: "Failed to update booking." };
    }
}

export async function updateBookingDetails(bookingId: number, start: Date, end: Date) {
    const user = await getCurrentUser();
    // Should verify role here

    try {
        await prisma.bookings.update({
            where: { booking_id: bookingId },
            data: {
                start_datetime: start,
                end_datetime: end
            },
        });

        revalidatePath("/approver");
        return { success: "Booking updated successfully." };
    } catch (e) {
        console.error(e);
        return { error: "Failed to update booking details." };
    }
}

export async function checkAvailability(bookingId: number) {
    const booking = await prisma.bookings.findUnique({
        where: { booking_id: bookingId },
        select: {
            resource_id: true,
            start_datetime: true,
            end_datetime: true,
        },
    });

    if (!booking) {
        return { available: false, error: "Booking not found" };
    }

    // Check for overlapping APPROVED bookings
    const conflicts = await prisma.bookings.findMany({
        where: {
            resource_id: booking.resource_id,
            status: "APPROVED",
            start_datetime: { lt: booking.end_datetime },
            end_datetime: { gt: booking.start_datetime },
        },
    });

    return {
        available: conflicts.length === 0,
        conflicts: conflicts.length
    };
}
