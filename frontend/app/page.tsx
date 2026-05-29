import Image from "next/image";
import AnimatedTitle from "./components/AnimatedTitle";

export default function Home() {

  return (
    <div className="flex flex-col gap-1 items-center justify-start min-h-screen pt-20 mx-auto">
        <AnimatedTitle text="What shall we eat?" ></AnimatedTitle>
       <textarea
        className="rounded-xl border border-gray-300 focus:border-gray-400 focus:outline-none resize-none p-3 text-base font-mono shadow-lg w-128"
        id="input"
        rows={1}
        cols={20}
      />  

    </div>
  );
}
