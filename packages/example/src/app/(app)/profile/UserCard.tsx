import Image from "next/image";

export function UserCard() {
    return <>
    <div className="flex flex-col items-center">
    <Image
    width={128}
    height={128}
    alt="User"
    src="https://randomuser.me/api/portraits/men/94.jpg"
     className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0" />
    <h1 className="text-xl font-bold">John Doe</h1>
    <p className="text-gray-700">Software Developer</p>
    <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Contact</a>
        <a href="#" className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded">Resume</a>
    </div>
</div >
        <hr className="my-6 border-t border-gray-300"></hr>
    </>
}