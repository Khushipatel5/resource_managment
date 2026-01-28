import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StaffMaintenanceHistoryPage() {
    const user = await requireRole(["STAFF", "MAINTENANCE"]);

    const completedTasks = await prisma.maintenance.findMany({
        where: {
            assigned_to_id: user.user_id,
            status: "COMPLETED"
        },
        include: {
            resource: true,
            feedback: {
                include: {
                    user: true
                }
            }
        },
        orderBy: {
            scheduled_date: 'desc'
        }
    });

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
                <div>
                    <h1 className="fw-bold mb-1">
                        Maintenance <span className="text-gradient">History</span>
                    </h1>
                    <p className="text-muted mb-0">Review all your completed tasks</p>
                </div>
                <Link href="/staff" className="btn btn-modern">
                    <i className="bi bi-arrow-left me-2"></i>Back to Portal
                </Link>
            </div>

            <div className="glass-card overflow-hidden animate-fade-in delay-100">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-secondary small text-uppercase fw-bold">
                            <tr>
                                <th className="ps-4 py-3 border-0">Resource</th>
                                <th className="py-3 border-0">Type</th>
                                <th className="py-3 border-0">Completed On</th>
                                <th className="py-3 border-0">Original Feedback</th>
                                <th className="pe-4 py-3 border-0 text-end">Status</th>
                            </tr>
                        </thead>
                        <tbody className="border-0">
                            {completedTasks.map((task) => (
                                <tr key={task.maintenance_id}>
                                    <td className="ps-4">
                                        <div className="fw-semibold text-dark">{task.resource.resource_name}</div>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border-0">{task.maintenance_type}</span>
                                    </td>
                                    <td className="text-muted small">
                                        {new Date(task.scheduled_date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="text-wrap small text-secondary" style={{ maxWidth: '300px' }}>
                                            {task.feedback?.message || "Internal Task"}
                                        </div>
                                        {task.feedback?.user && (
                                            <div className="text-muted x-small mt-1">— {task.feedback.user.name}</div>
                                        )}
                                    </td>
                                    <td className="pe-4 text-end">
                                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">
                                            {task.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {completedTasks.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        <i className="bi bi-clock-history fs-1 mb-3 d-block opacity-25"></i>
                                        No completed tasks found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
