"use client";
import { AppMenuItem } from "@/components/app/app-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppMenus } from "./Menus";
import { SlideHeader } from "./SlideHeader";
import { UserProfile } from "./SlideUserProfile";

export function Slide() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      data-slide-state={isOpen ? "open" : "closed"}
      className={cn(
        "inset-y-0 group left-0 transition-all z-10 hidden w-16 flex-col border-r bg-background sm:flex",
        isOpen && "w-[260px]"
      )}
    >
      <nav>
        <SlideHeader />
        <div
          className="flex
          gap-2
        group-data-[slide-state=closed]:gap-4
        group-data-[slide-state=closed]:p-2
        flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8"
        >
          {AppMenus.map((menu, index) => (
            <AppMenuItem
              key={index}
              href={menu.href}
              icon={menu.icon}
              label={menu.title}
              isOpen={isOpen}
              className={
                menu.href === pathname ? "bg-accent text-accent-foreground" : ""
              }
            />
          ))}
        </div>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex  items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
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
        <UserProfile simple={!isOpen} />
      </nav>
    </aside>
  );
}
