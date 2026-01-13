"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/bookings";

type Resource = {
  resource_id: number;
  resource_name: string;
  description: string | null;
  resource_type: {
    type_name: string;
  };
  bookings: {
    start_datetime: Date;
    end_datetime: Date;
    status: string;
  }[];
};

export default function BookingResources({
  resources,
}: {
  resources: Resource[];
}) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  // Default dates for the inputs (optional)
  // const [start, setStart] = useState("");
  // const [end, setEnd] = useState("");

  const handleBookClick = (resource: Resource) => {
    setSelectedResource(resource);
    setShowModal(true);
    setMessage(null);
  };
  const filteredResources = resources.filter(
    (r) =>
      r.resource_name.toLowerCase().includes(search.toLowerCase()) ||
      r.resource_type.type_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedResource(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const res = await createBooking(formData);

    setIsSubmitting(false);
    if (res.error) {
      setMessage({ type: "error", text: res.error });
    } else if (res.success) {
      setMessage({ type: "success", text: res.success });
      // Close modal after short delay? Or let user close.
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    }
  };

  // Helper to check availability for "Now" rendering in the list
  const isAvailableNow = (resource: Resource) => {
    const now = new Date();
    // Check if any APPROVED booking overlaps with NOW
    return !resource.bookings.some(
      (b) =>
        b.status === "APPROVED" &&
        new Date(b.start_datetime) <= now &&
        new Date(b.end_datetime) >= now
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-dark mb-0">Available Resources</h4>
        <div className="input-group w-auto">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card mb-4 overflow-hidden">
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {filteredResources.map((resource) => {
              const available = isAvailableNow(resource);

              return (
                <div
                  key={resource.resource_id}
                  className="list-group-item p-4 d-flex align-items-center justify-content-between bg-transparent"
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-white rounded p-3 me-3 text-center d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: "60px", height: "60px" }}
                    >
                      <i className="bi bi-box-seam fs-3 text-primary"></i>
                    </div>
                    <div>
                      <h5 className="mb-1 fw-bold text-dark">
                        {resource.resource_name}
                      </h5>
                      <p className="mb-0 text-muted small">
                        {resource.resource_type.type_name} •{" "}
                        {resource.description || "No description"}
                      </p>
                      {available ? (
                        <span className="badge bg-success bg-opacity-10 text-success mt-2">
                          Available Now
                        </span>
                      ) : (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary mt-2">
                          In Use
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookClick(resource)}
                    className="btn btn-sm btn-outline-primary rounded-pill"
                  >
                    Check & Book
                  </button>
                </div>
              );
            })}

            {resources.length === 0 && (
              <div className="p-5 text-center text-muted">
                No resources found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && selectedResource && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "1rem" }}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  Book {selectedResource.resource_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted small mb-4">
                  Select your desired date and time. Availability will be
                  checked upon submission.
                </p>

                {message && (
                  <div
                    className={`alert ${message.type === "success"
                        ? "alert-success"
                        : "alert-danger"
                      } mb-3`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <input
                    type="hidden"
                    name="resourceId"
                    value={selectedResource.resource_id}
                  />
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      className="form-control"
                      required
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      className="form-control"
                      required
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill fw-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating Request...
                        </span>
                      ) : (
                        "Confirm Booking Request"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-light rounded-pill text-muted"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
