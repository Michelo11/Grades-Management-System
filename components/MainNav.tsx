import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
}

export default async function MainNav() {
  const session = await auth();
  const user = await getUser(session!.user.id);

  return (
    <div className="border-b">
      <div className="flex items-center justify-between p-3">
        <Link className="flex gap-3 items-center" href="/">
          <Avatar className="h-8 w-8" draggable={false}>
            <AvatarImage
              src="https://michelemanna.me/img/logo.png"
              draggable={false}
            />
            <AvatarFallback>{session?.user.name}</AvatarFallback>
          </Avatar>
          <h3>Grades Management System</h3>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8" draggable={false}>
                <AvatarImage
                  src={session?.user.image || undefined}
                  draggable={false}
                />
                <AvatarFallback>{session?.user.name}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {(user?.role === "STUDENT" && (
                <>
                  <DropdownMenuItem>
                    <Link href="/student">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/student/grades">Grades</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/student/archive">Archive</Link>
                  </DropdownMenuItem>
                </>
              )) ||
                (user?.role === "ADMIN" && (
                  <DropdownMenuItem>
                    <Link href="/admin">Dashboard</Link>
                  </DropdownMenuItem>
                )) || (
                  <DropdownMenuItem>
                    <Link href="/teacher">Dashboard</Link>
                  </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <form
              action={async () => {
                "use server";

                await signOut();
              }}
            >
              <button type="submit" className="w-full">
                <DropdownMenuItem>Log Out</DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
