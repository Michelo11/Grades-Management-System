import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = auth(async (req) => {
  const schema = z.object({
    id: z.string().optional(),
    name: z.string(),
    teachers: z.array(z.string()),
  });
  const body = await req.json();
  const data = schema.parse(body);

  const classItem = await prisma.class.upsert({
    where: { id: data.id },
    update: { name: data.name, teachers: { set: data.teachers } },
    create: { name: data.name, teachers: { set: data.teachers } },
  });

  return NextResponse.json(classItem);
});
