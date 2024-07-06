import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import SelectRole from "./SelectRole";

export default async function TableComponent({ users }: { users: User[] }) {
  const session = await auth();

  return (
    <Table>
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
            <TableCell>{user.classId || "N/A"}</TableCell>
            <TableCell>
              <SelectRole user={user} />
            </TableCell>
            <TableCell className="text-right">
              <form
                action={async () => {
                  "use server";

                  if (user.id === session?.user.id) {
                    return redirect("?error=You can't delete yourself");
                  }

                  try {
                    await prisma.user.delete({ where: { id: user.id } });

                    revalidatePath("/admin", "page");

                    return;
                  } catch (error) {
                    return redirect(`?error=${error}`);
                  }
                }}
              >
                <Button variant="destructive" type="submit">
                  Delete
                </Button>
              </form>
            </TableCell>
          </TableRow>
        </TableBody>
      ))}
    </Table>
  );
}
