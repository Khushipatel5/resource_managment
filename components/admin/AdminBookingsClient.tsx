"use client";

import { updateBookingStatus } from "@/lib/actions/bookings";
import { useState } from "react";

type Booking = {
    booking_id: number;
    start_datetime: Date;
    end_datetime: Date;
    status: string;
    user: { name: string | null; email: string };
    resource: { resource_name: string };
};

export default function AdminBookingsClient({ bookings }: { bookings: Booking[] }) {
    const [isUpdating, setIsUpdating] = useState<number | null>(null);

    const handleUpdate = async (id: number, status: "APPROVED" | "REJECTED") => {
        if (!confirm(`Are you sure you want to force ${status} this booking?`)) return;
        setIsUpdating(id);
        await updateBookingStatus(id, status);
        setIsUpdating(null);
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Resource</th>
                                <th>User</th>
                                <th>Dates</th>
                                <th>Status</th>
                                <th>Admin Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.booking_id}>
                                    <td className="ps-4 fw-semibold">{booking.resource.resource_name}</td>
                                    <td>
                                        <div>{booking.user.name}</div>
                                        <small className="text-muted">{booking.user.email}</small>
                                    </td>
                                    <td className="small">
                                        <div>{new Date(booking.start_datetime).toLocaleDateString()}</div>
                                        <div className="text-muted">
                                            {new Date(booking.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(booking.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${booking.status === 'APPROVED' ? 'bg-success' :
                                                booking.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                onClick={() => handleUpdate(booking.booking_id, "APPROVED")}
                                                disabled={isUpdating === booking.booking_id || booking.status === 'APPROVED'}
                                                className="btn btn-outline-success"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(booking.booking_id, "REJECTED")}
                                                disabled={isUpdating === booking.booking_id || booking.status === 'REJECTED'}
                                                className="btn btn-outline-danger"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
