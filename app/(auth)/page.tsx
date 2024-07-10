import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
}

export default async function Page() {
  const session = await auth();
  const user = await getUser(session!.user.id);

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
