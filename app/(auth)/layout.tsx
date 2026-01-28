"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

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

    useEffect(() => {
        const r = getCookie("role");
        setRole(r || null);
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

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar role={role} handleLogout={handleLogout} />

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
