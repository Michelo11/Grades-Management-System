import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = auth(async (req: NextRequest, { params }) => {
  const { id } = params as { id: string };
  const body = await req.json();

  await prisma.user.update({
    where: { id },
    data: { classId: body.value },
  });

  return NextResponse.json({ message: "Class updated" });
});
