import TableGrade from "@/components/teacher/TableGrade";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getGrades(id: string, teacherId: string) {
  const grades = await prisma.grade.findMany({
    where: {
      classId: id,
      teacherId: teacherId,
    },
    include: {
      user: true,
    },
  });

  return grades;
}

async function getClass(id: string) {
  const classItem = await prisma.class.findUnique({
    where: {
      id,
    },
  });

  return classItem;
}

async function getUsers(id: string) {
  const users = await prisma.user.findMany({
    where: {
      classId: id,
    },
  });

  return users;
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await auth();
  const grades = await getGrades(id, session!.user.id);
  const classItem = await getClass(id);
  const users = await getUsers(id);

  return (
    <main>
      <div className="flex-col md:flex">
        <div className="flex flex-col gap-3 p-3">
          <h1>{classItem?.name} dashboard</h1>

          <TableGrade grades={grades} users={users} />
        </div>
      </div>
    </main>
  );
}
