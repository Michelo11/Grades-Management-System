import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Grade } from "@prisma/client";
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
            {grades.length === 0 && (
              <div className="text-sm text-muted-foreground">
                You don&apos;t have any grades yet.
              </div>
            )}
            {grades.map((grade) => cardComponent({ grade }))}
          </div>
        </div>
      </div>
    </main>
  );
}

const cardComponent = ({ grade }: { grade: Grade }) => {
  return (
    <Card key={grade.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">
          {grade.createdAt.getFullYear()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button>
          <Link
            href={`/api/grade/download?year=${grade.createdAt.getFullYear()}`}
          >
            Download
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
