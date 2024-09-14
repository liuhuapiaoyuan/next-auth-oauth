
// dev下解决global重复问题
const globalDEMO = globalThis as unknown as { DEMO: string[] };
export const DEMO = globalDEMO.DEMO ??["初始化数据"]
if (process.env.NODE_ENV !== "production") {
   globalDEMO.DEMO = DEMO
}


export function getDemo() {
  return DEMO   
}
export function addDemo(data: string) {
  DEMO.push(data)
}
export function removeDemo(index: number) {
  DEMO.splice(index, 1)
}
export function editDemo(index: number, data: string) {
  DEMO[index] = data
}