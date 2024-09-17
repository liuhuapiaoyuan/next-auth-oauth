import type { PropsWithChildren } from "react";
import { Header } from "./_components/Header";
import { Slide } from "./_components/Slide";
export const description = "SAAS工作台服务页面";

export default function AppLayout(props: PropsWithChildren) {
  const { children } = props;
  return (
    <div className="flex h-screen w-full bg-muted/40">
      <Slide />
      <div className="flex flex-1 w-1 relative  overflow-auto  flex-col ">
        <Header />
        <main className="grid  flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
