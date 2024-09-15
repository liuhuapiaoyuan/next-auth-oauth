"use client";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export default function ProfileLayout(props: PropsWithChildren) {
  const pathname = usePathname();
  const menus = [
    { name: "基本", href: "/profile" },
    { name: "安全", href: "/profile/security" },
    { name: "集成", href: "/profile/integration" },
    { name: "组织", href: "/profile/organization" },
    { name: "高级", href: "/profile/advanced" },
  ];
  return (
    <AnimatePresence>
      <div className="w-full h-full flex flex-col gap-5">
        <div className="">
          <h1 className="text-3xl font-semibold">设置</h1>
        </div>

        <div className="flex">
          <nav className="flex  flex-col w-56 gap-4 text-sm text-muted-foreground">
            {/* <Link href="#" className="font-semibold text-primary">
            基本
          </Link>
          <Link href="#">密码</Link>
          <Link href="#">集成</Link>
          <Link href="#">组织</Link>
          <Link href="#">高级</Link> */}
            {menus.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className={`font-semibold ${
                  pathname === menu.href ? "text-primary" : ""
                }`}
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
