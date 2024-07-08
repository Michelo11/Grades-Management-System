import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = auth(async (req, { params }) => {
  const { id } = params as { id: string };
  const body = await req.json();

  await prisma.user.update({
    where: { id },
    data: { role: body.value },
  });

  return NextResponse.json({ message: "Role updated" });
});