import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = auth(async (req) => {
  const schema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name is too short").max(20, "Name is too long"),
    teachers: z.array(z.string()),
  });
  const body = await req.json();
  const data = schema.parse(body);

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

  if (data.id) {
    const classItem = await prisma.class.update({
      where: { id: data.id },
      data: { name: data.name, teachers: { set: data.teachers } },
    });

    return NextResponse.json(classItem);
  }

  const classItem = await prisma.class.create({
    data: { name: data.name, teachers: { set: data.teachers } },
  });

  return NextResponse.json(classItem);
});
