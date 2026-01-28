import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UsersClient from "@/components/admin/UsersClient";

export default async function AdminUsersPage() {
    await requireRole("ADMIN");

    const users = await prisma.users.findMany({
        orderBy: { created_at: "desc" },
    });

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="h2 fw-bold text-dark mb-1">Manage Users</h1>
                    <p className="text-secondary mb-0">Total Users: {users.length}</p>
                </div>
            </div>

            <UsersClient users={users} />
        </div>
    );
}
