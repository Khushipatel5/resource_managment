import { requireRole } from "@/lib/auth";
import { getFeedbacks, getStaffMembers } from "@/lib/actions/feedback";
import Link from "next/link";
import FeedbackTabs from "@/components/admin/FeedbackTabs";

export default async function AdminFeedbacksPage() {
    await requireRole("ADMIN");

    const feedbackRes = await getFeedbacks();
    const staffRes = await getStaffMembers();

    const feedbacks = feedbackRes.success ? feedbackRes.feedbacks : [];
    const staff = staffRes.success ? staffRes.staff : [];

    const stats = {
        total: feedbacks.length,
        pending: feedbacks.filter((f: any) => f.status === "PENDING").length,
        assigned: feedbacks.filter((f: any) => f.status !== "PENDING" && f.status !== "COMPLETED").length,
        completed: feedbacks.filter((f: any) => f.status === "COMPLETED").length,
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
                <div>
                    <h1 className="fw-bold mb-1">
                        Student <span className="text-gradient">Feedback Center</span>
                    </h1>
                    <p className="text-muted mb-0">Monitor issues and track service resolution</p>
                </div>
                <Link href="/admin" className="btn btn-modern">
                    <i className="bi bi-arrow-left me-2"></i>Dashboard
                </Link>
            </div>

            {/* Stats Row */}
            <div className="row g-4 mb-5 animate-fade-in delay-100">
                <div className="col-md-3">
                    <div className="glass-card p-3">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                <i className="bi bi-chat-left-dots text-primary fs-5"></i>
                            </div>
                            <div>
                                <h6 className="text-muted x-small mb-0 text-uppercase fw-bold">Total</h6>
                                <h4 className="fw-bold mb-0">{stats.total}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="glass-card p-3 border-warning border-opacity-25">
                        <div className="d-flex align-items-center">
                            <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                                <i className="bi bi-hourglass-split text-warning fs-5"></i>
                            </div>
                            <div>
                                <h6 className="text-muted x-small mb-0 text-uppercase fw-bold">Pending</h6>
                                <h4 className="fw-bold mb-0 text-warning">{stats.pending}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="glass-card p-3">
                        <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                                <i className="bi bi-tools text-info fs-5"></i>
                            </div>
                            <div>
                                <h6 className="text-muted x-small mb-0 text-uppercase fw-bold">Active Tasks</h6>
                                <h4 className="fw-bold mb-0 text-info">{stats.assigned}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="glass-card p-3 border-success border-opacity-25">
                        <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                                <i className="bi bi-check2-all text-success fs-5"></i>
                            </div>
                            <div>
                                <h6 className="text-muted x-small mb-0 text-uppercase fw-bold">Solved</h6>
                                <h4 className="fw-bold mb-0 text-success">{stats.completed}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FeedbackTabs feedbacks={feedbacks} staff={staff as any} />
        </div>
    );
}
