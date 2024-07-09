import { CalendarDateRangePicker } from "@/components/student/DateRangePicker";
import { Overview } from "@/components/student/Overview";
import { RecentGrades } from "@/components/student/RecentGrades";
import { Button } from "@/components/ui/button";
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

export default async function Home() {
  const session = await auth();
  const classItem = await getClass(session!.user.id);
  const grades = await getGrades(session!.user.id);
  const average =
    grades.reduce((acc, grade) => acc + grade.value, 0) / grades.length;

  return (
    <main>
      <div className="flex-col md:flex">
        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-center justify-between">
            <h1>Student dashboard</h1>
            <div className="flex items-center gap-3">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Card className="w-1/3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">
                  Current Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h2>{classItem?.name || "N/A"}</h2>
              </CardContent>
            </Card>
            <Card className="w-1/3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Grades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h2>{grades.length}</h2>
              </CardContent>
            </Card>
            <Card className="w-1/3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">
                  General Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h2>{average || 0}</h2>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-3">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Overview grades={grades} />
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentGrades grades={grades} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
