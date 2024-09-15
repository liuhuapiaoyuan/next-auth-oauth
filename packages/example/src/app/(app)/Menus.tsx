import { LineChart, Package, ShoppingCart, Users2 } from "lucide-react";
export const AppMenus: Array<{
  title: string;
  href: string;
  icon: JSX.Element;
  keywords?: string[];
}> = [
  {
    title: "工作台",
    href: "/dashboard",
    icon: <ShoppingCart className="h-5 w-5" />,
    keywords: ["dashboard", "工作台"],
  },
  {
    title: "产品",
    href: "#",
    icon: <Package className="h-5 w-5" />,
    keywords: ["product", "产品"],
  },
  {
    title: "客户",
    href: "#",
    icon: <Users2 className="h-5 w-5" />,
    keywords: ["customer", "客户"],
  },
  {
    title: "分析",
    href: "/analytics",
    icon: <LineChart className="h-5 w-5" />,
    keywords: ["analysis", "分析"],
  },
];
