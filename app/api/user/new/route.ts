import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = auth(async (req: NextRequest) => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string(),
  });
  const body = await req.json();
  const data = schema.parse(body);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    },
  });

  return NextResponse.json(user);
});
