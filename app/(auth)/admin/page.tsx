"use client";

import TableClass from "@/components/admin/TableClass";
import TableUser from "@/components/admin/TableUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Class, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Page() {
  const { toast } = useToast();
  const { data: users } = useQuery<(User & { class: Class })[]>({
    queryKey: ["users"],
    queryFn: () =>
      axios
        .get("/api/user")
        .then((res) => res.data)
        .catch((error) => {
          toast({
            description: error.message,
            variant: "destructive",
          });
        }),
  });
  const { data: classes } = useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: () =>
      axios
        .get("/api/class")
        .then((res) => res.data)
        .catch((error) => {
          toast({
            description: error.message,
            variant: "destructive",
          });
        }),
  });

  return (
    <main>
      <div className="p-3 flex flex-col gap-3">
        <h1>Admin dashboard</h1>

        <Tabs defaultValue="USERS">
          <TabsList>
            <TabsTrigger value="USERS">Users</TabsTrigger>
            <TabsTrigger value="CLASSES">Classes</TabsTrigger>
          </TabsList>
          <TabsContent value="USERS">
            {users && classes && <TableUser users={users} classes={classes} />}
          </TabsContent>
          <TabsContent value="CLASSES">
            {users && classes && <TableClass users={users} classes={classes} />}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
