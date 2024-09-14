import { getDemo } from "@/service/demo";

export async function MenuList() {
  const demos = await getDemo();
  return (
    <div className="p-2">
      <div className="h-10"></div>
      {demos.map((demo) => (
        <div
          className="p-2 hover:translate-x-1 transition-transform bg-gray-50  cursor-pointer hover:bg-gray-200"
          key={demo}
        >
          <h2>{demo}</h2>
        </div>
      ))}
    </div>
  );
}
