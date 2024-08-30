import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const DELETE = auth(async (req, { params }) => {
  const { id } = params as { id: string };
  const report = req.nextUrl.searchParams.get("report");

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

  if (user?.role !== "TEACHER")
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  if (!report) {
    return NextResponse.json(
      {
        message: "Report not found",
      },
      {
        status: 404,
      }
    );
  }

  const target = await prisma.user.findUnique({
    where: { id },
  });

  if (!target) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  await prisma.user.update({
    where: { id },
    data: {
      reports: {
        set: target.reports.filter((r) => r !== report),
      },
    },
  });

  return NextResponse.json({ message: "Report deleted" });
});