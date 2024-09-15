import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default async function ProfileSecurityPage() {
  return (
    <div className="grid gap-5">
      <Card>
        <CardHeader>
          <CardTitle>密码修改</CardTitle>
          <CardDescription>修改您的账号密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-2">
            <Input placeholder="原始密码" />
            <Input placeholder="新密码" />
            <Input placeholder="新密码(重复)" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>提交修改</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>第三方绑定</CardTitle>
          <CardDescription>这里显示您的第三方绑定信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input placeholder="Project Name" defaultValue="/content/plugins" />
            <div className="flex items-center space-x-2">
              <Checkbox id="include" defaultChecked />
              <label
                htmlFor="include"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow administrators to change the directory.
              </label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
