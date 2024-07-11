import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Class } from "@prisma/client";
import Link from "next/link";

async function getClasses(id: string) {
  const classes = await prisma.class.findMany({
    where: {
      teachers: {
        has: id,
      },
    },
  });

  return classes;
}

export default async function Page() {
  const session = await auth();
  const classes = await getClasses(session!.user.id);

  return (
    <main>
      <div className="flex-col md:flex">
        <div className="flex flex-col gap-3 p-3">
          <h1>Teacher dashboard</h1>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 w-full">
            {classes.length === 0 && (
              <div className="text-sm text-muted-foreground">
                You don&apos;t have any classes yet.
              </div>
            )}
            {classes.map((classItem) => cardComponent({ classItem }))}
          </div>
        </div>
      </div>
    </main>
  );
}

const cardComponent = ({ classItem }: { classItem: Class }) => {
  return (
    <Card key={classItem.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{classItem.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>
          <Link href={`teacher/class/${classItem.id}`}>View class</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
