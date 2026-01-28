"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavbarProps {
    role: string | null;
    handleLogout: () => void;
}

export default function Navbar({ role, handleLogout }: NavbarProps) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                                <NavItem href="/admin/feedbacks" icon="bi-chat-left-dots" label="Feedbacks" />
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
    );
}
