import { requireRole } from "@/lib/auth";

export default async function StaffPage() {
  await requireRole("STAFF");

  return (
    <div>
      <div className="row align-items-center mb-5">
        <div className="col">
          <h1 className="h2 fw-bold text-dark mb-1">Staff Dashboard</h1>
          <p className="text-secondary mb-0">Facilitate and manage resource usage.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <a href="#" className="card bg-primary text-white border-0 shadow-sm h-100 text-decoration-none transition-transform hover-scale">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div className="mb-4">
                <i className="bi bi-calendar-check fs-1 opacity-50"></i>
              </div>
              <div>
                <h5 className="fw-bold">Reserve Resource</h5>
                <p className="small mb-0 opacity-75">Book equipment for classes or personal use</p>
              </div>
            </div>
          </a>
        </div>

        <div className="col-md-3">
          <a href="#" className="card bg-info text-white border-0 shadow-sm h-100 text-decoration-none transition-transform hover-scale">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div className="mb-4">
                <i className="bi bi-list-check fs-1 opacity-50"></i>
              </div>
              <div>
                <h5 className="fw-bold">My Reservations</h5>
                <p className="small mb-0 opacity-75">View and manage your active bookings</p>
              </div>
            </div>
          </a>
        </div>

        <div className="col-md-3">
          <a href="#" className="card bg-success text-white border-0 shadow-sm h-100 text-decoration-none transition-transform hover-scale">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div className="mb-4">
                <i className="bi bi-search fs-1 opacity-50"></i>
              </div>
              <div>
                <h5 className="fw-bold">Browse Catalog</h5>
                <p className="small mb-0 opacity-75">Search the full inventory of resources</p>
              </div>
            </div>
          </a>
        </div>

        <div className="col-md-3">
          <a href="#" className="card bg-secondary text-white border-0 shadow-sm h-100 text-decoration-none transition-transform hover-scale">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div className="mb-4">
                <i className="bi bi-question-circle fs-1 opacity-50"></i>
              </div>
              <div>
                <h5 className="fw-bold">Help & Support</h5>
                <p className="small mb-0 opacity-75">Report issues or contact admin</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="fw-bold mb-3">Resource Status Overview</h4>
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Resource Name</th>
                    <th>Category</th>
                    <th>Availability</th>
                    <th>Next Available</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="fw-semibold">Lecture Hall 101</span>
                    </td>
                    <td>Room</td>
                    <td><span className="badge bg-success">Available</span></td>
                    <td>Now</td>
                    <td><button className="btn btn-sm btn-primary">Book</button></td>
                  </tr>
                  <tr>
                    <td>
                      <span className="fw-semibold">Physics Lab Kit A</span>
                    </td>
                    <td>Equipment</td>
                    <td><span className="badge bg-danger">Booked</span></td>
                    <td>Today, 4:00 PM</td>
                    <td><button className="btn btn-sm btn-secondary" disabled>Waitlist</button></td>
                  </tr>
                  <tr>
                    <td>
                      <span className="fw-semibold">Projector Portable</span>
                    </td>
                    <td>AV</td>
                    <td><span className="badge bg-warning text-dark">Maintaining</span></td>
                    <td>Unknown</td>
                    <td><button className="btn btn-sm btn-outline-danger" disabled>Report</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-scale {
          transition: transform 0.2s;
        }
        .hover-scale:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}
