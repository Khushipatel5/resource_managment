import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminBookingsClient from "@/components/admin/AdminBookingsClient";

export default async function AdminBookingsPage() {
    await requireRole("ADMIN");

    const bookings = await prisma.bookings.findMany({
        orderBy: { created_at: "desc" },
        include: {
            user: { select: { name: true, email: true } },
            resource: { select: { resource_name: true } }
        }
    });

    return (
        <div className="container-fluid p-4">
            <h1 className="h2 fw-bold text-dark mb-4">Manage All Bookings</h1>
            <AdminBookingsClient bookings={bookings} />
        </div>
    );
}
