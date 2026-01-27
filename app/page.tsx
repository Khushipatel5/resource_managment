import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div className="container">
          <Link
            className="navbar-brand fw-bold text-primary d-flex align-items-center"
            href="/"
          >
            <i className="bi bi-grid-1x2-fill me-2"></i> ResourceSys
          </Link>
          <div className="d-flex gap-2">
            {user ? (
              <Link
                href="/dashboard"
                className="btn btn-primary fw-semibold rounded-pill px-4"
              >
                Dashboard <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-outline-primary fw-semibold rounded-pill px-4"
                >
                  Log In
                </Link>
                {/* <Link href="/register" className="btn btn-primary fw-semibold rounded-pill px-4">
                  Sign Up
                </Link> */}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-grow-1 d-flex align-items-center position-relative overflow-hidden py-5">
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="pe-lg-5">
                <span className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold">
                  University Resource Management v1.0
                </span>
                <h1 className="display-3 fw-bold text-dark mb-4 lh-sm">
                  Smart Allocation for{" "}
                  <span className="text-primary">Campus Resources</span>
                </h1>
                <p className="lead text-secondary mb-5">
                  Streamline booking, tracking, and management of university
                  labs, equipment, and facilities in one unified platform.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  {!user && (
                    <Link
                      href="/register"
                      className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg hover-lift"
                    >
                      Get Started <i className="bi bi-chevron-right ms-2"></i>
                    </Link>
                  )}
                  <a
                    href="#features"
                    className="btn btn-white btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm border text-dark hover-lift"
                  >
                    Learn More
                  </a>
                </div>
                <div className="mt-5 d-flex align-items-center gap-4 text-secondary small">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>{" "}
                    Real-time Availability
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>{" "}
                    Instant Approvals
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                {/* Abstract decorative shapes */}
                <div
                  className="position-absolute top-0 end-0 bg-primary opacity-10 rounded-circle"
                  style={{
                    width: "300px",
                    height: "300px",
                    filter: "blur(60px)",
                    transform: "translate(20%, -20%)",
                  }}
                ></div>
                <div
                  className="position-absolute bottom-0 start-0 bg-info opacity-10 rounded-circle"
                  style={{
                    width: "250px",
                    height: "250px",
                    filter: "blur(60px)",
                    transform: "translate(-20%, 20%)",
                  }}
                ></div>

                {/* Glass-morphism Card Mockup */}
                <div
                  className="card border-0 shadow-lg bg-white bg-opacity-75 backdrop-blur rounded-4 p-4 position-relative z-1 mb-4 ms-lg-4"
                  style={{ backdropFilter: "blur(20px)" }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="fw-bold mb-0">Resource Request</h5>
                    <span className="badge bg-warning text-dark">Pending</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light p-3 rounded-3 me-3">
                      <i className="bi bi-laptop fs-3 text-primary"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">MacBook Pro 16"</h6>
                      <small className="text-muted">Design Lab • 2 Units</small>
                    </div>
                  </div>
                  <div className="progress mb-3" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-dark w-100 rounded-3">
                      Details
                    </button>
                    <button className="btn btn-sm btn-outline-danger w-100 rounded-3">
                      Cancel
                    </button>
                  </div>
                </div>

                <div
                  className="card border-0 shadow-lg bg-dark text-white rounded-4 p-4 position-relative z-2 w-75 me-auto"
                  style={{ transform: "translateY(-30px)" }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="mb-0 text-white-50">Systems Active</h6>
                    <i className="bi bi-hdd-network text-success"></i>
                  </div>
                  <h2 className="display-6 fw-bold mb-0">98.5%</h2>
                  <small className="text-success small">
                    <i className="bi bi-arrow-up-short"></i> Uptime this month
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-5 bg-white">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-6">
              <h2 className="fw-bold text-dark">
                Everything you need to manage assets
              </h2>
              <p className="text-secondary">
                From simple booking to complex maintenance tracking, we cover
                the full lifecycle of university resources.
              </p>
            </div>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 hover-bg-light transition-all">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-4"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-calendar-check fs-2"></i>
                </div>
                <h4 className="fw-bold mb-3">Easy Booking</h4>
                <p className="text-muted">
                  Students and staff can book rooms and equipment in seconds
                  with our intuitive calendar interface.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4 hover-bg-light transition-all">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-4"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-shield-check fs-2"></i>
                </div>
                <h4 className="fw-bold mb-3">Approval Workflow</h4>
                <p className="text-muted">
                  Automated routing of requests to the right approvers ensures
                  governance without the bottleneck.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4 hover-bg-light transition-all">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-circle mb-4"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-tools fs-2"></i>
                </div>
                <h4 className="fw-bold mb-3">Maintenance Tracking</h4>
                <p className="text-muted">
                  Log issues, assign repairs, and track equipment health to
                  minimize downtime and extend asset life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-light py-5 border-top">
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="col-md-4">
              <h5 className="fw-bold mb-3">ResourceSys</h5>
              <p className="text-muted small">
                Modernizing campus management one resource at a time. Built for
                efficiency, designed for people.
              </p>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold mb-3">Platform</h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Features
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Integrations
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold mb-3">Support</h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Help Center
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Documentation
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold mb-3">Legal</h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-decoration-none text-muted">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="row mt-5 pt-4 border-top">
            <div className="col text-center text-muted small">
              © 2025 Resource Management System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .hover-lift {
           transition: transform 0.2s ease-out;
        }
        .hover-lift:hover {
           transform: translateY(-3px);
        }
        .hover-bg-light:hover {
           background-color: rgba(0,0,0,0.02);
        }
        .transition-all {
           transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
