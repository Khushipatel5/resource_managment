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
  trigger,
}: {
  resources: Resource[];
  trigger?: React.ReactNode;
}) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  // Controls the standalone form modal (used when NO trigger is present)
  const [isInlineFormModalOpen, setIsInlineFormModalOpen] = useState(false);
  // Controls the main wrapper modal (used when trigger IS present)
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const handleBookClick = (resource: Resource) => {
    setSelectedResource(resource);
    setMessage(null);
    if (trigger) {
      // In trigger mode, we are already in a modal. 
      // Setting selectedResource switches the view to the form.
    } else {
      // In inline mode, we open the separate form modal.
      setIsInlineFormModalOpen(true);
    }
  };

  const filteredResources = resources.filter(
    (r) =>
      r.resource_name.toLowerCase().includes(search.toLowerCase()) ||
      r.resource_type.type_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCloseInlineForm = () => {
    setIsInlineFormModalOpen(false);
    setSelectedResource(null);
  };

  const handleCloseTriggerModal = () => {
    setIsTriggerModalOpen(false);
    setSelectedResource(null);
    setSearch("");
    setMessage(null);
  };

  const handleBackToList = () => {
    setSelectedResource(null);
    setMessage(null);
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
      // Close modal after short delay
      setTimeout(() => {
        if (trigger) {
          handleCloseTriggerModal();
        } else {
          handleCloseInlineForm();
        }
      }, 2000);
    }
  };

  const isAvailableNow = (resource: Resource) => {
    const now = new Date();
    return !resource.bookings.some(
      (b) =>
        b.status === "APPROVED" &&
        new Date(b.start_datetime) <= now &&
        new Date(b.end_datetime) >= now
    );
  };

  // --- Render Helpers ---

  const renderResourceList = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className={`fw-bold text-dark mb-0 ${trigger ? "h5" : ""}`}>
          {trigger ? "Select a Resource" : "Available Resources"}
        </h4>
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

      <div className={trigger ? "list-group-wrapper" : "glass-card mb-4 overflow-hidden"}>
        <div className={trigger ? "" : "card-body p-0"}>
          <div className="list-group list-group-flush">
            {filteredResources.map((resource) => {
              const available = isAvailableNow(resource);
              return (
                <div
                  key={resource.resource_id}
                  className="list-group-item p-3 d-flex align-items-center justify-content-between bg-transparent border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-white rounded p-2 me-3 text-center d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <i className="bi bi-box-seam fs-4 text-primary"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">
                        {resource.resource_name}
                      </h6>
                      <small className="text-muted">
                        {resource.resource_type.type_name}
                      </small>
                      <div className="mt-1">
                        {available ? (
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill" style={{ fontSize: '0.7em' }}>
                            Available
                          </span>
                        ) : (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill" style={{ fontSize: '0.7em' }}>
                            In Use
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookClick(resource)}
                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  >
                    Select
                  </button>
                </div>
              );
            })}

            {resources.length === 0 && (
              <div className="p-4 text-center text-muted">
                No resources found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderBookingForm = () => (
    <>
      {trigger && (
        <button
          type="button"
          className="btn btn-link text-decoration-none p-0 mb-3 text-muted"
          onClick={handleBackToList}
        >
          <i className="bi bi-arrow-left me-1"></i> Back to list
        </button>
      )}

      {!trigger && (
        <p className="text-muted small mb-4">
          Select your desired date and time. Availability will be checked upon submission.
        </p>
      )}

      {message && (
        <div
          className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
            } mb-3`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="resourceId"
          value={selectedResource!.resource_id}
        />
        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            name="startDate"
            className="form-control"
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
            onClick={trigger ? handleCloseTriggerModal : handleCloseInlineForm}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );

  // --- Main Render ---

  if (trigger) {
    return (
      <>
        <div onClick={() => setIsTriggerModalOpen(true)} className="d-inline-block">
          {trigger}
        </div>

        {isTriggerModalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div
                className="modal-content border-0 shadow-lg"
                style={{ borderRadius: "1rem" }}
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    {selectedResource
                      ? `Book ${selectedResource.resource_name}`
                      : "New Booking"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseTriggerModal}
                  ></button>
                </div>
                <div className="modal-body p-4 pt-3">
                  {/* If a resource is selected, show Form. Else show List */}
                  {selectedResource ? renderBookingForm() : renderResourceList()}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Inline Mode (Original Behavior)
  return (
    <>
      {renderResourceList()}

      {/* Booking Form Modal */}
      {isInlineFormModalOpen && selectedResource && (
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
                  onClick={handleCloseInlineForm}
                ></button>
              </div>
              <div className="modal-body p-4">
                {renderBookingForm()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
