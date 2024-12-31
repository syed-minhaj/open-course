"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
export default function Home() {
  const {theme , setTheme} = useTheme();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary gap-10">
      <div> 
        <button className="bg-white" onClick={() => {setTheme("dark")}}>
          theme switch
        </button>
        <button className="bg-white" onClick={() => {setTheme("light")}}>
          theme switch
        </button>
      </div>
      <div className="gap-5 h-fit">
        <div className="bg-prePrimary h-10 w-10 shadow-md"></div>
        <div className="bg-secondary h-10 w-10"></div>
        <div className="bg-tertiary h-10 w-10"></div>
        <div className="bg-accent h-10 w-10"></div>
      </div>
      <div className="h-36 w-20 bg-prePrimary shadow-lg"></div>
    </div>
  );
}
