import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const body = await req.json();

  await prisma.user.update({
    where: { id },
    data: { role: body.role },
  });

  return NextResponse.json({ message: "Role updated" });
}