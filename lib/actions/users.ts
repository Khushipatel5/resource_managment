'use server'

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth"; // Assuming requireRole can be used or we use getCurrentUser
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: number) {
    // Check if admin
    await requireRole("ADMIN");

    try {
        await prisma.users.delete({
            where: { user_id: userId },
        });

        revalidatePath("/admin/users");
        return { success: "User deleted successfully" };
    } catch (e) {
        console.error(e);
        return { error: "Failed to delete user" };
    }
}

export async function updateUserRole(userId: number, newRole: string) {
    await requireRole("ADMIN");

    try {
        await prisma.users.update({
            where: { user_id: userId },
            data: { role: newRole },
        });

        revalidatePath("/admin/users");
        return { success: "User role updated successfully" };
    } catch (e) {
        console.error(e);
        return { error: "Failed to update user role" };
    }
}
