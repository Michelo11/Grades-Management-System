import { User } from "@prisma/client";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

export default function SelectSubject({ user }: { user: User }) {
  const { toast } = useToast();
  const queryClient = new QueryClient();
  const changeSubject = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) =>
      await axios
        .patch(`/api/user/${id}/subject`, {
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
        if (value !== user.subject) {
          await changeSubject.mutateAsync({ id: user.id, value });
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={user.subject} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MATH">MATH</SelectItem>
        <SelectItem value="SCIENCE">SCIENCE</SelectItem>
        <SelectItem value="HISTORY">HISTORY</SelectItem>
        <SelectItem value="ENGLISH">ENGLISH</SelectItem>
        <SelectItem value="IT">IT</SelectItem>
      </SelectContent>
    </Select>
  );
}
