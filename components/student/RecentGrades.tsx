import { Grade, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function RecentGrades({
  grades,
}: {
  grades: (Grade & {
    teacher: User;
  })[];
}) {
  const recentGrades = grades.slice(0, 7);

  return (
    <div className="space-y-3">
      {recentGrades.length === 0 && (
        <p className="text-sm text-muted-foreground">No grades yet</p>
      )}
      {recentGrades.map((grade) => (
        <div className="flex items-center gap-3" key={grade.id}>
          <Avatar className="h-8 w-8" draggable={false}>
            <AvatarImage
              src={grade.teacher.image || undefined}
              draggable={false}
            />
            <AvatarFallback>{grade.teacher.name}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {grade.teacher.name}
            </p>
            <p className="text-sm text-muted-foreground">{grade.subject}</p>
          </div>
          <div className="ml-auto font-medium">{grade.value}</div>
        </div>
      ))}
    </div>
  );
}
