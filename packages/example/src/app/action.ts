'use server'

import { addDemo, getDemo } from "@/service/demo";
import { revalidatePath } from "next/cache";


export async function addMenu(name:string){
    console.log(`Adding menu ${name}...`);
    addDemo(name)
    console.log("当前菜单数量：" + getDemo().length)
    await revalidatePath("/page2","layout")
}
function delay(timeout:number){
    return new Promise(resolve => {
        setTimeout(resolve, timeout)
    })
}
export async function formAction(_:string,formData:FormData){
    console.log("接收参数" , Object.fromEntries(formData))
    await delay(2000)
    if(Math.random() > 0.5){
        console.log("成功")
        return "success"
    }
    throw new Error("失败异常来测试")
}