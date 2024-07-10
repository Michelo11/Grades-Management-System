import TableGrade from "@/components/student/TableGrade";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getGrades(id: string) {
  try {
    const grades = await prisma.grade.findMany({
      where: {
        userId: id,
      },
      include: {
        teacher: true,
      },
    });

    return grades;
  } catch (error) {
    redirect(`?error=${error}`);
  }
}

export default async function Page() {
  const session = await auth();
  const grades = await getGrades(session!.user.id);
  const schoolYear = new Date().getFullYear();
  const filter = grades.filter(
    (grade) => schoolYear === grade.createdAt.getFullYear()
  );

  return (
    <main>
      <div className="flex-col md:flex">
        <div className="flex flex-col gap-3 p-3">
          <h1>Grades</h1>

          <TableGrade grades={filter} />
        </div>
      </div>
    </main>
  );
}
