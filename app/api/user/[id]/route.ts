import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = auth(async (req, { params }) => {
  const { id } = params as { id: string };

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
