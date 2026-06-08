"use client";
import Markdown  from "react-markdown";
import Link from 'next/link'
import { ArrowBigLeft  } from "lucide-react";


export default function Ingredients() {
  return (
  <div className="flex h-screen w-screen items-center justify-start">

    <div className="flex flex-col items-start p-4">
        <button className="cursor-pointer ml-2 mr-2 p-2 mb-1.5  rounded-lg border bg-gray-900 text-white border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center">
            <Link href={`./`}>
            <ArrowBigLeft ></ArrowBigLeft>
            </Link>
        </button>
    </div>

    

    <div className="flex flex-col gap-1 items-center justify-start min-h-screen pt-10 mx-auto">
      <div 
        className= {`flex flex-col self-end rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg h-[90vh] w-[85vw] mt-2 overflow-y-auto`}
        id="displayArea"
      >
        <Markdown>{localStorage.getItem("ingredientsMessage")}</Markdown>
      </div>
    </div>
  </div>
  );
}