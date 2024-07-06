"use client";

import { User } from "@prisma/client";
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

  return (
    <Select
      onValueChange={async (value) => {
        try {
          await axios.patch(`/api/user/${user.id}/role`, {
            role: value,
          });

          location.reload();

          return;
        } catch (_) {
          return toast({
            description: "Failed to update user role",
            variant: "destructive",
          });
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={user.role} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="STUDENT">Student</SelectItem>
        <SelectItem value="TEACHER">Teacher</SelectItem>
      </SelectContent>
    </Select>
  );
}
