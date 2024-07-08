"use client";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
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
  id,
  nameValue,
}: {
  title: string;
  id?: string;
  nameValue?: string | null;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(nameValue || undefined);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const manageClass = useMutation({
    mutationFn: async (data: { id: string; name: string }) =>
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

  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Teacher</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                John Doe
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DialogFooter>
          <Button onClick={() => {}}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
