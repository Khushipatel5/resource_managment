"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/actions/feedback";

export default function FeedbackForm({ resources }: { resources: { resource_id: number, resource_name: string }[] }) {
    const [message, setMessage] = useState("");
    const [resourceId, setResourceId] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ success?: string; error?: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const res = await submitFeedback(message, resourceId);
        setLoading(false);

        if (res.success) {
            setStatus({ success: res.success });
            setMessage("");
            setResourceId(undefined);
        } else {
            setStatus({ error: res.error });
        }
    };

    return (
        <div className="glass-card p-4 animate-fade-in">
            <h4 className="fw-bold mb-4">Submit Feedback</h4>

            {status?.success && (
                <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success mb-4">
                    <i className="bi bi-check-circle me-2"></i> {status.success}
                </div>
            )}

            {status?.error && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i> {status.error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label text-muted small fw-bold text-uppercase">Resource</label>
                    <select
                        className="form-select border-0 bg-light rounded-pill px-4"
                        value={resourceId || ""}
                        onChange={(e) => setResourceId(e.target.value ? parseInt(e.target.value) : undefined)}
                        required
                    >
                        <option value="">Select a Resource...</option>
                        {resources.map(r => (
                            <option key={r.resource_id} value={r.resource_id}>{r.resource_name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="form-label text-muted small fw-bold text-uppercase">Your Message</label>
                    <textarea
                        className="form-control border-0 bg-light rounded-4 px-4 py-3"
                        rows={5}
                        placeholder="Describe your issue or suggestion..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill py-3 fw-bold"
                    disabled={loading || !message.trim()}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                        </>
                    ) : "Submit Feedback"}
                </button>
            </form>
        </div>
    );
}
