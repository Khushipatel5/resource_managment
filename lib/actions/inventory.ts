'use server'

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- Resource Types ---
export async function createResourceType(formData: FormData) {
    await requireRole("ADMIN");
    const name = formData.get("typeName") as string;
    try {
        await prisma.resource_types.create({ data: { type_name: name } });
        revalidatePath("/admin/inventory");
        return { success: "Resource Type created" };
    } catch (e) { return { error: "Failed to create type" }; }
}

export async function deleteResourceType(id: number) {
    await requireRole("ADMIN");
    try {
        await prisma.resource_types.delete({ where: { resource_type_id: id } });
        revalidatePath("/admin/inventory");
        return { success: "Deleted" };
    } catch { return { error: "Failed (likely in use)" }; }
}

// --- Buildings ---
export async function createBuilding(formData: FormData) {
    await requireRole("ADMIN");
    const name = formData.get("buildingName") as string;
    const number = formData.get("buildingNumber") as string;
    const floors = parseInt(formData.get("totalFloors") as string);

    try {
        await prisma.buildings.create({
            data: { building_name: name, building_number: number, total_floors: floors }
        });
        revalidatePath("/admin/inventory");
        return { success: "Building created" };
    } catch (e) { return { error: "Failed to create building" }; }
}

export async function deleteBuilding(id: number) {
    await requireRole("ADMIN");
    try {
        await prisma.buildings.delete({ where: { building_id: id } });
        revalidatePath("/admin/inventory");
        return { success: "Deleted" };
    } catch { return { error: "Failed (likely in use)" }; }
}

// --- Facilities (Simple add to resource) ---
// Note: Facilities are linked to a resource. This might be better handled in resource edit.
// keeping it simple for now.

// --- Cupboards ---
export async function createCupboard(formData: FormData) {
    await requireRole("ADMIN");
    const name = formData.get("cupboardName") as string;
    const shelves = parseInt(formData.get("totalShelves") as string);
    const resourceId = parseInt(formData.get("resourceId") as string);

    try {
        await prisma.cupboards.create({
            data: { cupboard_name: name, total_shelves: shelves, resource_id: resourceId }
        });
        revalidatePath("/admin/inventory");
        return { success: "Cupboard created" };
    } catch (e) { return { error: "Failed to create cupboard" }; }
}
