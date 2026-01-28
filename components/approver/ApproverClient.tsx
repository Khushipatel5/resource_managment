"use client";

import { updateBookingStatus, checkAvailability, updateBookingDetails } from "@/lib/actions/bookings";
import { useState } from "react";

type Booking = {
    booking_id: number;
    start_datetime: Date;
    end_datetime: Date;
    status: string;
    user: {
        name: string | null;
        email: string;
    };
    resource: {
        resource_name: string;
        resource_type: {
            type_name: string;
        };
    };
};

export default function ApproverClient({
    pendingBookings,
    historyBookings
}: {
    pendingBookings: Booking[],
    historyBookings: Booking[]
}) {
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [availabilityStatus, setAvailabilityStatus] = useState<{ [key: number]: { checked: boolean; available: boolean; conflicts?: number } }>({});
    const [editingId, setEditingId] = useState<number | null>(null);

    // Edit Form State
    const [editStart, setEditStart] = useState("");
    const [editEnd, setEditEnd] = useState("");

    const handleAction = async (bookingId: number, status: "APPROVED" | "REJECTED") => {
        setProcessingId(bookingId);
        await updateBookingStatus(bookingId, status);
        setProcessingId(null);
    };

    const handleCheckAvailability = async (bookingId: number) => {
        const result = await checkAvailability(bookingId);
        setAvailabilityStatus(prev => ({
            ...prev,
            [bookingId]: { checked: true, available: result.available, conflicts: result.conflicts }
        }));
    };

    const startEditing = (booking: Booking) => {
        setEditingId(booking.booking_id);
        // Format for input datetime-local: YYYY-MM-DDTHH:mm
        setEditStart(new Date(booking.start_datetime).toISOString().slice(0, 16));
        setEditEnd(new Date(booking.end_datetime).toISOString().slice(0, 16));
    };

    const saveEditing = async (bookingId: number) => {
        setProcessingId(bookingId);
        await updateBookingDetails(bookingId, new Date(editStart), new Date(editEnd));
        setEditingId(null);
        setProcessingId(null);
        // Reset availability check since times changed
        setAvailabilityStatus(prev => {
            const newState = { ...prev };
            delete newState[bookingId];
            return newState;
        });
    };

    return (
        <div>
            {/* Tabs */}
            <ul className="nav nav-tabs mb-4 border-bottom-0">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'pending' ? 'active fw-bold text-primary border-bottom-primary' : 'text-secondary'}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Requests <span className="badge bg-warning text-dark ms-2 rounded-pill">{pendingBookings.length}</span>
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'history' ? 'active fw-bold text-primary' : 'text-secondary'}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Approval History
                    </button>
                </li>
            </ul>

            {activeTab === 'pending' && (
                <div className="row g-4 animate-fade-in">
                    {pendingBookings.length === 0 ? (
                        <div className="col-12 text-center py-5 glass-card">
                            <div className="mb-4"><i className="bi bi-clipboard-check fs-1 text-muted opacity-50"></i></div>
                            <h4 className="fw-bold text-dark">All Caught Up!</h4>
                            <p className="text-muted">No pending requests.</p>
                        </div>
                    ) : (
                        pendingBookings.map((booking) => (
                            <div key={booking.booking_id} className="col-12 col-lg-6">
                                <div className="glass-card h-100 p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                                <i className="bi bi-person text-primary fs-5"></i>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-0 text-dark">{booking.user.name || booking.user.email}</h6>
                                                <span className="badge bg-light text-secondary border mt-1">Student</span>
                                            </div>
                                        </div>
                                        <span className="badge bg-warning bg-opacity-10 text-warning text-dark">Pending</span>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="fw-bold text-dark mb-2">{booking.resource.resource_name}</h5>
                                        <p className="text-muted small mb-3">{booking.resource.resource_type.type_name}</p>

                                        {editingId === booking.booking_id ? (
                                            <div className="bg-light p-3 rounded mb-3 border border-primary">
                                                <label className="small fw-bold mb-1">Start</label>
                                                <input type="datetime-local" className="form-control form-control-sm mb-2" value={editStart} onChange={e => setEditStart(e.target.value)} />
                                                <label className="small fw-bold mb-1">End</label>
                                                <input type="datetime-local" className="form-control form-control-sm mb-3" value={editEnd} onChange={e => setEditEnd(e.target.value)} />
                                                <div className="d-flex gap-2">
                                                    <button onClick={() => saveEditing(booking.booking_id)} className="btn btn-sm btn-primary w-100" disabled={!!processingId}>Save</button>
                                                    <button onClick={() => setEditingId(null)} className="btn btn-sm btn-outline-secondary w-100">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-light rounded p-3 border-start border-4 border-primary position-relative display-hover-trigger">
                                                <button
                                                    onClick={() => startEditing(booking)}
                                                    className="btn btn-sm btn-light border position-absolute top-0 end-0 m-2 shadow-sm"
                                                    title="Edit Booking Time"
                                                >
                                                    <i className="bi bi-pencil-fill small text-muted"></i>
                                                </button>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="bi bi-calendar-event me-2 text-primary"></i>
                                                    <span className="small fw-semibold">{new Date(booking.start_datetime).toLocaleDateString()}</span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center small text-secondary">
                                                    <span>Start: {new Date(booking.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <i className="bi bi-arrow-right mx-2 text-muted"></i>
                                                    <span>End: {new Date(booking.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Availability Check Result */}
                                        {availabilityStatus[booking.booking_id]?.checked && (
                                            <div className={`mt-3 alert ${availabilityStatus[booking.booking_id].available ? 'alert-success' : 'alert-danger'} py-2 small fw-bold mb-0`}>
                                                {availabilityStatus[booking.booking_id].available
                                                    ? <><i className="bi bi-check-circle me-1"></i> No conflicts found.</>
                                                    : <><i className="bi bi-exclamation-triangle me-1"></i> Conflict! {availabilityStatus[booking.booking_id].conflicts} overlapping booking(s).</>
                                                }
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex flex-column gap-2 pt-3 border-top">
                                        {!availabilityStatus[booking.booking_id]?.checked && (
                                            <button onClick={() => handleCheckAvailability(booking.booking_id)} className="btn btn-sm btn-light text-primary fw-semibold w-100 mb-2">
                                                <i className="bi bi-search me-1"></i> Check Availability
                                            </button>
                                        )}

                                        <div className="d-flex gap-2">
                                            <button
                                                onClick={() => handleAction(booking.booking_id, "APPROVED")}
                                                disabled={processingId === booking.booking_id || (availabilityStatus[booking.booking_id]?.checked && !availabilityStatus[booking.booking_id].available)}
                                                className="btn btn-success flex-grow-1 shadow-sm rounded-pill fw-semibold"
                                            >
                                                {processingId === booking.booking_id ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-check-lg me-2"></i> Approve</>}
                                            </button>
                                            <button
                                                onClick={() => handleAction(booking.booking_id, "REJECTED")}
                                                disabled={processingId === booking.booking_id}
                                                className="btn btn-outline-danger flex-grow-1 rounded-pill fw-semibold"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="glass-card animate-fade-in">
                    <div className="card-header bg-white border-bottom py-3">
                        <h5 className="mb-0 fw-bold">Recent Activity</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Resource</th>
                                    <th>User</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyBookings.map(b => (
                                    <tr key={b.booking_id}>
                                        <td className="ps-4 fw-semibold">{b.resource.resource_name}</td>
                                        <td>{b.user.name}</td>
                                        <td>{new Date(b.start_datetime).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${b.status === 'APPROVED' ? 'bg-success' : 'bg-danger'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {historyBookings.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-4 text-muted">No history found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
