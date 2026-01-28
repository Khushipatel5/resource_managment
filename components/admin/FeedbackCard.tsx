"use client";

import { useState } from "react";
import { assignStaffToFeedback } from "@/lib/actions/feedback";
import { useRouter } from "next/navigation";

type Staff = {
    user_id: number;
    name: string;
    role: string;
};

export default function FeedbackCard({ feedback, staff }: { feedback: any; staff: Staff[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<string>("");
    const [taskType, setTaskType] = useState("Repair / Issue");
    const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAssign = async () => {
        if (!selectedStaff) return;

        setLoading(true);
        const res = await assignStaffToFeedback(
            feedback.feedback_id,
            parseInt(selectedStaff),
            taskType,
            new Date(scheduledDate)
        );
        setLoading(false);

        if (res.success) {
            setShowModal(false);
            router.refresh();
        } else {
            alert(res.error);
        }
    };

    return (
        <div className="col">
            <div className="glass-card h-100 p-4 d-flex flex-column border-0 shadow-sm hover-lift">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                            <i className="bi bi-person text-primary"></i>
                        </div>
                        <div>
                            <h6 className="fw-bold mb-0 text-dark">{feedback.user.name.toUpperCase()}</h6>
                            <small className="text-muted">{feedback.user.email}</small>
                        </div>
                    </div>
                    <span className={`badge rounded-pill ${feedback.status === "PENDING" ? "bg-warning bg-opacity-10 text-warning" :
                        feedback.status === "COMPLETED" ? "bg-success bg-opacity-10 text-success" :
                            feedback.status === "IN_PROGRESS" ? "bg-primary bg-opacity-10 text-primary" :
                                "bg-info bg-opacity-10 text-info"
                        }`}>
                        {feedback.status}
                    </span>
                </div>

                <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-box-seam text-secondary me-2 small"></i>
                        <span className="badge bg-light text-dark border-0 small px-2 py-1">
                            {feedback.resource?.resource_name || "General Feedback"}
                        </span>
                    </div>
                    <p className="text-secondary small mb-0" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        "{feedback.message}"
                    </p>
                </div>

                <div className="mt-auto pt-3 border-top border-light">
                    {feedback.status !== "PENDING" && feedback.maintenance?.[0] ? (
                        <div>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    <i className="bi bi-person-check text-primary me-2"></i>
                                    <span className="small fw-semibold">{feedback.maintenance[0].assigned_to?.name.toUpperCase() || "NIL"}</span>
                                </div>
                                <span className={`badge rounded-pill small ${feedback.maintenance[0].status === "COMPLETED" ? "bg-success text-white" :
                                    feedback.maintenance[0].status === "IN_PROGRESS" ? "bg-primary text-white" : "bg-info text-dark"
                                    }`}>
                                    {feedback.maintenance[0].status}
                                </span>
                            </div>
                            <div className="progress" style={{ height: "4px" }}>
                                <div
                                    className={`progress-bar ${feedback.maintenance[0].status === "COMPLETED" ? "bg-success" :
                                        feedback.maintenance[0].status === "IN_PROGRESS" ? "bg-primary" : "bg-info"
                                        }`}
                                    role="progressbar"
                                    style={{
                                        width: feedback.maintenance[0].status === "COMPLETED" ? "100%" :
                                            feedback.maintenance[0].status === "IN_PROGRESS" ? "50%" : "10%"
                                    }}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="btn btn-primary btn-sm w-100 rounded-pill py-2 fw-bold"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="bi bi-plus-lg me-1"></i> Assign Staff
                        </button>
                    )}
                </div>

                {showModal && (
                    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                                <div className="modal-header bg-primary text-white border-0 py-3">
                                    <h5 className="modal-title fw-bold">
                                        <i className="bi bi-tools me-2"></i> Create Maintenance Task
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body p-4 bg-light bg-opacity-50">
                                    <div className="alert bg-white border mb-4">
                                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem' }}>Student Feedback</small>
                                        <p className="small mb-0 text-dark">"{feedback.message}"</p>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Assign to Staff</label>
                                        <select
                                            className="form-select border-0 shadow-sm rounded-pill px-4 py-2"
                                            value={selectedStaff}
                                            onChange={(e) => setSelectedStaff(e.target.value)}
                                        >
                                            <option value="">Choose staff member...</option>
                                            {staff.map(s => (
                                                <option key={s.user_id} value={s.user_id}>{s.name} ({s.role})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Task Category</label>
                                            <select
                                                className="form-select border-0 shadow-sm rounded-pill px-4 py-2"
                                                value={taskType}
                                                onChange={(e) => setTaskType(e.target.value)}
                                            >
                                                <option value="Repair / Issue">Repair / Issue</option>
                                                <option value="Replacement">Replacement</option>
                                                <option value="Inspection">Inspection</option>
                                                <option value="Cleaning">Cleaning</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted text-uppercase">Schedule For</label>
                                            <input
                                                type="date"
                                                className="form-control border-0 shadow-sm rounded-pill px-4 py-2"
                                                value={scheduledDate}
                                                onChange={(e) => setScheduledDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4 bg-light bg-opacity-50">
                                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4 border-0" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button
                                        type="button"
                                        className="btn btn-primary rounded-pill px-5 shadow-sm fw-bold"
                                        onClick={handleAssign}
                                        disabled={loading || !selectedStaff}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Assigning...
                                            </>
                                        ) : "Assign Now"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
