
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-8"
            >
                <div>
                <Sun width={15}/>
                </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem >
                <div className="flex  items-center gap-1">
                    <Sun width={15} />白天
                </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <div className="flex items-center gap-1">
                    <Moon width={15}/>
                    夜间
                </div>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}