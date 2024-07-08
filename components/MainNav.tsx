import { auth, signOut } from "@/lib/auth";
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

export default async function MainNav() {
  const session = await auth();

  return (
    <div className="border-b">
      <div className="flex items-center justify-between p-3">
        <Link className="flex gap-3 items-center" href="/">
          <img
            src="https://michelemanna.me/img/logo.png"
            alt="Logo"
            className="rounded-full"
            width="32"
            height="32"
            draggable={false}
          />
          <h3>Grades Management System</h3>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user.image || undefined} />
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
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit" className="w-full">
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
