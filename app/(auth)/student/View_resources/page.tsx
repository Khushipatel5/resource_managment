import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";

// Helper to calculate status
function getBookingStatus(booking: any) {
  const isOverdue =
    booking.status === "APPROVED" && new Date(booking.end_datetime) < new Date();

  if (booking.status === "PENDING") return "PENDING";
  if (booking.status === "REJECTED") return "REJECTED";
  if (isOverdue) return "OVERDUE";
  return "ACTIVE";
}

async function ViewResource() {
  const myBookings = await prisma.bookings.findMany({
    include: { resource: true },
    orderBy: { start_datetime: "desc" },
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
        <Link href="/student/" className="btn btn-modern">
          <i className="bi bi-arrow-left me-2"></i>Back
        </Link>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
        <div>
          <h1 className="fw-bold mb-1">
            My <span className="text-gradient">Bookings</span>
          </h1>
          <p className="text-muted mb-0">Track your resource usage and history</p>
        </div>

      </div>

      <div className="row g-4">
        {myBookings.map((booking, index) => {
          const status = getBookingStatus(booking);
          const startDate = new Date(booking.start_datetime).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          const endDate = new Date(booking.end_datetime).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          let statusBadgeClass = "";
          let statusLabel = "";

          switch (status) {
            case "PENDING":
              statusBadgeClass = "bg-warning bg-opacity-10 text-warning";
              statusLabel = "Pending Approval";
              break;
            case "REJECTED":
              statusBadgeClass = "bg-danger bg-opacity-10 text-danger";
              statusLabel = "Rejected";
              break;
            case "OVERDUE":
              statusBadgeClass = "bg-danger bg-opacity-10 text-danger border border-danger";
              statusLabel = "Overdue";
              break;
            case "ACTIVE":
              statusBadgeClass = "bg-success bg-opacity-10 text-success";
              statusLabel = "Active";
              break;
            default:
              statusBadgeClass = "bg-secondary bg-opacity-10 text-secondary";
              statusLabel = status;
          }

          // Stagger animation
          const delayClass = index < 3 ? `delay-${(index + 1) * 100}` : "";

          return (
            <div
              key={booking.booking_id}
              className={`col-12 col-md-6 col-lg-4 animate-fade-in ${delayClass}`}
            >
              <div className="glass-card h-100 p-4 border-0 position-relative overflow-hidden">
                {/* Decorative circle */}

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-white rounded p-2 me-3 shadow-sm d-flex align-items-center justify-content-center"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <i className="bi bi-box-seam fs-4 text-primary"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">
                        {booking.resource.resource_name}
                      </h5>
                    </div>
                  </div>
                  <span className={`badge ${statusBadgeClass} rounded-pill px-3 py-2`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-top border-light">
                  <div className="row g-2">
                    <div className="col-6">
                      <small className="text-uppercase text-muted fw-bold" style={{ fontSize: "0.7rem" }}>
                        From
                      </small>
                      <div className="fw-semibold text-dark small">{startDate}</div>
                    </div>
                    <div className="col-6 text-end">
                      <small className="text-uppercase text-muted fw-bold" style={{ fontSize: "0.7rem" }}>
                        To
                      </small>
                      <div className="fw-semibold text-dark small">{endDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {myBookings.length === 0 && (
        <div className="text-center py-5 animate-fade-in">
          <div className="glass-card d-inline-block p-5">
            <div className="mb-4">
              <i className="bi bi-journal-x fs-1 text-muted opacity-50"></i>
            </div>
            <h3 className="fw-bold text-dark">No Bookings Found</h3>
            <p className="text-muted mb-4">You haven't booked any resources yet.</p>
            <Link href="/student/Book_resources" className="btn btn-modern">
              Browse Resources
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewResource;
