import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const DELETE = auth(async (_, { params }) => {
  const { id } = params as { id: string };;

  await prisma.class.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Class deleted" });
});
