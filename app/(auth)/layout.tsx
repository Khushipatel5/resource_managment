"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Simple cookie getter helper
function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const r = getCookie("role");
        setRole(r || null);

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            router.refresh();
            router.push("/");
            // Refresh to clear cookies from state
        }
    };

    const isActive = (path: string) => pathname?.startsWith(path);

    const NavItem = ({ href, icon, label }: { href: string; icon: string; label: string }) => (
        <li className="nav-item">
            <Link
                href={href}
                className={`nav-link px-3 ${isActive(href) ? "text-primary fw-bold" : "text-secondary"}`}
            >
                <i className={`bi ${icon} me-2`}></i>{label}
            </Link>
        </li>
    );

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* Proper Navbar */}
            <nav className={`navbar navbar-expand-lg sticky-top transition-all ${scrolled ? "bg-white shadow-sm py-2" : "bg-white/80 backdrop-blur-md py-3 border-bottom"}`}>
                <div className="container">
                    <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" href="/dashboard">
                        <div className="bg-primary text-white rounded p-1 me-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                            <i className="bi bi-grid-fill small"></i>
                        </div>
                        <span className="ls-tight">ResourceSys</span>
                    </Link>

                    <button
                        className="navbar-toggler border-0 shadow-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarContent"
                    >
                        <i className="bi bi-list fs-4"></i>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarContent">
                        <ul className="navbar-nav mx-auto align-items-center">
                            {/* Common Links */}
                            <NavItem href="/dashboard" icon="bi-speedometer2" label="Dashboard" />

                            {/* Role Based Links */}
                            {role === "ADMIN" && (
                                <>
                                    <NavItem href="/admin/bookings" icon="bi-calendar-check" label="Bookings" />
                                    <NavItem href="/admin/users" icon="bi-people" label="Users" />
                                    <NavItem href="/admin/inventory" icon="bi-box-seam" label="Inventory" />
                                </>
                            )}

                            {(role === "STAFF" || role === "MAINTENANCE") && (
                                <NavItem href="/staff" icon="bi-calendar-plus" label="Portal" />
                            )}

                            {role === "STUDENT" && (
                                <NavItem href="/student" icon="bi-calendar-plus" label="My Portal" />
                            )}

                            {role === "APPROVER" && (
                                <NavItem href="/approver" icon="bi-check-circle" label="Approvals" />
                            )}

                            {/* Shared Maintenance View if needed, strictly speaking covered in Staff now, but good to have explicit Nav if they are explicitly Maintenance role */}
                            {/* (role === "MAINTENANCE") && <NavItem href="/maintainence" icon="bi-tools" label="Tasks" /> - Redundant due to redirect */}
                        </ul>

                        <ul className="navbar-nav ms-auto align-items-center gap-2">
                            <li className="nav-item">
                                <div className="nav-link d-flex align-items-center gap-2 text-dark bg-light rounded-pill px-3 py-1">
                                    <div className="bg-secondary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>
                                        <i className="bi bi-person-fill text-secondary"></i>
                                    </div>
                                    <span className="small fw-medium">{role || 'User'}</span>
                                </div>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-sm btn-outline-danger fw-semibold px-4 rounded-pill border-0 bg-danger bg-opacity-10 text-danger"
                                >
                                    Sign Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow-1 py-4">
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
                            <p className="text-muted small mb-0">&copy; 2025 University Resource Management.</p>
                        </div>
                        <div className="col-md-6 text-center text-md-end opacity-50">
                            <i className="bi bi-shield-lock-fill text-muted"></i>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                .fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nav-link { transition: all 0.2s; border-radius: 0.5rem; }
                .nav-link:hover { background: rgba(0,0,0,0.03); color: var(--primary-color) !important; }
                .navbar { transition: padding 0.3s ease, background 0.3s ease; }
            `}</style>
        </div>
    );
}
