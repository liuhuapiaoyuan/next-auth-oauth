import type { PropsWithChildren } from "react";
import { Header } from "./Header";
import { Slide } from "./Slide";
export const description =
  "产品编辑页面。产品编辑页面有一个表单，用于编辑产品详情、库存、产品类别、产品状态和产品图片。产品编辑页面有一个侧边导航栏和一个主要内容区域。主要内容区域有一个表单，用于编辑产品详情、库存、产品类别、产品状态和产品图片。侧边导航栏有链接到产品详情、库存、产品类别、产品状态和产品图片。";

export default function AppLayout(props: PropsWithChildren) {
  const { children } = props;
  return (
    <div className="flex h-screen w-full bg-muted/40">
      <Slide />
      <div className="flex flex-1 w-1 relative  overflow-auto  flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid  flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
