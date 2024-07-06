import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user!.id },
  });

  if (!user) return redirect("/login");

  switch (user.role) {
    case "STUDENT":
      return redirect("/student");
    case "ADMIN":
      return redirect("/admin");
    case "TEACHER":
      return redirect("/teacher");
  }
}