"use client";

import { Class, User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "../ui/button";
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
    <>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        {users.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          </TableBody>
        )}

        {users.map((user) => (
          <TableBody key={user.id}>
            <TableRow>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <SelectClass user={user} classes={classes} />
              </TableCell>
              <TableCell>
                <SelectRole user={user} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteUser.mutate(user.id);
                  }}
                >
                  {/* TODO: Menu */}
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        ))}
      </Table>

      {/* TODO */}
      <Button className="mt-4">Add new</Button>
    </>
  );
}
