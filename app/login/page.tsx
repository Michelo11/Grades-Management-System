import { Button } from "@/components/ui/button";
import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (session?.user) return redirect("/");

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Login</h2>
          <p className="text-sm text-muted-foreground">
            Get started with our platform
          </p>

          <form
            action={async () => {
              "use server";
              try {
                await signIn("github");

                return redirect("/");
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`?error=${error.type}`);
                }

                throw error;
              }
            }}
          >
            <Button type="submit" className="w-1/2">
              GitHub
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
