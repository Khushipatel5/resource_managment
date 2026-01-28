import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InventoryClient from "@/components/admin/InventoryClient";

export default async function AdminInventoryPage() {
    await requireRole("ADMIN");

    const [types, buildings] = await Promise.all([
        prisma.resource_types.findMany(),
        prisma.buildings.findMany(),
    ]);

    return (
        <div className="container-fluid p-4">
            <h1 className="h2 fw-bold text-dark mb-4">Inventory Configuration</h1>
            <p className="text-secondary mb-4">Manage the foundational data for your resources.</p>
            <InventoryClient types={types} buildings={buildings} />
        </div>
    );
}
