import { requireRole } from "@/lib/auth";

export default async function AdminSettingsPage() {
    await requireRole("ADMIN");

    return (
        <div className="container-fluid p-4">
            <h1 className="h2 fw-bold text-dark mb-4">System Settings</h1>
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <h5 className="fw-bold">General Configuration</h5>
                    <p className="text-muted">Configure application wide settings.</p>

                    <div className="mb-3">
                        <label className="form-label">System Name</label>
                        <input type="text" className="form-control" defaultValue="Resource Management System" disabled />
                    </div>

                    <button className="btn btn-primary" disabled>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
