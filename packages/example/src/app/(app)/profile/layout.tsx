"use client";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { UserCard } from "./_components/UserCard";
import { cn } from "@/lib/utils";

export default function ProfileLayout(props: PropsWithChildren) {
  const pathname = usePathname();
  const menus = [
    { name: "基本", href: "/profile" },
    { name: "活动", href: "/profile/activity" },
    { name: "订阅", href: "/profile/subscript" },
    { name: "安全", href: "/profile/security" },
  ];
  const currentMenu = menus.find((menu) => menu.href === pathname);
  return (
    <AnimatePresence>
      <div className="w-full h-full flex flex-col gap-5">
        <div className="">
          <h1 className="text-3xl font-semibold">{currentMenu?.name}</h1>
        </div>

        <div className="flex gap-5">
          <nav className="flex  flex-col w-56 gap-4 text-sm text-muted-foreground">
            <UserCard />
            {menus.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className={cn(`font-semibold ${pathname === menu.href ? "text-primary" : ""
                  }`,
                  "hover:translate-x-4 transition-transform"
                )}
              >
                {menu.name}
              </Link>
            ))}
          </nav>
          <div className="flex-1 w-1">{props.children}</div>
        </div>
      </div>
    </AnimatePresence>
  );
}
