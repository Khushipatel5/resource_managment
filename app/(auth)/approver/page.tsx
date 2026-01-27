import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ApproverClient from "./ApproverClient";

export default async function ApproverPage() {
  const user = await requireRole("APPROVER");

  // Fetch pending bookings
  const pendingBookings = await prisma.bookings.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      user: true,
      resource: {
        include: {
          resource_type: true,
        },
      },
    },
    orderBy: {
      start_datetime: "asc",
    },
  });

  // Fetch approval history
  const historyBookings = await prisma.bookings.findMany({
    where: {
      approver_id: user.user_id,
    },
    take: 20,
    orderBy: { created_at: 'desc' },
    include: {
      user: true,
      resource: { include: { resource_type: true } }
    }
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Approver Dashboard</h1>
          <p className="text-secondary mb-0">
            Welcome back, {user.name}. Review and manage resource requests.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-pill shadow-sm border">
          <i className="bi bi-bell text-primary me-2"></i>
          <span className="fw-bold text-dark">{pendingBookings.length}</span> Pending
        </div>
      </div>

      <ApproverClient pendingBookings={pendingBookings} historyBookings={historyBookings} />
    </div>
  );
}
