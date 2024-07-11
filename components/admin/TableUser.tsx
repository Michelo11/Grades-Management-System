"use client";

import { Class, User } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import DialogUser from "../dialogs/DialogUser";
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
import SelectClass from "./SelectClass";
import SelectRole from "./SelectRole";
import SelectSubject from "./SelectSubject";

export default function TableUserComponent({
  users,
  classes,
}: {
  users: (User & {
    class: Class | null;
  })[];
  classes: Class[];
}) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const deleteUser = useMutation({
    mutationFn: async (id: string) =>
      await axios.delete(`/api/user/${id}`).catch((error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <div className="flex flex-col gap-3 mt-3">
      <div className="flex justify-between items-center gap-3">
        <Input
          placeholder="Search users"
          className="lg:w-1/3 w-full"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <DialogUser title="Add new" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          )}

          {users
            .filter((user) =>
              user.name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <SelectClass user={user} classes={classes} />
                </TableCell>
                <TableCell>
                  <SelectRole user={user} />
                </TableCell>
                {(user.role === "TEACHER" && (
                  <TableCell>
                    <SelectSubject user={user} />
                  </TableCell>
                )) || (
                  <TableCell className="uppercase">Not a teacher</TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[160px]">
                      <DropdownMenuItem asChild>
                        <DialogUser
                          title="Edit"
                          nameValue={user.name}
                          emailValue={user.email}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          deleteUser.mutate(user.id);
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
