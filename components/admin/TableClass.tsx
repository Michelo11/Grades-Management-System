"use client";

import { Class, User } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import DialogClass from "../dialogs/DialogClass";
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

export default function TableClassComponent({
  classes,
  users,
}: {
  classes: Class[];
  users: User[];
}) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const deleteClass = useMutation({
    mutationFn: async (id: string) =>
      await axios.delete(`/api/class/${id}`).catch((error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["classes"] }),
  });

  return (
    <div className="flex flex-col gap-3 mt-3">
      <div className="flex justify-between items-center gap-3">
        <Input
          placeholder="Search classes"
          className="lg:w-1/3 w-full"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <DialogClass title="Add new" users={users} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {classes.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No classes found
              </TableCell>
            </TableRow>
          )}

          {classes
            .filter((classItem) =>
              classItem.name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.name}</TableCell>
                <TableCell>{classItem.teachers.length}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[160px]">
                      <DropdownMenuItem asChild>
                        <DialogClass
                          title="Edit"
                          classItem={classItem}
                          users={users}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          deleteClass.mutate(classItem.id);
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
