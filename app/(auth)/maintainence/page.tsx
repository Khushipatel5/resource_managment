import { requireRole } from "@/lib/auth";

export default async function MaintenancePage() {
  await requireRole("MAINTENANCE");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Maintenance Dashboard</h1>
          <p className="text-secondary mb-0">Monitor and fix resource issues.</p>
        </div>
        <button className="btn btn-warning text-dark shadow-sm">
          <i className="bi bi-exclamation-triangle me-2"></i> Report Issue
        </button>
      </div>

      <div className="row g-4 mb-4">
        {/* High Priority Alert */}
        <div className="col-12">
          <div className="alert alert-danger shadow-sm border-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-octagon-fill fs-3 me-3"></i>
            <div>
              <h5 className="alert-heading fw-bold mb-1">Critical Issue: Server Room A/C Failure</h5>
              <p className="mb-0">Temperature rising in Server Room 2. Immediate attention required.</p>
            </div>
            <button className="btn btn-danger ms-auto fw-bold">Acknowledge</button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <h4 className="fw-bold mb-3">Assigned Tasks</h4>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Task ID</th>
                      <th>Resource</th>
                      <th>Issue</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ps-4 fw-bold">#MT-2023</td>
                      <td>Projector B2</td>
                      <td>Lamp Replacement</td>
                      <td><span className="badge bg-warning text-dark">Medium</span></td>
                      <td>In Progress</td>
                      <td><button className="btn btn-sm btn-outline-primary">Update</button></td>
                    </tr>
                    <tr>
                      <td className="ps-4 fw-bold">#MT-2025</td>
                      <td>Lab Chair</td>
                      <td>Broken Wheel</td>
                      <td><span className="badge bg-info text-dark">Low</span></td>
                      <td>Pending</td>
                      <td><button className="btn btn-sm btn-outline-primary">Update</button></td>
                    </tr>
                    <tr>
                      <td className="ps-4 fw-bold">#MT-2021</td>
                      <td>Smart Board</td>
                      <td>Touch Unresponsive</td>
                      <td><span className="badge bg-danger">High</span></td>
                      <td>Assigned</td>
                      <td><button className="btn btn-sm btn-outline-primary">Update</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <h4 className="fw-bold mb-3">Resource Health</h4>

          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-semibold">Operational</span>
                <span className="text-success fw-bold">92%</span>
              </div>
              <div className="progress" style={{ height: "10px" }}>
                <div className="progress-bar bg-success" role="progressbar" style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-semibold">Under Maintenance</span>
                <span className="text-warning fw-bold">5%</span>
              </div>
              <div className="progress" style={{ height: "10px" }}>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: "5%" }}></div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-semibold">Broken / Out of Order</span>
                <span className="text-danger fw-bold">3%</span>
              </div>
              <div className="progress" style={{ height: "10px" }}>
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: "3%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
