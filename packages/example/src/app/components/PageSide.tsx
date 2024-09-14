"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MenuItem } from "./MenuItem";

export function PageSide() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={cn(
        "inset-y-0 left-0 transition-all z-10 hidden w-16 flex-col border-r bg-background sm:flex",
        isOpen && "w-[260px]"
      )}
    >
      <nav
        className={cn(
          "flex flex-col w-full px-2 gap-5 sm:py-5",
          isOpen && "gap-2"
        )}
      >
        <Link
          href="/auth/signin"
          className="hover:bg-opacity-75 mb-4 group flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className={isOpen ? "" : "sr-only"}>Acme Inc</span>
        </Link>
        <MenuItem
          href="#"
          icon={<ShoppingCart className="h-5 w-5" />}
          label="订单"
          isOpen={isOpen}
          className="bg-accent text-accent-foreground"
        />
        <MenuItem
          href="#"
          icon={<Package className="h-5 w-5" />}
          label="产品"
          isOpen={isOpen}
        />
        <MenuItem
          href="#"
          icon={<Users2 className="h-5 w-5" />}
          label="客户"
          isOpen={isOpen}
        />
        <MenuItem
          href="#"
          icon={<LineChart className="h-5 w-5" />}
          label="分析"
          isOpen={isOpen}
        />
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            >
              {isOpen ? (
                <ArrowLeftIcon className="h-5 w-5" />
              ) : (
                <ArrowRightIcon className="h-5 w-5" />
              )}
              <span className="sr-only">设置</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">切换菜单</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
