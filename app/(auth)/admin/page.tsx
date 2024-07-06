import Table from "@/components/admin/Table";
import { prisma } from "@/lib/prisma";

async function getUsers() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return users;
}

export default async function Page() {
  const users = await getUsers();

  return (
    <main>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>

        <Table users={users} />
      </div>
    </main>
  );
}