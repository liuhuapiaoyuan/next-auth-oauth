import { Package2, PanelLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { QuickMenuButton } from "./QuickMenuButton";
import { MobileMenus } from "./MobileMenus";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Header() {
  return (
    <header className="sticky bg-white shadow top-0 z-30 flex py-2 items-center gap-4 border-b  px-4  sm:h-auto sm:border-0 sm:px-6 sm:shadow-none border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden ">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">切换菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs  bg-white">
          <MobileMenus/>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">仪表盘</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">产品</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>编辑产品</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <QuickMenuButton />
      </div>
      <div>
        <ThemeSwitcher/>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="/logo.png"
              width={36}
              height={36}
              alt="头像"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href="/profile">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
          </Link>
          <DropdownMenuSeparator />
          <Link href="/profile">
            <DropdownMenuLabel>设置</DropdownMenuLabel>
          </Link>
          <Link href="/profile/security">
            <DropdownMenuItem>安全</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>支持</DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href="/">
            <DropdownMenuItem>登出</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}