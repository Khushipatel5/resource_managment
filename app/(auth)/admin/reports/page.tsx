import { requireRole } from "@/lib/auth";

export default async function AdminReportsPage() {
    await requireRole("ADMIN");

    return (
        <div className="container-fluid p-4">
            <h1 className="h2 fw-bold text-dark mb-4">System Reports</h1>
            <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Reporting module is under development. Coming soon: Usage analytics, Peak times, and User activity logs.
            </div>
        </div>
    );
}
