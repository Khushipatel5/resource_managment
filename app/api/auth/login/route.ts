import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isValid = await comparePassword(
    password,
    user.password
  );

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({
    success: true,
    role: user.role,
  });

  res.cookies.set("userId", String(user.user_id), {
    httpOnly: true,
  });

  res.cookies.set("role", user.role, {
    httpOnly: true,
  });

  return res;
}
