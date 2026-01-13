import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const userId = (await cookies()).get("userId")?.value;
  if (!userId) return null;

  return prisma.users.findUnique({
    where: { user_id: Number(userId) },
  });
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role) redirect("/dashboard");
  return user;
}
