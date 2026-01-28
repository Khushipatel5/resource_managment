import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentFeedbackHistoryPage() {
    const user = await requireRole("STUDENT");

    const myFeedbacks = await prisma.feedback.findMany({
        where: {
            user_id: user.user_id
        },
        include: {
            resource: true,
            maintenance: {
                select: {
                    status: true,
                    assigned_to: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
                <div>
                    <h1 className="fw-bold mb-1">
                        My <span className="text-gradient">Feedback History</span>
                    </h1>
                    <p className="text-muted mb-0">Track the status of your reported issues</p>
                </div>
                <Link href="/student" className="btn btn-modern">
                    <i className="bi bi-arrow-left me-2"></i>Dashboard
                </Link>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 animate-fade-in delay-100">
                {myFeedbacks.map((feedback) => (
                    <div key={feedback.feedback_id} className="col">
                        <div className="glass-card p-4 h-100 d-flex flex-column border-0">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="small text-muted">
                                    {new Date(feedback.created_at).toLocaleDateString()}
                                </span>
                                <span className={`badge rounded-pill ${feedback.status === "PENDING" ? "bg-warning bg-opacity-10 text-warning" :
                                    feedback.status === "COMPLETED" ? "bg-success bg-opacity-10 text-success" :
                                        "bg-primary bg-opacity-10 text-primary"
                                    }`}>
                                    {feedback.status}
                                </span>
                            </div>

                            <div className="mb-3">
                                <h6 className="fw-bold text-dark mb-1">
                                    <i className="bi bi-box-seam me-2 text-primary"></i>
                                    {feedback.resource?.resource_name || "General Feedback"}
                                </h6>
                                <p className="text-secondary small mt-2">"{feedback.message}"</p>
                            </div>

                            <div className="mt-auto pt-3 border-top border-light">
                                {feedback.maintenance?.[0] ? (
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="small text-muted">
                                            <i className="bi bi-person-check me-1"></i>
                                            {feedback.maintenance[0].assigned_to?.name || "Staff Assigned"}
                                        </div>
                                        <span className={`badge rounded-pill x-small ${feedback.maintenance[0].status === "COMPLETED" ? "bg-success" : "bg-info"
                                            }`}>
                                            {feedback.maintenance[0].status}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="small text-muted italic">
                                        <i className="bi bi-hourglass me-1"></i>
                                        Awaiting review by Admin
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {myFeedbacks.length === 0 && (
                <div className="text-center py-5 mt-5 animate-fade-in">
                    <div className="mb-4">
                        <i className="bi bi-chat-right-text fs-1 text-muted opacity-25"></i>
                    </div>
                    <h4 className="text-muted">You haven't submitted any feedback yet.</h4>
                    <Link href="/student/feedback" className="btn btn-modern mt-3">
                        Submit Feedback
                    </Link>
                </div>
            )}
        </div>
    );
}
