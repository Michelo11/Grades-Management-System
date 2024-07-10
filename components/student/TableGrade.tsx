import { Grade, User } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function TableGrade({
  grades,
}: {
  grades: (Grade & {
    teacher: User;
  })[];
}) {
  return (
    <div className="flex flex-col gap-3 mt-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Value</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Teacher</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {grades.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No grades found
              </TableCell>
            </TableRow>
          )}

          {grades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell>{grade.value}</TableCell>
              <TableCell>{grade.subject}</TableCell>
              <TableCell>{grade.teacher.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
