import { Overview } from "@/components/student/Overview";
import { RecentGrades } from "@/components/student/RecentGrades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getClass(id: string) {
  try {
    const classItem = await prisma.class.findFirst({
      where: {
        students: {
          some: {
            id,
          },
        },
      },
    });

    return classItem;
  } catch (error) {
    redirect(`?error=${error}`);
  }
}

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

  if (!session?.user) return redirect("/");

  const classItem = await getClass(session!.user.id);
  const grades = await getGrades(session!.user.id);
  const schoolYear = new Date().getFullYear();
  const filter = grades.filter(
    (grade) => schoolYear === grade.createdAt.getFullYear()
  );
  const average =
    filter.reduce((acc, grade) => acc + grade.value, 0) / filter.length;

  return (
    <main>
      <div className="flex-col md:flex">
        <div className="flex flex-col gap-3 p-3">
          <h1>Student dashboard</h1>

          <div className="flex flex-col md:flex-row gap-3">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                  Current Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="uppercase">{classItem?.name || "n/a"}</h2>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h2>{filter.length}</h2>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                  General Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h2>{average || 0}</h2>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">
                  School Year
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h2>{schoolYear}</h2>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Overview grades={filter} />
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentGrades grades={filter} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
