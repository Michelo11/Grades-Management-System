"use client";

import { Class, User } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

export default function SelectClass({
  user,
  classes,
}: {
  user: User & {
    class: Class | null;
  };
  classes: Class[];
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const changeClass = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) =>
      await axios
        .patch(`/api/user/${id}/class`, {
          value,
        })
        .catch((error) => {
          toast({
            description: error.message,
            variant: "destructive",
          });
        }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <Select
      onValueChange={async (value) => {
        if (value !== user.class?.id) {
          await changeClass.mutateAsync({ id: user.id, value });
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={user.class?.name.toUpperCase() || "N/A"} />
      </SelectTrigger>
      <SelectContent>
        {classes.length === 0 && (
          <SelectItem disabled value="disabled" className="uppercase">
            No classes found
          </SelectItem>
        )}
        {classes.map((classItem) => (
          <SelectItem
            key={classItem.id.toUpperCase()}
            value={classItem.id.toUpperCase()}
          >
            {classItem.name.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
