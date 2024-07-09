import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user!.id },
  });

  if (!user || user.role !== "STUDENT") return redirect("/");

  return children;
}