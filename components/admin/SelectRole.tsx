"use client";

import { User } from "@prisma/client";
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

export default function SelectRole({ user }: { user: User }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const changeRole = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) =>
      await axios
        .patch(`/api/user/${id}/role`, {
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
        if (value !== user.role) {
          await changeRole.mutateAsync({ id: user.id, value });
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={user.role} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">ADMIN</SelectItem>
        <SelectItem value="STUDENT">STUDENT</SelectItem>
        <SelectItem value="TEACHER">TEACHER</SelectItem>
      </SelectContent>
    </Select>
  );
}
