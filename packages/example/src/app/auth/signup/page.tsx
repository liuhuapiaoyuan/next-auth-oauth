import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const description =
  "一个登录页面，包含两个列。第一列包含登录表单，包括电子邮件和密码。有一个忘记密码的链接和一个注册链接，如果你没有账户的话。第二列包含一张封面图片。";

export default function AuthSignupPage() {
  return (
    <div className="w-full lg:grid h-[100vh] lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">注册</h1>
            <p className="text-balance text-muted-foreground">
              输入您的电子邮件以注册您的账户
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">账号</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">密码</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  忘记密码？
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              登录
            </Button>
            <Button variant="outline" className="w-full">
              使用 Google 登录
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            已拥有账户？{" "}
            <Link href="signin" className="underline">
              登录
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="图片"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
