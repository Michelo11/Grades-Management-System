import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user!.id },
  });

  if (!user || user.role !== "ADMIN") return redirect("/");

  return children;
}