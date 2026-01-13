"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createResource(formData: FormData) {
    const resourceName = formData.get("resourceName") as string;
    const description = formData.get("description") as string;
    const floorNumber = parseInt(formData.get("floorNumber") as string);
    const resourceTypeId = parseInt(formData.get("resourceTypeId") as string);
    const buildingId = parseInt(formData.get("buildingId") as string);

    if (!resourceName || isNaN(floorNumber) || isNaN(resourceTypeId) || isNaN(buildingId)) {
        return { error: "Missing required fields" };
    }

    try {
        await prisma.resources.create({
            data: {
                resource_name: resourceName,
                description: description,
                floor_number: floorNumber,
                resource_type_id: resourceTypeId,
                building_id: buildingId,
            },
        });

        revalidatePath("/admin/AddResources");
        revalidatePath("/student"); // Update student view as well
        return { success: "Resource created successfully" };
    } catch (error) {
        console.error("Failed to create resource:", error);
        return { error: "Failed to create resource" };
    }
}
