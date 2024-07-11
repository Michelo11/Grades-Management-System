import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = auth(async (req) => {
  const schema = z.object({
    id: z.string().optional(),
    value: z.number().max(10).min(1),
    user: z.string(),
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

  if (user?.role !== "TEACHER")
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );

  if (data.id) {
    const grade = await prisma.grade.update({
      where: { id: data.id },
      data: { value: data.value, user: { connect: { id: data.user } } },
    });

    return NextResponse.json(grade);
  }

  const grade = await prisma.grade.create({
    data: {
      value: data.value,
      user: { connect: { id: data.user } },
      subject: user.subject as any,
      teacher: { connect: { id: user.id } },
    },
  });

  return NextResponse.json(grade);
});
