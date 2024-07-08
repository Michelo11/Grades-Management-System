import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = auth(async (req) => {
  const schema = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name is too short"),
  });
  const body = await req.json();
  const data = schema.parse(body);

  const user = await prisma.user.upsert({
    where: { email: data.email },
    update: { name: data.name, email: data.email },
    create: { name: data.name, email: data.email },
  });

  return NextResponse.json(user);
});
