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
            {(classItem &&
              cardComponent({
                title: "Current Class",
                content: classItem.name,
              })) ||
              cardComponent({ title: "Current Class", content: "None" })}
            {filter &&
              cardComponent({ title: "Total Grades", content: filter.length })}
            {(average &&
              cardComponent({ title: "General Average", content: average })) ||
              cardComponent({ title: "General Average", content: "0" })}
            {schoolYear &&
              cardComponent({ title: "School Year", content: schoolYear })}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            {filter &&
              cardComponent({
                title: "Overview",
                content: <Overview grades={filter} />,
              })}
            {filter &&
              cardComponent({
                title: "Recent Grades",
                content: <RecentGrades grades={filter} />,
              })}
          </div>
        </div>
      </div>
    </main>
  );
}

const cardComponent = ({ title, content }: { title: string; content: any }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="uppercase">{content}</h2>
      </CardContent>
    </Card>
  );
};