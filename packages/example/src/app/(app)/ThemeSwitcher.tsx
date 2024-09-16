
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
export function ThemeSwitcher() {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
            >
                <Sun />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel >
                <div className="flex  items-center gap-1">
                    <Sun />白天
                </div>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
                <div className="flex items-center gap-1">
                    <Moon />
                    夜间
                </div>
            </DropdownMenuLabel>
        </DropdownMenuContent>
    </DropdownMenu>
}