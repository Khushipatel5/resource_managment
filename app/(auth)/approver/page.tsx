import { requireRole } from "@/lib/auth";

export default async function ApproverPage() {
  await requireRole("APPROVER");

  return (
    <div>
      <div className="mb-5">
        <h1 className="h2 fw-bold text-dark mb-1">Approver Control Center</h1>
        <p className="text-secondary">Review and manage resource allocation requests.</p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                <i className="bi bi-hourglass-split text-warning fs-3"></i>
              </div>
              <div>
                <h2 className="fw-bold mb-0">5</h2>
                <p className="text-muted mb-0">Pending Requests</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                <i className="bi bi-check-circle text-success fs-3"></i>
              </div>
              <div>
                <h2 className="fw-bold mb-0">28</h2>
                <p className="text-muted mb-0">Approved This Week</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                <i className="bi bi-x-circle text-danger fs-3"></i>
              </div>
              <div>
                <h2 className="fw-bold mb-0">3</h2>
                <p className="text-muted mb-0">Rejected This Week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-3">Pending Approvals</h4>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {/* Request Item 1 */}
            <div className="list-group-item p-4">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="d-flex align-items-start">
                  <div className="bg-light rounded-circle p-2 me-3">
                    <i className="bi bi-person fs-4 text-secondary"></i>
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold">John Student</h5>
                    <p className="mb-1">Requesting: <span className="fw-semibold text-primary">Seminar Hall A</span></p>
                    <small className="text-muted"><i className="bi bi-clock"></i> Requested 2 hours ago &middot; For: Jan 10, 2025 (10:00 AM - 12:00 PM)</small>
                    <p className="mt-2 mb-0 small text-dark bg-light p-2 rounded border">"Need for final year project presentation."</p>
                  </div>
                </div>
                <div className="d-flex flex-column gap-2">
                  <button className="btn btn-success btn-sm px-3"><i className="bi bi-check-lg me-1"></i> Approve</button>
                  <button className="btn btn-outline-danger btn-sm px-3"><i className="bi bi-x-lg me-1"></i> Reject</button>
                </div>
              </div>
            </div>

            {/* Request Item 2 */}
            <div className="list-group-item p-4">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="d-flex align-items-start">
                  <div className="bg-light rounded-circle p-2 me-3">
                    <i className="bi bi-person fs-4 text-secondary"></i>
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold">Sarah Staff</h5>
                    <p className="mb-1">Requesting: <span className="fw-semibold text-primary">3D Printer Lab</span></p>
                    <small className="text-muted"><i className="bi bi-clock"></i> Requested 5 hours ago &middot; For: Jan 12, 2025 (All Day)</small>
                  </div>
                </div>
                <div className="d-flex flex-column gap-2">
                  <button className="btn btn-success btn-sm px-3"><i className="bi bi-check-lg me-1"></i> Approve</button>
                  <button className="btn btn-outline-danger btn-sm px-3"><i className="bi bi-x-lg me-1"></i> Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
