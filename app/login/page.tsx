import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
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
