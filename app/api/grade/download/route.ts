import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  const year = req.nextUrl.searchParams.get("year");

  if (!req.auth?.user)
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  const grades = await prisma.grade.findMany({
    where: {
      userId: req.auth.user.id,
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year}-12-31`),
      },
    },
    select: {
      value: true,
      subject: true,
      createdAt: true,
    },
  });

  return NextResponse.json(grades, {
    headers: {
      "Content-Disposition": "attachment; filename=grades.json",
    },
  });
});
