import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  const existing = await prisma.users.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const user = await prisma.users.create({
    data: {
      name,
      email,
      role,
      password: await hashPassword(password),
    },
  });

  return NextResponse.json({ success: true, user });
}
