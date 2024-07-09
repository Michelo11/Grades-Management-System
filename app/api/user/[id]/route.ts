import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async (req, { params }) => {
  const { id } = params as { id: string };

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
    where: { id },
  });

  if (!user)
    return NextResponse.json(
      {
        message: "User not found",
      },
      {
        status: 404,
      }
    );

  return NextResponse.json(user);
});

export const DELETE = auth(async (req, { params }) => {
  const { id } = params as { id: string };

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

  if (req.auth?.user?.id === id)
    return NextResponse.json(
      { message: "You can't delete yourself" },
      { status: 400 }
    );

  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ message: "User deleted" });
});
