import { requireRole } from "@/lib/auth";
import Link from "next/link";

export default async function AdminPage() {
  await requireRole("ADMIN");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Admin Dashboard</h1>
          <p className="text-secondary mb-0">Manage system resources, users, and settings.</p>
        </div>
        <Link href="/admin/AddResources" className="btn btn-primary d-flex align-items-center shadow-sm">
          <i className="bi bi-plus-circle me-2"></i> Add New Resource
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 border-start border-4 border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-uppercase text-muted small fw-bold mb-0">Total Users</h6>
                <i className="bi bi-people text-primary fs-4"></i>
              </div>
              <h2 className="display-6 fw-bold mb-0">1,240</h2>
              <small className="text-success"><i className="bi bi-arrow-up"></i> 12% increase</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 border-start border-4 border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-uppercase text-muted small fw-bold mb-0">Active Resources</h6>
                <i className="bi bi-pc-display text-success fs-4"></i>
              </div>
              <h2 className="display-6 fw-bold mb-0">85</h2>
              <small className="text-muted">Currently in use</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 border-start border-4 border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-uppercase text-muted small fw-bold mb-0">Pending Requests</h6>
                <i className="bi bi-hourglass-split text-warning fs-4"></i>
              </div>
              <h2 className="display-6 fw-bold mb-0">12</h2>
              <small className="text-danger"><i className="bi bi-exclamation-circle"></i> Requires attention</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 border-start border-4 border-danger">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-uppercase text-muted small fw-bold mb-0">Maintenance Issues</h6>
                <i className="bi bi-tools text-danger fs-4"></i>
              </div>
              <h2 className="display-6 fw-bold mb-0">4</h2>
              <small className="text-muted">Reported this week</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <h4 className="fw-bold mb-4 text-dark">Quick Actions</h4>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm card-hover cursor-pointer text-decoration-none">
            <div className="card-body p-4 text-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-person-gear fs-3"></i>
              </div>
              <h5 className="card-title fw-bold">User Management</h5>
              <p className="card-text text-muted small">Add, remove, or update user roles and permissions across the system.</p>
              <a href="#" className="btn btn-outline-primary btn-sm mt-2 stretched-link">Manage Users</a>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm card-hover">
            <div className="card-body p-4 text-center">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-building-gear fs-3"></i>
              </div>
              <h5 className="card-title fw-bold">Resource Allocation</h5>
              <p className="card-text text-muted small">Assign resources to departments, update availability, and track usage.</p>
              <a href="#" className="btn btn-outline-success btn-sm mt-2 stretched-link">Configure Resources</a>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm card-hover">
            <div className="card-body p-4 text-center">
              <div className="bg-info bg-opacity-10 text-info rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-bar-chart-fill fs-3"></i>
              </div>
              <h5 className="card-title fw-bold">System Reports</h5>
              <p className="card-text text-muted small">Generate usage reports, audit logs, and system health status.</p>
              <a href="#" className="btn btn-outline-info btn-sm mt-2 stretched-link">View Reports</a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card border-0 shadow-sm mt-5">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Recent System Activity</h5>
          <button className="btn btn-light btn-sm">View All</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="ps-4">User</th>
                <th scope="col">Action</th>
                <th scope="col">Resource</th>
                <th scope="col">Time</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="ps-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-secondary bg-opacity-25 rounded-circle p-2 me-2">
                      <i className="bi bi-person-fill text-secondary"></i>
                    </div>
                    <span>John Doe</span>
                  </div>
                </th>
                <td>Booking Request</td>
                <td>Lab Room 302</td>
                <td>2 mins ago</td>
                <td><span className="badge bg-warning text-dark bg-opacity-25 text-warning-emphasis">Pending</span></td>
              </tr>
              <tr>
                <th scope="row" className="ps-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-secondary bg-opacity-25 rounded-circle p-2 me-2">
                      <i className="bi bi-person-fill text-secondary"></i>
                    </div>
                    <span>Jane Smith</span>
                  </div>
                </th>
                <td>Maintenance Report</td>
                <td>Projector A1</td>
                <td>1 hour ago</td>
                <td><span className="badge bg-danger bg-opacity-10 text-danger">Open</span></td>
              </tr>
              <tr>
                <th scope="row" className="ps-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-secondary bg-opacity-25 rounded-circle p-2 me-2">
                      <i className="bi bi-person-fill text-secondary"></i>
                    </div>
                    <span>Mike Brown</span>
                  </div>
                </th>
                <td>Resource Return</td>
                <td>Laptop #45</td>
                <td>3 hours ago</td>
                <td><span className="badge bg-success bg-opacity-10 text-success">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
