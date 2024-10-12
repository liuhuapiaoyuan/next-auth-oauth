import { signOut } from "@/lib/auth/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#cf3434] text-background gap-2 hover:bg-[#680505] dark:hover:bg-[#b93636] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        type="submit"
      >
        退出系统
      </button>
    </form>
  );
}
