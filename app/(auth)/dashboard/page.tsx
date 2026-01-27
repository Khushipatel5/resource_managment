import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  switch (user.role) {
    case "ADMIN":
      redirect("/admin");
    case "STAFF":
    case "MAINTENANCE":
      redirect("/staff");
    case "STUDENT":
      redirect("/student");
    case "APPROVER":
      redirect("/approver");
    default:
      return null;
  }
}
