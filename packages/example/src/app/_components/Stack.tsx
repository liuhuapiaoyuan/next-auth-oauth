import React from "react";
import {
    GlowingStarsBackgroundCard,
    GlowingStarsDescription,
    GlowingStarsTitle,
} from "@/components/ui/glowing-stars";

function StackCode(props:{title:string,label:string}) {
    return (
        <div className="flex group cursor-pointer  items-center justify-center antialiased">
            <GlowingStarsBackgroundCard>
                <GlowingStarsTitle>{props.title}</GlowingStarsTitle>
                <div className="flex justify-between  items-start">
                    <GlowingStarsDescription>
                        {props.label}
                    </GlowingStarsDescription>
                    <div className="h-8 w-8  group-hover:scale-150   
                    hover:bg-white hover:bg-opacity-50 transition-all 
                    rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
                        <Icon />
                    </div>
                </div>
            </GlowingStarsBackgroundCard>
        </div>
    );
}

const Icon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-[50%]  text-white stroke-2 "
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
        </svg>
    );
};

export function Stack() {
    return <>
        <div className="max-w-xl mx-auto text-center ">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">技术栈</h2>
        </div>
        <div className="grid gap-2 p-2 lg:grid-cols-3 mt-5">
            <StackCode title="Next.js 15" label="The power of full-stack to the frontend. Read the release notes." />
            <StackCode title="React 19" label="The latest version of React. Read the release notes." />
            <StackCode title="NextAuth 5" label="The most advanced authentication library for Next.js. Read the release notes." />
        </div>
    </>

}