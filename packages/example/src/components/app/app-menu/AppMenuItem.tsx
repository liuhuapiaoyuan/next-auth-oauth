import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

interface AppMenuItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  className?: string;
}

export function AppMenuItem({
  href,
  icon,
  label,
  isOpen,
  className,
}: AppMenuItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "hover:bg-gray-100 flex h-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground",
            className
          )}
        >
          {icon}
          <span className={isOpen ? "" : "sr-only"}>{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
