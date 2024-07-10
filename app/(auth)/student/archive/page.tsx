import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getGrades(id: string) {
  try {
    const grades = await prisma.grade.findMany({
      where: {
        userId: id,
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

  return (
    <main>
      <div className="flex-col md:flex">
        <div className="flex flex-col gap-3 p-3">
          <h1>Archive</h1>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 w-full">
            {grades.map((grade) => (
              <Card key={grade.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {grade.createdAt.getFullYear()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button>
                    <Link
                      href={`/api/grades/download?year=${grade.createdAt.getFullYear()}`}
                    >
                      Download
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
