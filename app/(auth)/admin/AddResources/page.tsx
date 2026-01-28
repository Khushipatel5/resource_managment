import { prisma } from "@/lib/prisma";
import AddResourceForm from "@/components/admin/AddResourceForm";
import Link from "next/link";

export default async function AddResourcesPage() {
    const resourceTypes = await prisma.resource_types.findMany();
    const buildings = await prisma.buildings.findMany();

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-5 animate-fade-in">
                <Link href="/admin/" className="btn btn-modern">
                    <i className="bi bi-arrow-left me-2"></i>Dashboard
                </Link>
            </div>

            <AddResourceForm resourceTypes={resourceTypes} buildings={buildings} />
        </div>
    );
}
