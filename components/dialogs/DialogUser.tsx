"use client";

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
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

export default function DialogUser({
  title,
  nameValue,
  emailValue,
}: {
  title: string;
  nameValue?: string | null;
  emailValue?: string | null;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(nameValue || undefined);
  const [email, setEmail] = useState(emailValue || undefined);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const manageUser = useMutation({
    mutationFn: async (data: { name: string; email: string }) =>
      await axios.post("/api/user/manage", data).catch((error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setName("");
      setEmail("");
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
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
          />
          <Input
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!name || !email) {
                toast({
                  description: "Name and email are required",
                  variant: "destructive",
                });
                return;
              }
              manageUser.mutate({ name, email });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
