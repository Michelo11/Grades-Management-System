import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = auth(async (req, { params }) => {
  const { id } = params as { id: string };
  const body = await req.json();

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

  await prisma.user.update({
    where: { id },
    data: { subject: body.value },
  });

  return NextResponse.json({ message: "Subject updated" });
});