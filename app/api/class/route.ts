import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = auth(async (req: NextRequest) => {
  const classes = await prisma.class.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(classes);
});