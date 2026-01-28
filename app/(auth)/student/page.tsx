import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BookingClient from "@/components/student/BookingClient";
import Link from "next/link";

export default async function StudentPage() {
  const user = await requireRole("STUDENT");
  const now = new Date();

  // Fetch resources with their approved bookings to determine availability status
  // We fetch bookings that are either active now or in the future to help with "isAvailableNow" logic
  // and potentially for future calendar views if we add them.
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

  // Fetch user's bookings
  const myBookings = await prisma.bookings.findMany({
    where: { user_id: user.user_id },
    include: { resource: true },
    orderBy: { start_datetime: "desc" },
  });

  // Filter for upcoming return
  const activeBookings = myBookings.filter(
    (b) => b.status === "APPROVED" && new Date(b.end_datetime) > now,
  );

  const upcomingReturn = activeBookings.sort(
    (a, b) =>
      new Date(a.end_datetime).getTime() - new Date(b.end_datetime).getTime(),
  )[0];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Student Portal</h1>
          <p className="text-secondary mb-0">
            Book resources and track your requests.
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <Link href="/student/feedback" className="btn btn-outline-primary shadow-sm rounded-pill px-4">
            <i className="bi bi-chat-right-text me-2"></i> Give Feedback
          </Link>
          <BookingClient
            resources={resources}
            trigger={
              <button className="btn btn-primary shadow-sm rounded-pill px-4">
                <i className="bi bi-plus-lg me-2"></i> New Booking
              </button>
            }
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content Area - Resources */}
        <div className="col-lg-8">
          <BookingClient resources={resources} />
        </div>

        {/* Sidebar Area - My Bookings */}
        <div className="col-lg-4 ">
          {upcomingReturn && (
            <div
              className="card shadow-sm border-0 bg-primary text-white mb-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
              }}
            >
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3">
                  <i className="bi bi-clock-history me-2"></i>Upcoming Return
                </h5>
                <div className="p-3 bg-white bg-opacity-25 rounded-3 mb-2">
                  <h6 className="fw-bold mb-1">
                    {upcomingReturn.resource.resource_name}
                  </h6>
                  <small className="d-block text-white-50">
                    Due:{" "}
                    {new Date(upcomingReturn.end_datetime).toLocaleDateString()}{" "}
                    {new Date(upcomingReturn.end_datetime).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </small>
                </div>
                <p className="small mb-0 mt-3 opacity-75">
                  Please return on time to avoid penalties.
                </p>
              </div>
            </div>
          )}

          <div className="glass-card mt-5">
            <div className="card-header bg-transparent border-bottom py-3">
              <h6 className="mb-0 fw-bold">My Booking History</h6>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush small bg-transparent">
                {myBookings.slice(0, 5).map((booking) => {
                  const isOverdue =
                    booking.status === "APPROVED" &&
                    new Date(booking.end_datetime) < now;
                  // Note: Status logic here is simplified. In a real app, you might have 'RETURNED' status.
                  // Assuming 'APPROVED' implies currently possessed if end date is future, or overdue if end date is past.

                  let statusBadge;
                  if (booking.status === "PENDING") {
                    statusBadge = (
                      <span className="badge bg-warning bg-opacity-10 text-warning text-dark">
                        Pending
                      </span>
                    );
                  } else if (booking.status === "REJECTED") {
                    statusBadge = (
                      <span className="badge bg-danger bg-opacity-10 text-danger">
                        Rejected
                      </span>
                    );
                  } else if (isOverdue) {
                    statusBadge = (
                      <span className="badge bg-secondary bg-opacity-10 text-dark">
                        Overdue
                      </span>
                    );
                  } else {
                    // Approved and valid
                    statusBadge = (
                      <span className="badge bg-success bg-opacity-10 text-success">
                        Active
                      </span>
                    );
                  }

                  return (
                    <li
                      key={booking.booking_id}
                      className="list-group-item px-4 py-3 bg-transparent"
                    >
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-semibold">
                          {booking.resource.resource_name}
                        </span>
                        <span className="text-secondary">
                          {new Date(
                            booking.start_datetime,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {statusBadge}
                    </li>
                  );
                })}
                {myBookings.length === 0 && (
                  <li className="list-group-item px-4 py-3 text-center text-muted bg-transparent">
                    No bookings found.
                  </li>
                )}
              </ul>
            </div>
            <div className="card-footer bg-transparent border-0 d-flex justify-content-center gap-4 py-3">
              <Link
                href="/student/View_resources"
                className="text-decoration-none text-primary fw-semibold small"
              >
                Booking History
              </Link>
              <Link
                href="/student/feedback/history"
                className="text-decoration-none text-success fw-semibold small"
              >
                Feedback History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
