"use client";

import { deleteUser, updateUserRole } from "@/lib/actions/users";
import { useState } from "react";

type User = {
    user_id: number;
    name: string;
    email: string;
    role: string;
};

export default function UsersClient({ users }: { users: User[] }) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleRoleChange = async (userId: number, newRole: string) => {
        await updateUserRole(userId, newRole);
        setEditingId(null);
    };

    const handleDelete = async (userId: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
            await deleteUser(userId);
        }
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.user_id}>
                                    <td className="ps-4 fw-semibold">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {editingId === user.user_id ? (
                                            <select
                                                className="form-select form-select-sm"
                                                defaultValue={user.role}
                                                onChange={(e) =>
                                                    handleRoleChange(user.user_id, e.target.value)
                                                }
                                                autoFocus
                                                onBlur={() => setEditingId(null)}
                                            >
                                                <option value="STUDENT">STUDENT</option>
                                                <option value="STAFF">STAFF</option>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="APPROVER">APPROVER</option>
                                                <option value="MAINTENANCE">MAINTENANCE</option>
                                            </select>
                                        ) : (
                                            <span
                                                className="badge bg-light text-dark border cursor-pointer"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => setEditingId(user.user_id)}
                                                title="Click to edit"
                                            >
                                                {user.role} <i className="bi bi-pencil-fill ms-1 opacity-50" style={{ fontSize: '0.6rem' }}></i>
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(user.user_id)}
                                            className="btn btn-sm btn-outline-danger"
                                            disabled={user.role === 'ADMIN'}
                                        >
                                            Delete
                                        </button>
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
