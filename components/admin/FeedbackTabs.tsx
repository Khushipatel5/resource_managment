"use client";

import { useState } from "react";
import FeedbackCard from "./FeedbackCard";

export default function FeedbackTabs({ feedbacks, staff }: { feedbacks: any[], staff: any[] }) {
    const [activeTab, setActiveTab] = useState<"pending" | "solved" | "all">("pending");

    const pendingFeedbacks = feedbacks.filter(f => f.status === "PENDING");
    const solvedFeedbacks = feedbacks.filter(f => f.status === "COMPLETED");

    let displayFeedbacks = feedbacks;
    if (activeTab === "pending") displayFeedbacks = pendingFeedbacks;
    else if (activeTab === "solved") displayFeedbacks = solvedFeedbacks;

    return (
        <div>
            {/* Tabs Header */}
            <div className="d-flex justify-content-center mb-5 animate-fade-in delay-150">
                <div className="glass-card p-1 d-flex gap-1" style={{ borderRadius: '999px' }}>
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === "pending"
                            ? "btn-primary shadow-sm"
                            : "btn-light border-0 text-muted"
                            }`}
                    >
                        Action Required ({pendingFeedbacks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("solved")}
                        className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === "solved"
                            ? "btn-success shadow-sm text-white"
                            : "btn-light border-0 text-muted"
                            }`}
                    >
                        Solved ({solvedFeedbacks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${activeTab === "all"
                            ? "btn-primary shadow-sm"
                            : "btn-light border-0 text-muted"
                            }`}
                    >
                        Full History ({feedbacks.length})
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 animate-fade-in delay-200">
                {displayFeedbacks.map((f: any) => (
                    <FeedbackCard key={`${activeTab}-${f.feedback_id}`} feedback={f} staff={staff} />
                ))}
            </div>

            {/* Empty State */}
            {displayFeedbacks.length === 0 && (
                <div className="text-center py-5 mt-4 animate-fade-in">
                    <div className="mb-4">
                        <i className={`bi bi-${activeTab === "pending" ? "check2-circle" : activeTab === "solved" ? "emoji-smile" : "chat-dots"} fs-1 text-muted opacity-25`}></i>
                    </div>
                    <h4 className="text-muted">
                        {activeTab === "pending"
                            ? "All caught up! No pending feedback."
                            : activeTab === "solved"
                                ? "No feedback solved yet."
                                : "No feedback received yet."}
                    </h4>
                </div>
            )}
        </div>
    );
}
