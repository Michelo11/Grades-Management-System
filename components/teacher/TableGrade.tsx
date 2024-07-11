"use client";

import { Grade, User } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import DialogGrade from "../dialogs/DialogGrade";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "../ui/use-toast";

export default function TableGradeComponent({
  grades,
  users,
}: {
  grades: (Grade & { user: User })[];
  users: User[];
}) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const deleteGrade = useMutation({
    mutationFn: async (id: string) =>
      await axios.delete(`/api/grade/${id}`).catch((error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      }),
    onSuccess: () => location.reload(),
  });

  return (
    <div className="flex flex-col gap-3 mt-3">
      <div className="flex justify-between items-center gap-3">
        <Input
          placeholder="Search grades"
          className="lg:w-1/3 w-full"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <DialogGrade title="Add new" users={users} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {grades.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No grades found
              </TableCell>
            </TableRow>
          )}

          {grades
            .filter((grade) =>
              grade.user.name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((grade) => (
              <TableRow key={grade.id}>
                <TableCell>{grade.user.name}</TableCell>
                <TableCell>{grade.value}</TableCell>
                <TableCell>
                  <time suppressHydrationWarning>
                    {grade.createdAt.toLocaleString()}
                  </time>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[160px]">
                      <DropdownMenuItem asChild>
                        <DialogGrade
                          title="Edit"
                          userValue={grade.user}
                          users={users}
                          defaultValue={grade.value}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          deleteGrade.mutate(grade.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
