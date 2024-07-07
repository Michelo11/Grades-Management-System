import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = auth(async (req: NextRequest) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { class: true },
  });

  return NextResponse.json(users);
});