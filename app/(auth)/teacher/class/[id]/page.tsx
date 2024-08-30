import TableGrade from "@/components/teacher/TableGrade";
import TableReport from "@/components/teacher/TableReport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getGrades(id: string, teacherId: string) {
  const grades = await prisma.grade.findMany({
    where: {
      teacherId: teacherId,
      user: {
        classId: id,
      },
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

async function getReports(id: string) {
  const students = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      reports: true,
    },
    where: {
      classId: id,
    },
  });

  return students;
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
  const reports = await getReports(id);

  return (
    <main>
      <div className="flex-col md:flex">
        <div className="flex flex-col gap-3 p-3">
          <h1>{classItem?.name} dashboard</h1>

          <Tabs defaultValue="GRADES">
            <TabsList>
              <TabsTrigger value="GRADES">Grades</TabsTrigger>
              <TabsTrigger value="REPORTS">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="GRADES">
              <TableGrade grades={grades} users={users} />
            </TabsContent>
            <TabsContent value="REPORTS">
              <TableReport reports={reports} users={users} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
