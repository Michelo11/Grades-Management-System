"use client";

import { Class, User } from "@prisma/client";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export default function DialogClass({
  title,
  users,
  classItem,
}: {
  title: string;
  users: User[];
  classItem?: Class;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(classItem?.name);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const manageClass = useMutation({
    mutationFn: async (data: {
      id?: string;
      name?: string;
      teachers: string[];
    }) =>
      await axios.post("/api/class/manage", data).catch((error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setName("");
      setOpen(false);
    },
  });

  const [teachers, setTeachers] = useState<string[]>(classItem?.teachers || []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {title === "Add new" ? (
        <Button onClick={() => setOpen((o) => !o)}>{title}</Button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-sm px-2 py-1.5 text-sm cursor-default hover:bg-accent w-full text-left"
        >
          {title}
        </button>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                Teacher
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="DropdownMenuContent">
              {users.filter((user) => user.role === "TEACHER").length === 0 && (
                <DropdownMenuCheckboxItem disabled className="uppercase">
                  No teachers found
                </DropdownMenuCheckboxItem>
              )}

              {users
                .filter((user) => user.role === "TEACHER")
                .map((user) => (
                  <DropdownMenuCheckboxItem
                    key={user.id}
                    checked={teachers.includes(user.id) as Checked}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTeachers((teachers) => [...teachers, user.id]);
                      } else {
                        setTeachers((teachers) =>
                          teachers.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  >
                    {user.name}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              manageClass.mutate({ id: classItem?.id, name, teachers });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
