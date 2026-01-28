import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  await requireRole("ADMIN");

  const [
    resourceCount,
    pendingBookingsCount,
    maintenanceIssuesCount,
    recentBookings,
  ] = await Promise.all([
    prisma.resources.count(),
    prisma.bookings.count({ where: { status: "PENDING" } }),
    prisma.maintenance.count({ where: { status: { not: "COMPLETED" } } }),
    prisma.bookings.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: { user: true, resource: true },
    }),
  ]);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Admin Dashboard</h1>
          <p className="text-secondary mb-0">
            System overview and management controls.
          </p>
        </div>
        <Link
          href="/admin/AddResources"
          className="btn btn-primary shadow-sm rounded-pill px-4"
        >
          <i className="bi bi-plus-lg me-2"></i> Add Resource
        </Link>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                <i className="bi bi-box-seam text-primary fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1">Total Resources</h6>
                <h3 className="fw-bold mb-0">{resourceCount}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                <i className="bi bi-hourglass-split text-warning fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1">Pending Approvals</h6>
                <h3 className="fw-bold mb-0">{pendingBookingsCount}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                <i className="bi bi-tools text-danger fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted small mb-1">Maintenance Issues</h6>
                <h3 className="fw-bold mb-0">{maintenanceIssuesCount}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Bookings */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold">Recent Bookings</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4">User</th>
                      <th>Resource</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.booking_id}>
                        <td className="ps-4">
                          <div className="fw-semibold">{booking.user.name}</div>
                          <div className="small text-muted">
                            {booking.user.email}
                          </div>
                        </td>
                        <td>{booking.resource.resource_name}</td>
                        <td>
                          {new Date(booking.start_datetime).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`badge rounded-pill ${booking.status === "APPROVED"
                              ? "bg-success"
                              : booking.status === "PENDING"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                              }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentBookings.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          No recent bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links / Info */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link
                  href="/admin/users"
                  className="btn btn-outline-primary text-start"
                >
                  <i className="bi bi-people me-2"></i> Manage Users
                </Link>
                <Link
                  href="/admin/bookings"
                  className="btn btn-outline-primary text-start"
                >
                  <i className="bi bi-calendar-check me-2"></i> Manage Bookings
                </Link>
                <Link
                  href="/admin/inventory"
                  className="btn btn-outline-primary text-start"
                >
                  <i className="bi bi-boxes me-2"></i> Manage Inventory
                </Link>
                <Link
                  href="/admin/feedbacks"
                  className="btn btn-outline-primary text-start"
                >
                  <i className="bi bi-chat-left-text me-2"></i> Manage Feedback
                </Link>
                <Link
                  href="/admin/settings"
                  className="btn btn-outline-secondary text-start"
                >
                  <i className="bi bi-gear me-2"></i> System Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
