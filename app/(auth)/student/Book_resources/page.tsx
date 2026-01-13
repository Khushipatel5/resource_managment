import { prisma } from "@/lib/prisma";
import BookingClient from "./BookingClient";

export default async function BookResourcesPage() {
    const now = new Date();

    // Fetch resources with their approved bookings to determine availability status
    const resources = await prisma.resources.findMany({
        include: {
            resource_type: true,
            bookings: {
                where: {
                    status: "APPROVED",
                    end_datetime: { gte: now }, // Only get bookings that haven't ended yet
                },
            },
        },
    });

    return (
        <div className="container-fluid p-4">
            <h1 className="fw-bold mb-4 text-dark">Book Resources</h1>
            <BookingClient resources={resources} />
        </div>
    );
}
