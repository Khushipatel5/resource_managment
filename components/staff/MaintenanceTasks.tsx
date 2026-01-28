"use client";

import { useState } from "react";
import { updateMaintenanceStatus } from "@/lib/actions/maintenance";

type Task = {
    maintenance_id: number;
    maintenance_type: string;
    scheduled_date: Date;
    status: string;
    notes: string | null;
    resource: {
        resource_name: string;
    };
};

export default function MaintenanceTasks({ initialTasks }: { initialTasks: any[] }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleUpdateStatus = async (taskId: number, newStatus: string) => {
        setLoadingId(taskId);
        const res = await updateMaintenanceStatus(taskId, newStatus);
        setLoadingId(null);

        if (res.success) {
            setTasks(tasks.map(t => t.maintenance_id === taskId ? { ...t, status: newStatus } : t));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "warning";
            case "SCHEDULED": return "info";
            case "IN_PROGRESS": return "primary";
            case "COMPLETED": return "success";
            default: return "secondary";
        }
    };

    return (
        <div className="glass-card overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-tools me-2 text-primary"></i> Maintenance Tasks
                </h5>
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                    {tasks.filter(t => t.status !== "COMPLETED").length} Active
                </span>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-secondary small text-uppercase fw-bold">
                            <tr>
                                <th className="px-4 py-3 border-0">Resource</th>
                                <th className="py-3 border-0">Type</th>
                                <th className="py-3 border-0">Scheduled</th>
                                <th className="py-3 border-0">Status</th>
                                <th className="px-4 py-3 border-0 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody className="border-0">
                            {tasks.map((task) => (
                                <tr key={task.maintenance_id} className="border-bottom-0">
                                    <td className="px-4 py-3">
                                        <div className="fw-semibold text-dark">{task.resource.resource_name}</div>
                                        {task.notes && (
                                            <div className="small text-muted mt-1 fst-italic">
                                                <i className="bi bi-info-circle me-1"></i>
                                                {task.notes}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3">
                                        <span className="text-muted small">{task.maintenance_type}</span>
                                    </td>
                                    <td className="py-3 text-muted small">
                                        {new Date(task.scheduled_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3">
                                        <span className={`badge bg-${getStatusColor(task.status)} bg-opacity-10 text-${getStatusColor(task.status)} rounded-pill`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        {task.status === "PENDING" && (
                                            <button
                                                onClick={() => handleUpdateStatus(task.maintenance_id, "IN_PROGRESS")}
                                                className="btn btn-sm btn-primary rounded-pill px-3"
                                                disabled={loadingId === task.maintenance_id}
                                            >
                                                Start Task
                                            </button>
                                        )}
                                        {task.status === "IN_PROGRESS" && (
                                            <button
                                                onClick={() => handleUpdateStatus(task.maintenance_id, "COMPLETED")}
                                                className="btn btn-sm btn-success rounded-pill px-3"
                                                disabled={loadingId === task.maintenance_id}
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        <i className="bi bi-check2-circle fs-1 mb-3 d-block opacity-25"></i>
                                        No active maintenance tasks assigned to you.
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
