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
import { Label } from "@/components/ui/label";
import { Combobox } from "./_components/Combobox";
 
const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] 

export default function ProfilePage() {
  return (
    <div className="grid gap-5">
      <Card>
        <CardHeader>
          <CardTitle>昵称</CardTitle>
          <CardDescription>修改账户显示昵称</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Nickname" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>保存</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>其他信息</CardTitle>
          <CardDescription>
            The directory within your project, in which your plugins are
            located.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input placeholder="Project Name" defaultValue="/content/plugins" />
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">邮箱</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">职业</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">兴趣</Label>
             <Combobox
             mode="multiple"
             value={["en", "fr","ko","zh"]}
             options={languages}/>
            </div>
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
          <Button>更新资料</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
