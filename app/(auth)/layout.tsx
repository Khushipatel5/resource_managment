"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            router.push("/login");
            router.refresh();
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Navbar matched to Landing Page */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
                <div className="container">
                    <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" href="/dashboard">
                        <i className="bi bi-grid-1x2-fill me-2"></i>
                        <span>ResourceSys</span>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarContent"
                        aria-controls="navbarContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarContent">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item me-3">
                                <span className="nav-link text-secondary fw-medium small">
                                    <i className="bi bi-person-circle me-1"></i> User
                                </span>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-sm btn-outline-danger fw-semibold px-4 rounded-pill"
                                >
                                    Sign Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow-1 py-5">
                <div className="container">
                    <div className="fade-in-up">
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white py-4 border-top mt-auto">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <p className="text-muted small mb-0">&copy; 2025 University Resource Management. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <ul className="list-inline mb-0 small">
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted">Privacy</a></li>
                                <li className="list-inline-item mx-2">&middot;</li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted">Terms</a></li>
                                <li className="list-inline-item mx-2">&middot;</li>
                                <li className="list-inline-item"><a href="#" className="text-decoration-none text-muted">Support</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
        .fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
