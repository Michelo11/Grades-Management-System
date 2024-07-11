"use client";

import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

export default function DialogGrade({
  title,
  defaultValue,
  users,
  userValue,
}: {
  title: string;
  defaultValue?: number | null;
  userValue?: User;
  users: User[];
}) {
  const { toast } = useToast();
  const [value, setValue] = useState(defaultValue || undefined);
  const [user, setUser] = useState(userValue?.id);
  const [open, setOpen] = useState(false);
  const manageGrade = useMutation({
    mutationFn: async (data: { value: number; user: string }) =>
      await axios.post("/api/grade/manage", data).catch((error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      }),
    onSuccess: () => {
      location.reload();
      setValue(undefined);
      setOpen(false);
    },
  });

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
        <div className="grid gap-4 py-4">
          <Select value={user} onValueChange={(value) => setUser(value)}>
            <SelectTrigger>
              <SelectValue
                placeholder={userValue?.name?.toUpperCase() || "SELECT USER"}
              />
            </SelectTrigger>
            <SelectContent>
              {users.length === 0 && (
                <SelectItem disabled value="disabled" className="uppercase">
                  No users found
                </SelectItem>
              )}
              {users.map((user) => (
                <SelectItem
                  key={user.id}
                  value={user.id}
                >
                  {user.name?.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            id="value"
            value={value}
            onChange={(event) => setValue(parseInt(event.target.value))}
            placeholder="Value"
            type="number"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!user) return;
              manageGrade.mutate({ value: value!, user });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
