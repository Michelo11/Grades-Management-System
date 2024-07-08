import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async (_) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { class: true },
  });

  return NextResponse.json(users);
});