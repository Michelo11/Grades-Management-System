import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  if (!req.auth?.user)
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  const user = await prisma.user.findUnique({
    where: { id: req.auth.user.id },
  });

  if (user?.role !== "ADMIN")
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  const classes = await prisma.class.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(classes);
});
